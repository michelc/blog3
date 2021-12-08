---
date: 2019-05-28 12:27:44
layout: post
tags: javascript, jquery
title: "dQuery - Délégation d'évènements et « event.target »"
---

<div class="encart" markdown="1">

Cette série de billets retrace quelques-unes des étapes pour développer une
mini-librairie JavaScript qui remplacera(it) un jour jQuery sur mon site de jeux
de solitaires.

1. [Comment j'ai (bientôt) remplacé jQuery]({% post_url 2019-04-30-dquery-remplacer-jquery %})
2. [Une version compatible IE9 / ES5]({% post_url 2019-05-07-dquery-compatibilite-ie9-es5 %})
3. [Ma librairie pour manipuler le DOM]({% post_url 2019-05-14-dquery-librairie-js-manipulation-dom %})
4. [La délégation des évènements en JS]({% post_url 2019-05-21-dquery-delegation-evenement-javascript %})
5. [Délégation d'évènements et « event.target »]({% post_url 2019-05-28-dquery-delegation-evenement-event-target %})
6. [Délégation d'évènements et iOS]({% post_url 2019-06-04-dquery-delegation-evenement-ios %})

</div>

Je résume : après avoir implémenté la délégation d'évènement en pur JavaScript
dans ma librairie dQuery, mon jeu ne se comportait toujours pas correctement. La
fonction callback qui était appelée après avoir cliqué sur une carte ne
fonctionnait plus comme avant, c'est-à-dire comme elle le faisait du temps de
jQuery.

Au "départ" du délégate, je sais bien quelle est la carte cliquée, mais une fois
arrivée "dans" la fonction callback appelée, je ne le sais plus :

```
$(".pile").on("click", ".card", PlayCard);

...

function PlayCard() {
  var card_id = this.id; <----------- c'est pas le bon id !!!
  var card = $(card_id);

  ...
}
```

Déjà, pour commencer, je décide de revoir toutes mes fonctions évènements pour
qu'il soit plus explicite qu'il s'agisse d'un évènement. J'aurais pu changer
leur nom en `XxxxxxEvent()` mais ça ferait un peu trop C# / Javaesque. J'ai donc
préféré déclarer explicitement le paramètre `event` qu'elles reçoivent. De cette
façon, on peut immédiatement et visuellement comprendre qu'une fonction avec
le paramètre "event" est une fonction évènement :

```
function PlayCard(event) {
  var card_id = this.id; <----------- toujours pas le bon id !!!
  var card = $(card_id);

  ...
}
```

Le fait que `this` corresponde à l'élément cliqué et donc que `this.id` renvoie
l'identifiant de cet élément cliqué, est une "facilité" de JavaScript (ou
peut-être de jQuery ?). Heureusement, on peut aussi retrouver cette information
grâce à la propriété `.target` de l'évènement. Personnellement, ça me semble
même carrément plus clair :

```
function PlayCard(event) {
  var card_id = event.target.id; <--- là c'est le bon id !
  var card = $(card_id);

  ...
}
```

J'ai malgré tout fait quelques essais supplémentaires pour creuser un peu plus
le sujet. Il semblerait qu'on peut continuer à utiliser `this` et donc `this.id`
en remplaçant simplement :

```
if (event.target.closest(_filter))
  fn(event);
```

Pour utiliser la méthode `.call()`, ce qui qui permet de définir la valeur du
`this` quand on appelle la fonction callback :

```
if (event.target.closest(_filter))
  fn.call(event.target, event);
```

Mais comme je l'ai dit, je préfère utiliser explicitement la propriété `.target`
(et accessoirement éviter les prises de tête à [comprendre qui c'est ce
`this`](https://medium.com/quick-code/understanding-the-this-keyword-in-javascript-cb76d4c7c5e8)).

Et voilà. C'est quasi-parfait ! Tout marche comme avant, et à part un cas un peu
tordu, je ne devrais plus rien avoir à changer.
