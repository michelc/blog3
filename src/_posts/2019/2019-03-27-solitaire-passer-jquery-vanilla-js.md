---
date: 2019-03-27 12:22:32
layout: post
tags: javascript
title: "Solitaire - Passer de jQuery à Vanilla JS"
image: "/public/2019/vanille.jpg"
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
  <img src="{{ page.image }}" alt="vanille-bourbon" />
  <figcaption>Vanille Bourbon - La Réunion</figcaption>
</figure>

Au départ, j'ai utilisé [jQuery](https://jquery.com/) (et
[jQuery UI](https://jqueryui.com/)) parce que c'était encore ce qui se faisait
plus ou moins à l'époque. Et pour moi, c'était la solution la plus simple pour
réussir à faire rapidement ce que je voulais, et que cela fonctionne
correctement sur un maximum de navigateurs.

Maintenant, je connais un peu mieux JavaScript, et surtout les navigateurs sont
beaucoup plus "standards". Inspiré par le mouvement
[You Don't Need jQuery](http://youmightnotneedjquery.com/), et par de nombreux
exemples disponibles sur le web, j'ai déjà pas mal creusé le sujet. Pas parce
que jQuery est un problème, mais parce que j'ai envie de faire autrement et de
m'améliorer en JavaScript.

J'ai commencé à travailler sur une librairie "dQuery.js". Elle reprend
uniquement les fonctions de jQuery que j'utilise dans
[Solitaire-Play](https://www.solitaire-play.com/), de façon très basique. Le
code est assez standard (même si je m'accorche à IE9) et devrait donc être OK
pour tous les navigateurs suffisament modernes, y compris sur les smartphones.

Quelques liens qui m'ont aidé / encouragé pour démarrer :

* [10 Tips for Writing JavaScript without jQuery](https://tutorialzine.com/2014/06/10-tips-for-writing-javascript-without-jquery)
* [La vie sans jQuery](https://fvsch.com/js-sans-jquery/)
* [The Basics of DOM Manipulation in Vanilla JavaScript (No jQuery) ](https://www.sitepoint.com/dom-manipulation-vanilla-javascript-no-jquery/)
* [(Now More Than Ever) You Might Not Need jQuery](https://css-tricks.com/now-ever-might-not-need-jquery/)
* [Is Vanilla JavaScript worth learning? Absolutely](https://medium.freecodecamp.org/is-vanilla-javascript-worth-learning-absolutely-c2c67140ac34)
* [You-Dont-Need-jQuery](https://github.com/nefe/You-Dont-Need-jQuery) -
  Examples of how to do query, style, dom, ajax, event etc like jQuery with
  plain javascript.
* [How to create your own vanilla JS DOM manipulation library like jQuery](https://gomakethings.com/how-to-create-your-own-vanilla-js-dom-manipulation-library-like-jquery/)
* [Apprendre à se servir de ce qu'on a : manipuler le DOM](http://jesmodrazik.fr/article/apprendre-a-se-servir-de-ce-quon-a-manipuler-dom/)

Et quelques exemples de librairies qui visent à "remplacer" jQuery :

* [Bliss - Heavenly JavaScript](https://blissfuljs.com/) - Want to use Vanilla
  JS but find native APIs a bit unwieldy? Bliss is for you.
* [Umbrella JS](https://umbrellajs.com/) - Tiny library for DOM manipulation,
  events and AJAX
* [nanoJS](https://vladocar.github.io/nanoJS/) - Minimal standalone JS library
  for DOM manipulation

J'ai utilisé "nanoJS" comme point de départ et j'ai bien progressé depuis. J'ai
maintenant une version de test du jeu Golf Solitaire qui fonctionne telle quelle
avec jQuery ou avec ma librairie dQuery.

La suite maintenant, c'est de tester cette nouvelle solution dans un maximum de
cas et de conditions. Une fois que je serai suffisament sûr du résultat, je
pourrai migrer les quelques jeux sans drag and drop, puisqu'ils ne dépendent que
de jQuery et pas de jQuery UI.

Eventuellement, je pourrais aussi rédiger un billet à part pour présenter un
peu plus en détails ce que j'ai fait avec ma librairie dQuery.
