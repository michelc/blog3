---
date: 2010-01-29 11:51:00
layout: post
redirect_from: "post/2010/01/29/utiliser-asp-net-mvc-et-nhibernate-3-fin"
tags: mvc, nhibernate
title: "Utiliser ASP.NET MVC et NHibernate (3° partie)"
---

{:.encart}
Ceci est la traduction du billet "[Using ASP.NET MVC and NHibernate (Part 3)](http://forerunnerg34.wordpress.com/2009/11/05/using-asp-net-mvc-and-nhibernate-part-3-final/)" de César
Intriago.

Voici le troisième et dernier billet d'une série d'articles consacré à
l'utilisation de NHibernate pour développer des applications ASP.NET MVC. Les
liens vers les deux premières parties de ce tutoriel sont disponibles
ci-dessous :

* [Utiliser ASP.NET MVC et NHibernate (1° partie)]({% post_url 2010-01-29-utiliser-aspnetmvc-nhibernate-1 %})
* [Utiliser ASP.NET MVC et NHibernate (2° partie)]({% post_url 2010-01-29-utiliser-aspnetmvc-nhibernate-2 %})

Dans cet article, nous allons créer notre application ASP.NET MVC pour gérer
les Posts et les Categories. Notre projet aura la structure suivante :

![](http://forerunnerg34.files.wordpress.com/2009/11/image.png)

Le contrôleur CategoriesController va nous permettre de retrouver, créer,
modifier et supprimer des catégories de notre repository.

Le contrôleur PostController va nous permettre de faire la même chose pour
les Posts. En ce qui concerne les vues pour les Posts, je vais utiliser une
**ViewModel** afin de représenter la combinaison des Posts et des
Categories.

Dans notre projet ASP.NET MVC nous allons ajouter des références vers nos
projets Core et Infrastructure afin de pouvoir utiliser les composants
NHibernate pour la persistance que nous avons développé dans les deux premières
parties.

Nous utiliserons des vues fortement typées basées sur notre modèle et
ViewModel afin que Visual Studio puisse *scaffolder* les vues en
s'appuyant sur ces types d'objet.

![](http://forerunnerg34.files.wordpress.com/2009/11/newview.jpg)

J'ai apporté quelques modification au code par rapport à la deuxième partie
car j'ai détecté quelques bugs grâce aux test unitaires. Par conséquent, il est
nécessaire de [télécharger la version complète du projet](http://go2.wordpress.com/?id=725X1342&amp;site=forerunnerg34.wordpress.com&amp;url=http://cid-926d6677262767bd.skydrive.live.com/self.aspx/ForerunnerG34/NHibernate101%20Final.zip).

## ViewModel

Les vues pour les Posts ont besoin des objets Post et Category pour
fonctionner correctement. Pour cela, un *pattern* très répandu est de
passer par un modèle de vue qui sert de conteneur pour ces deux objets afin de
faciliter leur utilisation au niveau de la vue.

Par conséquent, dans le cas des vues destinées aux Posts, je n'ai pas
utilisé directement les objets du modèle (c'est à dire les classes Post et
Category). A la place, j'ai créé une classe PostViewModel qui contient ces deux
objets du modèle. De cette façon, je peux simplifier la manipulation des Posts
et des Categories auxquelles ils sont rattachés comme s'il s'agissait d'une
seule entité.

![](http://forerunnerg34.files.wordpress.com/2009/11/image1.png)

## Conclusion

Configurer NHibernate pour la première fois peut demander un petit effort
(ou un effort certain), mais il vous fera gagner énormément de temps pour
réaliser la couche données de votre application. Et combiné à un framework tel
que ASP.NET MVC, vous parvenez à une franche séparation des préoccupations
(*separation of concerns* en anglais) qui vous aidera à conserver un
projet bien organisé, facile à comprendre et à tester. Je suis persuadé qu'en
suivant cette méthode vous obtiendrez un projet avec un code et une structure
tirés à quatre épingle, d'autant plus que les modèles de Visual Studio pour
ASP.NET MVC rendent ce travail encore plus facile étant donné que vous pouvez
automatiser la création des vues.

C'est extraordinaire tellement c'est facile et rapide de créer une
application avec ASP.NET MVC. J'attends avec impatience la sortie de la version
2.0 (en fait je teste d'ores et déjà sa Preview). C'est vraiment le moment
idéal pour [apprendre ASP.NET MVC]({% post_url 2010-01-12-vous-devriez-apprendre-mvc %}) et NHibernate.

{:.encart}
Ceci est la traduction du billet "[Using ASP.NET MVC and NHibernate (Part 3)](http://forerunnerg34.wordpress.com/2009/11/05/using-asp-net-mvc-and-nhibernate-part-3-final/)" de César
Intriago.
