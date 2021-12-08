---
date: 2012-09-05 18:47:00
layout: post
redirect_from: "post/2012/09/05/verifier-numero-siret-la-poste"
tags: boulot
title: "Vérifier un numéro de siret de la Poste"
---

![](/public/2012/logo-la-poste.png)Rappel : les Siren (9 chiffres) servent
à identifier les sociétés et les Siret (14 chiffres) les établissements de ces
sociétés.

## Formule de Luhn

La vérification de la validité d'un Siren ou d'un Siret est basé sur la
[formule de Luhn](http://fr.wikipedia.org/wiki/Système_d'identification_du_répertoire_des_établissements#Calcul_et_validit.C3.A9_d.27un_num.C3.A9ro_SIRET).

Pour cela, on multiplie les chiffres de rang impair à partir de la droite
par 1, ceux de rang pair par 2. La somme des chiffres obtenus doit être
<s>congru au modulo 10</s> multiple de 10.

## Vérifier la clé du siret 73282932000074

```
73282932000074 -.
                |
                v
| Position | Chiffre | Multiplication | Résultat       |
|----------|---------|----------------|----------------|
|    14    |    7    |      7 x 2     | 14 => 1+4 => 5 |
|    13    |    3    |      3 x 1     |  3             |
|    12    |    2    |      2 x 2     |  4             |
|    11    |    8    |      8 x 1     |  8             |
|    10    |    2    |      2 x 2     |  4             |
|     9    |    9    |      9 x 1     |  9             |
|     8    |    3    |      3 x 2     |  6             |
|     7    |    2    |      2 x 1     |  2             |
|     6    |    0    |      0 x 2     |  0             |
|     5    |    0    |      0 x 1     |  0             |
|     4    |    0    |      0 x 2     |  0             |
|     3    |    0    |      0 x 1     |  0             |
|     2    |    7    |      7 x 2     | 14 => 1+4 => 5 |
|     1    |    4    |      4 x 1     |  4             |
--------------------------------------|----------------|
                                      |   Somme = 50   |

50 est un multiple de 10 => le n° de siret est valide
```

Notes :

* Dans le cas où la multiplication donne un résultat à 2 chiffres (donc
supérieur à 9), on prend la somme de ces 2 chiffres : 7 x 2 = 14 => on
prend 1 + 4 = 5
* Il existe un "truc" pour calculer cette somme de 2 chiffres, c'est d'oter 9
du nombre obtenu : 7 x 2 = 14 => on prend 14 - 9 = 5

## Cas des siret de La Poste

Ca c'est le truc habituel. Sauf que depuis que la Poste a changé de statut
et qu'elle est devenue une société anonyme, elle n'a plus droit qu'à un seul
Siren : 356 000 000. (je ne sais pas comment c'était avant : pas de
siren, plusieurs siren... / après vérification, plusieurs siren). Et tous ses
établissements doivent donc avoir un Siret en 356 000 000 #####.

Le problème c'est que la Poste a vraiment beaucoup d'établissements. Par
conséquent, à défaut de rallonger le n° de siret, il a fallu adapter le calcul
de la clé de contrôle des siret spécifiquement pour La Poste (et
**uniquement** dans le cas d'un siret de la Poste).

Le nouvel algorithme de contrôle pour les Siret de la forme 356 000 000
XXXXX est le suivant :

> La somme simple des chiffres du SIRET doit être congrue à 0 modulo 5, c'est
> à dire qu'elle doit être un multiple de 5.
>
> *Frédéric Tardieu - Chef de la division Répertoire Inter-administratif
> Sirene au sein de la direction des Statistiques d'Entreprises de
> l'Insee.*

## Vérifier la clé du siret 35600000049837

```
35600000049837 --.
                 |
                 v
| Position |  Chiffre   |
|----------|------------|
|    14    |         3  |
|    13    |         5  |
|    12    |         6  |
|    11    |         0  |
|    10    |         0  |
|     9    |         0  |
|     8    |         0  |
|     7    |         0  |
|     6    |         0  |
|     5    |         4  |
|     4    |         9  |
|     3    |         8  |
|     2    |         3  |
|     1    |         7  |
-----------|------------|
           | Somme = 45 |

45 est un multiple de 5 => le n° de siret est valide
```

Ce nouvel algorithme permet d'immatriculer jusqu'à 18 000 établissements
environ, soit presque deux fois plus que dans le cas général, tout en
maintenant un contrôle sur l'identifiant.
