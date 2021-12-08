---
date: 2019-04-08 12:29:24
layout: post
tags: javascript
title: "Solitaire - Ajouter des animations CSS"
image: "/public/2019/animation.jpg"
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
  <img src="{{ page.image }}" alt="victoire-solitaire" />
  <figcaption>
    <a href="http://www.skrekkogle.com/projects/solitaire/">Skrekkogle - Solitaire Win Sculpture</a>
  </figcaption>
</figure>

Il y a 2 ou 3 ans, j'avais déjà regardé comment gérer quelques animations pour
représenter le déplacement des cartes quand on double-clique dessus pour les
envoyer sur les fondations. Comme ce n'était pas très convaincant et pas
vraiment indispensable, j'avais laissé tombé pour d'autres trucs plus
intéressants à réaliser.

Mais pour ajouter un "AutoMove" à FreeCell comme envisagé dans un précédent
billet, il faut que je réfléchisse à nouveau sur le sujet pour (enfin) intégrer
quelques animations à mes jeux :

* Ca les rendrait un peu plus "vivants" et attractifs
* Certains coups seraient plus "clairs" pour les joueurs

J'ai déjà débuté avec un truc très simple en ajoutant une petite animation en
fin de partie. Jusqu'à il y a peu de temps, le joueur voyait immédiatement
apparaitre une popup en cas de victoire ou de "Game Over". Maintenant, il y a
une petit effet "shake" pendant 2 secondes lorsque cette boite de dialogue
apparait. Ca réveille un peu le jeu et c'est plus festif, que l'on ait gagné ou
perdu...

Et donc, un autre effet judicieux serait de "montrer" le déplacement d'une carte
d'une pile vers une autre. Comme vu dans le billet sur les
[améliorations de FreeCell]({% post_url 2019-04-01-solitaire-ameliorer-freecell %}),
cela serait très utile pour que le joueur voit ce qui se passe quand un
"AutoPlay" a lieu.

Cela servirait aussi à rendre le jeu un peu plus animé quand on double clique
sur une carte pour l'envoyer vers sa fondation. Et pareil, ça ferait un bel
effet en cas de "Undo" pour annuler le dernier coup joué et ramener une carte à
sa position de départ.

Ensuite, cela permettra de mieux rendre compte de tout ce qui se passe quand il
y a un "AutoMove" (clic droit pour jouer toutes les cartes possibles). Bien que
dans ce cas là, il y aura une difficulté supplémentaire pour trouver comment
"enchainer" les différentes animations correspondant à la succession des cartes
jouées.

Un autre truc qui vaudrait le coup et qui serait sans doute plus simple à
développer, ce serait de mettre un peu d'animation pour "matérialiser" la
constitution d'une paire de cartes. Dans certains jeux comme Pyramid ou Monte
Carlo, il faut faire une paire de cartes pour les éliminer du tableau et les
envoyer sur la fondation.

Pour l'instant, si les 2 cartes cliquées forment une paire correcte, elles sont
immédiatement placées sur la fondation. Si la paire sélectionnée est incorrecte,
les deux cartes sont bordées de rouge pendant quelques secondes.

J'aimerait trouver une petite animation sympa pour visualiser que la paire est
OK avant d'enchainer sur son déplacement vers la fondation. Et lorsque la paire
est KO, il faudrait avoir une animation pour indiquer que ça ne vas pas :
quelque chose de plus vivant qu'une simple bordure rouge...

Donc, dans ma todolist des animations :

* Remettre la main sur ce que j'avais commencé il y a quelques années pour faire
  bouger les cartes
* Procrastiner un peu et entre-temps travailler à des animations toute simple
  pour la réalisation des paires de cartes
* Au final, attaquer le déplacement des cartes, de préférence en Vanilla JS et
  CSS
