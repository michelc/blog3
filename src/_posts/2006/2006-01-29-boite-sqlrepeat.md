---
date: 2006-01-29 19:07:00
layout: post
redirect_from: "post/2006/01/29/Boite-SqlRepeat"
tags: qc, sql
title: "Boite SqlRepeat"
---

La boite SqlQuery automatise l'affichage du résultat d'une requête SQL dans
une table à l'aide de l'objet XTable. La nouvelle boite SqlRepeat permet
également d'afficher le résultat d'une requête SQL, mais offre plus de
souplesse en ce qui concerne la présentation. Il est ainsi possible de définir
:

* le code html a afficher avant le résultat de la requête,
* le code html servant de modèle pour formatter chaque ligne du résultat de
la requête,
* le code html à générer à la suite du résultat de la requête.

Exemple de paramétrage pour un fichier CSV :

* Connection string : {odbc};Driver={Microsoft Text Driver (*.txt;
*.csv)};Dbq=~/data/
* Sql query :

```
SELECT affix, givenName, legalName,
       telephone, email,
       addressLine1, postalCode, municipality
FROM   [adresses.csv]
ORDER BY postalCode DESC, legalName ASC, givenName ASC
```

* Header section : &lt;ol&gt;
* Template for each item : &lt;h4&gt;{0} {1}
{2}&lt;/h4&gt;&lt;ul&gt;&lt;li&gt;téléphone : {3}&lt;/li&gt;&lt;li&gt;&lt;a
href='mailto:{4}'&gt;{4}&lt;/a&gt;&lt;/li&gt;&lt;li&gt;{5} - {6}
{7}&lt;/li&gt;&lt;/ul&gt;
* Footer section : &lt;/ol&gt;

Dans le cas d'un fichier Excel, la paramétrage de la connexion et de la
requête devraient être effectué de la façon suivante :

* Connection string : {odbc};Driver={Microsoft Excel Driver
(*.xls)};Dbq=~/data/adresses.xls
* Sql query :

```
SELECT affix, givenName, legalName,
       telephone, email,
       addressLine1, postalCode, municipality
FROM   [Sheet1$]
ORDER BY postalCode DESC, legalName ASC, givenName ASC
```
