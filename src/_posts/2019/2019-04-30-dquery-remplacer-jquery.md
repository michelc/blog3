---
date: 2019-04-30 14:01:46
layout: post
tags: javascript, jquery
title: "dQuery - Comment j'ai (bientôt) remplacé jQuery"
---

<div class="encart" markdown="1">

Ce billet est le premier d'une nouvelle petite série consacrée au développement
de "dQuery.js", une mini-librairie JavaScript ultra simple pour remplacer en
partie jQuery.

1. [Comment j'ai (bientôt) remplacé jQuery]({% post_url 2019-04-30-dquery-remplacer-jquery %})
2. [Une version compatible IE9 / ES5]({% post_url 2019-05-07-dquery-compatibilite-ie9-es5 %})
3. [Ma librairie pour manipuler le DOM]({% post_url 2019-05-14-dquery-librairie-js-manipulation-dom %})
4. [La délégation des évènements en JS]({% post_url 2019-05-21-dquery-delegation-evenement-javascript %})
5. [Délégation d'évènements et « event.target »]({% post_url 2019-05-28-dquery-delegation-evenement-event-target %})
6. [Délégation d'évènements et iOS]({% post_url 2019-06-04-dquery-delegation-evenement-ios %})

</div>

Cela faisait déjà un petit moment que je voulais "abandonner" jQuery, ou plus
exactement voir ce qui était faisable en Vanilla JS.

Ces derniers temps, jQuery évolue peu (surtout jQuery UI) et les différents
navigateurs encore existants ont beaucoup moins de particularités. Je savais que
ce qui pouvait "bloquer" pour mes jeux de solitaire, c'était le drag and drop à
base de jQuery UI. Mais vu qu'il existe suffisamment de [librairies
indépendantes de jQuery pour le d&d]({% post_url 2019-04-15-solitaire-drag-and-drop-sans-jquery-ui %}),
le "problème" serait donc résolu en temps voulu. D'autant plus que tous mes jeux
n'utilisent pas le glisser-déplacer.

Je pouvais donc consacrer un peu de temps à chercher comment remplacer les
fonctions de jQuery que j'utilisais par du JavaScript "brut", à base de
`.querySelectorAll()` et autres... Je voulais quelque chose de simple et léger,
mais ce n'est pas encore évident de trouver une librairie de substitution qui
fasse l'unanimité (sur la durée particulièrement).

J'ai donc travaillé dessus assez épisodiquement, au fur et à mesure des articles
et des bibliothèques que je voyais passer à ce sujet. Et de temps en temps, je
testais 2 ou 3 trucs, assez pour continuer à entretenir l'envie de faire plus.

Et puis un jour, Eureka ! Je tombe sur la librairie JavaScript
[NanoJS](https://github.com/vladocar/nanoJS/) qui représente "pile-poil" ce que
je cherche à faire : reproduire plus ou moins les fonctionnalités de jQuery et
en particulier sa syntaxe `$(...)`.

Comme conseillé par Vladimir Carrer, son auteur, j'ai très vite adapté cette
librairie à mes propres besoins. Pour cela, j'ai commencé par recenser toutes
les utilisations que je faisais de jQuery dans mes jeux, et finalement il n'y
avait pas tant de trucs que ça (hors drag & drop) :

* `$(...).css(propriété, valeur)`
* `$(...).hide()`
* `$(...).show()`
* `$(...).on(évènement, fonction)`
* `$(...).addClass(une_classe_css)`
* `$(...).removeClass(une_classe_css)`
* `$(...).html(code_html)`
* `$(...).append(code_html)`
* `$(...).text(contenu_texte)`
* `$(...).remove()`
* `$(...).attr(un_attribut)`
* `$(...).is(":visible")`

Après pas mal d'essais, d'erreurs et de débogage, voici ce que ça a donné fin
2018, très largement copié / collé des sources d'origine de NanoJS :

```
!(function () {

  var nano = function (s) {
    if (typeof s === "string") {
      this.value = Array.prototype.slice.call(document.querySelectorAll(s));
    } else if (typeof s === "object") {
      this.value = [s];
    }
  };

  nano.prototype = {
    each: function (fn) {
      [].forEach.call(this.value, fn);
      return this;
    },
    css: function (a, v) {
      return this.each(function (i) {
        i.style[a] = v;
      });
    },
    hide: function () {
      return this.each(function (i) {
        i.style.display = "none";
      });
    },
    show: function () {
      return this.each(function (i) {
        i.style.display = "block";
      });
    },
    on: function (type, fn) {
      return this.each(function (i) {
        i.addEventListener(type, fn, false);
      });
    },
    addClass: function (v) {
      return this.each(function (i) {
        if (i.classList) {
          i.classList.add(v)
        } else {
          i.className += " " + v;
        }
      });
    },
    removeClass: function (v) {
      return this.each(function (i) {
        i.classList.remove(v);
      });
    },
    html: function (v) {
      return this.each(function (i) {
        i.innerHTML = v;
      });
    },
    append: function (v) {
      return this.each(function (i) {
        i.insertAdjacentHTML("beforeend", v);
      });
    },
    text: function (v) {
      return this.each(function (i) {
        i.innerText = v;
      });
    },
    remove: function () {
      return this.each(function (i) {
        i.parentNode.removeChild(i);
      });
    },
    parent: function () {
      this.value = [this.value[0].parentNode];
      return this;
    },
    attr: function (v) {
      return this.value[0].getAttribute(v);
    },
    is: function (v) {
      // Toujours $(..).is(":visible")
      return this.value[0].offsetParent !== null;
    },
  };

  window.$ = function (selector) {
    return new nano(selector);
  };

})();
```

Gros avantage, je suis passé de 85 ko pour jQuery 3.1.1 minifié à moins de 5 ko
bruts. Seulement 88 lignes de Vanilla JS et je pouvais quasiment remplacer "tel
quel" la librairie jQuery dans mon jeu de Golf solitaire !

Point positif, c'était possible de "refaire" jQuery (un morceau en tout cas). Et
c'était génial d'avoir ce côté "jqueryesque" et de pouvoir faire des `$(...)`,
les enchainer style `$(...).addClass(...).show()`... Sans compter que tout ça
est tellement simple que j'arrive même à comprendre le truc.

Petit problème, j'avais un peu galéré pour re-comprendre le fonctionnement des
évènements. Ça marchait moyennement parce que j'avais dû remplacer les
`$(sélecteur).on(évènement, filtre, fonction)` par des
`$(sélecteur + filtre).on(évènement, fonction)` et que ça avait demandé quelques
bidouilles dans le code source pour arriver au "bon" résultat.

Malgré tout, une telle simplicité c'était une véritable révélation. J'ai compris
qu'il fallait que je m'accroche et que je continue sur cette voie. Avec NanoJS,
j'avais enfin trouvé le bon truc qui me permettrait d'aller jusqu'au bout et de
remplacer jQuery.

Pour l'instant, `git push` et c'est publié. On verra plus tard pour la suite de
l'histoire...
