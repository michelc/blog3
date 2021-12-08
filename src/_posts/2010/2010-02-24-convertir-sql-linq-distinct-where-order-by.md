---
date: 2010-02-24 13:41:00
layout: post
redirect_from: "post/2010/02/24/convertir-sql-en-linq-distinct-where-order-by"
tags: csharp, linq
title: "Convertir SQL en LINQ : DISTINCT, WHERE et ORDER BY"
---

{:.encart}
Ceci est une traduction assez libre de la série de billets rédigés par Bill
Horst pour apprendre comment [passer du langage SQL au langage LINQ](http://blogs.msdn.com/vbteam/archive/tags/Converting SQL to LINQ/default.aspx) et plus spécialement en
VB LINQ. Pour ma part, j'ai adapté les explications et les exemples de codes
pour cibler la syntaxe C# du langage LINQ.

Ce troisième billet de la série continue la [description des clauses spécifiques]({% post_url 2010-02-23-convertir-sql-linq-from-select %}) et il va porter sur la
façon de transformer les clauses DISTINCT, WHERE et ORDER BY en clauses
LINQ.

## La clause DISTINCT

Les commandes SQL SELECT peuvent contenir un mot-clé `DISTINCT`
qui sert à supprimer tous les doublons dans les résultats renvoyés. Avec le
langage LINQ, il n'existe pas de mot-clé "`distinct`" qui pourrait
compléter la clause select ou être inséré au niveau de la requête LINQ. Pour
éviter d'avoir des doublons dans les résultats obtenus, il faut employer la
méthode `Distinct()`. Cette méthode renvoie des éléments distincts à
partir de la source sur laquelle on l'applique. Les deux exemples ci-dessous
ont le même effet :

### SQL

```
SELECT DISTINCT Region
FROM   ClientTable
```

### LINQ

```
var ListeRegions = (from Contact in ClientListe
                   select Contact.Region).Distinct();
```

## La clause WHERE

Comme pour une requête SQL, une expression LINQ permet elle aussi de filtrer
les résultats renvoyés en ajoutant une clause "`where`". Cette
clause peut contenir n'importe quelle expression C# booléenne.

### SQL

```
SELECT *
FROM   ClientTable
WHERE  Region = 'PACA'
```

### LINQ

```
from Contact in ClientListe
where Contact.Region == "PACA"
select Contact
```

## Utiliser un opérateur

Avec SQL, les clauses `WHERE` contiennent très souvent d'autres
opérateurs comme `AND` par exemple. Il existe généralement un
opérateur équivalent en C# qui peut être employé au niveau de la clause
`where` de la requête LINQ pour obtenir le même genre de
résultat.

### SQL

```
SELECT *
FROM   ClientTable
WHERE  Region = 'PACA'
AND    CodePostal = '06570'
```

### LINQ

```
from Contact in ClientListe
where Contact.Region == "PACA"
&& Contact.CodePostal == "06570"
select Contact
```

Même lorsqu'il n'existe pas vraiment d'équivalent en C#, il est généralement
possible de reproduire n'importe quelle expression SQL sous forme d'expression
C#. Par exemple, il n'existe pas de mot-clé en C# qui corresponde au mot-clé
"`BETWEEN`" du SQL. Mais on peut facilement obtenir un résultat
similaire en C#.

### SQL

```
SELECT *
FROM   CommandeTable
WHERE  DateCommande BETWEEN '2010-01-01' AND '2010-12-31'
```

### LINQ

```
from Colis in CommandeListe
where Colis.DateCommande >= "2010-01-01"
&& Colis.DateCommande <= "2010-12-31"
select Colis
```

Dans le cas de l'opérateur "`IN`" du SQL, il est possible
d'utiliser la méthode `Contains()` pour arriver au même
résultat :

### SQL

```
SELECT *
FROM   ClientTable
WHERE  Region IN ('IDF', 'PACA')
```

### LINQ

```
string[] regions = { "RA", "PACA" };
var ContactsSud = from Contact in ClientListe
                  where regions.Contains(Contact.Region)
                  select Contact
```

## La clause ORDER BY

La clause `ORDER BY` du SQL peut elle aussi être représentée par
une expression LINQ. La cause "`orderby`" du langage LINQ sert à
indiquer comment les résultats doivent être classés en définissant une liste
d'expressions séparées par des virgules. Il est possible d'employer n'importe
quelle expression C#, sans qu'il soit nécessaire que cette expression fasse
parti des éléments sélectionnés dans la requête LINQ.

### SQL

```
SELECT *
FROM   ClientTable
ORDER BY Telephone
```

### LINQ

```
from Contact in ClientListe
orderby Contact.Telephone
select Contact
```

## Définir l'ordre du tri

La clause SQL `ORDER BY` peut aussi contenir les mots-clés
`ASC` ou `DESC` pour préciser sir le tri doit de faire de
façon croissante ou décroissante. Avec LINQ, il faut utiliser les mots-clés
"`ascending`" ou "`descending`" pour obtenir le même
résultat. Quand aucun de ces mots-clés n'est indiqué, le tri est réalisé de
façon croissante par défaut.

### SQL

```
SELECT * FROM ClientTable
ORDER BY Telephone ASC, Nom DESC
```

### LINQ

```
from Contact in ClientListe
orderby Contact.Telephone ascending, Contact.Nom descending
select Contact
```

## Conclusion

Avec ce nouveau billet et les deux billets précédents, il vous est possible
de convertir des requêtes SQL basiques en requêtes LINQ. Dans le prochain
billet, j'aborderai la façon de traduire les fonctions scalaires ou les
fonctions d'agrégations du SQL en LINQ
