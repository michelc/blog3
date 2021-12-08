---
date: 2009-06-25 11:39:00
layout: post
redirect_from: "post/2009/06/25/Les-types-nullables-en-c"
tags: csharp
title: "Les types nullables en c#"
---

Avec le compilateur C# 1.1, une variable de type valeur (comme un bool, un
int, un double... mais aussi une DateTime) ne pouvait pas prendre la valeur
null.

* Quand on déclare une variable de type valeur, il faut obligatoirement lui
affecter une valeur avant de l'utiliser, sans quoi on obtient une erreur de
compilation : *Utilisation d'une variable non assignée*.

```
int compteur;
if (compteur == 0) {
        Console.WriteLine("zéro");
}
```

* Il est impossible de lui attribuer la valeur null, car dans ce cas on
obtient l'erreur *Impossible de convertir une valeur Null en 'int', car il
s'agit d'un type valeur*.

```
int compteur = null;
if (compteur == 0) {
        Console.WriteLine("zéro");
}
```

* Et bien sûr, on ne peut pas la comparer à la valeur null :
*L'opérateur '==' ne peut pas être appliqué aux opérandes de type 'int' et
'&lt;null&gt;'*

```
int compteur = 0;
if (compteur == null) {
        Console.WriteLine("null");
}
```

Avec le compilateur C# 2.0, il est désormais possible de faire en sorte que
des variables de type valeur acceptent aussi une valeur nulle en plus des
valeurs qu'elles peuvent prendre habituellement. Par exemple, une variable
nullable de booléen pourra stocker true, false et null. Outre le fait que c'est
une aubaine pour les indécis, c'est aussi censé être très pratique pour stocker
les valeurs indéfinies en provenance d'une base de données.

Pour qu'un type de valeur devienne nullable, il faut suffixer le type valeur
habituel avec un "?" :

```
int? compteur = null;
bool? ca_marche = null;
DateTime? pour_quand = null;
```

En fait, les types nullables sont des instances du struct System.Nullable.
Par conséquent, les trois déclarations précédentes sont rigoureusement
équivalentes aux trois lignes ci-dessous :

```
Nullable<int> compteur = null;
Nullable<bool> ca_marche = null;
Nullable<DateTime> pour_quand = null;
```

Les variables nullables ont une propriété HasValue qui renvoie true lorsque
la variable contient une valeur et false quand la variable est nulle.

```
bool? ca_marche = null;
...
if (ca_marche.HasValue == false) {
        Console.Write("Pas de réponse");
} else if (ca_marche == true) {
        Console.Write("Oui");
} else {
        Console.Write("Non");
}
```

Elles ont aussi une méthode GetValueOrDefault() qui renvoie :

* la valeur de la variable quand celle-ci n'est pas nulle (soit
**GetValue**OrDefault**()**)
* la valeur par défaut pour le type de valeur correspondant lorsque la
variable est nulle (soit
**Get**ValueOr**Default()**)

C'est ce qui permet par exemple d'affecter une variable de type nullable à
une variable de type valeur correspondant :

```
int? toto = null;

int tutu;
tutu = toto.GetValueOrDefault();
Console.Write(tutu); // affiche 0

toto = 12;

int titi;
titi = toto.GetValueOrDefault();
Console.Write(titi); // affiche 12
```

On peut aussi utiliser le nouvel opérateur **??** pour définir
la valeur par défaut qui sera utilisée dans le cas où on assignerait une
variable de type nullable ayant la valeur nulle à une variable de type valeur
non nullable :

```
int? toto = null;

int tutu;
tutu = toto ?? 0;
Console.Write(tutu); // affiche 0
int titi = toto ?? 12;
Console.Write(titi); // affiche 12
```

Par contre, il y aura une erreur de compilation si on essaie d'affecter
directement une variable de type nullable à une variable de type
valeur :

```
int? toto = null;
int tutu = toto; // Erreur de compilation: Cannot implicitly convert type 'int?' to 'int.
int? titi = 12;
tutu = titi; // Erreur de compilation: Cannot implicitly convert type 'int?' to 'int.
```

A la rigueur, il est possible de caster la variable de type nullable à une
variable de type valeur. Cela ne provoquera pas d'erreur de compilation mais
attendra l'exécution pour planter :

```
int? toto = null;
int tutu = (int)toto; // Compile mais provoque une exception de type InvalidCastException à l'exécution
```

Documentations sur les types nullables :

* [les types nullables sur MSDN](http://msdn.microsoft.com/fr-fr/library/1t3y8s4s(VS.80).aspx)
* [le monde magique des types nullables de C#](http://www.dotnetguru.org/articles/dossiers/nullabletypes/CS2_NullableTypes_FR.htm) par Patrick
Smacchia sur DotNetGuru
