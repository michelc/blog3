---
date: 2019-04-01 13:34:26
layout: post
tags: javascript
title: "Solitaire - Améliorer FreeCell"
image: "/public/2019/freecell.jpg"
---

<div class="encart" markdown="1">

Ce billet fait partie d'une série consacrée au travail en cours sur mon site de
solitaires et aux évolutions que je souhaite y apporter :

1. [Introduction]({% post_url 2019-03-23-solitaire-feuille-route-javascript %})
2. [Passer de jQuery à Vanilla JS]({% post_url 2019-03-27-solitaire-passer-jquery-vanilla-js %})
3. [Améliorer FreeCell]({% post_url 2019-04-01-solitaire-ameliorer-freecell %})
4. [Ajouter des animations CSS]({% post_url 2019-04-08-solitaire-ajouter-animations-css %})
5. [Drag and drop sans jQuery UI]({% post_url 2019-04-15-solitaire-drag-and-drop-sans-jquery-ui %})
6. [Remplacer AjaxMin, etc...]({% post_url 2019-04-25-solitaire-remplacer-ajaxmin %})

</div>

<figure>
  <img src="{{ page.image }}" alt="microsoft-freecell" />
  <figcaption>Microsoft FreeCell - Windows 3.1</figcaption>
</figure>

Côté jeux, je viens de mettre en production
[FreeCell](https://www.solitaire-play.com/freecell/), un jeu incontournable sur
un site de solitaires. Mais c'est encore une version assez basique puisqu'on
peut seulement jouer les cartes du dessus de chaque pile.

Une première évolution quasiment inévitable serait d'implémenter le
"[SuperMove](http://www.solitairelaboratory.com/fcfaq.html#Supermove)". Cela
consiste à jouer plusieurs cartes à la fois alors que la règle du jeu ne permet
de jouer que la carte du dessus des piles du tableau.

Cependant, lorsque les cartes d'une pile sont ordonnées correctement (par
exemple 9 rouge, 8 noir, 7 rouge et 6 noir), il est possible de les déplacer en
groupe d'une pile à l'autre (sur un 10 noir dans mon exemple). Ce n'est possible
que s'il y a assez de piles vides (parmi les "freecell" ou les piles du tableau)
pour découper ce déplacement en plusieurs déplacements individuels :

* le 6 noir va sur une "freecell"
* le 7 rouge sur une autre
* le 8 noir aussi
* le 9 rouge peut aller sur le 10 noir
* le 8 noir est ramené sur le 9 rouge
* le 7 rouge revient sur le 8 noir
* et le 6 noir sur le 7 rouge

Pour développer ça, il faut modifier le déplacement des cartes pour que le drag
and drop gère plus d'une carte à la fois. Le nombre de cartes déplaçable grâce à
un "SuperMove" variant en fonction du nombre de piles vides disponibles pour
décomposer ce déplacement. Ce n'est pas évident, mais pas insurmontable non
plus.

Une autre évolution intéressante serait de gérer un "AutoPlay". Cela consiste à
jouer automatiquement les cartes qui peuvent aller sur les fondations et qu'il
ne sert plus à rien de laisser sur le tableau :

* les As (bien évidemment)
* les Deux, une fois que les As correspondants ont été joués
* les Trois, à condition que les Deux de la couleur opposée soient déjà sur les
  fondations
* les Quatre, dès que les Trois de couleur opposée ne sont plus sur le tableau
* etc...

Cela sera suffisant pour reproduire un "AutoPlay" du niveau de celui du FreeCell
de Microsoft. Comme j'ai déjà un système de conseils, cela devrait être assez
simple à programmer. Par contre, le problème principal sera de faire en sorte
que le joueur puisse se rendre compte de ce qui se passe...

Par exemple, si je faisais ça maintenant, voici comment cela se déroulerait :

* Le joueur fait un déplacement qui libère une carte pouvant être jouée
  automatiquement
* Cette carte est __instantanément__ ajoutée à la fondation correspondante
* Le joueur doit réfléchir pour comprendre qu'un "AutoPlay" vient d'avoir
  lieu...

Pour rendre cet "AutoPlay" plus parlant et compréhensible, il faudrait que
j'ajoute une temporisation et même un effet visuel quand un "AutoPlay" se
produit. De cette façon, le joueur serait averti de ce qui se passe et se
rendrait compte qu'un coup vient d'être joué en automatique...

Dans l'immédiat, la suite pour moi c'est d'attaquer les modifications pour la
partie "SuperMove". En ce qui concerne le côté "AutoPlay", cela devra attendre
un peu. Il faudrait que je commence par creuser du côté des "effets spéciaux" et
des animations en JavaScript et CSS avant d'aller plus loin.
