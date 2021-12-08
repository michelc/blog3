---
date: 2019-12-09 12:24:10+200
layout: post
tags: javascript, bootstrap
title: "Gérer le menu hamburger de Bootstrap 4 en Vanilla JS"
image: "/public/2019/hamburger-menu.jpg"
excerpt: "Bootstrap 4 c'est super pour le côté responsive, mais 57 ko de JavaScript juste pour gérer le menu hamburger, c'est trop."
---

## Présentation

J'ai développé il y a quelque temps une petite application en ASP.NET MVC pour
laquelle j'ai déjà eu besoin de [filtrer les tables en JavaScript]({% post_url
2019-09-30-rechercher-filtrer-table-javascript %}).

<figure>
  <img src="{{ page.image }}" alt="hamburger-menu" />
  <figcaption>
    <a href="https://unsplash.com/photos/Nb_Q-M3Cdzg">Hamburger with a beer - Edward Franklin</a>
  </figcaption>
</figure>

Ce site utilise Bootstrap 4, ce qui me permet d'avoir un résultat totalement
responsive sans trop d'efforts. En particulier la barre de navigation qui
s'affiche en totalité lorsqu'il y a assez de place ou bien est remplacée par un
menu "hamburger" sur les écrans plus petits.

Ce résultat est obtenu très simplement par le code standard de Bootstrap pour
réaliser une barre de navigation :

```html
<nav class="navbar navbar-expand-lg">
  <a class="navbar-brand" href="/">Accueil</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="/un">Un</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/deux">Deux</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/trois">Trois</a>
      </li>
    </ul>
  </div>
</nav>
```

Sous Windows, la barre de navigation est affichée avec les entrées "Accueil",
"Un", "Deux" et "Trois". En émulant un smartphone, seul le menu "Accueil"
apparait avec à côté une "icone" hamburger. En cliquant sur celle-ci, cela fait
apparaître un sous-menu avec les choix "Un", "Deux" et "Trois".

Le fait d'avoir cliqué sur le menu hamburger a pour effet de modifier la balise
`div#navbarSupportedContent` et de lui ajouter une classe "show" (après une très
légère animation).

```html
<div class="collapse navbar-collapse show" id="navbarSupportedContent">
  ...
</div>
```

Et si on re-clique sur le menu hamburger, le sous-menu disparait à nouveau parce
que la `div#navbarSupportedContent` perd sa classe "show" :

```html
<div class="collapse navbar-collapse" id="navbarSupportedContent">
  ...
</div>
```


## Le problème qu'il y a

Pour l'instant, c'est la seule fonctionnalité de Bootstrap que j'utilise dans
cette application et qui ait besoin du script "bootstrap.min.js". Mais malgré
tout, uniquement pour cette fonctionnalité somme toute assez ridicule, je suis
obligé d'embarquer 2 scripts sur toutes mes pages :

* jquery-3.4.1.min.js (87 ko)
* bootstrap.min.js (57 ko)

C'est un peu du gaspillage...

Dans la pratique, j'ai besoin de jQuery, mais uniquement sur les formulaires de
saisie, parce que comme c'est une appication ASP.NET MVC, je reste classique et
j'utilise le plugin [jQuery Validation](https://jqueryvalidation.org/). Mais je
trouve que c'est pas très écologique de le charger sur toutes les pages sous
prétexte que c'est plus simple et que de toute façon il est en cache au bout
d'un moment. Sans parler des 57 ko de "bootstrap.min.js" qui lui ne me sert
strictement à rien d'autre qu'au menu hamburger...


## La solution (à base de jQuery)

C'est pourquoi j'ai décidé d'écrire mon propre script "navbar-toggler.js".

```javascript
$("button.navbar-toggler").on("click", function(e) {
  var target = $(this).data("target");
  $(target).toggleClass("show");
});
```

Et c'est tout :

* `$("button.navbar-toggler")` retrouve le bouton servant à switcher le sous-menu
* `.on("click", ...)` sert à gérer le clic sur ce bouton
* `$(this)` retrouve le bouton cliqué
* `.data("target")` retrouve la valeur de son attribut "data-target" (soit
"#navbarSupportedContent" dans notre cas)
* `$(target)` retrouve la div contenant le sous-menu
* `.toggleClass("show")` ajoute ou enlève la classe "show" de cette div, ce qui
permet de l'afficher ou de la masquer

J'aurai pu me contenter d'un `$("#navbarSupportedContent").toggleClass("show")`
puisque la valeur de "data-target" ne changera jamais, mais puisque l'attribut
est défini, autant l'utiliser...

Ce qui est important, c'est que je n'ai pas "fabriqué" un nouveau système de
menu hamburger ou quoique ce soit d'autre. J'utilise simplement toute la partie
HTML et CSS que Bootstrap 4 offre à ce sujet. Je bénéficie ainsi de tout le côté
responsive qui va avec cette barre de navigation et qui convient parfaitement.

Bonus : J'ai perdu la partie animation à l'affichage ou au masquage du menu
hamburger, mais ça c'est meilleur pour ma tension.


## La même solution (en Vanilla JS)

Pour être parfait, ce mini script ne devrait même pas compter sur jQuery. C'est
donc ce à quoi je vais m'attaquer maintenant.

```javascript
document.querySelectorAll("button.navbar-toggler")[0].addEventListener("click", function (event) {
  var target = this.getAttribute("data-target");
  var subbar = document.querySelectorAll(data_target)[0];
  subbar.className = (subbar.className + " show").replace(/ show show/, "");
});
```

C'est quasiment pareil !

* `document.querySelectorAll("button.navbar-toggler")[0]` retrouve le bouton
servant à switcher le sous-menu
* `.addEventListener("click", ...)` sert à gérer le clic sur ce bouton
* `this` retrouve le bouton cliqué
* `.getAttribute("target")` retrouve la valeur de son attribut "data-target"
* `document.querySelectorAll(data_target)[0]` retrouve la div contenant le sous-menu
* `(subbar.className + " show").replace(/ show show/, "")` ajoute ou enlève la
classe "show" de cette div, ce qui permet de l'afficher ou de la masquer


## Le fichier "js-navbar-toggler.js" final

Ce qui donne le fichier source suivant, prêt à être intégré via un `<script
src="/js/js-navbar-toggler.js"></script>` :

```javascript
// Vanilla JS navbar toggler for Bootstrap 4
// Source: https://blog.pagesd.info/2019/12/09/gerer-menu-hamburger-bootstrap-vanilla-js

(function () {
  "use strict";

  document.querySelectorAll("button.navbar-toggler")[0].addEventListener("click", function (event) {
    var target = this.getAttribute("data-target");
    var subbar = document.querySelectorAll(target)[0];
    subbar.className = (subbar.className + " show").replace(/ show show/, "");
  });

})();
```

{:.encart}
English version: [Switch Bootstrap 4 hamburger menu with Vanilla JS]({% post_url 2019-12-10-bootstrap-hamburger-menu-vanilla-js %}){:hreflang="en"}.
