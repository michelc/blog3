---
date: 2020-01-27 19:04:18+200
layout: post
tags: livres
title: "Waouh ! La scrollbar de Firefox est magique"
image: "/public/2020/firefox-scrollbar-color.jpg"
excerpt: "Avec Firefox, la barre de défilement de mes jeux Solitaire-Play est dans les tons «vert», comme le reste du site, et je ne sais pas pourquoi..."
---

Il me semble. Je reviens de mon site [Solitaire-Play](https://www.solitaire-play.com/) et je viens de m'apercevoir que la barre de l'ascenseur vertical est "verte", ce qui est la couleur dominante de tout jeux de solitaire qui se respecte :)

<figure>
  <img src="{{ page.image }}" alt="firefox-scrollbar-color" />
  <figcaption>
    <a href="https://www.solitaire-play.com/klondike-turn-three/">L'ascenseur est vert !</a>
  </figcaption>
</figure>

Je vérifie dans Chrome et là, la barre est "grise" comme à l'habitude. J'ai beau chercher, et je ne trouve rien qui explique ce comportement.

Selon [MDN web docs](https://developer.mozilla.org/fr/docs/Web/CSS/scrollbar-color), il est possible de définir la définir la couleur utilisée pour la barre de défilement avec la propriété expérimentale `scrollbar-color` :

```css
scrollbar-color: auto | dark | light | <color> <color>;
```

Et pour définir quelle couleur utiliser, on dispose des valeurs suivantes :

* `auto` => utilise le rendu par défaut du système pour la piste de la barre de défilement si aucune autre couleur n'est indiquée pour la mise en forme CSS de la barre de défilement (le "gris" dans mon cas)
* `dark` => affiche une barre de défilement sombre. Ce peut être la variante sombre fournie par le système sous-jacent ou une barre de défilement personnalisée avec des couleurs sombres
* `light` => affiche une barre de défilement claire. Ce peut être la variante claire fournie par le système sous-jacent ou une barre de défilement personnalisée avec des couleurs claires
* `<color> <color>` => les deux couleurs à appliquer ("jaune" et magenta" par exemple...)

Donc pas de valeur `magic` pour demander au navigateur d'utiliser des couleurs qui s'harmonisent avec la couleur générale du site...

Surtout, je n'ai aucune propriété `scrollbar` ou `scrollbar-color` dans mon CSS et rien de redéfini dans le "normalize.css" que j'utilise.

Comme je n'ai pas encore mis en place de fichier "manifest.json", je n'ai pas nom plus de propriété "theme_color" qui aurait pu lui mettre la puce à l'oreille.

Pour l'instant, je vais ranger ça dans la case des bénéfices qu'il y a à passer de Chrome à Firefox. Nous ne voyons pas d'autre explication...

{:.encart}
English version: [Hey! Firefox scrollbar-color is magical]({% post_url 2020-01-29-firefox-magic-scrollbar-color %}){:hreflang="en"}.
