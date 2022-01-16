---
date: 2022-01-16 10:26:09 +02:00
tags: [ javascript, jeux ]
title: Ajout d'icônes SVG à mon Wordle français
cover:
  image: /public/2022/lemot-wordle-fr.png
  link: https://www.solitaire-play.com/lemot/
  text: LeMOT - Un jeu de mot chaque jour
excerpt: Juste après avoir modifié mon Wordle en français pour utiliser des couleurs accessibles, j'ai pris un petit moment pour ajouter de véritables icônes SVG.
---

Juste après avoir modifié ma version de [Wordle en français](https://www.solitaire-play.com/lemot/) pour utiliser des couleurs accessibles, j'ai pris un petit moment pour ajouter de véritables icônes SVG.


## Mes premières "icônes"

Au départ, je m'étais contenté d'utiliser de simples caractères Ascii ou Unicode pour représenter les actions du jeu ou les touches du clavier :

* "?" pour le menu Aide
* "⚙" pour le menu paramétrage
* "↵" pour la touche Entrée
* "⌫" pour la touche Retour arrière

C'est simple, ça marche et comme jusqu'à présent j'ai rarement eu l'occasion d'utiliser des icônes au format SVG, c'était la solution la plus pratique pour créer **LeMOT** super rapidement.

![Les icônes d'origine](/public/2022/lemot-apres.png "Les «icônes» d'origine")

C'était pas mal, mais ça ne rendait pas pareil selon sur quoi on joue : un PC sous Windows, un téléphone, un iPhone, ... Et puis j'avais dû bidouiller du CSS pour réussir à donner un aspect "bouton" aux icônes du menu.

```css
.menu {
  background-color: #ddd;
  color: #fff;
  border-radius: 50%;
  font-size: 24px;
  width: 35px;
  height: 35px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.menu:hover {
  background-color: #bbb;
}
```


## Changement pour des icônes SVG

Malgré tout, j'avais prévu dès le début de regarder du côté des icônes SVG pour améliorer **LeMOT**. Comme j'avais sous le coude un certain nombre de jeux d'icônes SVG, j'ai cherché lequel conviendrait mieux.

* [Feather – Simply beautiful open source icons](https://feathericons.com/)
* [Vue Unicons – 1000+ Pixel-perfect svg icons](https://antonreshetov.github.io/vue-unicons/)
* [Iconoir – An Open-Source SVG Icons Library](https://iconoir.com/)
* [Heroicons – Beautiful hand-crafted SVG icons](https://heroicons.com/)
* [Phosphor Icons – A flexible icon family](https://phosphoricons.com/)

Même si au final ce ne sont pas les icônes que j'ai sélectionnées, je les ai listées ici parce qu'elles sont toutes très bien. Par contre j'ai eu quelquefois un problème pour trouver des icônes qui représentent les touches Entrée et Retour arrière. En plus, juste à ce moment-là, Josh Wardle avait ajouté une nouvelle icône dans le menu pour consulter les statistiques.

Et aussi, comme j'étais un peu impatient, j'ai eu un peu de mal à trouver des explications pour savoir comment les colorer ou les dimensionner.

Par chance, j'ai fini par tilter et j'ai repensé aux [icônes Bootstrap](https://icons.getbootstrap.com/) que j'utilise quelquefois sous forme de police d'icônes ! Et là, il y avait tout ce dont j'avais besoin et en plus elles étaient facilement personnalisables avec un peu de CSS.

Pour définir la couleur :

```css
svg {
  fill: green;
}
```

Pour les dimensionner :

```css
svg {
  height: 1.75em;
  width: 1.75em;
}
```

Cerise sur le gâteau, le fait d'utiliser l'unité de mesure "em" permet de les dimensionner proportionnellement à la taille de la police.

![Les icônes SVG](/public/2022/lemot-icones-svg.png "Les «icônes» SVG")


## Un problème de clic sur les icônes SVG

Comme il était tard et que je n'avais pas suffisamment (ou pas du tout ?) testé, ça a bugué :(

<blockquote class="twitter-tweet"><p lang="fr" dir="ltr"><a href="https://twitter.com/ms_michel?ref_src=twsrc%5Etfw">@ms_michel</a> hello je te signale un bug impossible d’effacer des lettres le jeu est planté</p>&mdash; Guillaume (@yomz) <a href="https://twitter.com/yomz/status/1481782505309192194?ref_src=twsrc%5Etfw">January 14, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Sur les téléphones, il n'était plus possible de revenir en arrière pour corriger une lettre ou de valider le mot saisi ! Tout ça parce que mon code se basait toujours sur les caractères Unicode "↵" et "⌫" pour détecter quelle touche avait été utilisée.

```js
  if (touche === "↵") {
    validerLigne();
  } else if (touche === "⌫") {
    retourArriere();
  }
```

Ou quelque chose dans le genre...

Qu'à cela ne tienne, je n'avais qu'à ajouter un `data-attribut` sur les 2 touches concernées et problème résolu !

Malheureusement, quand on clique sur un SVG, le `event.target` que donne l'évènement "click" ne correspond pas obligatoirement à l'élément DOM "button" qui représente la touche. Cela peut être l'élément "SVG" ou même l'élément "PATH" en fonction de l'endroit exact où on a cliqué...

*Note : Très certainement que sur un téléphone ça tombe toujours sur le "button" (à moins d'avoir un doigt super fin), mais autant ne rien laisser au hasard.*

Heureusement, c'est un problème bien connu que j'avais d'ailleurs déjà rencontré lors de mes précédents accrochages avec la délégation d'évènement. Dans son article "[Detecting click events on SVGs with vanilla JS event delegation](https://gomakethings.com/detecting-click-events-on-svgs-with-vanilla-js-event-delegation/)", Chris Ferdinandi donne deux solutions pour résoudre le problème.

Bien entendu, j'ai pris la solution la plus simple et j'ai ajouté un `pointer-events: none;` à mon fichier CSS.

Et c'est pour cela que maintenant, il est possible de [jouer à Wordle en français](https://www.solitaire-play.com/lemot/) sur un téléphone et avec de jolies icônes.
