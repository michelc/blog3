---
date: 2019-09-30 12:23:34
layout: post
tags: javascript, jquery
title: "Rechercher et filtrer une table en JavaScript"
image: "/public/2019/filter-table-js.jpg"
excerpt: "Comment faire une recherche et filtrer le contenu d'une table HTML en JavaScript. Depuis le script trouvé sur codepen.io et après quelques explications arrive à une version finale légèrement retravaillée."
---

Il y a quelque temps, j'ai eu besoin de proposer une recherche simple dans un
tableau. Normalement, je préfère le bon vieux `Ctrl+F` mais ça ne plaît pas à
tout le monde (et aussi le but était plus de limiter l'affichage aux seules
lignes trouvées, ce que ne permet pas la recherche de Chrome).

<figure>
  <img src="{{ page.image }}" alt="filtrer-table-js" />
  <figcaption>
    <a href="https://www.harborfreight.com/4-piece-funnel-set-744.html">Ensemble d'entonnoir 4 pièces + JavaScript</a>
  </figcaption>
</figure>

Comme mon site n'utilisait pas encore jQuery, j'ai cherché un petit truc tout
fait en Vanilla JS et j'ai trouvé un exemple très simple et facilement
compréhensible avec une démonstration sur
[codepen.io](https://codepen.io/priyankamalviya/pen/zzWZEa).


## Le script de départ

Tout d'abord, le script tel que développé par
[Priyanka Malviya](https://twitter.com/priyankamalvi18) avant d'expliquer ce que
ça fait et comment.

```
(function() {
  'use strict';

  var TableFilter = (function() {
    var Arr = Array.prototype;
    var input;

    function onInputEvent(e) {
      input = e.target;
      var table1 = document.getElementsByClassName(input.getAttribute('data-table'));
      Arr.forEach.call(table1, function(table) {
        Arr.forEach.call(table.tBodies, function(tbody) {
          Arr.forEach.call(tbody.rows, filter);
        });
      });
    }

    function filter(row) {
      var text = row.textContent.toLowerCase();
      var val = input.value.toLowerCase();
      row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
    }

    return {
      init: function() {
        var inputs = document.getElementsByClassName('table-filter');
        Arr.forEach.call(inputs, function(input) {
          input.oninput = onInputEvent;
        });
      }
    };

  })();

 TableFilter.init();
})();
```

## Comment ça marche ?

Pour pouvoir utiliser ce code, il faut ajouter à la page une zone de saisie en
la décorant avec la classe "table-filter" :

```
<p>
  Filtrer : <input type="text" class="table-filter" data-table="livres">
</p>
...
<table class="livres">
  ...
</table>
...
<script src="/scripts/js-table-filter.js"></script>

```

La classe "table-filter" du contrôle `<input ...>` sert à indiquer que cette
zone de saisie est destinée à filtrer le contenu d'une table.

L'attribut "data-table" permer de définir le nom de la classe correspondant à la
table devant être filtrée, ici la table HTML avec la classe "livres".

Le script "js-table-filter.js" lance directement la fonction
`TableFilter.init()` qui recherche toutes les balises avec la classe
"table-filter" et applique à chacune d'elle la fonction
`TableFilter.onInputEvent` sur son évènement `oninput`. Le cas échéant, le
système permet donc d'avoir plusieurs tables avec chacune sa zone de saisie pour
filtrer son contenu :

```
init: function() {
  var inputs = document.getElementsByClassName('table-filter');
  Arr.forEach.call(inputs, function(input) {
    input.oninput = onInputEvent;
  });
}
```

Cet évènement se déclenche donc dès que l'utilisateur saisi ou modifie le texte
dans la zone de recherche. Il exécute la fonction `onInputEvent` associée à cet
évènement lors de l'initialisation.

Cette fonction `onInputEvent` va effectuer la recherche en testant toutes les
lignes existantes dans la table :

* stocke la zone de saisie ayant déclenché l'évènement `oninput` (ie
"event.target") dans la variable "input"
* retrouve la classe de la table à filtrer à partir de l'attribut "data-table"
de cette zone de saisie
* recherche toutes les tables ayant cette classe CSS
* boucle sur chacune de ces tables, puis pour chaque table, sur chacun de ses
blocs de type `<tbody>`, puis pour chaque "body", sur chacune de ses lignes
`<tr>`, et applique la fonction `TableFilter.filter` sur celles-ci.

```
function onInputEvent(e) {
  input = e.target;
  var table1 = document.getElementsByClassName(input.getAttribute('data-table'));
  Arr.forEach.call(table1, function(table) {
    Arr.forEach.call(table.tBodies, function(tbody) {
      Arr.forEach.call(tbody.rows, filter);
    });
  });
}
```

La fonction `filter()` sert pour filtrer les lignes de la table. Elle va
afficher ou cacher une ligne selon que la recherche est positive ou pas :

* stocke le contenu "textuel" et en minuscule de la ligne dans la variable
locale "text"
* stocke le texte à rechercher en minuscule dans la variable locale "val"
* affiche la ligne `<tr>` quand elle contient le texte recherché
* cache le ligne `<tr>` si elle ne contient pas le texte recherché

```
function filter(row) {
  var text = row.textContent.toLowerCase();
  var val = input.value.toLowerCase();
  row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
}
```

Le fait de cacher / afficher une ligne se fait via la propriété CSS `display`
que l'on défini selon le cas à "none" ou "table-row".


## 1° modification : prise en main

Après avoir étudié le fonctionnement de ces quelques lignes, j'ai procédé à une
très petite modification qui m'a permis de bien comprendre comment fonctionnait
le code.

```
(function () {
  "use strict";

  var TableFilter = (function () {
    var Arr = Array.prototype;
    var search;

    function onInputEvent(e) {
      search = e.target.value.toLowerCase();
      var tables = document.getElementsByClassName(e.target.getAttribute("data-table"));
      Arr.forEach.call(tables, function (table) {
        Arr.forEach.call(table.tBodies, function (tbody) {
          Arr.forEach.call(tbody.rows, filter);
        });
      });
    }

    function filter(row) {
      var text = row.textContent.toLowerCase();
      row.style.display = text.indexOf(search) === -1 ? "none" : "table-row";
    }

    return {
      init: function () {
        var inputs = document.getElementsByClassName("table-filter");
        Arr.forEach.call(inputs, function (input) {
          input.oninput = onInputEvent;
        });
      }
    };

  })();

  TableFilter.init();
})();
```

Outre la transformation des apostrophes en guillemets (je préfère), j'ai
remplacé la variable "input" qui stocke le contrôle de saisie par une variable
"search" qui stocke uniquement le texte à rechercher après l'avoir transformé
en minuscule.

Avantages :

* Stockage d'une simple variable de type texte plutôt qu'un objet "DOM".
* Le texte à rechercher n'est plus transformé en minuscule à chaque ligne testée.


## 2° modification : une petite amélioration

Mon tableau affiche une liste de livres. Le système de filtre fonctionne à
merveille : je peux taper quelques trucs et le tableau ne présente plus que les
livres qui correspondent à la recherche.

On peut cliquer sur une des lignes du tableau et cela envoie vers une page de
détail qui affiche plus d'informations sur le livre sélectionné.

Mais bizarement, quand on revient en arrière via le navigateur, on retrouve la
liste avec le filtre pré-rempli mais pas appliqué : toutes les lignes du tableau
sont visibles...

Il faut donc trouver un truc pour ré-activer la recherche dès lors que la zone
de saisie est pré-remplie. C'est vraiment pas compliqué et il suffit de
déclencher l'évènement `oninput` si la zone de saisie n'est pas vide :

```
init: function() {
  var inputs = document.getElementsByClassName('table-filter');
  Arr.forEach.call(inputs, function(input) {
    input.oninput = onInputEvent;
    if (input.value !== "") input.oninput({ target: input });
  });
}
```

La ligne `if (input.value !== "") input.oninput({ target: input });` teste si la
zone de saisie n'est pas vide, et si c'est le cas, déclenche l'évènement en
lui passant la zone de saisie en cours.


## 3° modification : un peu de modernité

Une fois que je procrastinais, j'ai décidé de remplacer les
`document.getElementsByClassName()` par des `document.querySelectorAll()`
vachement plus modernes et au passage d'en profiter pour simplifier les
différentes sélections.

J'ai commencé par créer une fonction `TableFilter.dquery()` pour standardiser la
façon d'utiliser `querySelectorAll()` et en récupérer un tableau :

```
function dquery(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector));
}
```

Note : C'est du copier / coller de ma mini-librairie JavaScript [dQuery]({% post_url 2019-04-30-dquery-remplacer-jquery %}).

J'ai alors pu modifier la façon de sélectionner les zones de saisie concernées :

```
// AVANT
var inputs = document.getElementsByClassName("table-filter");
Arr.forEach.call(inputs, function (input) { ... });

// APRES
var inputs = dquery(".table-filter");
[].forEach.call(inputs, function (input) { ... });
```

J'ai surtout pu faire évoluer la façon de boucler sur les lignes de la table :

```
var tables = document.getElementsByClassName(e.target.getAttribute("data-table"));
Arr.forEach.call(tables, function (table) {
  Arr.forEach.call(table.tBodies, function (tbody) {
    Arr.forEach.call(tbody.rows, filter);
  });
});
```

qui est devenu :

```
var lignes = dquery(e.target.getAttribute("data-table") + " tbody tr");
[].forEach.call(lignes, filter);
```

Note : L'attribut "data-table" qui contenait jusqu'à présent "livres" (un nom de
classe qui était attendu par `.getElementsByClassName()`) doit désormais être
modifié en ".livres" (un sélecteur CSS qui est destiné à `.querySelectorAll()`).


## 4° modification : une légère optimisation

A chaque fois qu'on déclenche une recherche, toutes les lignes de la table sont
transformées en minuscule pour pouvoir effectuer la comparaison... Supposons que
j'ai une petite table avec 200 livres, si je veux filtrer sur les éléments qui
contiennent le mot "CHAT", je fais :

* 200 transformations en minuscule quand je tape "C"
* \+ 200 transformations en minuscule quand j'ajoute "H"
* \+ 200 transformations en minuscule quand j'ajoute "A"
* \+ 200 transformations en minuscule quand j'ajoute "T"

C'est bête. J'ai donc mis en cache le contenu "textuel" de la ligne après
l'avoir transformé en minuscule pour "gagner" un peu de temps :

```
if (!row.lowerTextContent) {
  row.lowerTextContent = row.textContent.toLowerCase();
}
row.style.display = row.lowerTextContent.indexOf(search) === -1 ? "none" : "table-row";
```

Note : Vu la taille des tableaux sur lesquels j'utilise "js-table-filter.js",
c'est plus par sens du détail que pour une réelle optimisation.


## 5° modification : une fonctionnalité de plus

Ce coup-ci, j'ai fait une modification un peu plus utile. Le titre de la table
est "Liste des livres", suivi du nombre de livres entre parenthèses.

```
<h2>Liste des livres (<%= model.length %>)</h2>
<p>
  Filtrer : <input type="text" class="table-filter" data-table=".livres">
</p>
...
<table class="livres">
  ...
</table>
```

Et quand on filtre le contenu de la table, ce compteur ne bouge pas puisqu'il
est initialisé côté serveur et qu'il correspond au nombre total de lignes dans
la table, qu'elles soient affichées ou cachées...

J'ai donc complété le code existant pour mettre à jour ce compteur au fur et à
mesure qu'on filtre les données :

```
...
[].forEach.call(lignes, filter);
var writer = input.getAttribute("data-count");
if (writer) {
  var count = rows.reduce(function (t, x) { return t + (x.style.display === "none" ? 0 : 1); }, 0);
  dquery(writer)[0].textContent = count;
}
```

Pour que ça marche, il faut ajouter un attribut "data-count" à la zone de saisie
pour identifier où afficher le nombre de lignes. Et bien entendu, ajouter une
balise correspondant à cet attribut, soit `<span id="count">...</span>` dans
l'exemple ci-dessous :

```
<h2>Liste des livres (<span id="count"><%= model.length %></span>)
<p>
  Filtrer : <input type="text" class="table-filter" data-table=".livres" data-count="#count">
</p>
...
```

Note : Si l'attribut "data-count" n'existe pas, alors le test `if (writer)
{ ... }` permet d'éviter de chercher à compter les lignes dans ce cas.


## 6° modification : simplifications

A cette occasion, on peut aussi remarquer que la classe "table-filter" n'est
pas vraiment indispensable. On peut aussi bien se baser sur la présence de
l'attribut "data-table" pour déterminer quels sont les contrôles de saisie
destinés à effectuer une recherche.

Ce qui donne côté HTML :

```
<p>
  Filtrer : <input type="text" data-table=".livres" data-count="#count">
</p>
```

Et côté JavaScript :

```
// AVANT
var inputs = dquery(".table-filter");
[].forEach.call(inputs, function (input) { ... });

// APRES
var inputs = dquery("input[data-table]");
[].forEach.call(inputs, function (input) { ... });
```


## Le fichier "js-table-filter.js" à ce jour

Voilà où j'en suis (en attendant de travailler à une recherche et un filtrage
sans tenir compte des accents). Et avec quelques commentaires, le code est
toujours aussi court et simple :

