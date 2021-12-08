---
date: 2013-02-11 22:15:50
layout: post
redirect_from: "post/2013/02/11/conditions-ruby"
tags: ruby
title: "Les conditions en Ruby"
---

## Le mot clé "if"

Comme dans la plupart des langages, le mot clé `if` sert à tester
une condition et il s'emploie de la façon suivante :

```
if condition
  ici_on_fait_quelque_chose...
end
```

On peut aussi compléter le `if` par un `then` (un peu
comme en Basic) :

```
if condition then
  ici_on_fait_quelque_chose...
end
```

## Le if "mono-ligne"

La version avec le `then` est obligatoire pour écrire des tests
sur une seule ligne de code :

```
if condition then ici_on_fait_quelque_chose... end
```

Par exemple :

```
irb(main):001:0> if 10 > 1 then puts "10 gagne" end
10 gagne
=> nil
```

Alors que :

```
irb(main):002:0> if 10 > 1 puts "10 gagne" end
SyntaxError: (irb):2: syntax error, unexpected tIDENTIFIER, expecting keyword_then or ';' or '
'
if 10 > 1 puts "10 gagne" end
              ^
(irb):2: syntax error, unexpected keyword_end, expecting $end
        from C:/Ruby/bin/irb:12:in `<main>'
```

Dans ce cas, on obtient une erreur qui nous dit qu'il manque le mot clé
`then`.

De même, on ne peut pas écrire tout simplement :

```
irb(main):003:0> if 10 > 1 puts "10 gagne"
irb(main):004:1>
```

L'indice `1` dans `irb(main):004:1>` nous indique
que IRB attend la suite de l'instruction. Et si on ajoute un `end`
pour "fermer" le `if`, on obtient une erreur qui nous dit qu'il
manque le mot clé `then` :

```
irb(main):003:0> if 10 > 1 puts "10 gagne"
irb(main):004:1> end
SyntaxError: (irb):3: syntax error, unexpected tIDENTIFIER, expecting keyword_then or ';' or '
'
if 10 > 1 puts "10 gagne"
              ^
(irb):4: syntax error, unexpected keyword_end, expecting $end
        from C:/Ruby/bin/irb:12:in `<main>'
irb(main):005:0>
```

## Le if en tant que "modificateur"

C'est pourquoi on utilise le `if` différement quand on veut
écrire un test sur une seule ligne :

```
ici_on_fait_quelque_chose... if condition
```

Ce qui donne :

```
irb(main):006:0> puts "10 gagne" if 10 > 1
10 gagne
=> nil
```

C'est déjà plus facile à écrire que `if 10 > 1 then puts "10 gagne"
end` et c'est aussi plus clair à lire :

> &gt; 10 gagne si 10 est supérieur à 1

est plus lisible et naturel que :

> &gt; si 10 est supérieur à 1 alors 10 gagne

## Le mot clé "else"

Comme dans les autres langages, on peut aussi définir le traitement à
réaliser lorsque la condition n'est pas respectée à l'aide du mot clé
`else` :

```
if condition
  ici_on_fait_quelque_chose...
else
  et_la_on_fait_autre_chose...
end
```

Ou :

```
if condition then
  ici_on_fait_quelque_chose...
else
  et_la_on_fait_autre_chose...
end
```

Cela peut aussi s'écrire sur 1 seule ligne, mais là encore on perd beaucoup
en lisibilité :

```
irb(main):017:0> if 10 > 1 then puts "10 gagne" else puts "10 perd" end
10 gagne
=> nil
```

## Le mot clé "elsif"

Quand on a besoin d'enchainer les tests, on peut utiliser le mot clé
`elsif` qui correspond au `else if` des autres
langages :

```
if condition_1
  ici_on_fait_quelque_chose...
elsif condition_2
  la_on_fait_autre_chose...
else
  et_la_une_autre_chose...
end
```

Par exemple :

```
if 10 > 1
  puts "10 gagne"
elsif 10 < 1
  puts "10 perd"
else
  puts "c'est serré"
end
```

Si nécessaire, on peut utiliser autant de `elsif` que l'on
veut :

```
if condition_1
  ici_on_fait_quelque_chose...
