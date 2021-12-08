---
date: 2019-04-25 12:19:02
layout: post
tags: javascript
title: "Solitaire - Remplacer AjaxMin, etc..."
image: "/public/2019/printemps.jpg"
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
  <img src="{{ page.image }}" alt="printemps" />
</figure>

Lorsque j'aurai réussi à réaliser tout ce que j'ai en vue dans les billets
précédents, cela sera déjà pas mal. Mais j'aimerais aussi parvenir à moderniser
un peu le fonctionnement du projet.

Par exemple, j'utilise actuellement AjaxMin pour compresser les fichiers
JavaScript et CSS. C'est une vieille application console sous Windows qui fait
pile ce dont j'ai besoin (et que j'ai dû utiliser pour la première fois il y a
fort longtemps sur je ne sais plus quoi...).

Rien que le nom complet, [Microsoft Ajax Minifier](https://github.com/Microsoft/ajaxmin),
donne une idée de quand ça date. Ce n'est plus tout jeune et plus maintenu non
plus. Même si c'est quand même un assez bon outil d'après Charles O'Dale qui
avait effectué un comparatif par rapport à YUICompressor et UglifyJS il y a
quelque temps dans son billet [Selecting a JavaScript Minifier](https://www.charlesodale.com/selecting-a-javascript-minifier-spoiler-microsoft-ajax-minifier-wins/).

Et en effet, AjaxMin présente malgré tout quelques avantages (au moins dans mon
cas) :

* C'est un petit exécutable que je trimbale d'un PC à l'autre
* Il est facile à utiliser sans avoir rien à installer
* Ce me sert aussi à "obfuscater" le code JavaScript et à rendre sa
  réutilisation un peu plus compliqué en cas de décompression

L'idéal serait évidemment de passer à quelque chose de plus utilisé, dans le
genre de [UglifyJS](http://lisperator.net/uglifyjs/). Mais pour y arriver, il
faudrait aussi :

* Moderniser et formaliser un peu mieux les sources du projet (style npm et
  package.json)
* Voir si je peux plus ou moins réussir à protéger les sources comme avec AjaxMin

C'est pour cela que dans l'immédiat, je vais éviter de passer trop de temps sur
ce genre de truc, puisque ça marche très bien en l'état avec un simple batche.
Donc standby pour l'instant. Ou à la rigueur un petit ménage de printemps en
commençant par passer à npm et package.json afin d'avoir un projet plus
"standard" et être prêt à d'autres évolutions pour l'avenir...
