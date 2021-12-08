---
date: 2010-06-01 18:40:00
layout: post
redirect_from: "post/2010/06/01/mvc-music-store-raven-db-storemanagercontroller-2"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : StoreManagerController (2° partie)"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: StoreManagerController, part
2](http://ayende.com/Blog/archive/2010/05/31/porting-mvc-music-store-to-raven-storemanagercontroller-part-2.aspx)", le dernier de la série consacrée au portage de l'application MVC Music
Store sous RavenDB par Oren Eini, alias Ayende Rahien.

Le contrôleur StoreManagerController contient encore deux méthodes que nous
n'avons pas étudiées. Nous allons devoir les aborder de façon un peu
différente.

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreManagerC_E224/image_thumb.png)

Est-ce que vous devinez pourquoi ?

C'est parce qu'au départ nous étions d'accord sur le fait qu'il n'y avait
aucune raison valable de gérer les artistes en tant que document spécifique.
Après tout, il ne s'agit que de données de référence. Sauf que maintenant nous
devons y faire référence.

C'est sûr qu'on pourrait créer une série de documents artistes, ce qui
faciliterait énormément la migration du code :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreManagerC_E224/image_thumb_1.png)

Mais je continue à penser que les artistes n'existent pas réellement en tant
qu'entité indépendante dans notre modèle. Par conséquent, au lieu de suivre
cette voie nous allons plutôt faire une projection.

Nous commençons par définir un index "Artists" à l'aide des requêtes linq
map / reduce suivantes :

```
// map 
from album in docs.Albums
select new { album.Artist.Id, album.Artist.Name }

// reduce 
from artist in results
group artist by new { artist.Id, artist.Name } into g
select new { g.Key.Id, g.Key.Name }
```

Si vous regardez attentivement ce code, vous pouvez voir que sa
fonctionnalité principale est de faire un distinct sur l'ensemble des artistes
de tous les albums.

Si bien que maintenant nous pouvons coder nos deux dernières méthodes comme
ceci :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreManagerC_E224/image_thumb_2.png)

Il faut bien comprendre un truc : ça ne coûte rien de faire des
requêtes avec Raven, parce que Raven ne permet les requêtes que sur des index
et que ces index sont créés en tache de fond, ce qui contribue à rendre les
requêtes très rapides.

Et cela remet en cause la façon dont vous allez concevoir votre système et
de votre modèle de données. Avec Raven, vous cherchez à axer la plupart de vos
traitements sur des index et interroger ces index, parce que c'est ce qui est
le moins gourmand.
