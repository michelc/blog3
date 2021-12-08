---
date: 2019-05-07 15:04:36
layout: post
tags: javascript, jquery
title: "dQuery - Une version compatible IE9 / ES5"
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

Pour l'instant, je m'accorde encore le besoin d'être compatible avec IE9, et
par conséquent EcmaScript 5.

Il est certain qu'aujourd'hui, ce n'est pas franchement indispensable. Mais je
me dis qu'il y a bien quelques joueurs en entreprises qui doivent se coltiner un
PC avec IE9 pour faire tourner de vieilles applications intranet que personne ne
veut mettre à jour...

Et puis surtout, le côté "challenge" me donne l'occasion de "mieux" étudier et
maitriser le code que je fais (j'espère).

Quoiqu'il en soit, étant donné la taille de [NanoJS](https://github.com/vladocar/nanoJS/),
il n'y a franchement rien d'insurmontable à assurer un maximum de compatibilité
avec le navigateur Internet Explorer 9.

Premier truc, dans NanoJS, la méthode `.removeClass()` ne fonctionne que si la
propriété `.classList` existe (donc pas IE9). Alors que la méthode `.addClass()`
gère ça et passe par la propriété `.className` (connue de IE9) si besoin.

Donc une méthode `.removeClass()` basée que la propriété `.className` quand
nécessaire :

```
removeClass: function (v) {
  return this.each(function (i) {
    if (i.classList) {
      i.classList.remove(v);
    } else {
      i.className = i.className.replace(" " + v, "");
    }
  });
},
```

Ou mieux, avec une expression régulière copiée / collée d'internet :

```
removeClass: function (v) {
  return this.each(function (i) {
    if (i.classList) {
      i.classList.remove(v);
    } else {
      i.className = i.className.replace(new RegExp(v + " *", "g"), "");
    }
  });
},
```

Puis un truc facile. La propriété `.innerText` n'est pas "standard" et il est
préférable d'employer `.textContent` (ce n'est pas vraiment un problème lié à
IE9, mais plutôt avec les vieux Firefox) :

```
text: function (v) {
  return this.each(function (i) {
    i.textContent = v;
  });
},
```

Pour la méthode `.css(propriété, valeur)`, les propriétés snake-case posent
problème :

* `element.style["background-color"] = "red"` => KO
* `element.style["backgroundColor"] = "red"` => OK

Il suffit donc de transformer le libellé des propriétés snake-case en
camel-case :

```
css: function (a, v) {
  a = a.replace(/(\-\w)/g, function(m) { return m[1].toUpperCase(); });
  return this.each(function (i) {
    i.style[a] = v;
  });
},
```

Pour finir, je me suis débarrassé du seul `$("#win").is(":visible")` dont
j'avais besoin dans mes sources. J'ai remplacé ça par du code basé non plus sur
le résultat (est-ce que l'écran de réussite est visible) mais sur le fait que la
partie était gagnée ou pas (`game.state !== 0`). Ce qui m'a permis de supprimer
la méthode `.is(...)` qui était quelque peu frauduleuse :

```
is: function (v) {
  // Toujours $(..).is(":visible")
  return this.value[0].offsetParent !== null;
},
```

Ce n'était vraiment pas compliqué, et au final ma version source "arrangée" de
NanoJS est la suivante :

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
      a = a.replace(/(\-\w)/g, function(m) { return m[1].toUpperCase(); });
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
        if (i.classList) {
          i.classList.remove(v);
        } else {
          i.className = i.className.replace(new RegExp(v + " *", "g"), "");
        }
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
        i.textContent = v;
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
  };

  window.$ = function (selector) {
    return new nano(selector);
  };

})();
```

Et toujours moins de 100 lignes de code !
