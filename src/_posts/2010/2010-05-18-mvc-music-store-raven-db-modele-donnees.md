---
date: 2010-05-18 18:04:00
layout: post
redirect_from: "post/2010/05/18/mvc-music-store-sous-raven-db-modele-donnees"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : Modèle de données"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: The data model](http://ayende.com/Blog/archive/2010/05/18/porting-mvc-music-store-to-raven-the-data-model.aspx)", le premier
d'une série consacrée au portage de l'application MVC Music Store sous RavenDB
par Oren Eini, alias Ayende Rahien.

Le tutoriel "[MVC Music Store](http://www.asp.net/mvc/samples/mvc-music-store/)" est venu à point nommé pour moi. Je
souhaitais faire une application de démonstration pour [Raven DB](http://ravendb.net/) et le fait que quelqu'un
d'autre ait déjà fait tout le travail ingrat (l'interface utilisateur :) à ma
place et que je n'ai plus qu'à refaire l'accès aux données est une situation
rêvée. Mon objectif est de ne rien toucher du tout au Javascript ou au code
HTML et de me contenter de remplacer les contrôleurs. Ca devrait être
intéressant de voir si je peux y arriver.

Le modèle de base de données dans le tutoriel d'origine est le
suivant :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenThedatamodel_14/image_2.png)

On peut déjà remarquer deux ou trois choses intéressantes dans ce
schéma :

* Il serait plus correct que la table Cart soit nommée CartLineItem
puisqu'elle stocke une ligne par article dans le panier
  - CartId n'est pas une clé étrangère, mais référence le nom de l'utilisateur
ou l'identifiant de la session
* La table Artist gère uniquement le nom de l'artiste et rien d'autre.

A partir de ces informations, je considère que le modèle de données suivant
devrait convenir.

## Albums

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenThedatamodel_14/image_thumb_1.png)

* Le document Album contient à la fois une référence pour le Genre et pour le
libellé du genre. Cela nous permet d'afficher l'album sans avoir à référencer
le document Genre.
* Et pour les mêmes raisons, le document Album contient aussi le nom et
l'identifiant de l'artiste.
* Il n'y a pas un ensemble de documents Artists dans la base de données. Nous
ne gérons aucune information sur les artistes, si ce n'est leur nom, et je ne
vois donc pas de raison pour définir un document Artist pour l'instant.

## Genre

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenThedatamodel_14/image_thumb_3.png)

Le document Genre est la réplique exacte de la table Genre, rien
d'extraordinaire à ce niveau.

## Cart

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenThedatamodel_14/image_thumb_7.png)

Le document Cart suit un format de document plutôt classique. Nous avons un
simple document qui contient un tableau d'éléments là où le modèle de données
relationnel contient un ensemble de lignes. Vous pouvez voir que le
UserIdentifier nous sert pour stocker l'identifiant de l'utilisateur ou celui
de la session pour le panier.

## Orders

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenThedatamodel_14/image_thumb_8.png)

Order constitue une autre document plutôt standard. Nous regroupons toutes
les information de la commande dans un simple document et nous stockons les
informations liées à celle-ci (Address) dans un noeud spécifique.

## Artist

Il n'y a pas de document Artist.

## Pourquoi un document pour Genre et pas pour Artist ?

Pour la bonne raison que l'application va faire quelque chose avec les
Genres (en plus d'afficher leur description) alors que la seule chose que l'on
fait avec les Artistes est d'afficher leur nom dans la cadre d'un album. Pour
l'instant, je considère que Artist fait partie intégrante de Album et qu'il n'y
a donc pas à définir un document spécifique pour lui. La seule raison au fait
qu'il existe un identifiant artiste en plus du nom est que je suppose (d'après
les données) que la source pour les artistes est un système externe qui fait
quelque chose d'un peu plus utile que simplement stocker le nom de
l'artiste.

Nous n'avons fait que la moitié du travail à faire. Nous avons défini le
modèle de données, maintenant nous devons étudier comment il sera utilisé dans
un contexte plus large et lui ajouter le modèle de requête en utilisant des
index. Nous verrons cela dans un prochain billet.
