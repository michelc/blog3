---
date: 2009-10-14 14:51:00
layout: post
redirect_from: "post/2009/10/14/Les-types-implicites-en-c"
tags: csharp
title: "Les types implicites en c#"
---

Le compilateur C# 3.0 permet de déclarer les variables de façon implicite
grâce au nouveau mot clé "var". Au lieu de nous forcer à taper le code
suivant :

```
MonTypeSpecial toto = new MonTypeSpecial();
```

Il est possible d'économiser quelques touches en tapant seulement :

```
var toto = new MonTypeSpecial();
```

Dans les deux cas, le résultat est strictement identique et la variable toto
est bien toujours une variable de type MonTypeSpecial, qu'elle soit déclarée
explicitement ou implicitement. Dans la pratique, le code compilé est également
rigoureusement le même.

Lors de la compilation, le compilateur comprend que `new
MonTypeSpecial()` est une expression pour initialiser une variable de
type "MonTypeSpecial". Et comme le type de la variable à laquelle on affecte
cette expression n'est pas défini, il lui attribue implicitement le même
type.

Par conséquent, ce n'est en aucune manière une incursion du C# dans le monde
des langages dynamiques ou faiblement typés et le mot clé "var" n'a rien à voir
avec la déclaration de [variables de type Variant](http://en.wikipedia.org/wiki/Variant_type) qui existait en Visual Basic.

La mot clé "var" peut être utilisé dans tous les cas où la variable déclarée
est initialisée, quelque soit le type de l'expression qui sert à
l'initialisation.

```
var i = 0;                           // i est un int
var j = i;                           // j est un int
var k = i + 10;                      // k est un int
var d = 12.34;                       // d est un double
var q = d / 2;                       // q est un double
var a = k / 3;                       // a est un int (int /int => int)
var f = (float)i;                    // f est un float
var t = "toto";                      // t est un string
var l = t.Length();                  // l est un int
var x = new DateTime(1980, 1, 1);    // x est une DateTime
```

Par contre, le code suivant ne compilera même pas :

```
// Impossible d'assigner <null> à une variable locale implicitement typée
var n = null;
// Les variables locales implicitement typées doivent être initialisées
var i;
i = 0;
```

Par ailleurs, on ne peut employer "var" qu'avec des variables locales et en
aucun cas :

* pour des variables publiques
* en tant que paramètre de fonction
* comme valeur de retour d'une méthode
* comme type d'une propriété

=> Le mot clé contextuel 'var' ne peut apparaître que dans une
déclaration de variable locale

Sinon, il (me) semble préférable de réserver l'utilisation des déclarations
implicites au cas où l'expression d'initialisation indique en toute lettre le
type de l'expression et de les éviter quand cela demande de démarrer le
cerveau :

```
// Ok
var toto = new MonTypeSpecial();
var x = new DateTime(1980, 1, 1);
// Bof
var i = 0;
var j = i;
var t = "toto";
var l = t.Length();
```
