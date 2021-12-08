---
date: 2019-10-07 12:36:44
layout: post
tags: javascript, node, sql
title: "Comparaison de l'utilisation de SQlite ou PostgreSQL avec Express"
image: "/public/2019/microscope.jpg"
---

Après avoir rédigé deux tutoriels sur Express pour accéder à des bases de données
[SQlite]({% post_url 2019-09-11-crud-avec-express-sqlite-10-etapes %}) puis
[PostgreSQL]({% post_url 2019-09-21-crud-avec-express-postgresql-10-etapes %}),
j'ai pu me rendre compte qu'il n'y avait pas de si gros écarts que çà entre les
deux systèmes.

<figure>
  <img src="{{ page.image }}" alt="microscope" />
  <figcaption>
    <a href="https://unsplash.com/photos/6q5QG8iIgRo">Observing samples under the microscope - Trust "Tru" Katsande</a>
  </figcaption>
</figure>

Pour l'instant, j'ai compté 5 différences, plus ou moins importantes :

* Le marqueur pour les paramètres SQL : "$1" ou "?"
* La façon de définir les paramètres : toujours un array ou pas
* Les méthodes disponibles : .query() ou .run() + .all() + .get()
* Les paramètres transmis à la fonction callback
* Les noms des colonnes en minuscules


## Marqueurs pour les paramètres SQL

Généralement, les exemples pour SQlite utilisent des " ?, ?, ? ... " pour
répérer les paramètres dans les requêtes paramétrées. J'ai donc suivi cette
méthode. Quand on passe à PostgreSQL, on voit plutôt des " $1, $2, $3 ... ".

```
db.run("UPDATE Livres SET Titre = ? WHERE Livre_ID = ?", [titre, id], callback);
query.pool("UPDATE Livres SET Titre = $1 WHERE Livre_ID = $2", [titre, id], callback);
```

Mais ce n'est absolument pas un problème, parce que la base de données SQlite
supporte très bien les paramètres sous la forme " $1, $2, $3 ... ".

```
db.run("UPDATE Livres SET Titre = $1 WHERE Livre_ID = $2", [titre, id], callback);
```

Et d'un !


## Paramètres SQL sous forme de tableau

Lorsqu'il n'y a qu'un paramètre SQL, le module SQlite3 accepte que celui-ci soit
transmis en tant que valeur, et pas via un tableau :

```
db.get("SELECT * FROM Livres WHERE Livres_ID = $1", id, callback);
```

Alors que pour le module node-postgres, il faut impérativement que ce soit sous
forme de tableau :

```
pool.query("SELECT * FROM Livres WHERE Livres_ID = $1", [id], callback);
```

De même, lorsqu'il ne s'agit pas d'une requête paramétrée, le module SQlite3
permet de zapper complètement le paramètre, alors que le module node-postgres
exige un tableau vide :

```
db.all("SELECT * FROM Livres", callback);
pool.query("SELECT * FROM Livres", [], callback);
```

Mais ce coup-ci, c'est le module SQlite3 qui se montre très conciliant et on
peut faire exactement comme avec node-postgres :

```
db.get("SELECT * FROM Livres WHERE Livres_ID = $1", [id], callback);
db.all("SELECT * FROM Livres", [], callback);
```

C'est même limite mieux, parce qu'ainsi on est certain de ne pas avoir oublié
de paramètre par erreur.

Et de deux.


## .query() vs .run(), .all() et .get()

Le module SQlite3 défini 3 méthodes :

* `.run()` pour éxécuter des requêtes de mise à jour
* `.all()` pour effectuer des "SELECT" renvoyant plusieurs lignes
* `.get()` pour les "SELECT" par identifiant qui renvoient une seule ligne

Alors que côté node-postgres, tout se fait avec une seule méthode `.query()`.

Après tests, on peut très bien n'utiliser que la méthode `.all()` du module
SQlite3, car elle gère parfaitement :

* les "SELECT" à partir d'un identifiant : ça paraissait évident
* les requêtes de mise à jour : cool !

On peut donc sans problème écrire :

