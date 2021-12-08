---
date: 2008-10-20 13:34:00
layout: post
redirect_from: "post/2008/10/20/Ceci-n-est-pas-Subversion"
tags: svn
title: "Ceci n'est pas du Subversion"
---

Petite frayeur après l'apparition des icônes recouvrées de Subversion dans
des répertoires qui ne sont normalement pas sous contrôle de source. Sans
compter que les répertoires cachés "_svn" étaient introuvables et qu'avec un
clic-droit je n'avais pas non plus les options attendues pour Subversion.

Quoi ? Y'a mon Tortoise SVN qui est tout foutu ! Ou pire c'est le
disque dur qui rend l'âme...

Une journée de repos plus tard et j'ai tout compris ! Il ne faut pas
confondre :

![un fichier coché de vert](/public/2008/recouvrement-tortoise.gif)

et ça :

![un autre fichier coché de vert](/public/2008/recouvrement-mozy.gif)

Le premier recouvrement d'icônes c'est la façon habituelle de [TortoiseSVN](http://tortoisesvn.tigris.org/) pour me dire que tout va bien.
Le second recouvrement d'icônes, j'y ai droit depuis que j'ai installé la mise
à jour de [MozyHome
Backup](https://mozy.com/?ref=AX2L46 "(avec mon code de référence pour que j'ai encore plus de place :)"). Et en écarquillant bien les yeux, on peut remarquer qu'avec
Tortoise la marque est à gauche alors que la marque de MozyHome est à droite
(et qu'en plus elle est pas tout à fait pareille).

Ouf ! Y'a rien de cassé :)

Mise à jour : en configuration du client MozyHome, dans l'onglet
"Options", il est possible de cocher "Disable icon overlays in Windows
Explorer".
