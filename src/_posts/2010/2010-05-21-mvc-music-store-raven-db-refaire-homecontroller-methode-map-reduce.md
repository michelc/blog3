---
date: 2010-05-21 13:27:00
layout: post
redirect_from: "post/2010/05/21/mvc-music-store-raven-db-refaire-homecontroller-methode-map-reduce"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : Refaire HomeController, méthode map/reduce"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: Porting the HomeController, the
map/reduce way](http://ayende.com/Blog/archive/2010/05/21/porting-mvc-music-store-to-raven-porting-the-homecontroller-the.aspx)", le quatrième de la série consacrée au portage de
l'application MVC Music Store sous RavenDB par Oren Eini, alias Ayende
Rahien.

Actuellement, le contrôleur HomeController contient le code
suivant :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheHom_1FB9/image_2.png)

Je n'aime vraiment pas quand un contrôleur se charge de faire des requêtes,
mais ça n'est pas le sujet pour l'instant.

Grâce à [EF Prof](http://efprof.com/), on peut voir
à quoi ressemble cette requête :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheHom_1FB9/image_thumb_1.png)

Et là on se trouve face à un problème très intéressant : il ne nous est
pas possible de reproduire cette requête. En effet, cette requête porte sur
plusieurs tables que dans notre modèle nous avons réparties dans différents
documents.

Il existe plusieurs méthodes pour résoudre cela. Une des façon de faire
serait de définir un index [map / reduce](http://ayende.com/Blog/archive/2010/03/14/map-reduce-ndash-a-visual-explanation.aspx) au niveau des documents orders.

Note: Oui, je sais [ce que vous allez dire](http://browsertoolkit.com/fault-tolerance.png).

La méthode que je suis sur le point de vous montrer n'est pas celle que je
conseillerais dans la réalité. Mais je veux malgré tout vous la présenter. Dans
mon prochain billet, je vous expliquerai la façon dont Raven permet de gérer ça
dans les formes.

Avec Raven, le map / reduce consiste simplement en quelques requêtes Linq.
Il n'y a donc pas de raison de s'affoler. Pour mémoire, nous avons défini les
documents suivant dans notre base de données :

![](/public/2010/ravendb4.png)

Nous créons l'index "SoldAlbums" à l'aide des requêtes suivantes :

```
// map
from order in docs.Orders
from line in order.Lines
select new{ line.Album, line.Quantity }

// reduce
from result in results
group result by result.Album into g
select new{ Album = g.Key, Quantity = g.Sum(x=>x.Quantity) }
```

Comme vous pouvez le voir, il s'agit de deux requêtes Linq toute
simples.

Leur résultat devrait être le suivant :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheHom_1FB9/image_thumb_4.png)

Dès lors que nous avons cela, c'est un jeu d'enfant d'en faire découler
GetTopSellingAlbums. En fait, la fonction ci-dessous implémente exactement la
même logique et renvoie le même résultat que l'implémentation
d'origine :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheHom_1FB9/image_thumb_6.png)

La façon dont elle fonctionne est très simple. Nous sélectionnons les albums
les plus vendus (en triant les quantités par ordre décroissant), puis nous les
chargeons depuis la base de données. Et dans le cas où nous aurions moins
d'albums vendus que ce que nous comptons afficher, nous complétons avec
d'autres albums normaux.

Au final ce code exécute 2 ou 3 requêtes. Je n'aime vraiment pas ça, mais
sur ma machine, cela prend environ moins de 10 ms pour faire ces trois
requêtes, ce qui est tout à fait supportable.

Je vous ai présenté cette solution parce que je voulais vous montrer que
c'était une approche du problème, mais pas la solution recommandée pour le
résoudre. Nous verrons une meilleure approche dans le billet suivant.
