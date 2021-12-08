---
date: 2009-03-10 18:35:00
layout: post
redirect_from: "post/2009/03/10/Premier-essai-pour-organiser-le-plan-d-un-site"
tags: ap, jquery
title: "Premier essai pour organiser le plan d'un site"
---

Avant Altrr-Press il y avait QC et avant QC il y avait inPortal. Et à
l'époque, il existait un module pour mettre à jour le plan du site.

Ca permettait de déplacer un écran avant ou après un autre écran en cliquant
sur les flèches haut et bas et aussi de le changer de niveau en cliquant sur
les flèches gauche et droite. Et même si ça devenait un peu compliqué à
manipuler dès que le site commençait à avoir un peu trop de pages mais ça
rendait bien service.

Pour l'occasion, j'ai ressorti les vieux zip et j'ai reconstitué une
[page de démonstration](/public/2009/plan-00.html), mais sans
garantie (ça marchotte sous Firefox parce que c'est tellement vieux qu'en ce
temps là j'utilisais encore [K-Meleon](http://kmeleon.sourceforge.net/)).

Quand j'ai commencé à travailler sur QC, je me disais toujours qu'il fallait
que je refasse une boite pour modifier le plan du site mais soit je n'avais pas
envie de faire la même chose qu'avant, soit il y avait d'autres trucs à faire,
soit c'était les vacances... Tant et si bien que jusqu'à présent il n'existe
toujours rien qui permet de changer l'ordre des pages ou de les ré-organiser
dans Altrr-Press.

Actuellement, si l'écran a est avant l'écran b et que l'on veut faire passer
l'écran b en première position, il faut :

* créer un écran c avant l'écran a
* déplacer dans l'écran c toutes les boites de l'écran b
* supprimer l'écran b
* renommer l'écran c en ecran b

L'avantage avec cette méthode c'est que cela oblige à réfléchir 5 minutes au
plan du site avant de se mettre à créer les pages.

Mais là, avec tout les trucs qui existent sous jQuery, je me dit qu'il
serait quand même temps d'essayer d'offrir une méthode un peu plus pratique
pour réorganiser la structure des sites créés avec Altrr-Press.

J'ai donc fait un premier essai avec le [composant Sortable de jQuery
UI](http://docs.jquery.com/UI/API/1.7/Sortable). Pouvoir organiser le plan du site à coup de drag &amp; drop, ça devrait
le faire. L'avantage, c'est qu'une fois qu'on a trouvé un exemple qui marche,
c'est assez simple à utiliser.

Il faut commencer par insérer tous les fichiers javascript
nécessaires :

```
<script type="text/javascript" src="jquery-1.3.2.min.js"></script>
<script type="text/javascript" src="ui.core.js"></script>
<script type="text/javascript" src="ui.sortable.js"></script>
```

Puis on appelle la méthode sortable() pour le 1° niveau de la liste que l'on
veut pouvoir trier :

```
<script type="text/javascript">
$(document).ready(function() {
  var sortOpts = {
    items: "li", 
    cursor: "crosshair"
  }
  $("ul.ap-sitemap").sortable(sortOpts);
});
</script>
```

[C'est déjà pas mal](/public/2009/plan-01-a.html),
mais :

* ça tremblote un peu quand on est en mode drag
* on a du mal à prévoir où on va dropper

Si je rajoute un peu de CSS et que je met en évidence la zone où le drop va
avoir lieu :

* en la stylant avec une classe CSS définie via la [propriété placeholder](/public/2009/plan-01-b.html)
* en lui donnant une hauteur avec la [propriété forcePlaceholderSize](/public/2009/plan-01-c.html) à true

C'est déjà plus clair, mais je reste un peu sur ma faim :

* c'est mieux que rien mais sans plus... je m'attendais à un effet plus
spectaculaire
* je n'arrive pas à créer un sous-niveau : pendant un moment j'ai pensé
que la propriété dropOnEmpty me le permettrait mais apparemment ça n'est pas
ça.
* et en plus, il faudra que je cherche comment [limiter
le nombre de sous-niveau à 3]({% post_url 2004-10-25-wdevs-week-end-with-mysql %})

A creuser donc...

Note : la liste que j'utilise en exemple est tirée de l'article
[Complex
Dynamic Lists: Your Order Please](http://www.alistapart.com/articles/complexdynamiclists) de Christian Heilmann et publié sur A List
Apart.
