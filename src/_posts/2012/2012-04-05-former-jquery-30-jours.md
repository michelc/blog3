---
date: 2012-04-05 21:07:00
layout: post
redirect_from: "post/2012/04/05/se-former-a-jquery-en-30-jours"
tags: javascript, jquery
title: "Se former à jQuery en 30 jours"
---

Je me suis lancé dans la formation [30 Days to Learn jQuery](http://learnjquery.tutsplus.com/)
mardi dernier. C'est une formation gratuite prévue sur 30 jours, soit pile 1
mois si on tient le rythme de 1 tutoriel par jour ou au pire 1 mois et demi à 2
mois si on profite des week-ends et des jours fériés pour se reposer.

Je viens de terminer la première partie consacrée aux bases de jQuery, soit
1 bonne heure et demi de vidéos et un quiz.

Grosso-modo, ça m'a permi de revoir un peu tout ce que j'avais acquis au fur
et à mesure de mon utilisation de jQuery.

* Hello jQuery : récupérer jQuery, le référencer juste avant la balise
`</body>`, utiliser la fonction `jQuery()`, les 1°
sélecteurs CSS, l'alias `$()`
* Not So Fast, jQuery : utiliser la méthode `ready()` quand
notre script apparaît en début de page avec au choix la syntaxe
`$(document).ready(function() { ... });` ou `$(function() { ...
});`
* The Basics of Querying the DOM : les fonctions
`children()`, `find()`, `parent()`,
`parents()`, `closest()`... pour parcourir le DOM à
partir d'un sélecteur
* Events 101 : un premier exemple pour réagir au clic sur un bouton avec
la méthode `click()`
* Events 201 : un autre exemple plus poussé de `click()`,
`.hover()` et `on("click")` avec quelques exemples
d'animations
* Quiz #1: The Basics : j'ai presque fait 20 / 20
* Bind…Live…Delegate…Huh? : rappel des "anciennes" méthodes
`bind()`, `live()` et `delegate()` qui
pointent désormais toutes sur la méthode `on()`
* Creating and Appending Content : un tour des méthodes pour insérer du
contenu au DOM : `append()`, `prepend()`,
`after()`, `before()`, `appendTo()`,
`prependTo()`, `insertAfter()`,
`insertBefore()` et `$("<p></p>")` pour créer
du contenu

Je connaissais plus ou moins, mais ça m'a aussi servi à apprendre quelques
trucs nouveaux :

* `$("li:first-child")` = `$("li:first")` =
`$("li").first()` = `$("li").eq(0)` :
`:first-child` est un sélecteur CSS alors que
`:first` est un sélecteur spécifique à jQuery qui fonctionnerait
aussi avec IE6 (je savais mais j'avais oublié)
* l'existence de la fonction `on('click')` = `click()`
(je connaissais pas)
* `$("tr").on("event")` => attache 1 évènement pour chaque tr,
donc potentiellement énormément d'évènements
* `$("table").on("event", "tr")` => attache 1 seul évènement à
la table et l'applique uniquement aux lignes => beaucoup plus
performant

Pour l'instant, le bilan est plutôt positif puisque j'ai découvert quelques
trucs et que ça m'a permi de vérifier que je maitrise plutôt bien les bases de
jQuery.

Les révisions (la partie facile) étant derrière moi, il faut maintenant
basculer dans la vraie formation et attaquer la deuxième partie consacrées aux
effets. Soit 10 jours de leçons avec presque 3 heures de vidées, 1 quiz et même
un devoir du soir !
