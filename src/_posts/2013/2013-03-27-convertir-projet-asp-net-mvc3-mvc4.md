---
date: 2013-03-27 22:06:00
layout: post
redirect_from: "post/2013/03/27/convertir-un-projet-asp-net-mvc3-en-mvc4"
tags: mvc
title: "Convertir un projet ASP.NET MVC 3 en MVC 4"
---

J'ai migré mon application [Répertoir](http://repertoir.apphb.com/) vers ASP.NET MC 4. Comme le dit la doc :

> The simplest way to upgrade is to create a new ASP.NET MVC 4 project and
> copy all the views, controllers, code, and content files from the existing MVC
> 3 project to the new project. [Upgrading an ASP.NET MVC 3 Project to ASP.NET MVC 4](http://www.asp.net/whitepapers/mvc4-release-notes#_Toc303253806)

## Créer un projet ASP.NET MVC 4 réellement vide

Note : le projet vide est déjà pas mal vide, mais il
intègre Web API par défaut et je n'en ai pas l'utilité.

### Créer un projet "Empty"

* Renommer le dossier C:\MVC\Repertoir en C:\MVC\Repertoir3
* Sous Visual Studio 2010, créer un nouveau projet "Repertoir" de type
"ASP.NET MVC 4 Web Application" dans le dossier "C:\MVC"
* Sélectionner le template "Empty" avec bien évidemment :
  - Razor comme View Engine
  - Ok pour créer le projet de test unitaire

### Supprimer Web API du projet

* Pour le projet Repertoir : Références, clic-droit et "Gérer les
packages NuGet..."
* Désinstaller "Microsoft ASP.NET Web API" => signale que va aussi
désinstaller :
  - Microsoft.AspNet.WebApi.WebHost
  - Microsoft.AspNet.WebApi.Core
  - Microsoft.AspNet.WebApi.Client
  - Newtonsoft.Json
  - Microsoft.Net.Http
* Confirmer que c'est OK => il ne reste plus que :
  - Microsoft.AspNet.Mvc
  - Microsoft.AspNet.Razor
  - Microsoft.AspNet.WebPages
  - Microsoft.Web.Infrastructure

### Supprimer Web API du projet de test unitaire

* Pour le projet Repertoir.Tests : Références, clic-droit et "Gérer les
packages NuGet..."
* Désinstaller "Microsoft.AspNet.WebApi.WebHost" => signale que va aussi
désinstaller :
  - Microsoft.AspNet.WebApi.Core
  - Microsoft.AspNet.WebApi.Client
  - Newtonsoft.Json
  - Microsoft.Net.Http
* Confirmer que c'est OK => il ne reste plus que :
  - Microsoft.AspNet.Mvc
  - Microsoft.AspNet.Razor
  - Microsoft.AspNet.WebPages
  - Microsoft.Web.Infrastructure

### Finaliser le projet vide

* Dans le projet Repertoir / App_Start, supprimer le fichier
WebApiConfig.cs
* Dans Repertoir / Global.asax.cs, supprimer la ligne
`WebApiConfig.Register(GlobalConfiguration.Configuration);` dans
Application_Start().
* Vérifier que tout est OK :
  - Fichier / Enregistrer tout
  - Générer / Regénérer la solution
  - => La regénération globale a réussi

## Ajouter quelques packages

Avant de commencer, faire un clic-droit sur la solution "Repertoir" et
sélectionner "Activer la restauration du package NuGet".

Ensuite, faire clic-droit sur Repertoir /Références et "Gérer les packages
NuGet..." pour installer les packages dont j'ai besoin :

* AutoMapper
* EntityFramework
* jQuery
* jQuery.Validation
* LowercaseRoutesMVC (pas LowercaseRoutesMVC4 puisque Web API a été
éjecté)
* Microsoft.jQuery.Unobtrusive.Validation
* MiniProfiler
* MiniProfiler.EF
* Modernizr

Puis clic-droit sur Repertoir.Tests /Références et "Gérer les packages
NuGet..." pour installer les packages suivants :

* EntityFramework
* Moq
* MvcRouteUnitTester

Vérifier que tout est OK :

* Fichier / Enregistrer tout
* Générer / Regénérer la solution
* => La regénération globale a réussi

## Copier les sources du projet MVC 3 vers MVC 4

Dans le cas du projet Repertoir, cela consiste à copier :

* le contenu de /App_Data
* le répertoire /Contents
* le contenu de /Controllers
* le répertoire /Helpers
* le contenu de /Models
* le fichier /Scripts/chosen.jquery.fr.js
* le fichier /Scripts/gmaps.js
* le contenu de /Views (à l'exception du Web.Config)

Et ne pas oublier d'inclure ces différents fichiers dans le projet (à
l'exception des fichiers contenus dans /App_Data)

Pour le projet Repertoir.Tests, il faut copier :

* le répertoire /Controllers
* le répertoire /Helpers
* le fichier /RoutesTest.cs

Là aussi, penser à inclure ces nouveaux fichiers dans le projet.

### Mettre à jour les fichiers de configuration

* Repertoir/Web.Config :
  - recopier la section &lt;connectionStrings&gt;
  - &lt;customErrors mode="RemoteOnly" defaultRedirect="~/Error" /&gt;
  - Les sections &lt;authentication&gt;, &lt;membership&gt;, &lt;profile&gt; et
&lt;roleManager&gt; sont absentes (sans doute parce que je suis parti d'un
template vide) mais je n'en ai pas besoin.
* Repertoir/Web.Release.Config : recopier celui de Repertoir3 (pour la
transformation lors de la mise en production sur Appharbor)
* Repertoir/Views/Web.Config : ajouter &lt;add
namespace="Repertoir.Helpers" /&gt; à &lt;system.web.webPages.razor&gt;
* Repertoir.Tests/App.Config : recopier la section
&lt;connectionStrings&gt;

### Adapter le Global.asax

```
using System;
using System.Web.Mvc;
using System.Web.Routing;
using Repertoir.Helpers;
using Repertoir.Models;
using StackExchange.Profiling;

namespace Repertoir
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            ModelBinders.Binders.Add(typeof(string), new StringModelBinder());

            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new RazorViewEngine());

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            AutoMapperConfiguration.Configure();

            MiniProfilerEF.Initialize(true);
        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            if (Request.IsLocal) MiniProfiler.Start();
        }

        protected void Application_EndRequest(object sender, EventArgs e)
        {
            MiniProfiler.Stop();
        }
    }
}
```

### Mise au point des routes

Il faut également adapter /App_Start/RouteConfig.cs pour tenir compte de la
route "Id_Slug" et du fait que j'utilise LowercaseRoutesMVC.

```
using System.Web.Mvc;
using System.Web.Routing;
using LowercaseRoutesMVC;

namespace Repertoir
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRouteLowercase(
                name: "Id_Slug",
                url: "{controller}/{action}/{id}/{slug}",
                defaults: new { controller = "Contacts", action = "Index" }
            );

            routes.MapRouteLowercase(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Contacts", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
```

### Vérifier que tout est OK

* Fichier / Enregistrer tout
* Générer / Regénérer la solution

=> 5 erreurs "Repertoir.MvcApplication ne contient pas de définition pour
RegisterRoutes" dans le projet Repertoir.Tests

Remplacer 5 fois la ligne :

```
MvcApplication.RegisterRoutes(routes);
```

par :

```
RouteConfig.RegisterRoutes(routes);
```

Revérifier que tout est OK

* Fichier / Enregistrer tout
* Générer / Regénérer la solution

=> La regénération globale a réussi

## Lancer les tests unitaires

Test / Exécuter / Tous les tests de la solution

=> 2 erreurs sur 151 tests

Les deux tests TestIncomingRoutes et TestOutgoingRoutes lèvent une exception
System.InvalidOperationException parce que la classe Repertoir.MvcApplication
n'a pas de méthode RegisterRoutes. Problème un peu plus compliqué, mais
[pas insoluble](http://mvcrouteunittester.codeplex.com/discussions/387822). Là encore, il faut remplacer la ligne :

```
var tester = new RouteTester<MvcApplication>();
```

par :

```
var routes = new RouteCollection();
RouteConfig.RegisterRoutes(routes);
var tester = new RouteTester(routes);
```

Test / Exécuter / Tous les tests de la solution

=> 151/151 réussi(s)

## Lancer l'application

Boum !

> L'exception SqlCeException n'a pas été gérée par le code utilisateur
>
> The column name is not valid. [ Node name (if any) = c,Column name =
> CreatedOn ]

Zut ! J'avais complètement oublié ça : [SqlException on EF 5 w/ .NET 4.5](http://community.miniprofiler.com/permalinks/99/sqlexception-on-ef-5-w-net-4-5) => [Entity Framework 5 expects CreatedOn column from MigrationHistory
table](http://stackoverflow.com/questions/11979026/entity-framework-5-expects-createdon-column-from-migrationhistory-table).

Mais moi j'utilise SQL Server CE, alors ça le fait pas avec le truc pour
"System.Data.SqlClient.SqlException". Sous Visual Studio, il faut donc aller
dans Debug / Windows / Exception Settings. Dans l'entrée "Common Language
Runtime Exceptions", il faut ajouter l'exception
"System.Data.SqlServerCe.SqlCeException" et ne pas cocher la case "Break When
Thrown" puis clic-droit dessus pour vérifier que l'action "Continue when
unhandled in user code" n'est pas activée.

Et enfin tout marche !!!!

Quoique. Pour que le déploiement fonctionne sur AppHarbor, il faut s'assurer que
le Build Action des 2 fichiers "Web.Debug.config" et "Web.Release.config" est
bien à "Content" (et pas à "None").


## Rebrancher Git

C'est là que la magie opère : copier le dossier ".git" et les fichiers
".gitattributes", ".gitignore" et "readme.md" de l'ancien projet
C:\MVC\Repertoir3 vers le nouveau projet dans C:\MVC\Repertoir. C'est pas avec
SourceSafe qu'on pourrait jouer à des trucs pareils...

Puis lancer Github for Windows et commiter "Migration ASP.NET MVC 4".
