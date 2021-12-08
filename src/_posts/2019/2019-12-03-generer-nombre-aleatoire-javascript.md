---
date: 2019-12-03 12:13:15+200
layout: post
tags: javascript
title: "Générer un nombre aléatoire en JavaScript"
image: "/public/2019/xkcd-221.jpg"
excerpt: "Comment générer un nombre aléatoire en JavaScript, mais aussi comment utiliser le module 'seedrandom' pour rendre le hasard plus prévisible."
---

## La méthode "Math.random()"

<figure>
  <img src="{{ page.image }}" alt="random-number" />
  <figcaption>
    <a href="https://xkcd.com/221/">XKCD #221 - Random Number</a>
  </figcaption>
</figure>

Pour obtenir un nombre au hasard, il faut utiliser la fonction `Math.random()`
qui renvoie un pseudo nombre aléatoire qui est :

* supérieur ou égal à 0.0
* strictement inférieur à 1.0

Donc, si on veut obtenir un numéro de carte à jouer, soit un nombre entier entre
1 et 52, il faut :

* Multiplier le résultat de `Math.random()` par 52, ce qui nous donne un nombre
entre 0.0 et 51.999...
* Arrondir ce nombre à la valeur entière inférieure avec la fonction
`Math.floor()` pour avoir un entier entre 0 et 51 (compris)
* Ajouter 1 à cette valeur pour avoir un nombre entre 1 et 52

```
// Obtient un entier entre 1 et 52
const cardNumber = 1 + Math.floor(52 * Math.random());
```

Note: On parle de "pseudo" nombre aléatoire, parce que pour un ordinateur, ça
n'est pas facile de reproduire le hasard et qu'il est plus simple de simuler.


## Le module "Math.seedrandom()"

Pour changer du travail (C# / Oracle), j'ai créé il y a quelque temps un site de
jeux de solitaires, [Solitaire-Play](https://www.solitaire-play.com/), avec des
solitaires comme Klondike, Canfield, Freecell, Golf...

Chaque jeu dispose d'un système de conseils. Dans la plupart des cas, je me
contente de proposer les cartes qui sont jouables en fonction de la règle du
jeu. Mais dans le cas de Klondike Solitaire, j'ai essayé de faire un peu mieux
et d'avoir un algorithme qui "réflechisse" pour optimiser les chances de gagner.

Pour mettre au point et vérifier que ce que je développe a un impact positif,
j'ai un programme qui teste le taux de réussite des parties jouées en suivant
uniquement les conseils de mon programme.

Pour avoir des valeurs suffisament significatives, je teste les résultats pour
1000 parties. Le problème, c'est que par défaut, je n'obtiens jamais exactement
le même pourcentage de réussite à chaque fois que je lance un jeu de test. Ce
qui assez est "normal", puisque il s'agit à chaque fois de 1000 parties
totalement aléatoires.

J'ai donc cherché s'il était possible de "forcer" le hasard et que mes tests
portent toujours sur les mêmes 1000 parties. Ce qui me permettrait de mieux
évaluer les améliorations que j'apporte à mon système de conseils.

C'est ainsi que j'ai trouvé le package "[seedrandom.js](https://github.com/davidbau/seedrandom)"
de David Bau. Ce code permet de rendre "prévisible" le résultat de la méthode
`Math.random()`.

Comme dans mon cas je ne l'utilise que pour effectuer des tests, je me contente
d'appeler la fonction `Math.seedrandom("seed")` avant ma série de 1000 tests. Au
final, mon programme de test ressemble désormais au code suivant :

```
function Test_Run (seed) {
  if (seed) Math.seedrandom(seed);
  var play_count = 0;
  var win_count = 0;
  for (var i = 0; i < 1000; i++) {
    play_count++;
    Test_Run_One();
    if (game.state() > 0) win_count++;
  }
  console.log(play_count + " jeux => "
          + "{ gagnés: " + win_count
          + ", perdus: " + (play_count - win_count)
          + ", pourcentage: " + (Math.round(win_count * 1000 / play_count) / 10)
          + " }");
}
```

J'ai testé avec plusieurs valeurs pour "seed" et j'ai obtenu les résultats
suivants :

* Test_Run("michel") => 41% de parties gagnées
* Test_Run("hasard") => 41.2% de parties gagnées
* Test_Run("randomize") => 39.3 de parties gagnées

En faisant jouer mon système du mieux que je peux, je peux donc espérer gagner
4 parties sur 10. Ce qui est déjà pas mal pour de bêtes "if ... else". Et donc,
en utilisant la chaine "randomize" comme valeur d'initialisation, cela me
permettra de mieux voir les progrès accomplis par mon système de conseils, au
fur et à mesure que je le ferai évoluer. Le but étant bien entendu d'arriver au
minimum à un résultat de 50% de réussite...

{:.encart}
English version: [Generate a random number with JavaScript]({% post_url 2019-12-04-generate-random-number-javascript %}){:hreflang="en"}.
