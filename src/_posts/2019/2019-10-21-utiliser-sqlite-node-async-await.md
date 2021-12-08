---
date: 2019-10-21 12:12:36+200
layout: post
tags: javascript, node, sql
title: "Utiliser SQlite3 en mode async / await"
image: "/public/2019/grand-bain.jpg"
---

Je continue ma série de tutoriels pour apprendre Node JS et plus
particulièrement voir comment développer de petites applications web avec
ExpressJS. J'ai déjà vu comment accéder à une base de données
[SQlite]({% post_url 2019-09-11-crud-avec-express-sqlite-10-etapes %}), puis à
[PostgreSQL]({% post_url 2019-09-21-crud-avec-express-postgresql-10-etapes %}).
Dans le tutoriel précédent, j'ai comparé la façon d'accéder à [SQlite et
PostgreSQL avec Express]({% post_url 2019-10-07-comparaison-sqlite-postgresql-express %})
pour parvenir à écrire le même code pour accéder aux deux bases de données.

Dans ce tutoriel, je vais modifier le code existant pour ne plus avoir à
utiliser de fonction callback quand je fais une requête sur la base de données.

<figure>
  <img src="{{ page.image }}" alt="grand-bain" />
  <figcaption>
    <a href="https://fr.wikipedia.org/wiki/Le_Grand_Bain_(film)">Le Grand Bain - Gilles Lellouche</a>
  </figcaption>
</figure>


## Fonctionnement asynchrone / callback

La dernière fois, j'ai trouvé comment avoir le même code JavaScript pour accéder
aux deux bases de données :

```javascript
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
```

La requête SQL est exécutée via la méthode `.query()`, qui s'exécute en
asynchrone puis qui appelle une fonction callback lorsque le requête est
terminée. Dans l'exemple ci-dessus, la fonction callback est une fonction
lambda anonyme qui correspond à la partie de code suivante :

```javascript
(err, result) => {
  if (err) {
    return console.error(err.message);
  }
  res.render("livres", { model: result.rows });
}
```

C'est pas trop compliqué, mais c'est pas trop clair non plus. En fait, cette
façon de coder découle du fonctionnement async / callback qui est aussi
difficile à lire qu'à écrire.

De façon schématique, il faut :
* passer une fonction callback à la méthode `.query()`,
* lorsque la requête est terminée, la méthode `.query()` appelle cette fonction
callback en lui envoyant un paramètre `Error` et le résultat de l'exécution de
la requête,
* et pour finir, la fonction callback doir gérer cette erreur (éventuelle) et ce
résultat...

Note : C'est difficile à lire, c'est difficile à écrire, et c'est aussi
difficile à expliquer.


## Fonctionnement async / await

C'est pour ça que JavaScript a régulièrement évolué jusqu'à permettre
aujourd'hui d'utiliser un fonctionnement async / await qui, bien que faisant la
"même" chose, paraisse beaucoup plus "naturel".

Ce qui donne :

```javascript
// GET /livres
app.get("/livres", async (req, res) => {
  try {
    const sql = "SELECT * FROM Livres ORDER BY Titre";
    const result = await db.query(sql, []);
    res.render("livres", { model: result.rows });
  } catch (err) {
    return console.error(err.message);
  }
});
```

A ce coup :), on exécute la requête par un `await db.query(...)` sans callback.

Mais (!) pour pouvoir utiliser "await", il faut que la fonction dans laquelle
on fait l'await soit décorée d'un attribut "async". Et dans notre cas, la
fonction c'est la fonction callback passée à la méthode `app.get()`, à savoir
la fonction lambda anonyme suivante :

```javascript
(req, res) => {
  try {
    const sql = "SELECT * FROM Livres ORDER BY Titre";
    const result = await db.query(sql, []);
    res.render("livres", { model: result.rows });
  } catch (err) {
    return console.error(err.message);
  }
}
```

Et donc, au lieu d'écrire :

