---
date: 2010-04-28 18:02:00
layout: post
redirect_from: "post/2010/04/28/c-est-quoi-cette-expression-lambda"
tags: .net
title: "C'est Quoi cette Expression Lambda ?"
---

{:.encart}
Ceci est la traduction du billet "[What on Earth is a Lambda Expression?](http://blogs.msdn.com/simonince/archive/2010/04/16/what-on-earth-is-a-lambda-expression.aspx)"
de Simon Ince.

Ces derniers temps, j'ai eu à faire à quelques clients qui se demandaient ce
qu'était une Expression Lambda, ce qui n'a pas manqué de me surprendre. Il
semblerait donc qu'une seconde vague de développeurs se mette à utiliser les
Lambdas (sans doute ceux qui n'étaient pas passé à C# 3.0 dès sa sortie) et
qu'ils ont besoin de quelques pistes. C'est pourquoi ce billet est destiné à
vous aider à comprendre ce que représentent les expressions lambdas.

Je ne vais pas chercher à répondre au comment, au pourquoi, au quand ou à
quoi que ce soit dans ce genre. Il existe déjà de bien meilleurs billets sur le
sujet. Non, je vais juste vous dire "bon sang, mais ça veut dire quoi une
syntaxe pareille ?".

## Prenons un exemple concret

Je vais utiliser une situation classique auquel tout développeur est
confronté de nos jours : filtrer une liste de Lamas en tenant compte de
leur taille de leur propension à ronchonner (Ouais, je sais que c'est plus
typique du pays de Candy que de celui de l'informatique, mais le vendredi
après-midi c'est permis).

Supposons que nous ayons une liste de nos Lamas préférés :

```
private static List<Lama> Lamas = new List<Lama>()
{
    new Lama { Nom = "Larry", Taille = 10, EstRonchon = true },
    new Lama { Nom = "Loulou", Taille = 12, EstRonchon = false },
    new Lama { Nom = "Lara", Taille = 8, EstRonchon = true },
    new Lama { Nom = "Lorry", Taille = 4, EstRonchon = true },
    new Lama { Nom = "Laurel", Taille = 20, EstRonchon = false },
    new Lama { Nom = "Louise", Taille = 17, EstRonchon = true }
};
```

Maintenant, imaginez que je veuille obtenir une liste de tous les Lamas qui
sont à la fois grands et du genre ronchonneur. On pourrait y arriver de la
façon suivante :

```
var results = new List<Lama>();
foreach (var lama in Lamas)
{
    bool include = lama.EstRonchon && lama.Taille > 9;
    if (include)
        results.Add(lama);
}
```

## Refactoriser en Lambda

Le problème c'est que ça fait un paquet de code pour appliquer un filtre
tout bête… Alors que nous savons bien qu'il existe de supers méthodes
d'extensions en LINQ qui permettent d'exécuter une commande Where sur une
collection d'objets.

On va modifier un peu notre syntaxe de départ pour nous orienter dans la
bonne direction. **Notez bien que la plupart du code C# contenu dans le
reste de ce billet est délibérément faux**, étant donné que je cherche à
vous conduire vers la solution. Je vous préviendrai la prochaine fois que vous
aurez à faire à une syntaxe correcte !

Imaginons que Where prenne comme paramètre le nom d'une méthode qui réalise
le filtrage de la liste. Notre code pourrait alors se présenter comme
ceci :

```
var results = Lamas.Where(Filter);
```

... avec une méthode helper qu'on appellerait Filter :

```
private bool Filter(Lama lama)
{
    return lama.EstRonchon && lama.Taille > 9;
}
```

C'est pas complètement idiot ? La méthode Where appelle la méthode
Filter en lui passant chaque Lama un par un pour vérifier s'il doit faire parti
des résultats ou non.

## Méthode anonyme en ligne

Ouais mais quand même : notre méthode Filter ne sert qu'à un seul
endroit pour filtrer nos Lamas. On pourrait donc se simplifier la vie et éviter
d'avoir à la déclarer en faisant une méthode en ligne à la place. Pourquoi pas
quelque chose comme ci-dessous (encore une fois, c'est une syntaxe fictive
comme la plupart du code dans ce billet) :

```
var results = Lamas.Where(
    bool Filter(Lama lama)
    {
        return lama.EstRonchon && lama.Taille > 9;
    });
```

Ca c'est fait. Et en plus on s'est débarrassé du mot clé private puisque la
méthode n'est plus un membre de la classe. Mais alors, à quoi ça sert qu'elle
ait encore un nom ? Y'a qu'à le virer :

```
var results = Lamas.Where(
    bool (Lama lama)
    {
        return lama.EstRonchon && lama.Taille > 9;
    });
```

Ca c'est déjà plus concis. Suivez-bien et je vous traduis ce que ça veut
dire : "cette méthode renvoie un Booléen, et attend un Lama en
entrée", suivi du code pour le corps de la méthode.

## Types implicites

Attendez-voir. Le compilateur C# est quand même vachement intelligent, pas
vrai ? Alors pourquoi est-ce que je me décarcasse à lui dire que la
méthode renvoie un Booléen puisqu'il sait bien que la méthode Where a besoin
d'un Booléen et qu'il est assez grand peut se rendre compte que la commande
`EstRonchon && Taille > 9` est une expression de type
Booléen ? Tchao Tchao le Booléen :

```
var results = Lamas.Where(
    (Lama lama)
    {
        return lama.EstRonchon && lama.Taille > 9;
    });
```

Et on sait bien que la méthode Where s'applique à une `List<Lama>`, ce
qui fait que le seul argument possible pour cette méthode est de type Lama…
Alors arrêtons d'écrire des trucs inutiles dans notre code :

```
var results = Lamas.Where(
    (lama)
    {
        return lama.EstRonchon && lama.Taille > 9;
    });
```

## Constructeurs inutiles

Le truc c'est que notre méthode n'est rien de plus qu'une seule et
ridiculement simple ligne d'expression Booléenne. Alors pourquoi avoir encore
besoin du mot clé `return` ? Ou du point-virgule pour terminer
la ligne ? On sait très bien ce qu'elle fait. Et on n'a quand même pas
besoin des accolades pour une expression d'une seule ligne, pas vrai ?

```
var results = Lamas.Where(
    (lama)
        lama.EstRonchon && lama.Taille > 9
    );
```

Mais ça se complique un peu si on se met à supprimer les espaces
inutiles :

```
var results = Lamas.Where( (lama) lama.EstRonchon && lama.Taille > 9 );
```

Là ça devient un peu plus coton à lire. Il nous faudrait trouver une autre
façon de séparer les paramètres en entrée du corps de notre expression. Et avec
C#, c'est justement à ça que sert l'opérateur `=>` :

```
var results = Lamas.Where( (lama) => lama.EstRonchon && lama.Taille > 9 );
```

Et on n'a pas non plus besoin des parenthèses autour du paramètre en entrée
puisqu'on en a un seul :

```
var results = Lamas.Where( lama => lama.EstRonchon && lama.Taille > 9 );
```

Et pourquoi diable gaspiller toutes ces lettres pour écrire
`lama` à chaque fois alors qu'on pourrait très bien se contenter
d'un simple `l` ?

```
var results = Lamas.Where( l => l.EstRonchon && l.Taille > 9 );
```

## Résumé

Il s'avère que **les trois dernières commandes ci-dessus sont des
Expressions Lambdas valides** qui filtrent une liste de Lamas pour nous.
L'objectif de ce code n'a pas varié d'un iota et il continue à avoir la même
signification :

> Tiens. C'est une méthode qui prend un paramètre nommé `l` et
> renvoie un résultat Booléen en appliquant l'expression suivante au paramètre en
> entrée. T"as qu'à t'en servir pour filtrer les Lamas, steuplé !

Et maintenant, à vous de découvrir ce que la syntaxe ci-dessous peut bien
vouloir dire :

```
grandRonchonLamas.ForEach(l => Console.WriteLine(l.Nom));
```

Je souhaite de tout cœur que cette approche un peu décalée a réussi à vous
expliquer comment utiliser les Expressions Lambdas. Maintenant, vous n'avez
plus qu'à approfondir tout ça et à vous documenter un peu pour comprendre des
trucs comme Expression&lt;&gt;, Func&lt;&gt;, Action&lt;&gt;, etc…

Amusez-vous bien !

{:.encart}
Ceci est la traduction du billet "[What on Earth is a Lambda Expression?](http://blogs.msdn.com/simonince/archive/2010/04/16/what-on-earth-is-a-lambda-expression.aspx)" de Simon Ince.
