---
date: 2019-04-15 12:32:26
layout: post
tags: javascript
title: "Solitaire - Drag and drop sans jQuery UI"
image: "/public/2019/drag-and-drop.jpg"
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
  <img src="{{ page.image }}" alt="drag-and-drop" />
</figure>

A assez long terme par rapport à tout le reste (remplacer jQuery, terminr
FreeCell, ajouter quelques animations...), j'aimerai revoir la gestion du
glisser / déposer dans mes jeux.

Actuellement, toute cette partie est gérée via
[jQuery UI](https://jqueryui.com/) et
[jQuery UI Touch Punch](http://touchpunch.furf.com/) pour les tablettes et les
smartphones. Ils font très bien l'affaire, mais j'aimerais redévelopper cette
fonctionnalité pour utiliser quelque chose de plus "moderne".

C'est un objectif assez lointain et pas vraiment urgent. D'abord cela ne pourra
se faire qu'une fois que j'aurai réussi à abandonner complètement jQuery pour
l'ensemble des jeux qui n'utilisent pas le drag & drop. Et c'est quelque chose
que j'envisage pour après que FreeCell soit terminé et que j'ai ajouté quelques
animations...

Pour remplacer jQuery UI, il faut déjà que je trouve une librairie Vanilla JS
qui soit super simple pour gérer le glisser / déposer. Pour l'instant, j'ai
repéré les 5 librairies JavaScript suivantes qui gèrent les navigateurs récents
mais aussi Internet Explorer et les écrans tactiles...


## [Dragula](https://bevacqua.github.io/dragula/)

Dragula est une librairie JavaScript simple et sans aucune dépendance. Elle
permet d'ajouter du drag & drop  aux éléments du DOM. Elle gère les
périphériques tactiles et fonctionne aussi avec IE7+.

* Sources : [https://github.com/bevacqua/dragula](https://github.com/bevacqua/dragula)
* Dernière mise à jour : 18/12/2018
* Dernière release : 12/09/2016


## [Draggabilly](https://draggabilly.desandro.com/)

Draggabilly est une librairie JavaScript avec pour seul objectif de faire que
le drag and drop marche. Elle fonctionne avec IE10+ et les appareils tactiles.

* Sources : [https://github.com/desandro/draggabilly](https://github.com/desandro/draggabilly)
* Dernière mise à jour : 27/09/2018
* Dernière release : 27/03/2018


## [Draggable JS](https://shopify.github.io/draggable/)

Draggable JS est une bibliothèque JavaScript complètement paramétrable pour
gérer tout ce qui est drag & drop, tri ou permutation. C'est une librairie
orientée ES6 qui est compatible IE11+.

* Sources : [https://github.com/Shopify/draggable](https://github.com/Shopify/draggable)
* Dernière mise à jour : 03/04/2019
* Dernière release : 07/09/2018 (beta)

A l'origine, c'était un projet issu de la plateforme de eCommerce Shopify, mais
il est désormais géré par d'autres personnes.


## [Interact.js](http://interactjs.io/)

Interact.js est une librairie JavaScript légère et autonome pour gérer le
glisser / déposer et le redimensionnement sur les navigateurs modernes. Elle
fonctionne avec IE9+.

* Sources : [https://github.com/taye/interact.js](https://github.com/taye/interact.js)
* Dernière mise à jour : 07/04/2019
* Dernière release : 05/04/2019


## [SortableJS](https://sortablejs.github.io/Sortable/)

SortableJS est une librairie JavaScript simple et légère qui permet de trier une
liste d'éléments du DOM. Elle fonctionne avec tous les navigateurs et appareils
tactiles, dont IE9+.

* Sources : [https://github.com/SortableJS/Sortable](https://github.com/SortableJS/Sortable)
* Dernière mise à jour : 12/04/2019
* Dernière release : 11/03/2019

C'est sans doute une librairie plus destinée au tri des "listes". Mais il y a
quand même 2 points intéressants :

* Il y a un "[Grid Exemple](https://sortablejs.github.io/Sortable/#grid)" qui
  pourrait peut-être le faire pour un jeu de carte...
* Il y a aussi 2
  [comparatifs vidéos](https://sortablejs.github.io/Sortable/#comparisons) par
  rapport à jQuery UI et Dragula.


## Conclusion

Ca va me demander pas mal de travail pour étudier et tester tout ça avant de
pouvoir sélectionner la "bonne" librairie dans un premier temps. Et après, il
faudra encore parvenir à la maitriser suffisament pour réussir à l'intégrer dans
mes jeux (et dans la mesure du possible avec dQuery.js).

C'est donc pas demain la veille que je vais attaquer ce gros morceau. Mais
l'avantage, c'est que d'ici là j'aurai sans doute laissé tomber IE9...