```javascript
app.get("/livres", (req, res) => {
...
```

On écrit (mais sans les "+++++") :

```javascript
app.get("/livres", async (req, res) => {
                   +++++
...
```

Note : On ne parle pas du fait qu'il y a toujours un callback pour `app.get()`
et on se concentre sur la base de données...

En cas de problème, l'erreur est récupérée via le `try / catch` et quand tout va
bien, le résultat de la requête est renvoyée et le traitement en cours peut
reprendre son cours normal...

Note : Ça ressemble à un fonctionnement synchrone, ça se code comme du
synchrone, mais c'est quand même de l'asynchrone puisqu'on a écrit "async" et
"await".

C'est beaucoup plus beau et en plus ça marche ! Mais que quand j'utilise
PostgreSQL et node-postgres... Parce qu'avec SQlite, tout est cassé :

```
Cannot read property 'rows' of undefined
E:\Code\AppTestAA\node_modules\sqlite3\lib\trace.js:27
                    throw err;
                    ^

TypeError: callback is not a function
    at Statement.<anonymous> (E:\Code\AppTestAA\index.js:39:7)
--> in Database#all('SELECT * FROM Livres ORDER BY Titre', [], [Function])

...
```


## Async / Await avec le module SQlite3

Je suppose que c'était sa façon à lui de dire que le module SQlite3 ne gère pas
un fonctionnement async / await.

Bon ben c'est pas compliqué. Il faut que je regarde comment faire pour que
SQlite3 supporte l'async / await, ou au pire que je cherche un autre module pour
SQlite qui sache faire...

...

Bon ben c'est compliqué :(

Ça ne marche pas, y'a rien qui marche, y faut tout changer, j'en ai marre,
je le savais que l'asynchrone ça serait que des emm...

...

Un autre jour.

Il faut "juste" que ma bidouille de `.query()` (pour que SQlite3 ressemble à
node-postgres) fonctionne en async / await.

```javascript
// Bidouille pour ressembler à node-postgres
db.query = function (sql, params, callback) {
  this.all(sql, params, function (err, rows) {
    callback(err, { rows: rows });
  });
};
```

Je ne sais pas trop comment faire, mais au moins internet est de quelque utilité
et en m'inspirant d'un certain nombre d'exemples, en essayant un peu dans tous
les sens, j'arrive finalement à bidouiller un peu plus :

```javascript
// Bidouille pour ressembler à node-postgres
// (et permettre un fonctionnement async / await)
db.query = function (sql, params) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error, rows) {
      if (error)
        reject(error);
      else
        resolve({ rows: rows });
    });
  });
};
```

Je re...teste : http://localhost:3000/livres

...

Ça marche :)


## Conclusion

Personnellement, la syntaxe async / await ça me plait beaucoup plus. C'est plus
beau, ça parait plus naturel et ça évite les indentations de la mort :

```javascript
// Création de la table Livres (Livre_ID, Titre, Auteur, Commentaires)
const sql_create = `CREATE TABLE IF NOT EXISTS livres ... `;
db.query(sql_create, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'Livres'");
  // Alimentation de la table
  db.query("SELECT COUNT(*) AS count FROM Livres", [], (err, result) => {
    const count = result.rows[0].count;
    if (count === 0) {
      const sql_insert = `INSERT INTO Livres ... `;
      db.query(sql_insert, [], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Alimentation réussie de la table 'Livres'");
      });
    }
  });
});
```

=> Beurk !

```javascript
(async () => {
  try {
    // Création de la table Livres (Livre_ID, Titre, Auteur, Commentaires)
    const sql_create = `CREATE TABLE IF NOT EXISTS livres ... `;
    await db.query(sql_create, []);
    console.log("Création réussie de la table 'Livres'");
    // Alimentation de la table
    const result = await db.query("SELECT COUNT(*) AS count FROM Livres", []);
    const count = result.rows[0].count;
    if (count === 0) {
      const sql_insert = `INSERT INTO Livres ... `;
      await db.query(sql_insert, []);
      console.log("Alimentation réussie de la table 'Livres'");
    }
  }
  catch (error) { throw error; }
})();
```

