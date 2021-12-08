---
date: 2010-05-31 21:46:00
layout: post
redirect_from: "post/2010/05/31/mvc-music-store-raven-db-storemanagercontroller"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : StoreManagerController"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: StoreManagerController](http://ayende.com/Blog/archive/2010/05/29/porting-mvc-music-store-to-raven-storemanagercontroller.aspx)", le
douzième de la série consacrée au portage de l'application MVC Music Store sous
RavenDB par Oren Eini, alias Ayende Rahien.

La dernière partie du portage de MVC Music Store sous Raven concerne toute
la partie administration, implémentée au niveau du contrôleur
StoreManagerController. Je vais commencer par une rapide comparaison de toutes
les méthodes où le passage sous Raven n'apporte rien de nouveau puis je mettrai
l'accent sur une différence de conception plutôt intéressante entre les deux
implémentations.

## Code d'origine

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreManagerC_DCF0/image_thumb.png)

## Portage sous Raven

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreManagerC_DCF0/image_thumb_1.png)

Le code pour Raven est beaucoup plus court pour la bonne et simple raison
que j'ai fait disparaitre tout la pseudo gestion d'erreur qu'il contenait.

## Code d'origine

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreManagerC_DCF0/image_thumb_5.png)

## Portage sous Raven

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreManagerC_DCF0/image_thumb_6.png)

Là encore, le fait de faire disparaitre une gestion d'erreur qui n'est là
que pour la gallerie a un impact plus que certain sur la taille du code.

## Code d'origine

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreManagerC_DCF0/image_thumb_7.png)

## Portage sous Raven

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenStoreManagerC_DCF0/image_thumb_8.png)

Ici nous avons une différence plus intéressante. Le code d'origine a pour
effet d'effacer les commandes qui contiennent l'album supprimé. Ce que ne fait
pas le code porté sous Raven.

La notion d'intégrité référentielle n'existe pas sous Raven (ou de façon
plus générale sous les bases de données document). Cela peut être un avantage
ou un inconvénient. Mais dans ce cas précis, cela s'avère être un avantage
puisque nous pouvons supprimer un album sans perdre de commandes. Je ne sais
pas pour vous, mais en ce qui me concerne ça ne me déplait pas de conserver
toutes mes commandes :)

Avec Raven, les documents sont indépendants les uns des autres. Par
conséquent, le fait de modifier un document n'a aucun impact sur les autres
documents.

Il reste encore deux méthodes à étudier en ce qui concerne le contrôleur
StoreManagerController, mais je verrai ça dans mon prochain billet.