```
db.all("CREATE TABLE Livres ...", [], callback);
db.all("UPDATE Livres SET Titre = $1 WHERE Livre_ID = $2", [titre, id], callback);
db.all("SELECT * FROM Livres WHERE Livres_ID = $1", [id], callback);
db.all("SELECT * FROM Livres", [], callback);
```

Tout comme on le fait avec node-postgres :

```
pool.query("CREATE TABLE Livres ...", [], callback);
pool.query("UPDATE Livres SET Titre = $1 WHERE Livre_ID = $2", [titre, id], callback);
pool.query("SELECT * FROM Livres WHERE Livres_ID = $1", [id], callback);
pool.query("SELECT * FROM Livres", [], callback);
```

Et de trois...


## Paramètres de la fonction callback

La méthode `.query()` du module node-postgres renvoie toujours 2 objets à la
fonction callback qu'elle enchaine :

* un objet `Error` (selon le pattern "error-first" popularisé par Node)
* un objet `Result` qui contient le résultat renvoyé par la requête exécutée et
des informations sur l'excécution de cette requête.

Du coté du module SQlite3, la méthode `.all()` fourni également 2 objets à sa
fonction callback :

* un objet `Error`
* un tableau de "rows" qui contient les lignes renvoyées par la requête.

Si on utilise `.all()` à toutes les sauces, cela va en fait donner :

* un tableau avec la liste des lignes obtenues pour une requête "SELECT"
retournant plusieurs lignes
* un tableau avec l'unique ligne trouvée pour une requête "SELECT" à partir d'un
identifiant
* un tableau vide pour une requête de mise à jour

C'est donc là qu'il faut ruser et faire d'une pierre deux coups en ajoutant une
méthode `.query()` à l'objet `Database` du module SQlite3 de façon à renvoyer un
objet qui ressemble suffisament au `Result` du module node-postgres :

```
db.query = function (sql, params, callback) {
  if (!Array.isArray(params)) throw new Error("params n'est pas un tableau !");
  this.all(sql, params, function (err, rows) {
    callback(err, { rows: rows });
  });
};
```

Note : je déclenche une erreur si "params" n'est pas un tableau parce que le but
pendant le développement sur SQlite est d'être le plus proche de ce qui devra
fonctionner en production avec PostgreSQL. Et donc, si j'oublie d'utiliser un
tableau, autant que ça plante pendant le développement plutôt qu'en prod.

Grâce à cette nouvelle méthode, on peut finalement écrire le **même** code pour
SQlite (via le module SQlite3) que pour PostgreSQL (via le module
node-postgres), au nom de la méthode près :

```
xxx.query("CREATE TABLE Livres ...", [], (err, result) => {});
xxx.query("UPDATE Livres SET Titre = $1 WHERE Livre_ID = $2", [titre, id], (err, result) => {});
xxx.query("SELECT * FROM Livres WHERE Livres_ID = $1", [id], (err, result) => {});
xxx.query("SELECT * FROM Livres", [], (err, result) => {});
```

Et de quatre !


## Le problème des minuscules

J'ai pour habitude de mettre les mots-clés SQL en majucule et les noms de
tables, colonnes, vues, séquences... en PascalCase.

