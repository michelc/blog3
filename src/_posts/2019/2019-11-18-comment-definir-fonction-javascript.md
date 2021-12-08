---
date: 2019-11-18 12:31:14+200
layout: post
tags: javascript
title: "Comment définir une fonction JavaScript"
image: "/public/2019/butterfly-collection.jpg"
excerpt: "Pour moi essentiellement, un petit mémo sur les différentes façons de déclarer une fonction en JavaScript."
---

Comme j'ai toujours un peu de mal à me rappeler de tout et aussi parce qu'il y a
un petit côté collection que j'aime bien, voici un récapitulatif sommaire des
différentes façons qui existent pour définir des fonctions en JavaScript.

<figure>
  <img src="{{ page.image }}" alt="butterfly-collection" />
  <figcaption>
    <a href="https://unsplash.com/photos/X8pnAEjqmqI">Wall decorations with colorful butterflies - __ drz __</a>
  </figcaption>
</figure>

## Via une déclaration

La méthode classique date des origines de JavaScript et consiste simplement à
déclarer la fonction avec le mot-clé `function`.

```
function bonjour (prenom) {
  console.log(`Bonjour ${prenom}`);
}
```

Cette fonction a comme nom "bonjour", ce qui en fait une fonction nommée.


## Via une expression

Une méthode un peu plus moderne qui met en évidence le fait que les fonctions
sont des objets comme les autres et qu'elles peuvent elles aussi être affectées
à des variables.

```
const bonjour = function (prenom) {
  console.log(`Bonjour ${prenom}`);
};
```

Même si cela ne se remarque pas, la fonction est anonyme :

* Elle est créée sans lui donner de nom (juste "function (...) { ... }")
* Elle est affectée à une variable qui elle a un nom

Note : Comme il s'agit d'une affectation à une variable (en l'occurrence on lui
affecte une fonction), la commande se termine par un point-virgule, exactement
comme c'est le cas pour toutes les autres affectations : `const pi = 3.14;`.


## Via la syntaxe arrow

Avec ES6 est apparu une nouvelle syntaxe "arrow" pour déclarer les fonctions via
une expression :

* Suppression du mot-clé `function` devant la liste des arguments.
* Ajout du symbole `=>` après cette liste.

```
const bonjour = (prenom) => {
  console.log(`Bonjour ${prenom}`);
};
```

C'est plus compact et le but est d'obtenir ainsi un code plus clair. C'est
pourquoi les fonctions arrows peuvent encore être simplifiées :

* Un seul paramètre => pas besoin de le mettre entre parenthèses.
* Une seule ligne de code dans la fonction => pas besoin d'un bloc "{ ... }".
* Si la fonction ne fait qu'un "return ..." => le mot-clé `return` est inutile.

Au final, les trois expressions suivantes sont identiques :

```
const bonjour1 = function (prenom) {
  return `Bonjour ${prenom}`;
};

const bonjour2 = (prenom) => {
  return `Bonjour ${prenom}`;
};

const bonjour3 = prenom => `Bonjour ${prenom}`; // (°~°)
```

Ce côté épuré est particulièrement utile dans le cas des callbacks. Par exemple,
avec la méthode `.map()` des tableaux qui attend une fonction callback, on peut
arriver à des trucs intéressants :

```
const test = [1, 2, 3];

function doubler (x) {
  return x * 2;
}
test.map(doubler);                          // [2, 4, 6]

test.map(function (x) { return x * 2; });   // [2, 4, 6]

test.map((x) => { return x * 2; });         // [2, 4, 6]

test.map(x => x * 2);                       // [2, 4, 6] Bingo !
```

{:.encart}
English version: [How to define a JavaScript function]({% post_url 2019-11-19-how-to-define-javascript-function %}){:hreflang="en"}.
