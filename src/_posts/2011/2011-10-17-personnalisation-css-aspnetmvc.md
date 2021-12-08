---
date: 2011-10-17 20:25:00
layout: post
redirect_from: "post/2011/10/17/personnalisation-css-asp-net-mvc"
tags: html, mvc
title: "Personnalisation de la CSS pour ASP.NET MVC"
---

Ce billet est avant tout un pense-bête personnel pour noter les quelques
modifications que j'apporte assez régulièrement à la feuille de style fournie
par défaut quand on génère un nouveau projet ASP.NET MVC3 dans Visual
Studio.

En général, lorsque je débute un nouveau projet, j'ai tendance à conserver
la feuille de style telle que Visual Studio l'a créée. Puis quand je bloque sur
des fonctionnalités ou des problèmes techniques, je m'accorde un petit moment
de détente en adaptant "Site.css" pour essayer d'embellir mon
projet avant de repartir de plus belle.

![](/public/2011/mysite01.png)

## Normalize

Avant toute chose, et pour partir du bon pied, je démarre par un petit
[reset.css](http://meyerweb.com/eric/tools/css/reset/), ou ces derniers temps un [normalize.css](http://necolas.github.com/normalize.css/) dans
la vue _Layout.cshtml :

```
<head>
  ...
  <link href="@Url.Content("~/Content/normalize.css")" rel="stylesheet" type="text/css" />
  <link href="@Url.Content("~/Content/Site.css")" rel="stylesheet" type="text/css" />
  ...
</head>
```

## Undo

Comme j'aime très moyennement les coins arrondis, je commence par m'en
débarrasser. Ca m'amuse toujours de commencer de façon radicale en lançant un
rechercher / remplacer de `-radius` par `-no-radius`.
Cela me permet de venir à bout de `border-radius`,
`-moz-border-radius` et autre `-webkit-border-radius`.
Mais au final, je fais ça de façon plus civilisée en redéfinissant tous les
styles `xxxxx-border-radius` à 0.

```
/* Suppression des coinzarrondis */
#main,
footer,
#footer,
ul#menu li a
{
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
}
```

Il y a aussi l'effet d'ombre 3D sur le titre "My MVC
Application" que je trouve un peu lourd. Là encore, un rechercher /
remplacer à l'arrache de `-shadow` par `-no-shadow` ne
fait pas de mal. Ou plus proprement je redéfini le style
`text-shadow` de `header h1`.

```
/* Suppression de l'effet 3D sur le titre */
header h1,
#header h1
{
  text-shadow: 0 0 0 transparent;
}
```

## Font

Une fois défoulé, j'apporte encore quelques modifications encore plus
personnelles pour obtenir un résultat un peu plus à mon goût.

Comme je suis toujours dans ma période Century Gothic is Beautiful, c'est
elle qui gagne par rapport à la police "Trebuchet MS" utilisée par
défaut.

```
/* Utilisation de ma police de prédilection */
body
{
  font-family: "Century Gothic", "Trebuchet MS", Verdana, Helvetica, Sans-Serif;
}
```

## Color

Puis, même si j'aime beaucoup le bleu assez soutenu utilisé comme couleur de
fond, je le change pour une couleur plus claire et neutre.

Ensuite, je change les couleurs de titres au gré de l'humeur du jour ou des
"Oh, c'est quoi cette joli couleur" trouvés sur d'autres sites. Ou
plus simplement, c'est le titre général en chocolat, le titre de page en gris
clair et les sous-titre en vert.

Après, j'ai encore un problème avec le menu qui est bleuté par défaut parce
que je n'ai rien trouvé qui me plaise vraiment. Pour l'instant, je me contente
de le faire ressortir en le passant en blanc sur fond vert avec un effet
chocolat quand on passe la souris dessus.

```
/* Changement du jeu de couleurs */
body { background-color: #e0e0e0; } /* Un fond de page gris clair */
header h1, #header h1, h1 { color: #d2691e; } /* chocolat */
h2 { color: #888888; } /* gris */
h3 { color: #39b449; } /* vert */
ul#menu li a { color: #fff; background-color: #39b449; } /* Menu blanc/vert */
ul#menu li a:hover { background-color: #d2691e; } /* Et survolé en chocolat */
ul#menu { border-bottom: 0; } /* Tant qu'à faire */
```

## Table

Une fois zen, je pars à l'assaut des tables. Déjà c'est du n'importe quoi.
Pour éviter de m'emporter, je commence par un `table { width : 100%
}` pour qu'elles s'étalent par défaut sur toute la largeur de la
page.

```
/* Par défaut les tables occupent toute la largeur de la page */
table
{
  width: 100%;
}
```

Puis j'aère les cellules parce que ça sert à rien de se payer des 21 pouces
si c'est pour rester tout riquiqui et tassé.

```
/* Aération des cellules */
thead th,
tbody td,
tfoot th
{
  border: 1px dotted #aaa;
  padding: 0.5em;
  text-align: left;
  vertical-align: top;
}
```

En parlant de `thead` et autres, je me plonge dans toutes les
vues d'ores et déjà générées par défaut pour rajouter les balises
`<thead>` et `<tbody>` que Visual Studio
s'acharne à oublier. Y m'énerve ! C'est pourtant pas compliqué de
comprendre que :

* C'est quand même beaucoup plus simple à styler
* C'est bien plus pratique pour utiliser la plupart des plugins jQuery

Après ça, je peux facilement colorer les en-têtes et pieds de tables en
reprenant la couleur du menu d'onglets :

```
/* Redéfini les couleurs de l'en-tête et du pied des tables */
thead tr th,
tfoot tr th
{
  background-color: #3399ff;
  color: #fff;
}
```

Puis là, comme j'en ai rien à faire des vieux navigateurs, j'alterne la
couleur de fond des lignes avec du CSS3 et un fond moins blanc que blanc.

```
/* Alterne la couleur de fond des lignes d'une table */
tbody tr:nth-child(odd)
{
  background-color: #f0f0f0;
}
```

Pour continuer à animer et égayer un peu les tableaux, je fais mon petit
effet au passage de la souris en changeant la couleur de fond de la ligne pour
que ça pète un peu plus. Là aussi, la couleur dépend des jours et de
l'inspiration. Et aujourd'hui c'est jaune clair parce qu'il a l'avantage
d'avoir un petit effet orangé sur mon portable.

```
/* Ajoute un effet lors du survol d'une ligne */
tbody tr:hover
{
  background-color: #ffff80;
}
```

## Form

Là aussi, il y aurait pas mal à dire du choix du balisage. Le problème,
c'est que c'est tout un ensemble entre les helpers et le système de validation
alors c'est un peu compliqué et que je résiste encore pour conserver tel quel
le html généré par Visual Studio. Ce qui fait que je n'arrive pas à me fixer
sur quelque chose de "définitif". Enfin bref, y'a rien qui me plait pour
l'instant. A suivre donc…

![](/public/2011/mysite02.png)
