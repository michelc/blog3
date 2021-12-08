---
date: 2019-05-21 12:30:52
layout: post
tags: javascript, jquery
title: "dQuery - La délégation des évènements en JS"
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

La délégation d'évènements. Comment dire ? C'est pas compliqué, mais c'est pas
si facile que ça... Et puis il faut s'en rappeler tout le temps !


## Etape 1 : Premier re-découverte

Revenons au tout début de [Solitaire-Play](https://www.solitaire-play.com/).
Au cours de mes premiers essais, je gérais le clic sur les cartes de façon
basique :

```
$(".card").on("click", PlayCard);

...

function PlayCard() {
  var card_id = this.id;
  var card = $(card_id);
  var pile_id = card.parent().attr("id");

  ...
}
```

J'attachais donc un évènement clic aux 52 cartes du jeu (en vrai un peu moins,
puisque je me limitais aux cartes jouables du dessus des piles).

Et à chaque fois que je réaffichais une pile, je ré-attachais un évènement clic
à toutes les cartes jouables de la pile. Tout ça parce que pour simplifier, je
supprimais la pile puis je la recréais pour la réafficher complètement à chaque
fois que je modifiais le contenu d'une pile de cartes. Ça devait craindre un peu
et mieux vaut ne pas trop réfléchir à ce que devenait tous ces évènements...

Un beau jour, j'ai quand même vu qu'il était possible d'ajouter un "filtre" à
la méthode `.on()` de jQuery. Ainsi, au lieu d'attacher 52 évènements clic aux
cartes :

```
$(".card").on("click", PlayCard);
```

Je pouvais me contenter d'attacher 13 évènements clic aux 13 piles (dans le cas
de Klondike solitaire) :

```
$(".pile").on("click", ".card", PlayCard);
```

C'était plus "léger" (13 c'est mieux que 52) et surtout je n'avais plus à le
refaire à chaque fois que je réaffichais une pile de cartes !

Et c'est comme ça que j'ai pour la première fois re-découvert la délégation
d'évènement... Parce que bien entendu, j'avais déjà lu des trucs à ce sujet il
y a fort longtemps, genre "[How JavaScript Event Delegation Works](https://davidwalsh.name/event-delegate)"
ou "[Utiliser la délégation d'évènements...](https://delicious-insights.com/fr/articles/dix-bonnes-pratiques-javascript/#4-utiliser-la-d-l-gation-d-v-nements-plut-t-que-des-tas-de-gestionnaires-troits)".


## Etape 2 : Deuxième re-découverte

