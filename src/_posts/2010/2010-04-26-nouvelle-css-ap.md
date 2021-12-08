---
date: 2010-04-26 19:35:00
layout: post
redirect_from: "post/2010/04/26/nouvelle-css-pour-ap"
tags: ap, html
title: "Nouvelle CSS pour AP"
---

Ca fait une éternité que j'ai envie de donner un coup de jeune à la charte
graphique de [07 Ardèche](http://07-ardeche.com/) qui
date des tous premiers jours du site et qui n'a quasiment jamais évolué depuis,
si ce n'est pour gérer de plus en plus de trucs.

L'idéal ça aurait été de la remplacer complètement, mais ça demande beaucoup
de travail. Et à chaque fois que j'essaie de m'y mettre, je n'ai pas
suffisamment de temps libre pour m'occuper de tous les aspects du site, ce qui
fait que malgré plusieurs démarrages, rien ne bouge...

Par conséquent, ce coup-ci j'ai préféré prendre le problème à l'envers et
plutôt que de repartir à zéro pour tout changer, j'y suis allé par petites
touches même si le résultat final est moins spectaculaire.

## Améliorer la lisibilité

Pour commencer, j'ai défini une couleur fond différente pour le body (gris
très clair) et la partie contenu (blanc). Pour cela, j'ai utilisé une image de
fond un peu plus large que le contenu ce qui donne l'impression qu'il existe
une bordure assez grande autour du contenu. Le but c'est d'essayer de donner un
effet un peu moins tassé aux pages.

Pour continuer à "alléger" les pages et rendre leur contenu un peu plus
lisible, j'ai cherché à mieux faire ressortir les différents types de contenu.
Jusqu'à présent, il n'y avait en gros que 3 couleurs dans tout le
site :

* du noir pour le texte
* du bleu pour les liens et certains titres
* du vert pour quelques titres

J'ai donc décidé de revenir à plus de simplicité et d'être plus strict en
réservant le bleu aux liens. Et pour les titres, je suis parti avec du gris qui
est ma couleur du moment pour tout ce qui est titre. Après avoir appliqué ce
même gris aux deux barres de séparation en haut et en bas de page, le contenu
des pages me parait un peu moins fouillis.

Toujours pour que le texte soit plus simple et j'espère plus lisible, j'ai
fait disparaitre tous les effets de décalage et d'alinéa qui pouvaient exister
sur certaines pages et j'ai un peu dé-complexifié les styles pour la navigation
dans la partie blogue.

J'ai terminé en simplifiant le contenu de la feuille de style. Globalement,
cela a consisté à supprimer tout plein de vieux code CSS qui ne servait plus
trop à rien mais qui continuait à trainer dans la feuille de style :

