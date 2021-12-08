---
date: 2008-12-18 11:58:00
layout: post
redirect_from: "post/2008/12/18/Sauvegarde-d-un-depot-Subversion"
tags: svn
title: "Sauvegarder un dépôt Subversion"
---

## SvnAdmin dump

Jusqu'à présent, je sauvegarde mon dépôt Subversion en faisant un dump de
celui-ci, à l'aide de la commande :

```
SvnAdmin dump D:\SVN\PI -q > PI_svn.dump
```

Puis je le compacte à l'aide de WinRAR :

```
"C:\Program Files\WinRAR\Rar" a -idq -m5 -s -t -ep1 PI_svn.rar PI_svn.dump D:\SVN\PI\conf\*.* D:\SVN\PI\hooks\*.bat
```

Et pour finir, je copie le fichier PI_svn.rar sur un disque externe.

Je ne sais si c'est la "meilleure" ni même la "bonne" façon de faire, mais
étant donné que je connaissais la commande "SvnAdmin dump", je n'avais pas trop
cherché à savoir ce qui se faisait d'autre.

Mais ce matin, j'ai voulu faire ça sur un vrai dépôt Subversion distant et
ça n'a pas marché.

```
SvnAdmin dump svn://srv02-svn/replu/ -q > replu.dump
```

A quoi on m'a répondu :

```
svnadmin: 'svn://srv02-svn/replu/' is an URL when it should be a path
```

Ca a été l'occasion de faire un petit tour des différentes méthodes
possibles pour sauvegarder un dépôt.

## SvnAdmin hotcopy

Par rapport à un dump, cette commande est censée être beaucoup plus rapide
et surtout, elle intègre tout le dépôt (y compris la configuration du serveur
et les scripts de hook) et pas seulement les commits effectués comme c'est le
cas avec la commande "SvnAdmin dump".

Je commence par faire une "copie à chaud" du dépôt distant sur mon
poste :

```
SvnAdmin hotcopy \\srv02-svn\d$\repositories\replu D:\SVN\replucopy
```

C'est effectivement très rapide (mais ça ne marche que parce que j'ai les
droits d'accès au serveur qui stocke les dépôts Subversion).

Puis je le compacte à l'aide de WinRAR :

```
"C:\Program Files\WinRAR\Rar" a -idq -m5 -s -t -ep1 replucopy_svn.rar D:\SVN\replucopy
```

Dans ce cas, je peux compacter le contenu du répertoire D:\SVN\replucopy
puisqu'il s'agit d'une copie du dépôt d'origine et que personne n'accède à
cette copie. Je n'aurais pas pu compacter directement le contenu de
\\srv02-svn\d$\repositories\replu parce qu'il y avait un risque que quelqu'un
mettre à jour le dépôt "replu" pendant ce temps.

Par ailleurs, le fichier replucopy_svn.rar obtenu est beaucoup plus
volumineux que si j'avais fait un dump, mais c'est normal puisqu'il contient
plus de choses qu'un simple dump.

Le problème avec cette méthode, c'est qu'il faut avoir un accès "fichier" au
dépôt (comme c'est le cas pour toutes les commandes de SvnAdmin
apparament).

## SvnSync

Depuis Subversion 1.4, il existe un nouvel utilitaire SvnSync destiné à
faire des réplications d'un dépôt vers un autre. Un de ses avantages est de
pouvoir accéder aux dépôts en mode "direct" (fichiers) ou distant (via une
url).

Un de ses défauts, c'est que ce n'est pas très évident de trouver de la
documentation dessus, et encore moins quand on veut faire ça sous Windows. Mais
j'ai quand même réussi à trouver le billet [svnsync: mirror your svn repository](http://bob.pythonmac.org/archives/2006/09/14/svnsync-mirror-your-svn-repository/) sur le blog de Thomas
Guest.

Pour commencer, il faut créer un dépôt local pour y synchroniser le contenu
du dépôt distant :

```
SvnAdmin create D:\SVN\replusync
```

Puis il faut créer un script pre-revprop-change.bat vide :

```
ECHO REM > D:\SVN\replusync\hooks\pre-revprop-change.bat
```

Ce script ne fait absolument rien, mais il semble être attendu par SvnSync
(todo : tester voir ce qui se passe sans ce script)

```
type D:\SVN\replusync\hooks\pre-revprop-change.bat
REM
```

Ensuite, on initialise le dépôt local (D:\SVN\replusync) pour qu'il devienne
un "miroir" du dépôt distant (svn://srv02-svn/replu/) :

```
SvnSync init file:///D:/SVN/replusync svn://srv02-svn/replu/
Copied properties for revision 0.
```

Et pour finir, on synchronise le dépôt local pour que son contenu
corresponde à celui du dépôt distant :

```
SvnSync sync file:///D:/SVN/replusync
Committed revision 1.
Copied properties for revision 1.
Committed revision 2.
Copied properties for revision 2.
 ...
Committed revision 1234.
Copied properties for revision 1234.
```

C'est beaucoup plus long qu'une commande "SvnAdmin hotcopy", mais ça marche.
Et ça y est, mon dépôt local D:/SVN/replusync est une copie presque parfaite du
"vrai" dépôt Subversion (il n'y a pas la configuration et les hooks) que je
n'ai plus qu'à zipper :

```
"C:\Program Files\WinRAR\Rar" a -idq -m5 -s -t -ep1 replusync_svn.rar D:\SVN\replusync
```

L'autre avantage de l'utilitaire SvnSync, c'est que pour la prochaine
sauvegarde, je n'aurai qu'à lancer une ligne de commande pour re-synchroniser
mon dépôt local :

```
SvnSync sync file:///D:/SVN/replusync
```

Et si j'y tenais vraiment, je n'aurais qu'à automatiser cette commande dans
une tâche planifiée pour que mon dépôt local soit régulièrement synchronisé
avec le dépôt distant.

Mais dans mon cas, l'objectif était simplement de faire une sauvegarde
personnelle avant de partir en vacances, parce que certains vont profiter de la
fin d'année pour migrer le serveur Subversion de la version 1.4.7 à la version
1.5.4.
