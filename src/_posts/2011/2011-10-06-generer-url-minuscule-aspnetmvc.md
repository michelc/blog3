---
date: 2011-10-06 20:47:00
layout: post
redirect_from: "post/2011/10/06/generer-url-minuscule-asp-net-mvc"
tags: mvc, referencement
title: "Générer des URLs en minuscules avec ASP.NET MVC"
---

Un des trucs bien de ASP.NET MVC c'est que son système de routes sert aussi
pour générer automatiquement les URLs correctes pour les actions des
contrôleurs à partir de méthodes telles que Html.ActionLink(), Url.Action()… Un
des trucs crispant de ASP.NET MVC, c'est qu'il génère ces URLs en conservant
les noms des contrôleurs et des actions tels quels.

Ainsi, si on a une action "Update" dans un contrôleur "ContactsController",
cela génèrera l'URL "/Contacts/Update" alors que cela aurait été tellement plus
joli de générer une URL "/contacts/update" !

Ce qui laisse 2 solutions :

* Attendre le jour où ASP.NET MVC gèrera ça de lui-même
* Se dire que quelques majuscules par ci par là c'est pas si moche que
ça
* N'utiliser que des minuscules pour les noms de contrôleurs et
d'actions
* Améliorer le système de routes pour minusculiser automatiquement les noms
des contrôleurs et des actions

Du temps de MVC 1, j'avais déjà fait ça pour certains projets, en reprenant
le code proposé par Graham O'Neale dans son billet [Lowercase Route URL's in ASP.NET MVC](http://goneale.com/2008/12/19/lowercase-route-urls-in-aspnet-mvc/).

Mais je trouve que c'est typiquement le genre de petits trucs sur lequel il
ne faut pas perdre de temps et qu'il ne faut pas chercher à gérer soi-même. Et
dans ce cas là, l'utilisation d'un package NuGet tout prêt est la solution
idéale.

Ce qui tombe bien, puisque Lee Dumond a justement créé un package [LowercaseRouteMVC](http://nuget.org/List/Packages/LowercaseRoutesMVC) exprès pour ça. Son utilisation est très simple
puisqu'il suffit de référencer sa DLL puis de légèrement modifier la façon de
déclarer les routes dans le Globas.asax.

## Installer

* Faire un clic droit sur la branche "Référence" du projet et sélectionner le
sous-menu "Manage NuGet Packages…".
* Rechercher "lowercase"
* Demander à installer le package "LowercaseRouteMVC"
* Lire et accepter la licence

## Modifier

* Ouvrir le fichier "Global.asax"
* Ajouter un `using LowercaseRouteMVC;` au bon endroit
* Modifier la procédure "RegisterRoutes" pour remplacer
`route.MapRoute` par `route.MapRouteLowercase`

```
using LowercaseRoutesMVC;
  ...
public static void RegisterRoutes(RouteCollection routes)
{
  routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

  routes.MapRouteLowercase(
    "Default", // Route name
    "{controller}/{action}/{id}", // URL with parameters
    new { controller = "Home", action = "Index", id = UrlParameter.Optional } // Parameter defaults
  );
```

## Terminé

* Lancer l'exécution par F5
* Les URLs générées par l'application ne contiennent plus que des noms de
contrôleurs et d'actions en minuscules :)