Ca marche très bien en C# avec ADO.NET / [Dapper](https://stackexchange.github.io/Dapper/).
En Ruby, je n'ai pas eu de problèmes (sans doute parce que j'ai toujours utilisé
[DataMapper](https://datamapper.org/) ou [Sequel](https://sequel.jeremyevans.net/)).
Mais en JavaScript ça devient embêtant vu qu'il est très sensitif sur la casse.

Donc, dans les 2 tutoriels, j'avais créé une table de test de la façon suivante :

```
CREATE TABLE IF NOT EXISTS Livres (
  Livre_ID XXXXXXXXXX,
  Titre VARCHAR(100) NOT NULL,
  Auteur VARCHAR(100) NOT NULL,
  Commentaires TEXT
);
```

La base de données SQlite a respecté à la lettre ma façon d'écrire et a créé une
table "Livres" avec les colonnes "Livre_ID", "Titre", "Auteur" et
"Commentaires".

La base PostgreSQL a tout passé en minuscules est créé une table "livres" avec
les colonnes "livre_id", "titre", "auteur" et "commentaires".

Dans les 2 cas, je peux faire des requêtes SQL comme je veux :

```
SELECT Titre FROM Livres WHERE Livre_ID = 1
SELECT titre FROM livres WHERE livre_id = 1
SELECT TITRE FROM livres WHERE livre_ID = 1
...
```

Mais dans les 2 cas, les noms des propriétés de l'objet renvoyé reprennent
exactemement le nom des colonnes dans la base de données.

Et par conséquent, pour la requête suivante :

```
xxx.query("SELECT * FROM Livres WHERE livre_ID = $1", [1], (err, result) => {
  console.log(result.rows[0]);
});
```

J'obtiens cet objet avec SQlite3 :

```
{
  Livre_ID: 1,
  Titre: "Mrs. Bridge",
  Auteur: "Evan S. Connell",
  Commentaire: "Premier de la série"
}
```

Et celui-ci avec node-postgres :

```
{
  livre_id: 1,
  titre: "Mrs. Bridge",
  auteur: "Evan S. Connell",
  commentaire: "Premier de la série"
}
```

C'est pas la peine de se compliquer la vie, et le plus simple c'est que
dorénavant j'utilise des minuscules pour nommer les objets dans la base de
données (du moins dans les requêtes [Data Definition Language]()) :

```
CREATE TABLE IF NOT EXISTS livres (
  livre_id XXXXXXXXXX,
  titre VARCHAR(100) NOT NULL,
  auteur VARCHAR(100) NOT NULL,
  commentaires TEXT
);
```

Et de cinq => plus de différence.


## Créer un objet "commun"

Actuellement, je ne me connecte pas aux 2 bases de données de la même façon :

```
// SQlite
const db = new sqlite3.Database(db_name, err => { ... });
// PostgreSQL
const pool = new Pool({ ... });
```

Déjà, je vais toujours utiliser le nom de variable "db" parce que "pool" c'est
pas génial. Et surtout, je vais me baser sur `process.env.NODE_ENV` pour décider
comment réaliser la connexion.

Ce qui va donner quelque chose comme :

```
// Connexion à la base de données
let db = null;
if (process.env.NODE_ENV === 'production') {
  // PostgreSQL
  db = new Pool({
    ...
  });
} else {
  // SQlite
  const db_name = path.join(__dirname, "data", "apptest.db");
  db = new sqlite3.Database(db_name, err => {
    ...
  });
  // Bidouille pour ressembler à node-postgres
  db.query = function (sql, params, callback) {
    ...
  };
}
console.log("Connexion réussie à la base de données");
```

Note : Il faudrait voir comment isoler ce système un peu confus dans 2 fichiers
séparés. Mais chaque chose en son temps.


## Conclusion

J'ai résolu les problèmes liés au fait que les modules SQlite3 et node-postgres
fonctionnent un peu différement. Il a suffit de quelques modifications pour
réussir à mettre au point une solution suffisament simple pour avoir exactement
le même code pour les 2 bases de données :

* SQlite pour le développement
* PostgreSQL en production

Je n'ai pas besoin de gérer plus que ces 2 bases de données. C'est déjà ce que
je fais avec Sinatra (SQlite + PostgreSQL) ou ASP.NET MVC (SQL Server CE + SQL
Server).

Il reste cependant quelques problèmes avec SQL. C'est un langage assez standard,
mais il faut faire attention. Par exemple, pour créer l'identifiant unique dans
la table "livres", je dois faire différemment selon la base de données :

* SQlite : `livre_id INTEGER PRIMARY KEY AUTOINCREMENT`
* PostgreSQL : `livre_id SERIAL PRIMARY KEY`

Et puis il y a quelques autres trucs. Mais ça ne devrait pas poser trop de
problème pour les "petites" applications de débutant. Si j'ai besoin de faire
plus, ça voudra dire qu'il est temps que je regarde du côté des ORMs (ou que je
fasse des scripts SQL séparés).

En attendant ce jour, je peut bidouiller :

