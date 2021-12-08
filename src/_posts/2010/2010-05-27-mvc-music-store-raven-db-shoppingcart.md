---
date: 2010-05-27 22:14:00
layout: post
redirect_from: "post/2010/05/27/mvc-music-store-raven-db-shoppingcart"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : ShoppingCart"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: ShoppingCart](http://ayende.com/Blog/archive/2010/05/26/porting-the-mvc-music-store-to-raven-shoppingcart.aspx)", le neuvième
de la série consacrée au portage de l'application MVC Music Store sous RavenDB
par Oren Eini, alias Ayende Rahien.

![ShoppingCart](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb.png)

La classe ShoppingCart de [MVC Music Store](http://mvcmusicstore.codeplex.com/) est ma tête à claque du moment. C'est plus
fort que moi.

Vous pouvez admirer à quoi elle ressemble dans l'illustration de droite. Le
souci avec elle, c'est que c'est le genre de code qui fait l'amalgame entre
deux responsabilités différentes :

* Les opérations au sujet du panier
  - GetCart
  - GetCartId
  - GetCartItems
  - GetCount
* Les traitements du contenu du panier
  - AddToCart
  - CreateOrder
  - EmptyCart
  - MigrateCart
  - RemoveFromCart

Vous avez sans doute remarqué que toutes les opérations au sujet du panier
correspondent à des fonctions get. Tous les traitements du contenu du panier
sont relatifs aux articles du panier, ils représentent la logique métier du
panier et sa raison d'être. Les opérations Get ne sont pas rattachées aux
articles du panier, elles dépendent d'un autre genre d'objet qui gère les
instances de paniers.

Dans la plupart des applications, cet objet s'appellerait un Repository. Je
ne suis pas certain que cela nous soit utile dans le cas présent. Si on étudie
les méthodes Get de plus près, on se rend compte que la seule justification de
leur existence vient du fait que l'on a choisi de stocker uniquement les
articles du panier. Comme il n'existe pas d'entité panier, nous sommes obligé
d'effectuer des requêtes explicites pour obtenir ces données.

Avec Raven, nous procèderons différemment, ce qui fait que la seule chose
dont nous devrions avoir besoin est GetCart() et peut-être GetCartId().

Voici donc à quoi un document panier ressemblera :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_3.png)

Ce qui donnera en tant qu'entité :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_6.png)

La méthode GetTotal a été remplacée par une propriété Total. Contrairement à
la méthode GetTotal qui va générer un accès à la base de données, cette
propriété fonctionne uniquement à partir des données en mémoire. Cela constitue
une autre différence majeure de Raven par rapport à une autre solution
ORM : on ne va pas faire de lazy loading. C'est quelque chose d'inhérent
aux bases de données documents : les données du modèle ont rarement besoin
de parcourir d'autres données en dehors de leur propre document. Parcourir le
document avec Raven ne risque pas de provoquer du lazy loading ou de nous
entrainer dans de redoutables problèmes de type SELECT N+1.

Et maintenant, occupons nous de gérer les opérations au sujet du panier. Les
plus importantes sont GetCartId et GetCart. Je considère que ces méthodes n'ont
rien à faire là. J'ai donc créé une nouvelle classe ShoppingCartFinder qui
ressemble à ceci :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_5.png)

Vous pouvez voir que nous n'exposons plus la méthode GetCartId. Il s'agit
d'un élément interne qui n'a pas à être connu des clients de cette classe. La
méthode SetShoppingCartId() est là parce que nous devons gérer l'initialisation
de l'identifiant d'un panier étant donné que nous voulons gérer le transfert
d'un panier (lorsqu'un utilisateur anonyme se connecte). Comme nous n'avons pas
besoin des autres méthodes, je les ai supprimées.

Continuons avec les traitements du contenu du panier. Pour mémoire, voici la
méthode AddToCart() d'origine :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_7.png)

Et voici cette méthode portée sous Raven :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_8.png)

Le code pour Raven fonctionne entièrement en mémoire et sans se soucier de
tout l'aspect persistance. Le code d'origine se charge explicitement de tout ce
qui est persistance. Ce n'est pas un problème en soi, mais ce n'est pas le bon
endroit pour s'occuper de persistance.

Passons à RemoveFromCart() :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_9.png)

Vous pouvez voir que sa taille diminue de façon très significative et qu'une
fois encore, il ne s'agit plus que d'un traitement en mémoire. La méthode
EmptyCart() n'est pas implémentée puisqu'avec Raven cela correspond juste à un
Lines.Clear().

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_22.png)

Un truc intéressant à voir, c'est que l'ancienne implémentation de
EmptyCart() aurait généré N requêtes (N étant le nombre d'articles dans le
panier) alors qu'avec Raven cela engendre une seule requête.

La méthode CreateOrder() d'origine :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_11.png)

Et celle pour Raven pour laquelle il n'y a pas grand chose à dire si ce
n'est que l'ancien code exacuterait N * 2 requêtes là où le code pour Raven
continuera de se contenter d'une seule requête :-)

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_12.png)

MigrateCart() est plus intéressant parce que son implémentation est
complètement différente. Dans le code d'origine, on met à jour tous les
articles du panier un par un :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_13.png)

Avec Raven, nous allons faire quelque chose de radicalement
différent :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_15.png)

L'identifiant du panier sert pour définir la clé du document et donc, en
initialisant cet identifiant (soit avec le nom de l'utilisateur soit avec une
valeur stockée en session), nous pouvons charger le panier à l'aide d'une
méthode Load (sur la clé primaire pour faire une comparaison avec le monde des
bases relationnelles). Le transfert du panier est alors une opération toute
simple. Tout ce que vous avez à faire, c'est de changer sa clé. Etant donné que
Raven ne permet pas de la renommer, nous allons faire une suppression puis une
insertion qui s'exécuteront dans la même transaction.

Le code pour appeler la méthode MigrateCart() est le suivant :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingtheMVCMusicStoretoRavenShoppingCa_BA52/image_thumb_16.png)

Etant donné que SaveChanges est atomique et transactionnel, cela a le même
effet que de faire un Rename.

Et c'est tout pour le panier. Je consacrerai mon prochain billet au
contrôleur ShoppingCartController qui utilise cette classe.
