---
date: 2021-12-10 17:47:47 +02:00
tags: [ css, html ]
title: "Comment créer un badge / avatar en CSS"
cover:
  image: /public/2021/systeme-bertillon.jpg
  link: https://fr.wikipedia.org/wiki/Bertillonnage
  text: Le Système Bertillon
excerpt: Ce n'est pas très compliqué, et en à peine 30 lignes de CSS et une pincée de flexbox on peut afficher des badges ou des avatars très corrects.
---

Il y a quelques temps, j'avais développé une petite application pour consulter plus facilement les tickets d'assistance qui m'étaient affectés. J'ai depuis laissé tombé ce programme, mais comme cela m'avait donné l'occasion de présenter les échanges sous forme de conversation, je sauvegarde ici comment j'affichais les badges pour identifier les utilisateurs.

Pour commencer, je défini un carré de 100px sur 100px auquel j'applique des coins arrondis grâce à la propriété `border-radius` à 50% pour que le carré devienne rond. Puis je colorie en vert pour que cela soit visible sur un fond blanc et j'ajoute une bordure argentée assez épaisse pour que cela ressorte encore mieux.

```html
<style>
  .badge {
    /* Un rond vert */
    height: 100px;
    width: 100px;
    border-radius: 50%;
    background-color: limegreen;
    border: 10px solid silver;
  }
</style>

<div class="badge"></div>
```

![](/public/2021/badge-01.png)

Ensuite, j'ajoute les initiales de la personne qui a écrit le ticket ou le commentaire, en blanc, en gros et en gras.

```html
<style>
  .badge {
    /* Un rond vert */
    height: 100px;
    width: 100px;
    border-radius: 50%;
    background-color: limegreen;
    border: 10px solid silver;
    /* Des initiales blanches */
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 55px;
    font-weight: bold;
  }
</style>

<div class="badge">AB</div>
```

![](/public/2021/badge-02.png)

Et il ne me reste plus qu'à centrer ces initiales horizontalement et verticalement. Heureusement, ça fait longtemps que d'autres collectionnent les solutions pour savoir [comment tout centrer avec CSS](https://css-tricks.com/centering-css-complete-guide/)...

J'utilise la méthode à base de flexbox :

```html
<style>
  .badge {
    /* Un rond vert */
    height: 100px;
    width: 100px;
    border-radius: 50%;
    background-color: limegreen;
    border: 10px solid silver;
    /* Des initiales blanches */
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 55px;
    font-weight: bold;
    /* Et centrées */
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
</style>

<div class="badge">AB</div>
```

![](/public/2021/badge-03.png)

A première vue, je dirais que c'est pas tout à fait au centre et que ça penche un peu vers le bas. Mais c'est super simple et ça répond très correctement à mon problème.

Dans l'application d'origine, j'avais aussi un bout de code côté serveur pour générer une couleur de fond en fonction du trigramme de la personne. Mais je vais laisser ça de côté pour l'instant.

Par contre, j'avais aussi géré la possibilité d'avoir des images à la place des initiales pour mieux faire ressortir certains utilisateurs dans les conversations. Pour ça, j'avais notamment utilisé des dessins de [Cameron Mark](https://www.instagram.com/cameronmarkart/) pour représenter les deux personnes responsables de l'assistance de niveau 1.

En faisant au plus simple, la modification nécessaire pour remplacer les initiales par une photo consiste en deux choses :

* Afficher l'image correspondant à la personne,
* Masquer les initiales devenues inutiles.

```html
<style>
  .badge {
    /* Un rond vert */
    height: 100px;
    width: 100px;
    border-radius: 50%;
    background-color: limegreen;
    border: 10px solid silver;
    /* Des initiales blanches */
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 55px;
    font-weight: bold;
    /* Et centrées */
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .badge-avatar {
    /* Cacher les initiales */
    color: transparent;
    /* Afficher l'image */
    background-image: url("https://blog.pagesd.info/public/2021/queen-of-hearts.png");
    background-position: center;
    background-size: cover;
  }
</style>

<div class="badge badge-avatar">AB</div>
```

La ligne `background-position: center` permet de s'assurer que l'image est bien centrée. Et avec `background-size: cover`, la photo est redimensionnée au mieux pour être aussi grande que possible (et donc remplir au mieux le badge), tout en conservant ses proportions. 

![](/public/2021/badge-04.png)

Pour donner un peu de vie à l'interface utilisateur, on peut animer le badge quand la souris survole l'élément qui le contient, en changeant la couleur de la bordure.

```css
  :hover > .badge {
    border-color: orange;
  }
```

C'est quasi-terminé. Dans la pratique, un badge de 100 pixels de large (sans compter les bordures de 10 pixels) ça prend pas mal de place. Et donc, pour pouvoir définir des badges de différentes tailles, j'utilise des [variables CSS](https://developer.mozilla.org/fr/docs/Web/CSS/Using_CSS_custom_properties) pour redéfinir la hauteur et la largeur du badge, mais aussi l'épaisseur de la bordure et la taille des caractères.

```html
<style>
  .badge-75 {
    --badge-size: 75px;
  }
  
  .badge-200 {
    --badge-size: 200px;
  }
  
  .badge {
    /* Un rond vert */
    height: var(--badge-size);
    width: var(--badge-size);
    border-radius: 50%;
    background-color: limegreen;
    border: calc(var(--badge-size) / 10) solid lightgray;
    /* Des initiales blanches */
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: calc(var(--badge-size) / 1.75);
    font-weight: bold;
    /* Et centrées */
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  
  .badge-avatar {
    /* Cacher les initiales */
    color: transparent;
    /* Afficher l'image */
    background-image: url("https://blog.pagesd.info/public/2021/queen-of-hearts.png");
    background-position: center;
    background-size: cover;
  }
</style>

<div class="badge badge-75">AB</div>
<div class="badge badge-200">CD</div>
<div class="badge badge-avatar badge-75">EF</div>
<div class="badge badge-avatar badge-200">GH</div>
```

Et voilà ! A peine 30 lignes de CSS pour un résultat très satisfaisant. Maintenant, si jamais j'en ai à nouveau besoin, je saurais où retrouver ça.

![](/public/2021/badge-05.png)

<div class="encart">

English version: {% goto_en "How to create a badge / avatar in CSS", "2021-12-11-create-badge-avatar-css" %}.

</div>