```
db.query = function (sql, params, callback) {
  if (!Array.isArray(params)) throw new Error("params n'est pas un tableau !");
  sql = sql.replace(/SERIAL PRIMARY KEY/, "INTEGER PRIMARY KEY AUTOINCREMENT");
  this.all(sql, params, function (err, rows) {
    callback(err, { rows: rows });
  });
};
```

Note : Ca doit bien ralentir un chouilla, mais on est en développement, ça
laisse du temps pour réfléchir.


## Le code complet de "index.js"

Comme toujours, l'intégralité du fichier "index.js" pour avoir une vue
d'ensemble du nouveau fonctionnement.

```
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const sqlite3 = require("sqlite3").verbose();

// Création du serveur Express
const app = express();

// Configuration du serveur
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Connexion à la base de données
let db = null;
if (process.env.NODE_ENV === 'production') {
  // PostgreSQL en production
  db = new Pool({
    user: "mystere",
    host: "xxxxx.elephantsql.com",
    database: "mystere",
    password: "untrucsecretquinarienafaireici",
    port: 5432
  });
} else {
  // SQlite par défaut
  const db_name = path.join(__dirname, "data", "apptest.db");
  db = new sqlite3.Database(db_name, err => {
    if (err) {
      return console.error(err.message);
    }
  });
  // Bidouille pour ressembler à node-postgres
  db.query = function (sql, params, callback) {
    if (!Array.isArray(params)) throw new Error("params n'est pas un tableau !");
    sql = sql.replace(/SERIAL PRIMARY KEY/, "INTEGER PRIMARY KEY AUTOINCREMENT");
    this.all(sql, params, function (err, rows) {
      callback(err, { rows: rows });
    });
  };
}
console.log("Connexion réussie à la base de données");

// Création de la table Livres (Livre_ID, Titre, Auteur, Commentaires)
const sql_create = `CREATE TABLE IF NOT EXISTS livres (
  livre_id SERIAL PRIMARY KEY,
  titre VARCHAR(100) NOT NULL,
  auteur VARCHAR(100) NOT NULL,
  commentaires TEXT
);`;
db.query(sql_create, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'Livres'");
  // Alimentation de la table
  db.query("SELECT COUNT(*) AS count FROM Livres", [], (err, result) => {
    const count = result.rows[0].count;
    if (count === 0) {
      const sql_insert = `INSERT INTO Livres (Titre, Auteur, Commentaires) VALUES
        ('Mrs. Bridge', 'Evan S. Connell', 'Premier de la série'),
        ('Mr. Bridge', 'Evan S. Connell', 'Second de la série'),
        ('L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne');`;
      db.query(sql_insert, [], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Alimentation réussie de la table 'Livres'");
      });
    }
  });
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Serveur démarré (http://localhost:3000/) !");
});

// GET /
app.get("/", (req, res) => {
  // res.send("Bonjour le monde...");
  res.render("index");
});

// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});

// GET /data
app.get("/data", (req, res) => {
  const test = {
    titre: "Test",
    items: ["un", "deux", "trois"]
  };
  res.render("data", { model: test });
});

// GET /livres
app.get("/livres", (req, res) => {
  const sql = "SELECT * FROM Livres ORDER BY Titre";
  db.query(sql, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("livres", { model: result.rows });
  });
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Livres (Titre, Auteur, Commentaires) VALUES ($1, $2, $3)";
  const book = [req.body.titre, req.body.auteur, req.body.commentaires];
  db.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = $1";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: result.rows[0] });
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.titre, req.body.auteur, req.body.commentaires, id];
  const sql = "UPDATE Livres SET Titre = $1, Auteur = $2, Commentaires = $3 WHERE (Livre_ID = $4)";
  db.query(sql, book, (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Livres WHERE Livre_ID = $1";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: result.rows[0] });
  });
});

// POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Livres WHERE Livre_ID = $1";
  db.query(sql, [id], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/livres");
  });
});
```

{:.encart}
English version: [Comparing SQlite or PostgreSQL with Express]({% post_url 2019-10-22-comparing-sqlite-postgresql-express %}){:hreflang="en"}.
