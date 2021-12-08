---
date: 2010-05-25 13:11:00
layout: post
redirect_from: "post/2010/05/25/mvc-music-store-raven-db-refaire-homecontroller-bonne-methode"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : Refaire HomeController, la bonne méthode"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: Porting the HomeController, the
Right Way](http://ayende.com/Blog/archive/2010/05/22/porting-mvc-music-store-to-raven-porting-the-homecontroller-the-again.aspx)", le cinquième de la série consacrée au portage de l'application
MVC Music Store sous RavenDB par Oren Eini, alias Ayende Rahien.

Comme je l'ai indiqué dans le billet précédent, nous pouvons solutionner le
problème de la méthode GetTopSellingAlbums() grâce au map/reduce, mais cela
n'est pas vraiment la bonne façon de faire les choses. Le problème en procédant
de la sorte (en plus des regards effrayés et des cris de détresse que vous
suscitez dès que vous mentionnez cette solution), c'est qu'on essaie de
résoudre le problème selon une logique relationnelle. Et d'ailleurs, la
solution précédente est quasiment identique à la façon dont une base de données
relationnelle pourrait traiter ce genre de requête. Voyons plutôt quelle serait
l'approche d'une base de données documents pour résoudre ce genre de
problème.

La réponse est évidente à trouver : rappelez-vous que les documents
sont indépendants et réfléchissez à nouveau à la question. Ce que nous
cherchons à savoir, c'est quels sont les albums les plus vendus. Si nous
ajoutions une propriété CountSold à l'album, cela deviendrait immédiatement
bien plus simple de répondre à cette question. Et pour cela, il nous suffit de
mettre à jour les différents albums qui font parti de la commande lorsque
celle-ci est validée. C'est quelque chose de tout à fait acceptable et ce genre
d'opération est couramment effectuée, y compris avec des bases de données
SQL.

Pour l'instant, laissons de côté la façon de créer la propriété CountSold et
de l'initialiser avec les bonnes valeurs (je verrai ça dans mon prochain
billet). Nous supposerons donc que c'est déjà fait et qu'il ne nous reste plus
qu'à trouver comment résoudre le problème de notre méthode
GetTopSellingAlbums().

Et bien, c'est plutôt simple. Tout ce que nous avons à faire, c'est de
définir un index sur CountSold.

```
// AlbumsByCountSold
from album in docs.Albums
select new { album.CountSold };
```

Avec ça, nous pouvons implémenter la fonction GetTopSellingAlbums() de la
façon suivante :

![](http://ayende.com/Blog/images/ayende_com/Blog/WindowsLiveWriter/PortingMVCMusicStoretoRavenPortingtheHom_2CD9/image_thumb.png)

C'est fait : simple, efficace et même élégant (même si c'est moi qui le
dit).