```
// Vanilla JS table filter
// Source: https://blog.pagesd.info/2019/09/30/rechercher-filtrer-table-javascript/

(function () {
  "use strict";

  var TableFilter = (function () {
    var search;

    function dquery(selector) {
      // Renvoie un tableau des éléments correspondant au sélecteur
      return Array.prototype.slice.call(document.querySelectorAll(selector));
    }

    function onInputEvent(e) {
      // Récupère le texte à rechercher
      var input = e.target;
      search = input.value.toLocaleLowerCase();
      // Retrouve les lignes où effectuer la recherche
      // (l'attribut data-table de l'input sert à identifier la table à filtrer)
      var selector = input.getAttribute("data-table") + " tbody tr";
      var rows = dquery(selector);
      // Recherche le texte demandé sur les lignes du tableau
      [].forEach.call(rows, filter);
      // Mise à jour du compteur de ligne (s'il y en a un de défini)
      // (l'attribut data-count de l'input sert à identifier l'élément où afficher le compteur)
      var writer = input.getAttribute("data-count");
      if (writer) {
        // S'il existe un attribut data-count, on compte les lignes visibles
        var count = rows.reduce(function (t, x) { return t + (x.style.display === "none" ? 0 : 1); }, 0);
        // Puis on affiche le compteur
        dquery(writer)[0].textContent = count;
      }
    }

    function filter(row) {
      // Mise en cache de la ligne en minuscule
      if (row.lowerTextContent === undefined)
        row.lowerTextContent = row.textContent.toLocaleLowerCase();
      // Masque la ligne si elle ne contient pas le texte recherché
      row.style.display = row.lowerTextContent.indexOf(search) === -1 ? "none" : "table-row";
    }

    return {
      init: function () {
        // Liste des champs de saisie avec un attribut data-table
        var inputs = dquery("input[data-table]");
        [].forEach.call(inputs, function (input) {
          // Déclenche la recherche dès qu'on saisi un filtre de recherche
          input.oninput = onInputEvent;
          // Si on a déjà une valeur (suite à navigation arrière), on relance la recherche
          if (input.value !== "") input.oninput({ target: input });
        });
      }
    };

  })();

  TableFilter.init();
})();
```

En bonus, la partie HTML toute prête, pour quand j'ajoute ça à un un template sous
Bootstrap 4 :

```
<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="filter">Filtrer</span>
  </div>
  <input type="text" class="form-control" data-table="table" data-count="#count" placeholder="Texte pour filtrer..." aria-label="Filtre" aria-describedby="filter">
</div>
```

{:.encart}
English version: [Search and filter a table with JavaScript]({% post_url 2019-10-01-search-filter-table-javascript %}){:hreflang="en"}.