=> Miam ?


## Le code complet de "index.js"

Et pour finir, l'intégralité du fichier "index.js" pour avoir une vue d'ensemble
des modifications apportées.

```javascript
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
  // (et permettre un fonctionnement async / await)
  db.query = function (sql, params) {
    if (!Array.isArray(params)) throw new Error("params n'est pas un tableau !");
    sql = sql.replace(/SERIAL PRIMARY KEY/, "INTEGER PRIMARY KEY AUTOINCREMENT");
    var that = this;
    return new Promise(function (resolve, reject) {
      that.all(sql, params, function (error, rows) {
        if (error)
          reject(error);
        else
          resolve({ rows: rows });
      });
    });
  };
}
console.log("Connexion réussie à la base de données");

(async () => {
  try {
    // Création de la table Livres (Livre_ID, Titre, Auteur, Commentaires)
    const sql_create = `CREATE TABLE IF NOT EXISTS livres (
      livre_id SERIAL PRIMARY KEY,
      titre VARCHAR(100) NOT NULL,
      auteur VARCHAR(100) NOT NULL,
      commentaires TEXT
    );`;
    await db.query(sql_create, []);
    console.log("Création réussie de la table 'Livres'");
    // Alimentation de la table (si nécessaire)
    const result = await db.query("SELECT COUNT(*) AS count FROM Livres", []);
    const count = result.rows[0].count;
    if (count === 0) {
      const sql_insert = `INSERT INTO Livres (Titre, Auteur, Commentaires) VALUES
        ('Mrs. Bridge', 'Evan S. Connell', 'Premier de la série'),
        ('Mr. Bridge', 'Evan S. Connell', 'Second de la série'),
        ('L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne');`;
      await db.query(sql_insert, []);
      console.log("Alimentation réussie de la table 'Livres'");
    }
  } catch (e) { return console.error(e.message); }
})();

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
app.get("/livres", async (req, res) => {
  try {
    const sql = "SELECT * FROM Livres ORDER BY Titre";
    const result = await db.query(sql, []);
    res.render("livres", { model: result.rows });
  } catch (e) { console.error(e.message); }
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", async (req, res) => {
  try {
    const sql = "INSERT INTO Livres (Titre, Auteur, Commentaires) VALUES ($1, $2, $3)";
    const book = [req.body.titre, req.body.auteur, req.body.commentaires];
    const result = await db.query(sql, book);
    res.redirect("/livres");
  } catch (e) { console.error(e.message); }
});

// GET /edit/5
app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "SELECT * FROM Livres WHERE Livre_ID = $1";
    const result = await db.query(sql, [id]);
    res.render("edit", { model: result.rows[0] });
  } catch (e) { console.error(e.message); }
});

// POST /edit/5
app.post("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = [req.body.titre, req.body.auteur, req.body.commentaires, id];
    const sql = "UPDATE Livres SET Titre = $1, Auteur = $2, Commentaires = $3 WHERE (Livre_ID = $4)";
    const result = await db.query(sql, book);
    res.redirect("/livres");
  } catch (e) { console.error(e.message); }
});

// GET /delete/5
app.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "SELECT * FROM Livres WHERE Livre_ID = $1";
    const result = await db.query(sql, [id]);
    res.render("delete", { model: result.rows[0] });
  } catch (e) { console.error(e.message); }
});

// POST /delete/5
app.post("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "DELETE FROM Livres WHERE Livre_ID = $1";
    const result = await db.query(sql, [id]);
    res.redirect("/livres");
  } catch (e) { console.error(e.message); }
});
```

{:.encart}
English version: [Use SQlite3 in async / await mode]({% post_url 2019-10-29-use-sqlite-node-async-await %}){:hreflang="en"}.
