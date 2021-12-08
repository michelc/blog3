---
date: 2010-05-26 22:35:00
layout: post
redirect_from: "post/2010/05/26/mvc-music-store-raven-db-storecontroller"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : StoreController"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: StoreController](http://ayende.com/Blog/archive/2010/05/25/porting-mvc-music-store-to-raven-storecontroller.aspx)", le
huitième de la série consacrée au portage de l'application MVC Music Store sous
RavenDB par Oren Eini, alias Ayende Rahien.

Commençons par la méthode Index() :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreControll_3E26/image_thumb.png)

Il y a un truc dans ce code qui me gène, c'est qu'il va exécuter deux
requêtes sur la base de données. Mais je ne vais pas m'appesantir étant donné
que nous allons modifier tout ça.

Et voici ma version portée sous Raven :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreControll_3E26/image_thumb_3.png)

Comme vous pouvez le constater, c'est à peut près pareil et donc pas très
intéressant. Voyons voir ce que nous avons d'autre :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreControll_3E26/image_thumb_4.png)

Ce qu'il faut bien voir, c'est que ce code cherche à faire une recherche sur
le libellé d'un genre. Le problème c'est que le libellé du genre n'est pas la
clé primaire, et que pour couronner le tout, il n'y a même pas d'index sur
cette colonne libellé. Bon, c'est vrai que la table genre ne contient que 10
lignes, mais c'est une question de principe (si vous êtes très sympa, vous
n'aurez droit qu'à un sermon du DBA pour avoir osé faire une requête sans index
sur la base de production).

Avec Raven, il nous serait donc très simple d'implémenter ça en suivant la
même approche, mais je ne vois pas d'excuse pour faire ça. Le genre que nous
récupérons dans la méthode Browse() dépend des données que nous avons renvoyées
avec la méthode Index(). Il n'y a donc pas de raison pour ne pas faire passer
directement l'identifiant du genre. J'ai donc modifié l'action Index() pour
renvoyer l'objet genre complet et pas seulement son libellé et par la suite
renvoyer l'identifiant à l'action Browse() au lieu du libellé.

J'avais donc commencé à implémenter ça mais je me suis retrouvé coincé par
l'association entre les albums et les genres.

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreControll_3E26/image_thumb_8.png)

Normalement, les bases de données documents n'ont pas d'associations et pas
de jointures non plus. Alors, comment gérer ça ?

Depuis le temps vous devez commencer à vous douter de la réponse : en
créant un un index :)

```
// AlbumsByGenre
from album in docs.Albums
where album.Genre != null
select new { Genre = album.Genre.Id }
```

Et cet index nous permet d'écrire le code suivant :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreControll_3E26/image_thumb_9.png)

Et pour finir, il nous reste l'action GenreMenu :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreControll_3E26/image_thumb_5.png)

Que nous pouvons facilement porter de la façon suivante :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreControll_3E26/image_thumb_6.png)

Et nous en avons terminé avec StoreController.
