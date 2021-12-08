---
date: 2019-08-22 12:48:18
layout: post
tags: CSS
title: "Solitaire - Animation du déplacement des cartes"
image: "/public/2019/escalator.jpg"
excerpt: "Pour ajouter l'AutoPlay à mes jeux de Solitaire, il faut commencer par animer le déplacement des cartes..."
---

Actuellement, l'AutoPlay de mes jeux de solitaire est instantané. Toutes les
cartes qui peuvent être jouées sur les fondations sont immédiatement placées
dessus. Le but de cette nouvelle animation est donc de "montrer" le déplacement
d'une carte d'un point à un autre pour que le joueur comprenne ce qui se passe,
spécialement dans le cas de l'AutoPlay pour FreeCell.

<figure>
  <img src="{{ page.image }}" alt="escalator" />
  <figcaption>
    <a href="http://www.micro-sino.com/escalators/">Escalator</a>
  </figcaption>
</figure>

Montrer le déplacement, ce n'est finalement pas si compliqué que ça. Il faut
juste :

* savoir quelle est la carte à déplacer,
* récupérer sa position actuelle de départ,
* savoir vers où déplacer la carte,
* calculer cette position de destination,
* faire évoluer les coordonnées de la carte d'une position à l'autre.


## 1) Savoir quelle est la carte à déplacer

Facile : elle est passée en paramètre à la fonction via la propriété `.card_id`
de l'objet `move`.

```
var $card = $('#" + move.card_id);
```


## 2) Récupérer sa position de départ

Facile : c'est exactement ce que donne la méthode `.offset()`de jQuery :

```
var $card = $('#" + move.card_id);
var from = $card.offset();
```

Le petit truc en plus : pour
[dQuery](https://blog.pagesd.info/2019/05/14/dquery-librairie-js-manipulation-dom/),
une simple recherche "jQuery offset vanilla JS" et ça peut se calculer ainsi :

```
offset: function () {
  // Renvoie la position top/left absolue du premier élément sélectionné
  var rect = this.items[0].getBoundingClientRect(),
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
}
```


## 3) Savoir vers où déplacer la carte

Facile : c'est également donné par la propriété `.stack` de l'objet `move` passé
en paramètre à la fonction.

```
var $target = $("#" + move.stack.id);
```


## 4) Calculer cette position de destination

Facile : là encore, on utilise la méthode `.offset()` de jQuery / dQuery...

```
var $target = $("#" + move.stack.id);
var to = $target.offset();
```

Le gros truc en plus : la position cible correspond en fait à une pile de cartes
sur laquelle les cartes sont étalées verticalement. Par conséquent, la position
de cette pile ne correspond pas tout à fait à la position qu'occupera la carte
une fois déplacée. Lors de mes premiers essais, il y avait un déplacement
progressif de la carte vers sa pile de destination, suivit d'un soubresaut pour
la positionner au bon endroit dans la pile :

* La pile étant plus large que les cartes, celles-ci sont centrée
horizontalement au milieu de la pile => très léger soubresaut pour aligner la
carte correctement.
* Si la pile de destination contient déjà plusieurs cartes étalées
verticalement, l'animation amène la carte en haut de la pile => nouveau
soubresaut plus ou moins important pour décaler la carte en bas de la pile.

Il y avait moyen de calculer les "bonnes" coordonnées cibles avec quelques
formules un peu compliquées.

Mais plus simplement, il suffit d'ajouter une carte "fantôme" sur la pile de
destination puis de prendre comme coordonnées cibles la position de cette carte
fantôme :

```
$("#" + move.stack.id.append("<div id='target' class='card'></div>");
var $target = $("#target");
var to = $target.offset();
$target.remove();
```


## 5) Faire évoluer les coordonnées de la carte d'une position à l'autre

Facile !

On commence par calculer le déplacement à effectuer pour aller du point de
départ jusqu'à la position de destination :

```
var x = to.left - from.left;
var y = to.top - from.top;
```

Puis on utilise la fonctions CSS
[`translate()`](https://developer.mozilla.org/fr/docs/Web/CSS/transform-function/translate)
pour déplacer la carte :

```
$card.css("transform", "translate(" + x + "px, " + y + "px)");
```

Et pour que ce déplacement se déroule de façon progressive et pas d'un coup, il
faut définir une transition :

```
$card..css("transition", "all 200ms ease-in-out");
```

Et ça marche ! Il ne manque plus que quelques `setTimeout()` pour réussir à
enchainer correctement les différents déplacements et ne pas envoyer toutes les
cartes vers les fondations en même temps.


## 6) Quelques finitions

J'ai quand même eu besoin de 2 petits bricolages après avoir testé un peu mieux.

* Ajouter un `$card.css("z-index", 100)` pour que la carte déplacée reste au
dessus des autres pendant son voyage sous Internet Explorer.
* Bloquer tous les autres évènements pendant que l'AutoPlay est en cours, pour
éviter que le joueur fasse un Undo, demande un conseil, démarre un drag &
drop... pendant les animations.

Mais au final, le système est suffisamment bien foutu pour que je puisse
l'utiliser ailleurs que dans l'AutoPlay :

* Quand le joueur double clique sur une carte, son déplacement vers la fondation
est maintenant animé.
* Quand le joueur annule le dernier coup joué, c'est désormais une animation qui
ramène la carte à sa position d'origine.

Et dès que j'aurais un peu de temps, je mets ça en place dans les autres jeux de
solitaire...
