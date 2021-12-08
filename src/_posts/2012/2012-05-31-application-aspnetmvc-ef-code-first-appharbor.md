---
date: 2012-05-31 23:24:00
layout: post
redirect_from: "post/2012/05/31/application-asp-net-mvc-avec-ef-code-first-sur-appharbor"
tags: ef, mvc
title: "Application ASP.NET MVC avec EF Code First sur AppHarbor"
---

Je viens de déployer ma première application ASP.NET MVC + Entity Framework
Code First sur AppHarbor et je note vite tout ce que j'ai fait pour m'y
retrouver plus tard.

Inspiré par le tutoriel [Automatic migrations with Entity Framework 4.3](http://blog.appharbor.com/2012/04/24/automatic-migrations-with-entity-framework-4-3) j'ai commencé
par créer une application qui puisse fonctionner sur AppHarbor.

Je suis parti de cet exemple pour trois raisons :

* je n'ai pas trouvé d'exemple prêt à l'emploi d'une application ASP.NET MVC
+ Code First dans les GitHubs de [AppHarbor](https://github.com/appharbor) ou de [Michael Friis](https://github.com/friism). Il y a des exemples pour [PostgreSQL](https://github.com/appharbor/PostgreSQL-Sample-MVC-Application) ou [MySql](https://github.com/appharbor/MySQL-MVC-Application)
(mais c'est du NHibernate) ou pour [Entity Framework](https://github.com/friism/AppHarbor-Entity-Framework-Example), mais c'est du "non Code First".

* ca me donne l'occasion de faire d'une pierre deux coups et d'essayer la
migration automatique de Entity Framework

* et pour finir, c'est un exemple qui utilise SQL Server Compact en local (ce
que j'ai tendance à faire) et Sql Server en production en expliquant comment
configurer la transformation dans le fichier Web.Release.config.

## Etape 1 : Créer un nouveau projet sous Visual Studio 2010

### Nouveau projet...

![](/public/2012/ah1-01-nouveau-projet.jpg)

"HarborFirstTest" pour AppHarbor Code First Test

![](/public/2012/ah1-02-nouveau-mvc3.jpg)

Et voila :

![](/public/2012/ah1-03-explorateur-solution.jpg)

### Mise à jour des références

Clic-droit sur le projet, Gérer les packages NuGet... pour faire une mise à
jour

![](/public/2012/ah1-04-maj-nuget.jpg)

### Nettoyage du projet

Supprimer :

* /Scripts/Microsoft\*.\*
* /README.jQuery.vsdoc.txt
* /Controllers/AccountController.cs
* /Models/AccountModels.cs
* /Views/Account
* /Views/Shared/_LogOnPartial.cshtml

Mise à jour de /Views/Shared/_Layout.cshtml pour refléter tout ça :

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>@ViewBag.Title</title>
    <link href="@Url.Content("~/Content/Site.css")" rel="stylesheet" type="text/css" />
    <script src="@Url.Content("~/Scripts/jquery-1.7.2.min.js")" type="text/javascript"></script>
    <script src="@Url.Content("~/Scripts/modernizr-2.5.3.js")" type="text/javascript"></script>
</head>
<body>
    <div class="page">
        <header>
            <div id="title">
                <h1>My MVC Application</h1>
            </div>
            <div id="logindisplay">
                &nbsp;
            </div>
            <nav>
                <ul id="menu">
                    <li>@Html.ActionLink("Home", "Index", "Home")</li>
                    <li>@Html.ActionLink("About", "About", "Home")</li>
                </ul>
            </nav>
        </header>
        <section id="main">
            @RenderBody()
        </section>
        <footer>
        </footer>
    </div>
</body>
</html>
```

### Tests

Générer / Regénérer la solution, ça compile. Déboguer / Démarrer le
débogage, ça marche.

## Etape 2 : Ecriture du code

Par rapport au tutoriel je ne fais pas un projet "Core" et un projet "Web",
mais je met tout dans un seul projet (ce qui a l'avantage de passer avec Visual
Studio Express).

### /Models/Entity.cs

```
namespace HarborFirstTest.Models
{
    public abstract class Entity
    {
        public int Id { get; set; }
    }
}
```

### /Models/User.cs

```
namespace HarborFirstTest.Models
{
    public class User : Entity
    {
        public string Name { get; set; }
    }
}
```

### /Persistence/HftContext.cs

```
using System.Data.Entity;
using HarborFirstTest.Models;

namespace HarborFirstTest.Persistence
{
    public class HftContext : DbContext
    {
        public DbSet<User> Users { get; set; }
    }
}
```

Le "Hft" de HftContext est pour Harbor First Test

### /Controllers/HomeController.cs

```
using System.Web.Mvc;
using HarborFirstTest.Models;
using HarborFirstTest.Persistence;

namespace HarborFirstTest.Controllers
{
    public class HomeController : Controller
    {
        private readonly HftContext _context = new HftContext();

        public ActionResult Index()
        {
            return View(_context.Users);
        }

        public ActionResult Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
```

### /Views/Home/Index.cshtml

```
@model IEnumerable<HarborFirstTest.Models.User>

<h2>Index</h2>

<ul>
    @foreach (var user in Model)
    {
        <li>@user.Name</li>
    }
</ul>

@using (Html.BeginForm("Create", "Home", FormMethod.Post))
{
    <input type="text" name="Name" />
    <input type="submit" value="Submit" />
}
```

### /Web.config

Mise à jour de la section &lt;connectionStrings&gt; pour :

* supprimer la clé `ApplicationServices` qui définissait la
connexion liée à la gestion des comptes utilisateurs (puisque tout Account  - a
été supprimé)
* ajouter la clé `HftContext` pour définir la connexion à la base
de données SQL Server CE de mon application

```
  <connectionStrings>
    <add name="HftContext"
         connectionString="Data Source=|DataDirectory|hft_data.sdf"
         providerName="System.Data.SqlServerCe.4.0" />
  </connectionStrings>
```

### Tests

Générer / Regénérer la solution, ça compile. Déboguer / Démarrer le
débogage, ça marche. Créer quelques utilisateurs, ça passe !

![](/public/2012/ah1-05-premier-essai.jpg)

Et pour être sûr que les tests unitaires ne poseront pas problème lors du
déploiement vers AppHarbor, mise à jour de HomeControllerTest.cs :

```
using System.Web.Mvc;
using HarborFirstTest.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace HarborFirstTest.Tests.Controllers
{
    [TestClass]
    public class HomeControllerTest
    {
        [TestMethod]
        public void About()
        {
            // Arrange
            HomeController controller = new HomeController();

            // Act
            ViewResult result = controller.About() as ViewResult;

            // Assert
            Assert.IsNotNull(result);
        }
    }
}
```

## Etape 3 : Modifier le modèle de données

### /Models/User.cs

```
namespace HarborFirstTest.Models
{
    public class User : Entity
    {
        public string Name { get; set; }
        public string EmailAddress { get; set; }
    }
}
```

### /Views/Home/Index.cshtml

```
@model IEnumerable<HarborFirstTest.Models.User>

<h2>Index</h2>

<ul>
    @foreach (var user in Model)
    {
        <li>@user.Name (@user.EmailAddress)</li>
    }
</ul>

@using (Html.BeginForm("Create", "Home", FormMethod.Post))
{
    <input type="text" name="Name" />
    <input type="text" name="EmailAddress" />
    <input type="submit" value="Submit" />
}
```

### Tests

Générer / Regénérer la solution, ça compile. Déboguer / Démarrer le
débogage, ça plante.

![](/public/2012/ah1-06-migrer-ou-ne-pas-migreri.jpg)

> The model backing the 'HftContext' context has changed since the database
> was created. Consider using Code First Migrations to update the database
> (<http://go.microsoft.com/fwlink/?LinkId=238269>).

C'était prévu !

### /Persistence/Configuration.cs

Puisqu'on a modifié le modèle de données, on va devoir configurer le système
de migration de Entity Framework (de la façon la plus basique qui soit pour
l'instant).

```
using System.Data.Entity.Migrations;

namespace HarborFirstTest.Persistence
{
    public class Configuration : DbMigrationsConfiguration<HftContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
        }
    }
}
```

### /Persistence/HftContext.cs

Et on présente cette configuration à notre `DbContext`.

```
using System.Data.Entity;
using HarborFirstTest.Models;

namespace HarborFirstTest.Persistence
{
    public class HftContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<HftContext, Configuration>());
        }
    }
}
```

### Tests

Générer / Regénérer la solution, ça compile. Déboguer / Démarrer le
débogage, ça marche. Créer d'autres utilisateurs, ça repasse !

![](/public/2012/ah1-07-apres-migration.jpg)

## Etape 4 : Déployer vers AppHarbor

Enfin ! Pour cette dernière étape, je me suis aussi inspiré des billets
[Deploy to AppHarbor using GitHub for Windows](http://blog.appharbor.com/2012/05/25/deploy-to-appharbor-using-github-for-windows), [Announcing GitHub support](http://blog.appharbor.com/2011/10/13/announcing-github-support) et [Use NuGet Package Restore to avoid pushing packages to
AppHarbor](http://blog.appharbor.com/2012/02/06/use-nuget-package-restore-to-avoid-pushing-packages-to-appharbor) qu'il est donc impératif de lire dans leur intégralité.

### Créer l'application dans AppHarbor

![](/public/2012/ah1-08-creer-apphabor.jpg)

### Installer et configurer l'add-on SQL Server "Yocto"

![](/public/2012/ah1-09-addon-yocto.jpg)

![](/public/2012/ah1-10-configurer-yocto.jpg)

![](/public/2012/ah1-11-goto-yocto.jpg)

![](/public/2012/ah1-12-alias-yocto.jpg)

![](/public/2012/ah1-13-edit-alias.jpg)

Tout le monde a suivi ?

### Passer l'application sous Git

Lancer GitHib for Windows, chercher "+ add" et cliquer dessus pour "create a
new repository".

![](/public/2012/ah1-14-creer-git.jpg)

Perso, je modifie le fichier .gitignore généré en :

```
*resharper.user
[Aa]pp_[Dd]ata/
[Dd]ebug/
[Rr]elease/
build/
[Bb]in/
[Oo]bj/
[Tt]est[Rr]esults/
*.suo
*.cache
_ReSharper.*/
*.user
deploy
deploy/*
packages/
```

### Relier AppHarbor et GitHub

Aller sur AppHarbor, chercher "Build Url" et cliquer dessus

![](/public/2012/ah1-15-infos-github.jpg)

Et coller le presse-papier dans Notepad

![](/public/2012/ah1-16-notepad.jpg)

Aller sur GitHub, sur le repository créé à l'instant par GitHub for Windows,
soit michelc/HarborFirstTest dans mon cas, puis

* chercher "Admin" et cliquer dessus
* chercher "Service Hooks" et cliquer dessus
* chercher "AppHarbor" et cliquer dessus

Faire du copier / coller depuis Notepad pour renseigner du mieux
possible

![](/public/2012/ah1-17-appharbor-hook.jpg)

C'est presque fini !

### NuGet Package Restore

Depuis NuGet 1.6, il n'est plus obligatoire d'inclure les packages dans le
repository (cf [Using NuGet without committing packages to source
control](http://docs.nuget.org/docs/workflows/using-nuget-without-committing-packages)).

C'est pas compliqué, yaka cliquer droit sur la solution et sélectionner
"Activer la restauration du package NuGet" et répondre "Oui" à la question
posée.

Penser à vérifier que .gitignore exclue le répertoire "packages" du
repository (ma version le fait).

### J'ai failli oublier

Pour que l'application déployée sur AppHarbor utilise l'add-on SQL SErver
Yocto qu'on avait sélectionné plus haut, il faut modifier notre chaîne de
connexion dans le Web.config.

En local, on a :

```
  <connectionStrings>
    <add name="HftContext"
         connectionString="Data Source=|DataDirectory|hft_data.sdf"
         providerName="System.Data.SqlServerCe.4.0" />
  </connectionStrings>
```

En production sur AppHarbor, il faudra qu'on ait quelque chose du
genre :

```
  <connectionStrings>
    <add name="HftContext"
         connectionString="Server=sssssssssssss.sqlserver.sequelizer.com;Database=ddddddddddddd;User ID=uuuuuuuuuuuuu;Password=ppppppppppppp;"
         providerName="System.Data.SqlClient" />
  </connectionStrings>
```

Et c'est là que Web.Release.config fait sa transformation :

```
<?xml version="1.0"?>
<configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
  <connectionStrings>
    <add xdt:Locator="Condition([@name='HftContext'])" providerName="System.Data.SqlClient"
        xdt:Transform="SetAttributes" />
  </connectionStrings>
  <system.web>
    <compilation xdt:Transform="RemoveAttributes(debug)" />
  </system.web>
</configuration>
```

En fait, il gueule un peu parce que "L'attribut requis de 'connectionString'
est manquant" et que "L'attribut requis de 'name' est manquant", mais faut pas
l'écouter.

Pour information, le Web.Release.config se charge de remplacer le
`providerName` de "System.Data.SqlServerCe.4.0" en
"System.Data.SqlClient".

Puis après c'est la magie de AppHarbor qui remplace la
`connectionString` de "Data Source=|DataDirectory|hft_data.sdf" en
ce qui va bien.

### Initial Commit

Allez, on revient dans GitHub for Windows pour faire le premier commit du
projet

![](/public/2012/ah1-18-premier-commit.jpg)

### Publish, Build &amp; Deploy

On reste dans GitHub for Windows pour cliquer sur "publish" en haut de
l'écran et envoyer notre application vers GitHub et de là vers AppHarbor :)

* Sur GitHub le repository est mis à jour
* Sur AppHarbor, l'application est reçue, buildée puis déployée

Yapluska lancer et ça plante à cause d'une faute de frappe dans
Web.Release.config !

Je commite la correction, fait un "sync" (y'a plus le "publish") et je peux
enfin goto mon application : <http://harborfirsttest.apphb.com/>.

![](/public/2012/ah1-19-finito.jpg)

J'ai bien fait de tout noter à chaud, parce que s'il faut que je
ré-explique, ou pire que je re-fasse, je sais pas si j'y arriverais sans ça.
Quoiqu'il en soit, le source complet de ce premier essai est disponible sur
GitHub : <https://github.com/michelc/HarborFirstTest>.