elsif condition_2
  la_on_fait_autre_chose...
elsif condition_3
  la_une_troisieme_chose...
else
  et_la_une_autre_chose...
end
```

Et dans tous les cas, la partie `else` doit toujours être située
après tous les autres tests.

Comme toujours, les `elsif` peuvent également être condensés à
condition d'utiliser le `then` :

```
if condition_1 then ici_on_fait_quelque_chose...
elsif condition_2 then la_on_fait_autre_chose...
elsif condition_3 then la_une_troisieme_chose...
else et_la_une_autre_chose...
end
```

Quand on a l'habitude de la syntaxe `else if` des autres
langages, il faut bien faire attention à ne pas se mélanger les pinceaux, parce
que l'utilisation de "else if" en Ruby provoque une imbrication des tests.

Le code Ruby ci-dessous est incorrect :

```
if 10 > 1
  puts "10 gagne"
else if 10 < 1
  puts "10 perd"
else
  puts "c'est serré"
end

=> syntax error, unexpected $end, expecting keyword_end
```

On a une erreur car en fait ce code correspond au code suivant :

```
if 10 > 1
  puts "10 gagne"
else
  if 10 < 1
    puts "10 perd"
  else
    puts "c'est serré"
  end
 <-- ici il manque un "end"
```

## Le mot clé "unless"

Quand on veut tester l'opposé d'une condition, on peut utiliser l'opérateur
`not` :

```
if not (condition)
  on_fait_quelque_chose...
end
```

Dans ce cas, on ne fait quelque chose que si la condition n'est pas
réalisée :

```
if not (10 < 1)
  puts "10 gagne"
end
```

Outre le fait qu'on est presque obligé de mettre des parenthèses pour s'y
retrouver, ça ne fait pas très lisible selon les critères rubyistes.

C'est là que le mot clé `unless` entre en scène :

```
unless condition
  on_fait_quelque_chose...
end
```

Comme par exemple :

```
unless 10 < 1
  puts "10 gagne"
end
```

En fait, le mot clé `unless` est l'exact opposé du mot clé
`if` et on peut faire avec lui tout ce qui est possible avec le
`if` :

```
unless condition then
  ici_on_fait_quelque_chose...
end

unless condition
  ici_on_fait_quelque_chose...
else
  et_la_on_fait_autre_chose...
end

unless condition then ici_on_fait_quelque_chose... end

etc...
```

Ce qui va décider du choix d'un `if` ou d'un `unless` à est une
question de fluidité du code : qu'est-ce qui est le plus clair à
comprendre et qu'est-ce qui sonne le mieux à l'oreille ?

Comme pour le `if`, le `unless` est très intéressant
quand on s'en sert en tant que "modificateur" :

```
ici_on_fait_quelque_chose... unless condition
```

Ce qui donne :

```
irb(main):021:0> puts "10 gagne" unless 10 < 1
10 gagne
=> nil
```

## L'opérateur ternaire "? ... :"

Il existe une autre façon d'écrire des tests "condensés", c'est l'opérateur
ternaire " `?` " qui existe également dans d'autres langages comme
C# ou PHP :

```
irb(main):022:0> puts 10 > 1 ? "10 gagne" : "10 perd"
10 gagne
=> nil
```

Après le " `?` " on met l'expression renvoyée lorsque la
condition est vraie et après le " `:` " on met l'expression renvoyée
lorsque la condition n'est pas vraie.

```
condition ? expression_si_vrai : expression_si_faux
```

Avec l'opérateur ternaire, on ne peut utiliser que des expressions à
renvoyer et pas des instructions à exécuter :

```
irb(main):023:0> puts 10 > 1 ? "10 gagne" : "10 perd"
10 gagne
=> nil

irb(main):024:0> 10 > 1 ? "10 gagne" : "10 perd"
=> "10 gagne"
```

Alors que :

```
irb(main):025:0> 10 > 1 ? puts "10 gagne" : puts "10 perd"
SyntaxError: (irb):25: syntax error, unexpected tSTRING_BEG, expecting keyword_do or '{' or '('
10 > 1 ? puts "10 gagne" : puts "10 perd"
               ^
