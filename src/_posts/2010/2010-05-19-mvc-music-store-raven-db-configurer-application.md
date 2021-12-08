---
date: 2010-05-19 13:12:00
layout: post
redirect_from: "post/2010/05/19/mvc-music-store-raven-db-configurer-application"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : Configurer l'application"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: Setting up the
application](http://ayende.com/Blog/archive/2010/05/19/porting-mvc-music-store-to-raven-setting-up-the-application.aspx)", le deuxième de la série consacrée au portage de l'application
MVC Music Store sous RavenDB par Oren Eini, alias Ayende Rahien.

Juste quelques mots sur la façon de configurer Raven pour l'utiliser avec
l'application MVC Music Store avant de me lancer dans le développement du reste
du code.

* Le fonctionnement retenu est (délibérément) très proche de celui employé
avec NHibernate. Nous initialisons un objet DocumentStore au démarrage de
l'application.

* Puis nous gérons l'ouverture / fermeture des sessions dans le cadre de la
requête HTTP, complété par une méthode CurrentSession() pour accéder à la
session en cours.

* Si l'application avait employé un conteneur, j'aurais fait en sorte que les
contrôleurs récupèrent une instance de la session par son intermédiaire. Mais
comme il n'y en a pas, je m'en tiens à une méthode statique.
  - Si cela ne vous plait vraiment pas, n'hésitez pas à proposer autre
chose.

```
public class MvcApplication : System.Web.HttpApplication
{
    private const string RavenSessionKey = "Raven.Session";
    private static DocumentStore _documentStore;

    protected void Application_Start()
    {
        _documentStore = new DocumentStore { Url = "http://localhost:8080/" };
        _documentStore.Initialise();

        AreaRegistration.RegisterAllAreas();

        RegisterRoutes(RouteTable.Routes);
    }

    public MvcApplication()
    {
        BeginRequest += (sender, args) => HttpContext.Current.Items[RavenSessionKey] = _documentStore.OpenSession();
        EndRequest += (o, eventArgs) =>
        {
            var disposable = HttpContext.Current.Items[RavenSessionKey] as IDisposable;
            if (disposable != null)
                disposable.Dispose();
        };
    }

    public static IDocumentSession CurrentSession
    {
        get { return (IDocumentSession)HttpContext.Current.Items[RavenSessionKey]; }
    }
}
```

Et c'est à peu près tout, du moins en ce qui concerne l'initialisation de
Raven.