Les années passent et un jour je tombe sur
[NanoJS](https://github.com/vladocar/nanoJS/) et je me mets en tête de
l'utiliser pour mes jeux qui n'ont pas besoin de drag and drop.

Là je m'aperçois que j'utilise des `$(...).on(évènement, fonction)` et aussi un
`$(...).on("click", filtre, fonction)`. Qu'à cela ne tienne, je simplifie ce
dernier en `$(... + " " + filtre).on("click", fonction)`.

Et ça marche ! Presque. Oui, parce que je ne faisais pas un bête :

```
$(".pile").on("click", ".card", PlayCard);
```

Entre temps, j'avais aussi "optimisé" le truc :

```
$(".pile").on("click", ".card:last-child", PlayCard);
```

Mais le problème n'était pas là. Le souci venait du fait qu'en remplaçant ça
par `$(".pile .card").on("click", PlayCard)`, j'attachais les évènements clic
aux cartes et plus aux piles, comme à mes tout début. Et que tous s'effondrait
dès que je réaffichais complètement une pile.

Et c'est là que j'ai re-re-découvert un peu brutalement qu'il y avait un truc
qui s'appellerait la délégation d'évènements...


## Etape 3 : Un peu d'aide

Pffuuuuuuu ! Je cherche comment m'en sortir et je fini par tomber sur le blogue
de [Jesmo Drazik](http://jesmodrazik.fr/), avec des billets en français très
utiles pour "apprendre à se servir de ce qu'on a" :

* [Manipuler le DOM](http://jesmodrazik.fr/article/apprendre-a-se-servir-de-ce-quon-a-manipuler-dom/)
* [La délégation d'évènements](http://jesmodrazik.fr/article/apprendre-a-se-servir-de-ce-quon-a-event-delegation/)

Le premier article m'a permis de "réviser" et conforter un peu ce que j'avais
déjà fait avec dQuery. Et le deuxième article m'a sauvé la vie (au moins).

Il y explique entre autre pourquoi la délégation d'évènements c'est bien et même
que c'est mieux. Mais surtout, il y présente clairement comment faire ça :

```
// Notre fonction a besoin :
// - de l'élément sur lequel écouter l'événement
// - du type d'événement à écouter
// - du sélecteur auquel les éléments doivent correspondre pour lancer le callback
// - le callback à lancer
function delegate(element, eventType, selector, callback) {
  // on écoute l'événement sur l'élément parent
  element.addEventListener(eventType, function(event) {
    // si event.target correspond au sélecteur voulu...
    if (event.target && event.target.matches(selector)) {
      // ... on exécute le callback
      callback(event);
    }
  });
}
```


## Etape 4 : Je peux le faire

Je passe les détails, mais après beaucoup d'essais, pas mal de lectures et
quelques âneries, je fini par arriver à remplacer la courte méthode `.on()`
d'origine de NanoJS :

```
on: function (type, fn) {
  return this.each(function (i) {
    i.addEventListener(type, fn, false);
  });
},
```

Par un truc un peu plus compliqué / perfectionné :

```
on: function (type, filter, fn) {
  // Attache un gestionnaire d'évènement
  var delegation = (typeof filter === "string");

  // Syntaxe .on(type, fn)
  if (!delegation) {
    // Le paramètre "filter" est en fait le paramètre "fn"
    fn = filter;
    // Attache un gestionnaire d'évènement à chaque élément sélectionné
    return this.each(function (i) {
      i.addEventListener(type, fn, false);
    });
  }

  // Syntaxe .on(type, filter, fn)
  // => effectue une délégation d'évènement
  var _filter = this.selector + " " + filter;
  document.addEventListener(type, function (event) {
    if (event.target.matches(_filter)) fn(event);
  }, false);
  return this;
},
```


## Etape 5 : Ne pas laisser IE9 de côté

Malheureusement, la méthode `.matches()` n'existe pas sous IE9. Il faut donc
passer par un "polyfill" prêt à l'emploi :

```
/**
 * Element.matches() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
 */

if (!Element.prototype.matches)
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector;
}
```

Et puis, selon [Chris Ferdinandi](https://gomakethings.com/), il semblerait que
`.matches()` pose quelques soucis dans le cas où le clic se produit sur un objet
à l'intérieur de l'objet auquel on s'intéresse.

Par exemple, dans mon cas je m'intéresse aux clics effectués sur des `<div
class="card">`. Mais comme ces `<div>` peuvent contenir d'autres éléments
`<div>`, si on clique sur un de ces éléments "intérieurs", la méthode
`.matches(".card")` renverra faux :(

D'après son article "[Checking event target selectors with event bubbling in vanilla
JavaScript](https://gomakethings.com/checking-event-target-selectors-with-event-bubbling-in-vanilla-javascript/)",
il est plus précis de passer par la méthode `.closest()` :

* `if (event.target.matches(_filter)) ...` => pas mal
* `if (event.target.closest(_filter)) ...` => mieux

L'(in)évitable polyfill pour IE9 :

```
/**
 * Element.closest() polyfill (simple version)
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
```

C'est bien, c'est beau, mais ça ne fonctionne pas... Il me manque encore un ou
deux petits réglages pour que tout marche comme sur des roulettes.

A suivre...