(irb):25: syntax error, unexpected ':', expecting $end
10 > 1 ? puts "10 gagne" : puts "10 perd"
                          ^
        from C:/Ruby/bin/irb:12:in `<main>'
```

Donc, le résultat de l'opérateur ternaire est toujours une expression (celle
définie pour le cas où la condition est vraie ou bien celle définie pour le cas
contraire).

## Le if en tant que "expression"

Tout comme l'opérateur ternaire, le mot clé `if` peut lui aussi
servir à renvoyer une expression.

Par exemple, en C# on aurait ce code :

```
var resultat = "";

if (condition_1)
{
  resultat = "cas un";
}
else if (condition_2)
{
  resultat = "cas deux";
}
else
{
  resultat = "autre cas";
}

Console.WriteLine(resultat);
```

Dont l'équivalent en Ruby serait :

```
resultat = ""

if condition_1
  resultat = "cas un"
elsif condition_2
  resultat = "cas deux"
else
  resultat = "autre cas"
end

puts resultat
```

Mais en Ruby, il est quelquefois mieux de renvoyer une valeur depuis
l'instruction `if` :

```
resultat = if condition_1
             "cas un"
           elsif condition_2
             "cas deux"
           else
             "autre cas"
           end
puts resultat
```

Ou si la variable `resultat` ne sert jamais ailleurs :

```
puts if condition_1
       "cas un"
     elsif condition_2
       "cas deux"
     else
       "autre cas"
     end
```

C'est un peut comme l'opérateur ternaire `?` mais cela permet de
gérer plus de cas (et pas seulement un vrai / faux) et cela permet aussi
d'exécuter des instructions selon le cas :

```
puts if condition_1
       ici_on_fait_quelque_chose...
       "cas un"
     elsif condition_2
       la_on_fait_autre_chose...
       "cas deux"
     else
       et_la_une_autre_chose...
       "autre cas"
     end
```

De façon plus générale, il est bon de savoir qu'en Ruby toutes les
instructions sont en fait des expressions.

## Le mot clé "case"

Dans certains cas, on a besoin de tester plusieurs fois une même variable en
la comparant à différentes valeurs. On peut faire ça en enchainant toute une
série de `if` et de `elsif` :

```
if quoi == valeur_1
  ici_on_fait_quelque_chose...
elsif quoi == valeur_2
  la_on_fait_autre_chose...
elsif quoi == valeur_3
  la_une_troisieme_chose...
else
  et_la_une_autre_chose...
end
```

Mais en général, il vaut mieux simplifier ce genre de code en ayant recours
à la syntaxe `case ... when` :

```
case quoi
  when valeur_1
    ici_on_fait_quelque_chose...
  when valeur_2
    la_on_fait_autre_chose...
  when valeur_3
    la_une_troisieme_chose...
  else
    et_la_une_autre_chose...
end
```

Comme pour le `if`, un bloc `case` est capable de
renvoyer une valeur et on peut donc sans problème écrire le code
suivant :

```
resultat = case quoi
             when 1
               "cas un"
             when 2
               "cas deux"
             else
               "autre cas"
           end
puts resultat
```

Un `when` n'est pas limité à une seule valeur de comparaison. On
peut y faire figurer plusieurs valeurs, à condition de les séparer par des
virgules. Une autre possibilité est d'employer un Range pour tester par rapport
à un ensemble de valeurs.

```
case quoi
  when 0
    "zéro"
  when 1, 2, 3
    "très peu"
  when 4..9
    "un peu plus"
  else
    "beaucoup"
end
```

Comme pour le `if`, il est possible d'utiliser une version
"condensée" du `case ... when` en associant chaque condition au
mot-clé `then` pour séparer la condition en elle-même de son
traitement :

```
case quoi
  when 1 then "cas un"
  when 2 then "cas deux"
  else "autre cas"
end
```

Il existe également une autre forme de l'instruction `case` dans
laquelle on n'indique pas la valeur à tester après le
`case` :

