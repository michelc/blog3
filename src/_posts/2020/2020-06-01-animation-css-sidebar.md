---
date: 2020-06-01 17:35:16+200
layout: post
tags: css
title: "Animer une sidebar avec CSS"
image: "/public/2020/swing.jpg"
---

J'ai déjà réussi à faire un [template avec contenu + sidebar]({% post_url 2020-05-19-creer-template-sidebar-contenu %}), puis à [masquer la sidebar]({% post_url 2020-05-27-masquer-afficher-menu-lateral %}) assez simplement. Je vais maintenant voir comment améliorer le côté très basique de mes premiers essais grâce à quelques animations CSS et autres icônes.

<figure>
  <img src="{{ page.image }}" alt="balançoires" />
  <figcaption>
    <a href="https://unsplash.com/photos/HTCQCvwV9XY">Flying - ckturistando</a>
  </figcaption>
</figure>


## Animer le changement d'état

C'est tout simple, il suffit de compléter les styles de "sidebar" et "content" avec :

```css
transition: all 1s;
```

Il s'agit d'une propriété CSS qui en 1 seconde (pour avoir le temps de voir ce qui se passe) va animer le passage des valeurs CSS suivantes :

```css
#sidebar {
    display: block;
}
#content {
    width: calc(100% - 299px);
}
```

À ces nouvellles valeurs :

```css
.no-sidebar #sidebar {
    display: none;
}
.no-sidebar #content {
    width: 100%;
}
```

Maintenant, quand je vais cliquer sur le bouton "sidebar-toggle", le fait d'ajouter la classe "no-sidebar" à la div "wrapper" ne devrait pas immédiatement masquer la "sidebar" et élargir le "content". Cela devrait durer 1 seconde et se faire progressivement.

Ça marche du 1° coup ! A moitié...

Pour le "content", on le voit bien "bouger" quand on clique sur le bouton pour occuper toute la largeur de l'écran.

Par contre, la "sidebar" disparait ou apparait instantanément. C'est parce que le changement de la propriété "display" de "block" en "none" n'est pas pris en compte par les animations CSS :(

Il faut donc ruser et cacher "sidebar" en la sortant de l'écran. Pour cela, on lui met une marge négative égale à sa largeur :

```css
#sidebar {
    margin-left: 0;
}

.no-sidebar #sidebar {
    margin-left: -299px;
}
```

On peut alors accélérer l'animation (parce que sinon le *lorem ipsum dolor sit amet...* tangue et va finir par me rendre malade) :

```css
transition: all 0.25s;
```

Et ben c'est parfait pour moi.

Note : le `transition: all 0.25s` doit être défini 2 fois : une fois au niveau du CSS de "#sidebar" et une seconde fois pour le code CSS de "#content".


## Utiliser une icône pour basculer d'un état à l'autre

Finalement, je ne vais pas utiliser une icône mais un bête caractère avec un peu de CSS pour que cela ressemble à quelque chose.

Et comme je ne suis pas assez doué, je copie / colle tout depuis StackOverflow : [Style a link to be a circle with an arrow inside](https://stackoverflow.com/questions/22975037/style-a-link-to-be-a-circle-with-an-arrow-inside).

Je commence par remplacer le bouton par une balise `a` :

```html
<a href="#" id="sidebar-toggle"></a>
```

Puis j'ajoute le CSS :

```css
#sidebar-toggle {
    background-color: orange;
    border-radius: 50%;
    display: block;
    height: 2.2rem;
    left: -1.1rem;
    position: absolute;
    text-decoration: none;
    top: 7px;
    width: 2.2rem;
}
#sidebar-toggle::after {
    content: "🡐";
    color: white;
    display: block;
    font-size: 1.6rem;
    font-weight: bold;
    margin: -.2rem 0 0 0;
    text-align: center;
}
.no-sidebar #sidebar-toggle::after {
    content: "🡒";
    margin-left: .2rem;
}
#sidebar-toggle:hover {
    background-color: goldenrod;
}
```

Note : Pour les 2 flèches, j'ai pioché dans [Unicode Arrows](http://xahlee.info/comp/unicode_arrows.html).

Et voila, ça marche.

Pour friser la perfection, je n'ai plus qu'à positionner cette "icône" pile sur la tranche entre la "sidebar" et le "content" :

```css
#sidebar-toggle {
    position: absolute;
    left: -1.25rem;
    top: 7px;
}
```

Et penser à la masquer lors des impressions :

```css
@media print {
    #sidebar-toggle { display: none; }
}
```

Ça fera très bien l'affaire :)


## Démonstration

<script async src="//jsfiddle.net/qo6dx3w4/1/embed/result/"></script>

Bon, maintenant que j'ai à peu près le template que je voulais et même plus grâce à ces derniers ajouts, je vais pouvoir travailler pour de vrai et commencer à coder mon application...

{:.encart}
English version: [Sidebar animation with CSS]({% post_url 2020-06-02-sidebar-css-animation %}){:hreflang="en"}.
