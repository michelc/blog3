---
date: 2007-10-04 12:55:00
layout: post
redirect_from: "post/2007/10/04/Quatre-etapes-cest-deux-de-trop"
tags: ap
title: "Quatre étapes, c'est deux de trop"
---

## Y'a comme un problème

Jusqu'à présent, la barre d'outils d'Altrr-Press contient une
icone ![](/public/2007/mapsite.gif) qui fait apparaitre
une fenêtre pop-up dans laquelle est affichée la liste des écrans du site.

Cette liste se présente sous forme d'[arborescence](http://www.destroydrop.com/javascripts/tree/)
pour avoir une représentation synthétique dans le cas où le site géré
deviendrait un peu volumineux.

Bien que la majorité des sites n'ait jamais dépassé les 50 pages, tout
allait plutôt bien dans le meilleur des mondes :

* en tant qu'utilisateur ça répondait exactement à mes besoins et me
permettait d'atteindre assez rapidement n'importe quel écran du site,
* ça me paraissait d'autant plus parfait que j'avais essayé de donner à cette
fenêtre un petit air de Winform pour ne pas trop perturber les
utilisateurs.

Tout ça jusqu'à ce que je passe une heure à côté d'une utilisatrice pleine
de bonne volonté. Et là c'est le drame :

* la popup se perd derrière les autres fenêtres dès qu'on fait autre chose
sur le PC (sur le Mac en l'occurence),
* il faut cliquer exactement sur le petit [+] pour faire apparaitre les
sous-écrans,
* il faut cliquer sur un nom d'écran puis sur le bouton [OK] pour que la
fenêtre se ferme et qu'on atteigne l'écran voulu.

Tout ça c'est vraiment trop confusionnant voire même carrément mal
foutu!

## A chaque problème sa solution

Récapitulons. Je suis sur un écran A et je veux aller sur un écran B. La
meilleure solution serait d'y aller en ligne droite ou tout du moins avec le
moins de détours possible.

Actuellement, ce que je dois faire :

* commencer par afficher la liste des écrans,
* puis naviguer dans cette liste pour trouver l'écran de mon choix,
* puis sélectionner cet écran en cliquant dessus,
* puis cliquer sur le bouton <OK> pour arriver sur
l'écran.

![Sélection écran via un popup](/public/2007/20071004-sitemap-popup.png)

Ce que je devrais pouvoir faire :

* afficher la liste de mes écrans,
* cliquer dans cette liste pour aller sur l'écran de mon choix.

![Sélection écran en direct](/public/2007/20071004-sitemap-direct.png)

Sitôt dit, sitôt fait. Et c'est pas de la blague :

* Moins 11 lignes et plus 5 lignes dans la boite construisant la barre
d'outils,
* Plus 9 lignes de code dans la page gérant le chargement des boites.

Et c'est tout! Le seul problème, c'est qu'il existe aussi des boites qui
utilisent la popup de sélection des écrans pour permettre d'insérer des liens
internes. Y'a encore du boulot.
