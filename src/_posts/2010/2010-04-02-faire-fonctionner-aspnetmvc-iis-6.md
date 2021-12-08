---
date: 2010-04-02 15:54:00
layout: post
redirect_from: "post/2010/04/02/faire-fonctionner-asp-net-mvc-sur-iis-6"
tags: mvc
title: "Faire fonctionner ASP.NET MVC sur IIS 6"
---

Voici la façon la plus simple possible qui soit pour qu'une application
ASP.NET MVC puisse être installée et fonctionner sur un serveur IIS 6 qui n'y
est pas préparé. Personnellement, j'ai dû refaire ça hier et j'avais presque
oublié comment m'y prendre. Donc, pour ne pas prendre de risque, je préfère
noter tout ça pour la prochaine fois où je pourrais en avoir besoin.

Concrètement, je n'ai rien inventé et tout vient du billet de Phil
Haack : [ASP.NET MVC on IIS 6 Walkthrough](http://haacked.com/archive/2008/11/26/asp.net-mvc-on-iis-6-walkthrough.aspx).

## Ajouter l'extension .aspx aux routes MVC

Pour que MVC fonctionne sur un IIS 6 où ASP.NET s'attend à avoir des URLs
avec des extensions ".aspx", il faut commencer par mettre à jour les routes
définies dans le fichier Global.asax.cs pour qu'elles prennent en compte cette
extension.

### Comment faire

Pour cela, il faut modifier la méthode RegisterRoutes comme
ci-dessous :

```
public static void RegisterRoutes(RouteCollection routes)
{
  routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

  routes.MapRoute(
    "Default",
    "{controller}.aspx/{action}/{id}",
    new { action = "Index", id = "" }
  );

  routes.MapRoute(
    "Root",
    "",
    new { controller = "Home", action = "Index", id = "" }
  );
}
```

La première route (nommée "Default") fait qu'on aura plus des URLs du style
"http://www.example.com/Controller/Action/Id" mais
"http://www.example.com/Action**.aspx**/Action/Id" que IIS 6 sait
très bien gérer.

La seconde route (nommée "Root") est nécessaire pour gérer l'URL
"http://www.example.com/" que la route "Default" ne sait plus prendre en compte
puisqu'elle attend une extension ".aspx".

### Remarque

Pour que l'URL "http://www.example.com/" fonctionne, il faut également
penser à configurer IIS pour que le fichier Default.aspx soit un des documents
par défaut du site (à la place ou en plus des fichiers Index.aspx,
Index.htm...).

### Attention

Etant donné que nos URLs prennent des ".aspx", il faut aussi modifier le
fichier Web.Config pour mettre à jour l'URL qui y est paramétrée pour effectuer
l'authentification. Rechercher "loginUrl=" et remplacer :

```
<forms loginUrl="~/Account/LogOn" ...
```

Par :

```
<forms loginUrl="~/Account.aspx/LogOn" ...
```

Après ce gros morceau, il ne devrait pas y avoir d'autre problème avec les
URLs. Sauf si on a codé en dur des liens au lieu d'utiliser les helpers
Html.ActionLink() ou Url.Action() qui vont bien... Mais ça, c'est le métier qui
rentre.

## Installer ASP.NET MVC sur le serveur IIS 6

Je rigole. C'est beaucoup trop compliqué à faire.

Par contre, ce qui est beaucoup plus fastoche, c'est de copier
System.Web.Mvc.dll dans le répertoire "bin" de l'application !

## Un dernier truc

Tant qu'à faire de modifier le Web.Config, autant en profiter pour lui
ajouter la ligne :

```
<customErrors mode="Off" />
```

Au moins, avec ça, si jamais il y a un problème on est sûr d'avoir un bel
écran jaune avec des messages d'erreur en pagaille.
