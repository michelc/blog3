---
date: 2023-08-16 19:08:22 +02:00
tags: [ sql, csharp ]
title: "Gérer des clés étrangères avec SQLite"
cover:
  image: /public/2023/sqlite-foreign-keys.png
  link: https://littlekendra.com/2016/09/22/indexing-foreign-keys-guidelines/
  text: "C'est quoi le pire : un index inutile ou une clé étrangère non indexée ?"
excerpt: Quelques particularités auxquelles il faut penser pour gérer des clés étrangères avec SQLite et C#
---

Pour les petits trucs en .NET Core, le plus simple est d'utiliser une base de données [SQLite](https://www.sqlite.org/). Mais si on veut gérer correctement les clés étrangères, il faut penser à tenir compte de quelques particularités, d'où ce billet pour ne pas oublier...

Dans l'exemple qui suit, la clé étrangère permet de décrire la relation entre les deux tables "Blogs" (les parents) et "Posts" (les enfants) et d'assurer l'intégrité des données afin qu'il n'y ait pas d'enfants sans un parent. Toute tentative d'insertion d'une ligne dans la table "Posts" qui ne correspondrait pas à une ligne de la table "Blogs" génèrera une erreur SQL. De la même façon, on provoquera une erreur SQL si on essaie de supprimer une ligne de la table "Blogs" alors qu'il y a des données qui en dépendent dans la table "Posts".


```sql
CREATE TABLE Blogs
(
  Blog_ID     INTEGER PRIMARY KEY,
  Title       TEXT
);

CREATE TABLE Posts
(
  Post_ID     INTEGER PRIMARY KEY,
  Blog_ID     INTEGER,
  Content     TEXT,
  FOREIGN KEY (Blog_ID) REFERENCES Blogs (Blog_ID)
);
```

SQLite permet de définir des clés étrangères sans problème. La difficulté c'est que par défaut les contraintes liées aux clés étrangères sont désactivées (pour rester compatible avec les premières versions de SQLite).

Concrètement, ça veut donc dire qu'on peut créer des clés étrangères avec SQLite, mais qu'elles ne servent à rien ! Et donc qu'on pourra sans problème insérer des données sans clé étrangère "parent" ou supprimer des données "parents" pourtant utilisées par des enregistrements "enfants" :(

Heureusement, il est possible d'activer les contraintes liées aux étrangères. On ne peut pas faire cela de façon "globale", mais uniquement au niveau de la connexion à la base de données. Sous SQlite, on réalise ça avec la commande "PRAGMA" :

```sql
sqlite> PRAGMA foreign_keys = ON;
```

Avec ADO.NET ou Entity Framework, c'est encore plus simple (ou pas) puisqu'il suffit d'ajouter "Foreign Keys=true" à la chaine de connexion. Ce qui a pour effet d'envoyer automatiquement la commande `PRAGMA foreign_keys = 1` immédiatement après l'ouverture de la connexion à la base de données.

Grâce à cette modification toute simple, il ne sera plus possible d'ajouter un "enfant" sans référencer un "parent" existant. Ou de supprimer un parent qui a un enfant...

```sql
INSERT INTO Blogs (Blog_ID, Title) VALUES (1, 'Mon nouveau blogue');

COMMIT

INSERT INTO Posts (Post_ID, Blog_ID, Content) VALUES (1, 33, 'Mon premier billet');
=> FOREIGN KEY constraint failed

INSERT INTO Posts (Post_ID, Blog_ID, Content) VALUES (1, 1, 'Mon premier billet');

COMMIT

DELETE FROM Blogs WHERE Blog_ID = 1;
=> FOREIGN KEY constraint failed
```

**Attention** : Avec EF Core, la clause `ON DELETE` des clés étrangères est définie à `CASCADE` par défaut... De quoi alimenter un autre billet de blogue !
