---
date: 2010-05-30 17:41:00
layout: post
redirect_from: "post/2010/05/30/mvc-music-store-raven-db-gerer-le-reglement"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : Gérer le règlement"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: Porting the checkout
process](http://ayende.com/Blog/archive/2010/05/28/porting-mvc-music-store-to-raven-porting-the-checkout-process.aspx)", le onzième de la série consacrée au portage de l'application MVC
Music Store sous RavenDB par Oren Eini, alias Ayende Rahien.

Dans MVC Music Store, la gestion du règlement est composée de deux
parties : renseigner l'adresse et le mode de paiement puis terminer la
commande.

Le code pour gérer l'adresse et le mode de paiement dans la version
d'origine :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheche_D900/image_thumb.png)

Et ce même code correspondant à la version portée sous Raven :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheche_D900/image_thumb_1.png)

Comme vous pouvez le constater, ils sont presque identiques. Mais le code
pour Raven n'est pas tout à fait complet.

Si vous vous souvenez, nous avions décidé de stocker une propriété CountSold
dans le document Album, pour pouvoir plus facilement faire un classement en
fonction de ce compteur. Il nous reste donc à réaliser l'incrémentation de ce
compteur, ce que j'ai codé immédiatement après l'appel à CreateOrder :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheche_D900/image_thumb_2.png)

Le truc essentiel dans ce code, c'est que nous avons chargé tous les
documents albums en une seule requête. Et lorsque nous sauvegardons, Raven va
effectuer un seul appel (batch) au serveur.

Et maintenant, pour être tout à fait complet, voyons ce que donnait la
méthode Complete() :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheche_D900/image_thumb_3.png)

Et dans la nouvelle version sous Raven :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheche_D900/image_thumb_4.png)

Je pense qu'arrivé à ce point, vous êtes en mesure de comprendre comment
fonctionne les deux versions.

Mon prochain billet concernera la partie administration de
l'application.
