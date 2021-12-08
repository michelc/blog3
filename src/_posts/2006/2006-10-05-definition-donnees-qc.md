---
date: 2006-10-05 10:06:00
layout: post
redirect_from: "post/2006/10/05/Definition-de-donnees-avec-QC"
tags: qc, sql
title: "Définition de données avec QC"
---

Les ["pseudo-types"
de données de QC]({% post_url 2006-09-27-pseudo-types-donnees-qc %}) présentaient quels types de données utiliser avec QC.

Pour parvenir à ce résultat, on peut créer les tables dont on a besoin
directement dans Access, TOAD, SQL Server Enterprise Manager… pour la base de
données cible en veillant à bien respecter ces consignes.

Puis, lorsque le besoin d'utiliser une autre base de données se présente, il
suffit de recréer les tables à l'identique dans l'autre base de données. Si on
a été un peu prévoyant et que l'on dispose des scripts SQL de création de la
base de données, il est possible de les modifier à coup de rechercher /
remplacer pour les traduire de la syntaxe de la base de données source dans
celle la base de données cible.

* Avantage : on ne se complique pas la vie tant qu'on a pas besoin de changer
de base de données.
* Inconvénient : pas toujours évident d'avoir des scripts à jour (ou de
pouvoir les regénérer) et le rechercher / remplacer ne fait pas tout.

Lorsqu'il est très probable que l'application devra être multi bases (ou
lorsque la base de données cible n'est pas encore définie au début du projet),
il est possible de rédiger les scripts de création de la structure de la base
de données directement dans une syntaxe "multi-base".

L'outil de requêtes disponible avec QC supporte un certain nombre de
commandes DDL (Data Definition Language) qui couvrent la majorité des cas
rencontrés dans les scripts de création et de mise à jour des tables d'une base
de données relationnelle.

## Créer une table, sa clé primaire et un index

```
/* Create table
*/
CREATE TABLE test_Parametres (
  idParametre AUTOINCREMENT,
  libelle TEXT(100)
);
GO;

/* Create primary key
*/
ALTER TABLE test_Parametres
ADD CONSTRAINT PK_test_Parametres PRIMARY KEY (idParametre);
GO;

/* Create index
*/
CREATE UNIQUE INDEX UK_test_Parametres_libelle ON test_Parametres (libelle);
GO;
```

## Créer une table, une clé étrangère et un index

```
/* Create table and primary key
*/
CREATE TABLE test_Donnees (
  idDonnee AUTOINCREMENT,
  vraiFaux BOOLEAN,
  petitEntier SMALLINT,
  entier INT,
  grandEntier BIGINT,
  simplePrecision SINGLE,
  doublePrecision DOUBLE,
  desSous CURRENCY,
  texteLong TEXT(2000),
  texteCourt TEXT(100),
  texteMemo MEMO,
  jourHeure DATETIME,
  idParametre INT,
  CONSTRAINT PK_test_Donnees PRIMARY KEY (idDonnee)
);
GO;

/* Create foreign key
*/
ALTER TABLE test_Donnees
ADD CONSTRAINT FK_test_Donnees_Parametres FOREIGN KEY (idParametre)
    REFERENCES test_Parametres (idParametre) ON DELETE CASCADE ON UPDATE CASCADE;
GO;

/* Create index
*/
CREATE INDEX IK_test_Donnees_texteCourt ON test_Donnees (texteCourt);
GO;
```

Notes :

* dans ce cas, la création de la clé primaire a été définie au niveau de la
commande CREATE TABLE.
* ON UPDATE CASCADE n'est pas directement supporté avec Oracle

## Modifier une table

```
/* Add a column
*/
ALTER TABLE test_Donnees ADD COLUMN autreChamp TEXT(50);
GO;

/* Modify a column
*/
ALTER TABLE test_Donnees MODIFY COLUMN autreChamp TEXT(100);
GO;

/* Rename a column
*/
ALTER TABLE test_Donnees RENAME COLUMN autreChamp TO autreTexte;
GO;

/* Remove a column
*/
ALTER TABLE test_Donnees DROP COLUMN autreTexte;
GO;
```

Note : RENAME COLUMN ne fonctionne pas avec Access et MySQL.

## Faire du ménage

```
DROP TABLE test_Donnees;
GO;

DROP TABLE test_Parametres;
GO;
```
