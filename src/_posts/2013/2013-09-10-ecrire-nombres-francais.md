---
date: 2013-09-10 22:35:00
layout: post
redirect_from: "post/2013/09/10/ecrire-nombres-en-francais"
tags: csharp, unit-test
title: "Ecrire des nombres en français"
---

Mehdi Khalili a développé [Humanizer](https://github.com/MehdiK/Humanizer), une librairie C# pour humaniser les dates et les
nombres et il souhaite désormais essayer d'internationaliser. J'ai regardé vite
fait ce que cela pourrait donner en français et ça n'a pas été franchement
concluant en ce qui concerne les nombres. On pourrait presque croire que le
français est plus compliqué que l'anglais...

## Un peu d'archéologie

Heureusement, il y a très longtemps j'avais déjà fait un petit programme
pour écrire les nombres en lettres parce qu'en ces temps reculés c'était encore
nécessaire pour pouvoir imprimer des chèques (sur une imprimante matricielle).
A l'époque l'Internet n'existait pas trop (Compuserve peut être ?) et j'avais
adapté une macro Lotus 123 (sans doute trouvée sur l'Ordinateur Individuel) en
Quick Basic.

Et donc, voici en 106 lignes de QuickBasic comment écrire à peu près
correctement des nombres en lettres :

```
DECLARE FUNCTION CDU$ (NOMBRE#)
DECLARE FUNCTION STRNUM$ (NUM AS STRING)
DIM SHARED TABLE1$(9), TABLE2$(9), TABLE3$(9)

WIDTH 80, 25

DATA "","un","deux","trois","quatre","cinq","six","sept","huit","neuf"
DATA "","dix","vingt","trente","quarante","cinquante","soixante","soixante","quatre-vingt","quatre-vingt"
DATA "dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"

FOR DUM% = 0 TO 9
     READ TABLE1$(DUM%)
NEXT

FOR DUM% = 0 TO 9
     READ TABLE2$(DUM%)
NEXT

FOR DUM% = 0 TO 9
     READ TABLE3$(DUM%)
NEXT

GOTO toto
N% = -100
DO
     N% = N% + 1
     PRINT N%, STRNUM$(STR$(N%))
     IF CSRLIN > 40 THEN T$ = INPUT$(1): CLS
LOOP WHILE T$ <> CHR$(27)
END
toto:
DO
     INPUT N$
     PRINT STRNUM$(N$)
LOOP WHILE N$ <> ""

FUNCTION CDU$ (NOMBRE#)
NBR# = NOMBRE#
IF NBR# > 99 THEN
     FOCUS% = INT(NBR# / 100)
     NBR# = NBR# - (CDBL(FOCUS% * 100#))
     IF FOCUS% > 1 THEN N$ = " " + TABLE1$(FOCUS%)
     N$ = N$ + " cent"
     IF FOCUS% > 1 AND INT(NBR#) = 0 THEN N$ = N$ + "s"
     N$ = N$ + CDU$(NBR#)
ELSEIF NBR# > 19 THEN
     FOCUS% = INT(NBR# / 10)
     NBR# = NBR# - (CDBL(FOCUS% * 10#))
     IF FOCUS% > 0 THEN N$ = N$ + " " + TABLE2$(FOCUS%)
     IF FOCUS% = 7 THEN
          IF INT(NBR#) = 1 THEN N$ = N$ + " et"
          NBR# = NBR# + 10
     ELSEIF FOCUS% = 8 THEN
          IF INT(NBR#) = 0 THEN N$ = N$ + "s"
     ELSEIF FOCUS% = 9 THEN
          NBR# = NBR# + 10
     ELSEIF FOCUS% <> 0 THEN
          IF INT(NBR#) = 1 THEN N$ = N$ + " et"
     END IF
     N$ = N$ + CDU$(NBR#)
ELSEIF NBR# > 9 THEN
     FOCUS% = INT(NBR#) - 10
     NBR# = NBR# - FOCUS%
     N$ = N$ + " " + TABLE3$(FOCUS%)
ELSEIF NBR# > 0 THEN
     FOCUS% = INT(NBR#)
     NBR# = NBR# - FOCUS%
     IF FOCUS% > 0 THEN N$ = N$ + " " + TABLE1$(FOCUS%)
END IF
CDU$ = N$
END FUNCTION

FUNCTION STRNUM$ (NUM AS STRING)
NOMBRE$ = ""
NOMBRE# = CDBL(VAL(NUM$))
IF NOMBRE# < 0# THEN
     NOMBRE$ = "moins" + STRNUM$(STR$(-NOMBRE#))
ELSEIF NOMBRE# > 0# THEN
     RESTE# = NOMBRE#
     NOMBRE# = CDBL(INT(RESTE# / 1000000000#))
     IF NOMBRE# > 0# THEN
          RESTE# = RESTE# - (NOMBRE# * 1000000000#)
          NOMBRE$ = NOMBRE$ + CDU$(NOMBRE#)
          NOMBRE$ = NOMBRE$ + " milliard"
          IF NOMBRE# > 1 THEN NOMBRE$ = NOMBRE$ + "s"
     END IF
     NOMBRE# = CDBL(INT(RESTE# / 1000000#))
     IF NOMBRE# > 0# THEN
          RESTE# = RESTE# - (NOMBRE# * 1000000#)
          NOMBRE$ = NOMBRE$ + CDU$(NOMBRE#)
          NOMBRE$ = NOMBRE$ + " million"
          IF NOMBRE# > 1 THEN NOMBRE$ = NOMBRE$ + "s"
     END IF
     NOMBRE# = CDBL(INT(RESTE# / 1000#))
     IF NOMBRE# > 0# THEN
          RESTE# = RESTE# - (NOMBRE# * 1000#)
          IF NOMBRE# > 1 THEN NOMBRE$ = NOMBRE$ + CDU$(NOMBRE#)
          NOMBRE$ = NOMBRE$ + " mille"
          IF NOMBRE# > 1 THEN NOMBRE$ = NOMBRE$ + ""
     END IF
     NOMBRE# = CDBL(INT(RESTE#))
     IF NOMBRE# > 0# THEN NOMBRE$ = NOMBRE$ + CDU$(NOMBRE#)
     NOMBRE# = CDBL(VAL(MID$(NUM$, INSTR(NUM$ + ".", ".") + 1)))
     IF NOMBRE# > 0# THEN NOMBRE$ = NOMBRE$ + " virgule" + STRNUM$(STR$(NOMBRE#))
END IF
STRNUM$ = LTRIM$(NOMBRE$)
END FUNCTION
```

C'est donc pas si compliqué. Il suffit juste de se replonger dans ce code
pour trouver comment ça marche pour écrire des nombres en bon français puis
d'essayer de l'adapter en C#.

## Un peu de spécifications

Mais pour mettre toutes les chances de mon côté, je vais quand même m'aider
d'Internet et plus particulièrement de l'extraordinaire documentation
suivante :

> **Écriture des nombres en français** par Olivier Miakinen.
>
> GOTO "[http://www.miakinen.net/vrac/nombres](http://www.miakinen.net/vrac/nombres "Écriture des nombres en français")"
>
> C'est un peu long, mais c'est vraiment super intéressant à lire. Toutes les
> explications données ici sont reprises de ce site (et donc à consulter quand
> j'ai un peu trop simplifié).

Le principe pour écrire un nombre en toutes lettres, c'est de découper ce
nombre en paquets de 3 chiffres en partant de la droite et d'écrire chaque bloc
de chiffres sous forme de lettres puis d'ajouter l'unité :

* 1 => 1 => "un"
* 1234 => 1 234 => "un mille" "deux-cent-trente-quatre"
* 1234567 => 1 234 567 => "un million" "deux-cent-trente-quatre mille"
"cinq-cent-soixante-sept"

Donc pour commencer, je m'occupe uniquement de traiter les nombres de 0 à
999. Grosso-modo, c'est l'équivalant de la fonction `CDU$ (NOMBRE#)`
dans mon vieux code ("CDU" pour CentaineDizaineUnite).

Pour écrire les nombres, on s'appuie sur un certain nombre de mots (et plus
précisément des adjectifs cardinaux) pour pouvoir "nommer" les différents
nombres. Entre autre :

* "zéro, un, deux, trois, quatre, cinq, six, sept, huit et neuf" pour écrire
les nombres de 0 à 9.
* "dix, onze, douze, treize, quatorze, quinze et seize" pour écrire les
nombres de 10 à 19 (il existe un mot spécifique pour écrire de 10 à 16 et pour
les nombres 17, 18 et 19 on combine 2 mots : "dix-sept", "dix-huit" et
"dix-neuf".
* "vingt, trente, quarante, cinquante et soixante" pour pouvoir écrire les
nombres de 20 à 99 en combinant éventuellement avec les mots déjà vu et dans
quelque cas en utilisant le mot "et" pour lier les mots.
* "cent" pour écrire les nombres de 100 (cent) à 999
(neuf-cent-quatre-vingt-dix-neuf).
* puis "mille, million et milliard" pour les nombres plus grands.

Pour information, je met des traits d'union partout, conformément aux
[recommandations orthographiques de 1990](http://fr.wikipedia.org/wiki/Rectifications_orthographiques_du_français_en_1990) :

* Avant : on utilisait les traits d'union uniquement pour écrire les
nombres composés inférieurs à cent, sauf autour du mot "et" (qui servait donc à
remplacer le trait d'union). Et pour les nombres plus grand, on utilisait des
espaces. Ce qui donnait "dix-sept", "vingt et un", "trente-deux mille cinq cent
soixante et onze".
* Après : on met des traits d'union partout : "vingt-et-un",
"trente-deux-mille-cinq-cent-soixante-et-onze". Seuls les noms tels que
"million" ou "milliard" en sont exemptés.

## 1° étape : Le zéro

Le trucs le plus simple à faire pour commencer, c'est de gérer le cas du 0
qui s'écrit "zéro" tout simplement :

```
namespace Amstramgram
{
  public static class ToWordsExtension
  {
    public static string ToWords(this int number)
    {
      if (number == 0) return "zéro";

      return number.ToString();
    }
  }
}
```

Et pour tester que c'est OK :

```
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Amstramgram.Tests
{
  [TestClass]
  public class Tests
  {
    [TestMethod]
    public void Le_0_renvoie_zero()
    {
      Assert.AreEqual("zéro", 0.ToWords());
    }
  }
}
```

Et ça marche. Je sais donc écrire 0 sous forme de lettres :)

## 2° étape : Les nombres de 1 à 19

Les nombres de 1 à 16 correspondent à des mots spécifiques. Leur écriture
est donc à coder "en dur". Pour simplifier la suite (quand il faudra écrire les
nombres en 70 et les nombres en 90), il est plus pratique de définir en dur
tous les nombres de 1 à 19.

Le test unitaire :

```
[TestMethod]
public void Les_nombres_de_1_a_19_sont_corrects()
{
  var basics = new[] { "", "un", "deux", "trois", "quatre", "cinq", "six", "sept",
                       "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
                       "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf" };
  for (int i = 1; i < 20; i++)
  {
    Assert.AreEqual(basics[i], i.ToWords());
  }
}
```

Et le code :

```
public static string ToWords(this int number)
{
  // Le zéro est un cas un peu spécial
  if (number == 0) return "zéro";

  // Les nombres basiques qui serviront à former des combinaisons
  var basics = new[] { "", "un", "deux", "trois", "quatre", "cinq", "six", "sept",
                       "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
                       "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf" };

  if (number < 20) return basics[number];

  return number.ToString();
}
```

Résultat : les 2 tests unitaires sont OK.

## 3° étape : Les nombres de 20 à 99

Là ça commence à se compliquer un peu. Par conséquent, je vais faire le plus
facile d'abord puis je corrigerai les cas tordus après.

Pour écrire les dizaines, on décompose le nombre en dizaine et en unité puis
on prend le mot qui va bien pour exprimer la dizaine que l'on fait suivre du
mot qui correspond à l'unité :

* 17 = (1 x 10) + 7 => dix sept
* 23 = (2 x 10) + 3 => vingt trois
* 34 = (3 x 10) + 4 => trente quatre

Déjà là, on a 3 petites exceptions :

* pour les nombres de 11 à 16, on a des mots spéciaux (et pas dix-un,
dix-deux, dix-trois...)
* pour les nombres de 71 à 79, on n'a pas de mot pour exprimer la
soixantedizaine (les belges ont septante, mais c'est les belges)
* pour les nombres de 91 à 99, on n'a pas nom plus de pour exprimer la
quatrevingtdizaine (là encore, les belges ont nonante).

Pour les nombres de 11 à 16, pas de souci, je gère (déjà).

Pour les nombres en 70, on prend le mot qui sert normalement pour le 60
(soixante) et au lieu de le faire suivre du mot pour l'unité, on utilise le mot
qui correspond à 10 + l'unité :

* 70 = 70 + 0 = 60 + 10 + 0 = 60 + 10 => soixante dix
* 71 = 70 + 1 = 60 + 10 + 1 = 60 + 11 => soixante onze
* 72 = 70 + 2 = 60 + 10 + 2 = 60 + 12 => soixante douze
* etc...

Et pour les nombres en 90, on fait pareil, mais en partant du mot qui sert
pour le 80 (quatre-vingt) :

* 90 = 90 + 0 = 80 + 10 + 0 = 80 + 10 => quatre-vingt dix
* 91 = 90 + 1 = 80 + 10 + 1 = 80 + 11 => quatre-vingt onze
* 92 = 90 + 2 = 80 + 10 + 2 = 80 + 12 => quatre-vingt douze
* etc...

Pour l'instant, ça devrait m'occuper pour un petit moment. Je traiterai donc
des raffinements tels que le "s" à "quatre-vingt" ou le "et" pour les
dizaines-et-un à l'étape suivante.

Premier test : vérifier que les dizaines piles sont écrites
correctement (étant donné que les mots correspondants sont codés quasiment "en
dur") :

```
[TestMethod]
public void Les_dizaines_exactes_sont_correctes()
{
  // En vrai, 80 s'écrit quatre-vingts et pas quatre-vingt, mais ce sera pour plus tard
  var oks = new[] { "", "dix", "vingt", "trente", "quarante", "cinquante",
                    "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix" };
  for (int i = 1; i < 10; i += 1)
  {
    Assert.AreEqual(oks[i], (i * 10).ToWords());
  }
}
```

Second test : vérifier que les autres dizaines sont bien le résultat
d'une combinaison de la dizaine et de l'unité :

```
[TestMethod]
public void Les_dizaines_avec_unites_sont_correctes()
{
  var oks = new[] { "", "dix", "vingt", "trente", "quarante", "cinquante",
                    "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix" };
  for (int i = 1; i < 10; i += 1)
  {
    Assert.AreEqual(oks[i] + "-sept", (i * 10 + 7).ToWords());
  }
}
```

Et le code mis à jour pour que ces 2 nouveaux tests unitaires
passent :

```
public static string ToWords(this int number)
{
  // Le zéro est un cas un peu spécial
  if (number == 0) return "zéro";

  // Les nombres basiques qui serviront à former des combinaisons
  var basics = new[] { "", "un", "deux", "trois", "quatre", "cinq", "six", "sept",
                       "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
                       "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf" };

  if (number < 20) return basics[number];

  // Gère les dizaines et les unités
  var tens = new[] { "", "dix", "vingt", "trente", "quarante", "cinquante",
                     "soixante", "soixante", "quatre-vingt", "quatre-vingt" };

  int result = number / 10;
  int remainder = number % 10;

  var text = tens[result];
  if (result == 7)
  {
    remainder += 10;
  }
  if (result == 9)
  {
    remainder += 10;
  }
  if (remainder > 0)
  {
    text += "-";
    text += basics[remainder];
  }
  return text;
}
```

## 4° étape : Cas des 21, 31, 41, 51, 61 et 71

Normalement, dans le cas des dizaines avec des unités différentes de zéro,
le mot pour l'unité est simplement accolé au mot pour la dizaine via un trait
d'union. Dans le cas où l'unité a pour valeur 1, les deux mots sont regroupés
en utilisant le mot "et" (ou plus précisément "-et-") :

* 21, 31, 41 ... => vingt-et-un, trente-et-un, quarante-et-un ...
* 22, 32, 42 ... => vingt-deux, trente-deux, quarante-deux ...

Déjà, cette règle ne concerne pas le nombre 11 (puisque c'est onze et pas
dix-un). Mais elle ne s'applique pas non plus pour les nombres 81 et
91 :

* 81 => quatre-vingt-un (et pas quatre-vingt-et-un)
* 91 => quatre-vingt-onze (et pas quatre-vingt-et-onze)

Les 2 tests unitaires pour gérer cette particularité :

```
[TestMethod]
public void Les_nombres_en_dizaine_et_un_de_21_a_71_contiennent_un_et_devant_l_unite()
{
  for (int i = 21; i < 81; i += 10)
  {
    Assert.IsTrue(i.ToWords().Contains("-et-"));
  }
}

[TestMethod]
public void Les_nombres_81_et_91_ne_contiennent_pas_un_et_devant_l_unite()
{
  Assert.IsFalse(81.ToWords().Contains("-et-"));
  Assert.IsFalse(91.ToWords().Contains("-et-"));
}
```

Et le code devient alors :

```
public static string ToWords(this int number)
{
  // Le zéro est un cas un peu spécial
  if (number == 0) return "zéro";

  // Les nombres basiques qui serviront à former des combinaisons
  var basics = new[] { "", "un", "deux", "trois", "quatre", "cinq", "six", "sept",
                       "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
                       "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf" };

  if (number < 20) return basics[number];

  // Gère les dizaines et les unités
  var tens = new[] { "", "dix", "vingt", "trente", "quarante", "cinquante",
                     "soixante", "soixante", "quatre-vingt", "quatre-vingt" };

  int result = number / 10;
  int remainder = number % 10;

  // - la dizaine
  var text = tens[result];

  // - cas où l'unité vaut 1
  if (remainder == 1)
  {
    // la dizaine est séparée de l'unité par "et"
    // pour 21, 31, 41, 51, 61, 71 mais pas 81 et 91
    if (result < 8) text += "-et";
  }

  // l'unité
  if (result == 7)
  {
    remainder += 10;
  }
  else if (result == 9)
  {
    remainder += 10;
  }
  if (remainder > 0)
  {
    text += "-";
    text += basics[remainder];
  }

  return text;
}
```

## 5° étape : Le pluriel de vingt

C'est compliqué. Déjà, "vingt" peut se mettre au pluriel parce que c'est un
mot un peu particulier. Avant, on comptait aussi en vingtaines, c'est à dire en
base 20, ce qui explique le quatre-vingts = 4 vingtaines.

Et donc la règle c'est que on met un "s" à vingt :

* quand il est précédé d'un nombre qui le multiplie
* et qu'il n'est pas suivi par un autre nombre ou par "mille" (parce que
"mille" est un nombre cardinal)

Ce qui donne donc :

* quatre-vingts : 20 est précédé par 4 ET suivi par rien d'autre
* cent-vingt : 20 est précédé par 100 MAIS pas multiplié par 100
* quatre-vingt-un : 20 est précédé par 4 MAIS suivi par 1
* quatre-vingt-mille car vingt est suivi de "mille" (sans "s" à mille, mais
ça c'est une autre histoire...)
* quatre-vingts millions ou quatre-vingts milliards car "million" et
"milliard" sont des noms et pas des nombres cardinaux.

Pour contrôler tout ça, je doit revenir sur le test qui concernait les
dizaines exactes pour utiliser la véritable orthographe de 80. Et je dois
également ajouter un test pour le cas du 80000. Par contre, l'absence de "s"
lorsque l'unité est différente de zéro est déjà correctement prise en compte
par le test "Les_dizaines_avec_unites_sont_correctes".

```
[TestMethod]
public void Les_dizaines_exactes_sont_correctes()
{
  var oks = new[] { "", "dix", "vingt", "trente", "quarante", "cinquante",
                    "soixante", "soixante-dix", "quatre-vingts", "quatre-vingt-dix" };
  for (int i = 1; i < 10; i += 1)
  {
    Assert.AreEqual(oks[i], (i * 10).ToWords());
  }
}

[TestMethod]
public void Pas_de_s_a_80_quand_suivi_de_mille()
{
  Assert.AreEqual("quatre-vingt-mille", 80000.ToWords());
}
```

Il ne reste plus qu'à corriger mon code pour respecter ces tests
unitaires :

```
...
// Gère les dizaines et les unités
var tens = new[] { "", "dix", "vingt", "trente", "quarante", "cinquante",
                   "soixante", "soixante", "quatre-vingt", "quatre-vingt" };

int result = number / 10;
int remainder = number % 10;

// - la dizaine
var text = tens[result];

// - cas où l'unité vaut 1
if (remainder == 1)
{
  // la dizaine est séparée de l'unité par "et"
  // pour 21, 31, 41, 51, 61, 71 mais pas 81 et 91
  if (result < 8) text += "-et";
}

// - pluriel de vingt
if (result == 8)
{
  // quatre-vingts prend un "s" quand pas suivi d'un autre nombre
  if (remainder == 0) text += "s";
}
...
```

Pour l'instant, je ne gère que les nombres entre 0 et 999. Donc je n'ai pas
trop les moyens de coder les cas du 80000. Je vais donc devoir supporter un
test qui échoue pendant un petit moment...

Attention :

* Le nombre 80 s'écrit donc "quatre-vingts" avec un "s" lorsque que c'est un
nombre cardinal qui sert à exprimer une quantité : "il y a quatre-vingts
pages dans ce livre".
* Par contre, un nombre ordinal est toujours invariable. Un nombre ordinal
sert à exprimer un numéro d'ordre : "la quatre-vingtième page", mais aussi
"la page quatre-vingt" (sans "s" !).
* Heureusement pour moi, je ne m'intéresse qu'aux nombres cardinaux :)

## 6° étape : Les nombres de 100 à 999

Là aussi on procède par découpage un peu comme pour les dizaines. Il faut
commencer par écrire le chiffre qui correspond à la centaine que l'on fait
suivre du mot "cent" puis on continue en écrivant le reste du nombre, c'est à
dire la dizaine et l'unité comme on l'a fait aux étapes précédentes :

* 101 = 100 + 1 => cent un
* 123 = 100 + 23 => cent vingt-trois
* 235 = 200 + 35 => deux-cent trente-cinq
* 551 = 500 + 51 => cinq-cent cinquante-et-un

Notes :

* Le nombre 100 s'écrit "cent" et pas "cent zéro" pour 100 + 0
* Le pluriel de "cent" suit les mêmes règles que le pluriel de "vingt", mais
j'attendrai l'étape suivante pour gérer ça.

Je rajoute deux tests unitaires pour vérifier que mon futur code sera bien
OK :

```
[TestMethod]
public void Le_100_renvoie_cent()
{
    Assert.AreEqual("cent", 100.ToWords());
}

[TestMethod]
public void Les_centaines_avec_dizaines_ou_unites_sont_correctes()
{
  Assert.AreEqual("cent-un", 101.ToWords());
  Assert.AreEqual("cent-vingt-trois", 123.ToWords());
  Assert.AreEqual("deux-cent-trente-quatre", 234.ToWords());
  Assert.AreEqual("cinq-cent-cinquante-et-un", 551.ToWords()); // -et-un
  Assert.AreEqual("huit-cent-quatre-vingts", 880.ToWords());   // s à 80
  Assert.AreEqual("huit-cent-quatre-vingt-un", 881.ToWords()); // ni s, ni et à 81
}
```

Puis je modifie la fonction ToWords() pour gérer les centaines. Cela
provoque pas mal de changements, mais normalement je suis tranquille puisque
j'ai des tests unitaires pour vérifier que tout continue de fonctionner comme
prévu.

```
public static string ToWords(this int number)
{
  // Le zéro est un cas un peu spécial
  if (number == 0) return "zéro";

  // Les nombres basiques qui serviront à former des combinaisons
  var basics = new[] { "", "un", "deux", "trois", "quatre", "cinq", "six", "sept",
                       "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
                       "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf" };

  // Les mots qui serviront à former les dizaines
  var tens = new[] { "", "dix", "vingt", "trente", "quarante", "cinquante",
                     "soixante", "soixante", "quatre-vingt", "quatre-vingt" };

  var text = "";

  // Gère les centaines
  if (number > 99)
  {
    // Ecrit le chiffre des centaines
    int result = number / 100;
    int remainder = number % 100;

    if (result == 1)
    {
      // cent... et pas un-cent...
      text = "cent";
    }
    else
    {
      // deux-cent..., trois-cent...
      text = basics[result] + "-cent";
    }

    // Reste à écrire les dizaines et les unités
    number = remainder;
  }

  // Gère les petits nombres (codés en dur)
  if (number < 20)
  {
    if (number > 0)
    {
      if (text != "") text += "-";
      text += basics[number];
    }
  }

  // Gère les dizaines et les unités
  if (number > 19)
  {
    int result = number / 10;
    int remainder = number % 10;

    // - la dizaine
    if (text != "") text += "-";
    text += tens[result];

    // - cas où l'unité vaut 1
    if (remainder == 1)
    {
      // la dizaine est séparée de l'unité par "et"
      // pour 21, 31, 41, 51, 61, 71 mais pas 81 et 91
      if (result < 8) text += "-et";
    }

    // - pluriel de vingt
    if (result == 8)
    {
      // quatre-vingts prend un "s" quand pas suivi d'un autre nombre
      if (remainder == 0) text += "s";
    }

    // l'unité
    if (result == 7)
    {
      remainder += 10;
    }
    else if (result == 9)
    {
      remainder += 10;
    }
    if (remainder > 0)
    {
      if (text != "") text += "-";
      text += basics[remainder];
    }
  }

  // Renvoie le texte pour 0 à 999
  return text;
}
```

Ca a été un peu compliqué, mais c'est passé !

## 7° étape : Le pluriel de cent

C'est facile. C'est la même règle que pour le pluriel de vingt et on met
donc un "s" à cent :

* quand il est précédé d'un nombre qui le multiplie
* et qu'il n'est pas suivi par un autre nombre ou par "mille" (parce que
"mille" est un nombre cardinal)

Ce qui donne donc :

* deux-cents : 100 est précédé par 2 ET suivi par rien d'autre
* mille-cent : 100 est précédé par 1000 MAIS pas multiplié par 1000
* deux-cent-un : 100 est précédé par 2 MAIS suivi par 1
* deux-cent-mille (sans "s") car cent est suivi de "mille"
* deux-cents millions ou deux-cents milliards car "million" et "milliard"
sont des noms et pas des nombres cardinaux.

```
[TestMethod]
public void Cent_est_au_pluriel_pour_les_multiples_de_100()
{
  Assert.IsTrue(200.ToWords().Contains("cents"));
}

[TestMethod]
public void Cent_est_au_singulier_si_pas_un_multiple_de_100()
{
  Assert.IsFalse(201.ToWords().Contains("cents"));
}

[TestMethod]
public void Cent_ne_prend_pas_de_s_quand_suivi_de_mille()
{
    Assert.AreEqual("deux-cent-mille", 200000.ToWords());
}
```

Puis je modifie le code pour ajouter un "s" lorsque c'est nécessaire, en
laissant pour l'instant de côté le cas du 200000, ce qui me fera un deuxième
test unitaire KO.

```
  // Gère les centaines
  if (number > 99)
  {
    // Ecrit le chiffre des centaines
    int result = number / 100;
    int remainder = number % 100;

    if (result == 1)
    {
      // cent... et pas un-cent...
      text = "cent";
    }
    else
    {
      // deux-cent..., trois-cent...
      text = basics[result] + "-cent";
      if (remainder == 0) text += "s";    // <- code ajouté
    }

    // Reste à écrire les dizaines et les unités
    number = remainder;
  }
```

## 8° étape : Les nombres de 1000 à 999999

Maintenant qu'on sait gérer les blocs de 3 chiffres, c'est super facile. Il
suffit simplement de gérer 2 paquets au lieu d'un seul comme on l'a fait
jusqu'à présent :

* écrire en toute lettre le bloc qui correspond aux milliers,
* ajouter "mille"
* écrire en toute lettre le bloc qui correspond
centaines-dizaines-unités

Exemple :

* 1234 = 1 234 => mille deux-cent-trente-quatre
* 12345 = 12 345 => douze-mille trois-cent-quarante-cinq
* 123456 = 123 456 => cent-vingt-trois-mille
quatre-cent-cinquante-six

Et évidemment, on n'écrit pas "un mille", mais "mille".

Normalement, il devrait suffire des 2 tests unitaires suivants pour vérifier
que les milliers sont correctement gérés :

```
[TestMethod]
public void Le_1000_renvoie_mille()
{
  Assert.AreEqual("mille", 1000.ToWords());
}

[TestMethod]
public void Decoupe_par_blocs_de_3_chiffres()
{
  Assert.AreEqual("mille-deux-cent-trente-quatre", 1234.ToWords());
  Assert.AreEqual("douze-mille-trois-cent-quarante-cinq", 12345.ToWords());
  Assert.AreEqual("cent-vingt-trois-mille-quatre-cent-cinquante-six", 12345.ToWords());
}
```

Pour ce qui concerne le code, ça va demander pas mal de réorganisation pour
réussir à faire ça. Il faut extraire la partie qui gère le bloc de 3 chiffres
et l'appeler 2 fois. Mais même si c'est un "gros" chantier, les tests unitaires
sont là pour être certain qu'il n'y a pas eu de casse pendant le
déménagement.

Au final, j'ai reporté la quasi-totalité du code de la fonction ToWords()
dans une fonction privée Textify(int) et maintenant la méthode d'extension
ToWords() ne sert plus qu'à appeler cette nouvelle fonction pour chaque bloc de
3 chiffres et à concaténer les 2 chaines obtenues.

```
public static string ToWords(this int number)
{
  if (number >= 1000000) return number.ToString();

  if (number == 0) return "zéro";

  var text = "";

  int millier = number / 1000;
  if (millier > 0)
  {
    text += millier == 1 ? "mille" : Textify(millier) + "-mille";
    number = number % 1000;
    if (number > 0) text += "-";
  }

  text += Textify(number);

  return text;
}

private static string Textify(int number)
{
  // Les nombres basiques qui serviront à former des combinaisons
  var basics = new[] { "", "un", "deux", "trois", "quatre", "cinq", "six", "sept",
                       "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
                       "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf" };

  // Les mots qui serviront à former les dizaines
  var tens = new[] { "", "dix", "vingt", "trente", "quarante", "cinquante",
                     "soixante", "soixante", "quatre-vingt", "quatre-vingt" };

  var text = "";

  // Gère les centaines
  if (number > 99) ...

  // Gère les petits nombres (codés en dur)
  if (number < 20) ...

  // Gère les dizaines et les unités
  if (number > 19) ...

  // Renvoie le texte pour 0 à 999
  return text;
}
```

## 9° étape : Le pluriel de mille

C'est super facile. Mille est invariable, parce que dans le temps "mille"
était la forme plurielle de "mil".

Par conséquent, je vais juste tester que mille ne prend pas de "s" quand il
y a plusieurs milliers :

```
[TestMethod]
public void Mille_ne_prend_jamais_de_s()
{
    Assert.IsFalse(2000.ToWords().Contains("milles"));
}
```

Et je n'ai rien à changer au code pour que ce test passe.

En contrepartie, je vais en profiter pour gérer le pluriel de "vingt" et de
"cent" devant "mille" et faire en sorte de réussir les 2 tests KO que je traine
depuis un certain temps.

```
public static string ToWords(this int number)
{
  // Ne gère pas les millions
  if (number >= 1000000) return number.ToString();

  // Le zéro est un cas un peu spécial
  if (number == 0) return "zéro";

  var text = "";

  int millier = number / 1000;
  if (millier > 0)
  {
    text += millier == 1 ? "mille" : Textify(millier) + "-mille";
    number = number % 1000;
    if (number > 0) text += "-";

    // Vingt ou cent suivis de mille sont toujours au singulier
    text = text.Replace("cents-mille", "cent-mille");
    text = text.Replace("vingts-mille", "vingt-mille");
  }

  text += Textify(number);

  return text;
}
```

Et avec cette petite modification j'ai maintenant 15 tests unitaires sur 15
qui passent.

## 10° étape : Les millions

Une fois que les bases sont posées, c'est assez simple de faire évoluer le
truc. Dans le cas des millions, il suffit de reproduire ce qui a été fait pour
les milliers, sauf qu'on gère un bloc supplémentaire :

* écrire en toute lettre le bloc qui correspond aux millions,
* ajouter "millions"
* écrire en toute lettre le bloc qui correspond aux milliers,
* ajouter "mille"
* écrire en toute lettre le bloc qui correspond aux unités

Exemple :

* 1234567 = 1 234 567 => un million deux-cent-trente-quatre-mille
cinq-cent-soixante-sept

Comme le montre cet exemple, on écrit bien "un million" et pas juste
"million", parce que c'est un nom et pas un nombre cardinal. Et alors que le
trait d'union sert habituellement de séparateur entre les mots, ce n'est pas le
cas avec "million" pour lequel on utilise plutôt un espace.

Enfin, comme "million" est un nom, c'est beaucoup plus simple de gérer le
pluriel. On met un "s" à million dès lors qu'il est précédé d'un nombre
supérieur à 1 (ce qui signifie que le pluriel commence à 2 millions).

Par conséquent, il suffit de 3 tests unitaires supplémentaires pour
s'assurer que tout se déroule comme prévu :

```
[TestMethod]
public void Le_1_000_000_renvoie_un_million()
{
  Assert.AreEqual("un million", 1000000.ToWords());
}

[TestMethod]
public void Decoupe_en_3_blocs_de_3_chiffres()
{
  Assert.AreEqual("un million deux-cent-trente-quatre-mille-cinq-cent-soixante-sept", 1234567.ToWords());
}

[TestMethod]
public void Million_prend_un_s_au_pluriel()
{
  Assert.IsTrue(2000000.Contains("millions"));
}
```

Côté code, cela n'implique pas une trop grosse modification :

```
public static string ToWords(this int number)
{
  // Ne gère pas les milliards
  if (number >= 1000000000) return number.ToString();

  // Le zéro est un cas un peu spécial
  if (number == 0) return "zéro";

  var text = "";

  // Gère les millions
  int million = number / 1000000;
  if (million > 0)
  {
      text += Textify(million) + " million";
      if (million > 1) text += "s";
      number = number % 1000000;
      if (number > 0) text += " ";
  }

  // Gère les milliers
  int millier = number / 1000;
  if (millier > 0)
  {
    text += millier == 1 ? "mille" : Textify(millier) + "-mille";
    number = number % 1000;
    if (number > 0) text += "-";

    // Vingt ou cent suivis de mille sont toujours au singulier
    text = text.Replace("cents-mille", "cent-mille");
    text = text.Replace("vingts-mille", "vingt-mille");
  }

  // Gère les centaines, dizaines et unités
  text += Textify(number);

  return text;
}
```

## 11° étape : Les milliards

C'est quasiment la même chose que pour gérer les millions. On découpe le
nombre en 4 blocs de 3 chiffres et le 1° bloc correspond au(x) milliard(s).
Comme "milliard" est aussi un nom, on dit également "un milliard" et il suit
exactement les mêmes règles que "million" en matière d'espaces et de
pluriel.

Mais comme j'ai décidé de ne pas gérer les milliards, je vais plutôt écrire
un test unitaire pour contrôler qu'ils sont bien hors périmètre :

```
[TestMethod]
public void Les_milliards_ne_sont_pas_geres()
{
  Assert.AreEqual(1000000000.ToString(), 1000000000.ToWords());
  Assert.AreNotEqual(999999999.ToString(), 999999999.ToWords());
}
```

Et il n'y a rien à modifier dans le code puisque il tenait déjà compte du
cas où le nombre à écrire en lettre est supérieur ou égal à 1 milliard.

```
  // Ne gère pas les milliards
  if (number >= 1000000000) return number.ToString();
```

## 12° étape : Les nombres négatifs

Pour mettre la touche finale à la fonction ToWords(), j'ajoute une dernière
fonctionnalité pour qu'elle gère le cas des nombres négatifs.

Pour cela, j'ai besoin de vérifier qu'avec un nombre négatif le texte
qu'elle renvoie commence par "moins". Et pour compléter le test unitaire
précédent, j'ai également besoin de tester que les milliards négatifs ne sont
pas pris en compte, ce qui m'assure que seuls les nombres entiers de -999999999
à +999999999 sont gérés.

```
[TestMethod]
public void Un_nombre_negatif_commence_par_moins()
{
  Assert.IsTrue((-123).ToWords().StartsWith("moins "));
}

[TestMethod]
public void Les_milliards_negatifs_ne_sont_pas_geres()
{
  Assert.AreEqual((-1000000000).ToString(), (-1000000000).ToWords());
  Assert.AreNotEqual((-999999999).ToString(), (-999999999).ToWords());
}
```

Côté code, cela se traduit par quelques lignes en plus :

```
public static string ToWords(this int number)
{
  // Ne gère pas les milliards
  if (Math.Abs(number) >= 1000000000) return number.ToString();

  // Le zéro est un cas un peu spécial
  if (number == 0) return "zéro";

  var text = "";

  // Gère les nombres négatifs
  if (number < 0)
  {
    text = "moins ";
    number = 0 - number;
  }

  // Gère les millions
  ...
```

## Conclusion

Je ne suis pas vraiment certain que cette fonction me servira un jour, mais
c'était un chouette exercice. Et je pense m'en être pas trop mal tiré pour tout
ce qui concerne les tests unitaires. Par rapport à ma vieille fonction
`STRNUM$()` je ne gère pas les nombres décimaux, mais ça pourra
faire l'objet d'une V2.

PS: le projet [Amstramgram sur GitHub](https://github.com/michelc/Amstramgram).
