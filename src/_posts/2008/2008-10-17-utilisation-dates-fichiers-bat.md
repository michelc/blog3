---
date: 2008-10-17 09:53:00
layout: post
redirect_from: "post/2008/10/17/Utilisation-des-dates-dans-les-fichiers-BAT"
tags: code-snippets
title: "Utilier des dates dans les fichiers BAT"
---

Pour commencer, le truc de base :

```
ECHO %Date%
17/10/2008
ECHO %Time%
 9:58:13,70
```

Mais on peut faire mieux en utilisant la syntaxe
%Date**:~x,y**% ou %Time**:~x,y**%, où :

* x représente la position du 1° caractère dans la date ou l'heure en
cours
* y correspond au nombre de caractères à extraire

La longueur d'une date étant de 10 caractères, x peut prendre une valeur
allant de 0 à 9. Par contre, si la valeur de y est supérieure au nombre de
caractères présents à partir de la position x, cela n'a pas d'importance :
cela ne renverra que le nombre de caractères disponibles.

Donc pour avoir une date au format YYYY-MM-DD, il faut utiliser la syntaxe
suivante :

```
ECHO %Date:~6,4%-%Date:~3,2%-%Date:~0,2%
2008-10-17
```

On peut aussi utiliser une valeur négative pour x pour compter les
caractères de la droite vers la gauche. Dans ce cas, la valeur de x peut aller
de -1 à -10 (-1 étant le dernier caractère de la date, -2 l'avant-dernier...).
En utilisant une valeur négative, on obtiendra une date au format YYYY-MM-DD
avec la syntaxe suivante :

```
ECHO %Date:~-4,4%-%Date:~-7,2%-%Date:~-10,2%
2008-10-17
```

Et c'est pareil pour les heures : il faut utiliser la syntaxe suivante
pour obtenir une heure au format HH-MM-SS :

```
ECHO %Time:~0,2%-%Time:~3,2%-%Time:~6,2%
10-03-44
```
