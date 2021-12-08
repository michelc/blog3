---
date: 2010-02-22 19:32:00
layout: post
redirect_from: "post/2010/02/22/convertir-sql-en-linq-introduction"
tags: csharp, linq
title: "Convertir SQL en LINQ : Introduction"
---

{:.encart}
Ceci est une traduction assez libre de la série de billets rédigés par Bill
Horst pour apprendre comment [passer du langage SQL au langage LINQ](http://blogs.msdn.com/vbteam/archive/tags/Converting SQL to LINQ/default.aspx) et plus spécialement en
VB LINQ. Pour ma part, j'ai adapté les explications et les exemples de codes
pour cibler la syntaxe C# du langage LINQ.

Comme vous le savez sans doute déjà, les commandes LINQ permettent d'écrire
des requêtes en C# en utilisant une syntaxe inspirée de SQL. Cependant, la
syntaxe de LINQ ne correspond pas exactement à la syntaxe du SQL. Par
conséquent, si vous avez déjà travaillé en SQL ou que vous êtes habitués à
écrire des requêtes SQL, vous allez sans doute chercher à transformer vos
requêtes SQL en requêtes LINQ.

Ce billet va être le premier d'une série consacrée à la façon de traduire du
SQL en LINQ. Dans cette introduction, je souhaite présenter ce qui différencie
LINQ de SQL puis j'aborderai les particularités de chaque syntaxe dans la suite
de la série.

## Pré-requis

Les exemples de code SQL que je vais utiliser seront basés sur une table
ClientTable et une table CommandeTable. Pour les exemples C#, je m'appuierai
sur des objets ClientListe et les objets CommandeListe, tous deux de type
IEnumerable. Et j'utiliserai deux classes, Client et Commande qui sont définies
de la façon suivante :

```
class Client
{
    public int ClientID;
    public string Nom;
    public string Telephone;
    public string Adresse;
    public string Ville;
    public string CodePostal;
    public string Region;
}

class Commande
{
    public int CommandeID;
    public int ClientID;
    public Single Cout;
    public string Telephone;
    public DateTime DateCommande;
    public string Livraison;
    public string NomArticle;
}
```

## Syntaxe de base

LINQ gère l'équivalent des commandes SQL SELECT, mais pas les autres types
de commandes SQL telles que CREATE, INSERT, UPDATE ou DELETE. On peut
considérer que la syntaxe de base d'une requête SQL SELECT est constituée d'une
série de clauses débutant par une clause SELECT :

```
sqlSelectClause [ sqlClause1 [ sqlClause2 [ ... ] ] ]
```

Il peut exister un certain nombre de différences en fonction des nombreuses
versions de SQL, mais on a toujours plus ou moins la même syntaxe
générale :

```
SELECT Nom NomContact, ClientID ContactID
FROM   ClientTable
ORDER BY Nom
```

La syntaxe de base pour une expression LINQ consiste également en une série
de clauses qui débute par la clause `from` (ou
éventuellement une clause `aggregate` comme nous le verrons plus
tard) :

```
linqFromClause [ linqClause1 [ linqClause2 [ ... ] ] ]
```

Ce qui donne par exemple :

```
from Contact in ClientListe
orderby Contact.Nom
select new { NomContact = Contact.Nom, ContactID = Contact.ClientID }
```

J'ai employé le terme "expression LINQ" ci-dessus parce qu'à
proprement parler les requêtes LINQ ne sont pas des commandes complètes. Alors
qu'une requête SQL se suffit à elle-même, si on se place d'un point de vue
syntaxique, une requête LINQ n'est que l'équivalent d'une expression telle que
`3 * 4`. Cela ne constitue pas une commande complète et il faut donc
"faire" quelque chose avec. Une requête LINQ peut apparaitre dans
du code C# tel que celui-ci :

```
var ContactsTries = from Contact in ClientListe
                    orderby Contact.Nom
                    select new { NomContact = Contact.Nom, ContactID = Contact.ClientID };
```

Chaque clause d'une requête LINQ porte sur un objet de type
IEnumerable&lt;T&gt; et renvoie un nouvel objet de type IEnumerable&lt;T&gt;
(sans que le type T retourné soit nécessairement du même type que le T
initial). En général, les clauses de la requête sont analogues aux clauses SQL
(SELECT ou ORDER BY par exemple) et vous pouvez habituellement traduire votre
requête SQL en LINQ en faisant du "clause à clause". Dans les exemples
ci-dessus, même si les clauses apparaissent dans un ordre légèrement différent,
vous pouvez malgré tout voir qu'elles sont assez semblables.

## Conclusion

Après cette introduction assez généraliste, j'aborderai des aspects plus
spécifiques au cours des billets suivants. Mon objectif tout au long de ces
petits tutoriels consacrés à la traduction du SQL en LINQ est de présenter les
points suivants :

* [FROM et SELECT]({% post_url 2010-02-23-convertir-sql-linq-from-select %})
* [DISTINCT, WHERE et ORDER BY]({% post_url 2010-02-24-convertir-sql-linq-distinct-where-order-by %})
* Les fonctions (scalaires et agrégations)
* GROUP BY et HAVING
* Les jointures
* UNION, TOP et sous-requêtes