```
case
  when quoi == 1
    "cas un"
  when quoi == 2
    "cas deux"
  when quoi < 5
    "cas trois ou quatre"
  else
    "autre cas"
end
```

Dans cette syntaxe, le `when` est suivi de la condition complète
(`quoi == 1`) et pas seulement de la valeur à tester. L'avantage,
c'est que cela permet beaucoup plus de variété dans les expressions à tester
(on peut même tester par rapport à d'autres variables). Par contre, ce n'est
pas forcément beaucoup plus lisible qu'une série de `if` /
`elsif` ?

Par rapport au langage C#, le `case ... when` du Ruby est assez
proche du `switch ... case` :

```
switch (quoi)
{
  case valeur_1:
    ici_on_fait_quelque_chose...
    break;
  case valeur_2:
    la_on_fait_autre_chose...
    break;
  case valeur_3:
    la_une_troisieme_chose...
    break;
  default:
    et_la_une_autre_chose...
    break;
}
```

Ils répondent tous les deux au même genre de besoin pour éviter un
enchainement de `if` et `elsif` / `else if`,
mais ils présentent tout de même une différence assez importante :

* En Ruby, seul le premier `when` dont la condition est vraie est
traité.
* Alors qu'en C#, tous les `case` pour lesquels la condition est
vérifiée sont pris en compte, d'où la nécessité du `break` pour se
limiter au premier cas trouvé.

Et aussi, si on est un peu habitué à C# (et peut-être d'autres langages), il
faut faire attention de ne pas se tromper en tapant des "case une_valeur" pour
chaque condition au lieu des "when une_valeur" typiques de Ruby.

## Les opérateurs || et ||=

Ce n'est pas une condition comme `if`, `unless` ou
`case`, mais c'est quelque chose qu'on rencontre assez souvent dans
en Ruby et qui permet de remplacer l'opérateur ternaire " `? ... :`
" quand on veut affecter une valeur par défaut à une variable.

```
irb(main):026:0> toto = "une valeur"
=> "une valeur"
```

L'opérateur ternaire " `? ... :` " peut permettre de tester
explicitement si la variable toto est définie et si c'est le cas renvoie cette
valeur toto et sinon renvoie "une autre valeur". La valeur retournée étant
ensuite affectée à la variable toto de départ.

```
irb(main):027:0> toto = toto ? toto : "une autre valeur"
=> "une valeur"
```

Dans ce code, la partie " `toto ?` " sert à tester si la variable
toto est définie, parce qu'en Ruby, quelque chose qui n'existe pas est
considéré (évalué) comme faux et quelque chose qui existe est considéré comme
vrai.

Etant donné que le test porte uniquement sur le fait que la variable toto
est définie ou non, l'opérateur " `||` " (le `or`) permet
de réaliser le même genre de test mais de façon implicite :

```
irb(main):028:0> toto = toto || "une autre valeur"
=> "une valeur"
```

L'opérateur " `||=` " permet d'aller encore plus loin dans la
mesure où le test porte sur la même variable que celle à laquelle on va
affecter le résultat :

```
irb(main):029:0> toto ||= "une autre valeur"
=> "une valeur"
```

L'opérateur " `||=` " est comme l'opérateur " `+=` "
qui permet quant à lui de concaténer les opérateurs " `+` " et "
`=` " :

```
irb(main):030:0> i = 10
=> 10
irb(main):031:0> i = 10 + 3
=> 13
irb(main):032:0> i += 3
=> 16
```

L'intérêt des opérateurs " `||` " et " `||=` " c'est
que lorsqu'ils sont employés avec des variables qui n'ont pas encore été
définies, cela permet de leur attribuer des valeurs par défaut :

```
irb(main):033:0> tutu = tutu ? tutu : "valeur par défaut 1"
=> "valeur par défaut 1"

irb(main):034:0> titi = titi || "valeur par défaut 2"
=> "valeur par défaut 2"

irb(main):035:0> tata ||= "valeur par défaut 3"
=> "valeur par défaut 3"

irb(main):036:0> puts tutu, titi, tata
valeur par défaut 1
valeur par défaut 2
valeur par défaut 3
=> nil
```
