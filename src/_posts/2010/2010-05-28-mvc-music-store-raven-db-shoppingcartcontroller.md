---
date: 2010-05-28 13:15:00
layout: post
redirect_from: "post/2010/05/28/mvc-music-store-raven-db-shoppingcartcontroller"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : ShoppingCartController"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: ShoppingCart](http://ayende.com/Blog/archive/2010/05/27/porting-the-mvc-music-store-to-raven-shoppingcartcontroller.aspx)", le dixième
de la série consacrée au portage de l'application MVC Music Store sous RavenDB
par Oren Eini, alias Ayende Rahien.

Le contrôleur ShoppingCartController est considérablement impacté par tous
les changements que nous avons apportés à la classe ShoppingCart. Penchons-nous
sur ces modifications, en commençant par l'action Index() dans le code
d'origine :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_B3D7/image_thumb.png)

Celui-ci exécute deux requêtes différentes pour gérer la commande alors que
la version pour Raven exécute seulement une requête au niveau de la méthode
FindShoppingCart () :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_B3D7/image_thumb_5.png)

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_B3D7/image_thumb_6.png)

Ce code implémente seulement la logique pour charger le panier depuis Raven
ou créer un nouveau panier (pour l'identifiant spécifié). Notez-bien que nous
n'enregistrons pas le nouveau panier dans la base de données, mais associons
seulement ce nouveau panier avec la session. Nous n'avons pas besoin de
sauvegarder étant donné que pour l'instant il ne contient rien de significatif.
Lorsque nous appellerons SaveChanges(), le nouveau panier sera envoyé vers
Raven pour stockage.

Maintenant, voyons-voir l'action AddToChart d'origine :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_B3D7/image_thumb_3.png)

Et la version portée sous Raven :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_B3D7/image_thumb_7.png)

Elles sont très similaires, si ce n'est que dans le cas de Raven, la méthode
AddToCart() de la classe ShoppingCart est uniquement concerné par l'ajout d'un
nouvel article au panier ou par la mise à jour de la quantité d'un article
existant. Ainsi, il n'y a absolument aucun accès à la base de données dans la
version pour Raven de la méthode ShoppingCart.AddToCart().

La différence c'est donc que dans l'approche pour Raven, nous appelons la
méthode session.SaveChanges() au niveau de l'action. Pour la bonne et simple
raison que c'est le bon endroit où faire cela étant donné que le code appelant
est en charge de l'environnent, y compris la sauvegarde lorsque cela est
nécessaire.

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_B3D7/image_thumb_9.png)

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_B3D7/image_thumb_8.png)

Je pense que le code pour Raven est plutôt facile à suivre. Il y a juste un
truc un peu étrange à faire remarquer au niveau de la dernière ligne :
id.Split(). Pourquoi diable fait-on ça ?

Et bien c'est parce que Raven utilise des identifiants de la forme
"albums/616" et que la valeur DeleteId sera utilisé par le code Javascript
appelant pour retrouver un élément à partir de son identifiant. Et comme
l'identifiant d'un élément HTML ne peut pas contenir de "/", nous ne renvoyons
que la partie numérique de l'identifiant. Ce n'est pas un problème puisque dans
ce cas précis nous ne gérons que des albums.

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_B3D7/image_thumb_12.png)

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_B3D7/image_thumb_10.png)

Encore une fois, on ne peut pas faire plus simple. Par conséquent, je ferai
seulement remarquer qu'avec l'approche suivie par Raven on peut profiter du
cache de l'unit of work alors qu'avec le code d'origine non.

Dans mon prochain billet, je m'occuperai de la gestion de la commande.
