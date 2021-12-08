---
date: 2019-05-14 12:24:08
layout: post
tags: javascript, jquery
title: "dQuery - Ma librairie JS pour manipuler le DOM"
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

Au cours de mes essais et des évolutions / améliorations apportées à la
librairie [NanoJS](https://github.com/vladocar/nanoJS/), je me suis accordé un
petit moment de pause...

Cela m'a donné l'occasion de réfléchir à un nouveau nom pour la version
personnalisée sur laquelle je travaille :

> dQuery !

1. Ça ressemble à "jQuery"
2. Ça commence par un "d", comme "dollar"
3. Ça commence aussi par un "d", comme "DOM"

Je suis trop content...

Et donc, mon code source avec le "nouveau" nom plus quelques commentaires :

```
!(function () {

  var dQuery = function (s) {
    if (typeof s === "string") {
      // Liste des éléments correspondant au sélecteur en cours
      this.items = Array.prototype.slice.call(document.querySelectorAll(s));
    } else {
      // Liste des éléments correspondant à l'objet DOM en cours
      this.items = [s];
    }
  };

  dQuery.prototype = {
    each: function (fn) {
      // Exécute une fonction sur chaque élément sélectionné
      [].forEach.call(this.items, fn);
      return this;
    },
    css: function (a, v) {
      // Défini une propriété CSS sur chaque élément sélectionné
      // (commence par transformer le "snake-case" en "camelCase")
      a = a.replace(/(\-\w)/g, function(m) { return m[1].toUpperCase(); });
      return this.each(function (i) {
        i.style[a] = v;
      });
    },
    hide: function () {
      // Masque chaque élément sélectionné
      return this.each(function (i) {
        i.style.display = "none";
      });
    },
    show: function () {
      // Affiche chaque élément sélectionné
      return this.each(function (i) {
        i.style.display = "block";
      });
    },
    on: function (type, fn) {
      // Attache un gestionnaire d'évènement à chaque élément sélectionné
      return this.each(function (i) {
        i.addEventListener(type, fn, false);
      });
    },
    addClass: function (v) {
      // Ajoute un classe CSS à chaque élément sélectionné
      return this.each(function (i) {
        if (i.classList) {
          i.classList.add(v)
        } else {
          i.className += " " + v;
        }
      });
    },
    removeClass: function (v) {
      // Supprime une classe CSS de chaque élément sélectionné
      return this.each(function (i) {
        if (i.classList) {
          i.classList.remove(v);
        } else {
          i.className = i.className.replace(new RegExp(v + " *", "g"), "");
        }
      });
    },
    html: function (v) {
      // Défini le contenu HTML de chaque élément sélectionné
      return this.each(function (i) {
        i.innerHTML = v;
      });
    },
    append: function (v) {
      // Insère un contenu HTML ou un élément à la fin de chaque élément sélectionné
      return this.each(function (i) {
        i.insertAdjacentHTML("beforeend", v);
      });
    },
    text: function (v) {
      // Défini le contenu texte de chaque élément sélectionné
      return this.each(function (i) {
        i.textContent = v;
      });
    },
    remove: function () {
      // Supprime chaque élément sélectionné du DOM
      return this.each(function (i) {
        i.parentNode.removeChild(i);
      });
    },
    parent: function () {
      // Renvoie l'élément DOM parent du premier élément sélectionné
      this.items = [this.items[0].parentNode];
      return this;
    },
    attr: function (v) {
      // Renvoie la valeur d'un attribut du premier élément sélectionné
      return this.items[0].getAttribute(v);
    },
  };

  window.$ = function (selector) {
    return new dQuery(selector);
  };

})();
```

Et juste 105 lignes de code...

PS: J'ai aussi remplacé la propriété `.value` par `.items` qui me parait plus
"parlante".