* l'ancien système de pictogrammes utilisé dans les premiers mois du
site
* des bidouilles issues de [Skidoo
Lean](http://webhost.bridgew.edu/etribou/layouts/skidoo/lean/) pour gérer au mieux IE 5, IE 5.5, IE Mac et FF 0.#
* la mise en évidence des mot-clés recherchés quand on arrivait d'un moteur
de recherche (là j'ai aussi dû modifier le traitement dans les sources du
programme)

## Augmenter les espacements

Après avoir mis ces premières modifications en production et vérifié pendant
quelque jours que ça ne posait pas de problème, j'ai pu m'attaquer à une
seconde vague d'évolutions.

Jusqu'à présent, les différents contenu étaient un peu collés les uns aux
autres. Par exemple, il n'y avait qu'un espacement de 10 pixels entre le
contenu principal des pages et le bandeau latéral qui contient les
pictogrammes, les sous-menus et autres publicités.

Au fil du temps, j'avais donc plus ou moins mis en place les 3 types de
disposition suivantes :

* 2 colonnes =>
  - contenu principal (790 pixels) + espacement (10 pixels) + bandeau latéral
(160 pixels)
  - 1° demi colonne (390 pixels) + espacement (10 pixels) + 2° demi colonne
(390 pixels) + bandeau latéral (160 pixels)
* 3 colonnes => 1° colonne (480 pixels) + espacement (10 pixels) + 2°
colonne (300 pixels) + espacement (10 pixels) + bandeau latéral (160
pixels)

Le premier truc, pour aérer les pages et faire moins tassé, c'était
d'augmenter tous les espacements de 10 à 20 pixels, en essayant néanmoins de
respecter deux impératifs :

* rester dans la limite des 960 pixels
* commencer à aller vers un système de grid

Finalement, après beaucoup de calculs et la tentation de dépasser les 960
pixels, j'ai réussi à opter pour un système de grid avec des colonnes de 180
pixels :

* 180 px + 20 px + 180 px + 20 px + 180 px + 20 px + 180 px + 20px +
160px

J'ai donc dû un peu tricher avec la dernière colonne mais de toute façon 160
pixels c'est pile ce dont j'ai besoin pour le bandeau AdSense vertical.

Et ça me permet de gérer le mode 2 colonnes très simplement :

* contenu principal (780 pixels) + espacement (20 pixels) + bandeau latéral
(160 pixels)
* 1° demi colonne (380 pixels) + espacement (20 pixels) + 2° demi colonne
(380 pixels) + bandeau latéral (160 pixels)

L'avantage avec ça, c'est que j'arrive même à avoir les 4 colonnes
nécessaires pour afficher certaines pages de l'annuaire où les sites sont
classés par commune et se présentent alors sur 4 colonnes.

Malgré tout, il reste encore une disposition un peu exotique pour les pages
sur 3 colonnes :

* 1° colonne (480 pixels) + espacement (20 pixels) + 2° colonne (280 pixels)
+ espacement (20 pixels) + bandeau latéral (160 pixels)

Une fois ces nouvelles mesures décidées, il a fallu mettre à jour les CSS
pour que tout rentre dans le moule. Ca n'a pas été facile facile à faire. J'ai
dû y aller petit morceau par petit morceau et m'y reprendre à plusieurs fois
avant d'en venir à bout. Et j'ai dû passer par des tas de background-color:
pink, yellow, green, blue ... pour bien vérifier que chaque morceau était bien
cadré comme il fallait et que rien ne sortait des clous.

Après ça, je me suis un peu reposé en me contentant d'espacer légèrement
l'en-tête et le pied de page et en simplifiant certains bouts de CSS par ci ou
par là.

## Fignoler la présentation

Pour finir, je suis revenu sur le système que j'avais utilisé au début pour
donner un effet de large bordure autour du contenu des pages.

La largeur des pages est fixée à 960 pixels, ce qui ne laisse pas de place
pour des marges de 20 pixels à gauche et à droite. Par conséquent, pour simuler
ces marges, j'ai donc utilisé une image de fond de 1000 pixels de large que
j'applique à l'élément body :

```
body
{
        background: #eee url(bg1000.gif) repeat-y center top;
        color: #000;
        margin: 0;
        padding: 0;
        text-align: center;
}

#pageWrapper
{
        margin: auto;
        padding: 0;
        width: 960px;
        text-align: left;
}
```

L'inconvénient, c'est qu'avec ce système le fond blanc commence en haut de
l'écran pour finir tout en bas de l'écran alors que j'aurais bien voulu avoir
un petit espacement d'une dizaine de pixels en haut et en bas.

Après avoir essayé de jouer sans succès avec un effet de margin ou de
padding vertical sur l'élément body, j'avais bricolé les border pour parvenir à
ce que je souhaitais faire :

```
body
{
        background: #eee url(bg1000.gif) repeat-y center top;
        border-bottom: solid 10px #eee;
        border-top: solid 10px #eee;
        color: #000;
        margin: 0;
        padding: 0;
        text-align: center;
}
```

Le problème, c'est qu'avec les écrans 21 pouces ou plus, on avait le border
à la fin du contenu (sous le pied de page) puis on retrouvait l'image de fond
qui se répétait jusqu'en bas de l'écran :). J'ai donc dû changer de méthode et
finalement, je me suis rendu compte qu'il suffisait de gérer cette bordure au
niveau de l'élément html.

```
html
{
        background-color: #eee;
        color: #000;
        padding: 10px 0;
}
```

## Idées pour la suite

Même si à première vue les nombreuses modifications apportées ne sautent pas
aux yeux, je suis malgré tout extrêmement satisfait des résultats que j'ai
obtenus :

* le contenu est moins tassé et plus lisible qu'avant,
* la structure et la taille des pages sont plus homogènes,
* le code CSS a été pas mal nettoyé.

Pour l'avenir, j'aimerai faire rentrer le mode 3 colonnes dans le rang en
faisant en sorte que la colonne du milieu passe de 280 pixels à 180 pixels.
Pour cela, il faudra aussi revoir la façon de l'utiliser et très certainement
le code source de l'application pour qu'elle gère moins de contenu et qu'elle
ait plus un rôle de sous-menu géant.

Mais à priori, cela devrait être tout à fait jouable pour les différentes
parties du site qui ont besoin de cette disposition en 3 colonnes :

* la météo
* les offices de tourisme
* les randonnées

Une autre évolution, ça serait de voir si maintenant que mon code est un peu
plus carré je peux réussir à remplacer la base Skidoo Lean qui commence à dater
par un framework CSS plus récent.

Et si en plus de tout ça je continue à simplifier suffisamment mon code CSS
et à gérer moins de cas particuliers, peut-être que j'arriverai un jour à faire
un changement de charte graphique beaucoup plus radical et visible.
