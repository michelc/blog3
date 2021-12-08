---
date: 2010-02-23 22:51:00
layout: post
redirect_from: "post/2010/02/23/convertir-sql-en-linq-from-et-select"
tags: csharp, linq
title: "Convertir SQL en LINQ : FROM et SELECT"
---

{:.encart}
Ceci est une traduction assez libre de la série de billets rédigés par Bill
Horst pour apprendre comment [passer du langage SQL au langage LINQ](http://blogs.msdn.com/vbteam/archive/tags/Converting SQL to LINQ/default.aspx) et plus spécialement en
VB LINQ. Pour ma part, j'ai adapté les explications et les exemples de codes
pour cibler la syntaxe C# du langage LINQ.

Après un premier billet pour [comparer SQL et LINQ]({% post_url 2010-02-22-convertir-sql-linq-introduction %}), ce deuxième billet de la série va
présenter comment gérer des clauses plus spécifiques du SQL, en commençant par
deux des clauses les plus importantes : FROM et SELECT.

## La clause FROM

Une commande SQL SELECT débute toujours par une clause SELECT suivie d'une
clause FROM. Dans le cas de LINQ, une expression commence toujours par une
clause `from` (ou `aggregate` comme nous le verrons par
la suite). La clause SQL FROM de base indique la table sur laquelle va porter
la requête, et de façon similaire, la clause LINQ from indique l'objet sur
lequel va porter la requête (ClientListe dans notre exemple).

Cet objet peut représenter des données en mémoire, des données d'une table
SQL ou des données XML. Dans les exemples à venir, j'utilise des données
"en mémoire" pour que le code soit suffisamment simple. En plus de
cet objet sur lequel porte la requête, la clause LINQ from contient toujours un
identifiant pour la "ligne" courante (Contact dans notre exemple)
qui sert d'alias pour représenter cette ligne.

Avec SQL, il suffit de faire `SELECT *` pour sélectionner toutes
les colonnes de la table. En ce qui concerne LINQ, il suffit d'utiliser la
clause `select alias` pour renvoyer tous les membres de l'objet
requêté :

### SQL

```
SELECT *
FROM   ClientTable
```

### LINQ

```
from Contact in ClientListe
select Contact
```

## Utiliser un alias dans le FROM

En SQL, il est possible de définir un alias sur une table au niveau de la
partie FROM de la requête. Cela permet ensuite de faire référence aux colonnes
de la table source par l'intermédiaire de cet alias. Comme nous l'avons vu dans
le paragraphe précédent, l'identifiant qui est défini au niveau de la clause
from en LINQ sert lui aussi essentiellement à cela :

### SQL

```
SELECT Contact.ClientID, Contact.Telephone
FROM   ClientTable Contact
```

### LINQ

```
from Contact in ClientListe
select new { Contact.ClientID, Contact.Telephone }
```

## La clause SELECT

En SQL, les commandes SELECT contiennent une liste des valeurs à
sélectionner parmi les informations disponibles (Nom, Telephone, Ville…). De la
même façon, le langage LINQ vous permet lui aussi de sélectionner certains des
membres pour renvoyer un objet anonyme constitué à partir de cette
sélection.

Il n'est absolument pas nécessaire que les membres que vous définissez
correspondent à l'objet que vous avez spécifié au niveau de la clause from. Il
peut en effet s'agir de n'importe quelle expression C# valide (comme par
exemple `3 + 4`). S'il n'est pas possible de déduire le nom d'un membre
que vous avez sélectionné, vous devrez utiliser un alias (voir le paragraphe
suivant).

### SQL

```
SELECT Nom, ClientID
FROM   ClientTable Contact
```

### LINQ

```
from Contact in ClientListe
select new { Contact.Nom, Contact.ClientID }
```

## Utiliser un alias dans le SELECT

Toujours en SQL, il est possible de définir des alias pour les différents
éléments que vous sélectionnez au niveau de la clause SELECT, ce qui permet
ensuite d'utiliser ces alias pour faire référence à ces éléments. De la même
façon, LINQ vous permet de donner un nom aux éléments que vous sélectionnez, ce
qui vous permettra par la suite d'utiliser ce nom faire référence à ces
éléments lorsque vous exploiterez le résultat de la requête LINQ.

### SQL

```
SELECT Nom NomContact, ClientID ContactID
FROM   ClientTable Contact
```

### LINQ

```
from Contact in ClientListe
select new { NomContact = Contact.Nom, ContactID = Contact.ClientID }
```

Dans le prochain billet, je présenterai les équivalents des clauses
DISTINCT, WHERE et ORDER BY pour le langage LINQ.
