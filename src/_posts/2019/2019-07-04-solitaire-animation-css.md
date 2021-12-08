---
date: 2019-07-04 12:28:18
layout: post
tags: CSS
title: "Solitaire - Animation CSS en fin de partie"
image: "/public/2019/fireworks.jpg"
excerpt: "Comment utiliser @keyframes, transform, translate et rotate pour créer une première animation CSS en cas de victoire à Solitaire-Play."
---

J'ai finalement réussi à gérer l'animation pour le déplacement des cartes pour
que l'AutoPlay de [FreeCell](https://www.solitaire-play.com/freecell/) fonctionne
[comme je le souhaitais]({% post_url 2019-04-08-solitaire-ajouter-animations-css %}).

C'est un peu compliqué de documenter ça => je vais déjà faire un billet pour
revenir sur la première animation de
[Solitaire-Play](https://www.solitaire-play.com/).

<figure>
  <img src="{{ page.image }}" alt="fireworks" />
  <figcaption>
    <a href="https://unsplash.com/photos/HxeBUWUiA1A">New year's eve fireworks in the sky - Roven Images</a>
  </figcaption>
</figure>

Normalement, je préfère que mes applications soient assez basiques et sobres,
sans trop de fioritures. C'est pourquoi tout ce qui est animation me parait
généralement superflu. Même si de temps en temps j'utilise des
`$(...).fadeOut()` de jQuery pour masquer des éléments. Mais souvent ça me
plait au début puis je m'en lasse assez vite. J'ai l'impression que c'est une
perte de temps de devoir attendre avant que l'élément veuille bien disparaitre.

Néanmoins, comme j'envisageait d'animer le déplacement des cartes pour que les
joueurs visualisent mieux ce qui se passe en cas d'AutoPlay, il fallait bien me
mettre aux animations et autres transitions à un moment donné.

Pour commencer simplement, j'avais ajouté un petit effet "shake / tilt" au
moment d'afficher la popup qui signale la fin d'une partie :

* ça réveille (ie ça met littéralement de l'animation)
* c'est plus festif

Mais c'était surtout un bon premier pas pour voir ce qui est faisable en matière
d'animation de pas web, avec uniquement du CSS. A l'époque, j'imaginais très bien
dans ma tête ce que je voulais obtenir et je présumais que cela devait être
réalisable en CSS pur.

Je ne m'étais pas trompé et il était très facile de faire ça avec uniquement du
CSS, sans un brin de JavaScript. Par contre, j'ai eu un peu de mal à trouver un
exemple d'animation qui fasse un truc ressemblant à ce que je souhaitais.
Finalement, j'ai fini par trouver quelque chose d'assez fidèle à ce que j'avais
en tête sur le site de
[W3Schools](https://www.w3schools.com/howto/howto_css_shake_image.asp) :)

```
@keyframes shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
```

Si je décortique ce code (et que j'ai bien tout compris au système), voici ce à
quoi ça sert :

* L'animation est définie grâce à une règle CSS
  [@keyframes](https://developer.mozilla.org/fr/docs/Web/CSS/@keyframes).
* Je lui ai donné un nom ("shake"), qui me permettra d'appliquer l'animation à
  un élément HTML.
* La règle `@keyframes` contient les différentes étapes de l'animation, du début
  (étape 0%) à la fin (étape 100%).
* Chaque étape correspond à un pourcentage d'avancement de l'animation, de façon
  assez libre : 0%, 33%, 66%, 100% ou 0%, 10%, 25%, 50%, 100% ...
* A chaque étape, on associe un bloc CSS qui contient les styles correspondants
  à cette étape.

Dans mon cas, j'ai donc :

* Un point de départ qui correspond à l'avancement de 0%
* 9 étapes intermédiaires correspondant à un avancement de 10%, 20%, 30% ...
* La fin de l'animation qui correspond à l'avancement de 100%

**Note** : Le début / point de départ peut être noté `0% { ... }` ou  `from { ... }`
et la fin de l'animation peut s'écrire `100% { ... }` ou `to { ... }`.

A chaque étape, je ne modifie que la propriété CSS
[transform](https://developer.mozilla.org/fr/docs/Web/CSS/transform), pour
appliquer 2 fonctions de transformation :

* [translate()](https://developer.mozilla.org/fr/docs/Web/CSS/transform-function/translate)
  pour décaler / faire bouger légèrement la popup horizontalement (1° argument)
  et verticalement (2° argument).
* [rotate()](https://developer.mozilla.org/fr/docs/Web/CSS/transform-function/rotate)
  pour faire tourner la popup d'un petit degré dans un sens ou dans l'autre.

Ca c'était pour la partie définition / description de l'animation. Il faut ensuite
appliquer cette animation à un élément du DOM, en l'occurence la fenêtre popup que
j'affiche à la fin d'une partie de solitaire.

Pour faire ça, c'est super facile. Il suffit d'ajouter une propriété `animation` aux
règles CSS de ma fenêtre :

```
#popup {
  ...
  animation: shake 0.5s;
  ...
}
```

Cette règle comprend 2 arguments :

* `shake` : le nom de l'animation à appliquer
* `0.5s` : la durée totale de l'animation

Au final, je pense que j'ai à peu près compris le truc, et que ça doit être plus
ou moins çà. Quoiqu'il en soit, le résultat une fois mis en production me va très
bien et ça fait maintenant plusieurs mois que ça tourne sans que je m'en sois
lassé.

Il faudrait peut-être que j'utilise les versions préfixées `-o-transform`,
`-moz-transform`, `-webkit-transform` ... pour que cela fonctionne avec les
versions un peu plus anciennes des navigateurs. Mais en 2019, je considère que
ces navigateurs n'ont plus trop de raisons de ne pas être à jour.

Par contre, côté IE9, ça ne marche pas du tout. La propriété `transform` n'est
reconnue qu'à partir de IE10 (avec le préfixe `-ms-` ?) et de IE11 (sans
préfixe). Mais ça n'a pas d'importance, parce que ça n'empêche pas de jouer.
