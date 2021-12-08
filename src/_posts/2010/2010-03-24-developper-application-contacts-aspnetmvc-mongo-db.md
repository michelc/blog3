---
date: 2010-03-24 22:10:00
layout: post
redirect_from: "pages/developper-une-application-de-contacts-avec-asp-net-mvc-mongo-db-et-norm"
tags: net, mongodb, mvc, nosql, tutoriel
title: "Développer une application de contacts avec ASP.NET MVC et MongoDB"
---

Dans ce tutoriel je vais reconstruire à peu près à l'identique l'application
de gestion de contacts qui est développée au cours de la [première
étape du tutoriel ContactManager](http://msdn.microsoft.com/fr-fr/asp.net/dd627564.aspx). Le but n'est pas de créer une application
de référence, mais seulement de reprogrammer cette application en utilisant une
base de données MongoDB pour stocker les données.

Par conséquent, ce tutoriel sera un simple plagiat du tutoriel d'origine, ce
qui me donnera l'occasion de tester l'utilisation d'une base de données MongoDB
pour stocker les données et d'essayer la librairie NoRM repérée sur le blog de
Rob Conery (<http://blog.wekeroad.com/2010/03/04/using-mongo-with-linq>).

## Créer le projet ASP.NET MVC

Lancez Visual Studio et choisissez "Fichier, Nouveau, Projet...". Lorsque la
fenêtre "Nouveau projet" apparait (Figure 1), choisissez le type de projet
"Web" puis le modèle "ASP.NET MVC Web Application" et donnez le nom
MongoContact à votre projet avant de cliquer sur OK.

Note: Il faut bien avoir sélectionné .NET Framework 3.5
dans la liste déroulante en haut à droite de la fenêtre "Nouveau projet" sans
quoi le modèle de projet ASP.NET MVC n'apparaîtra pas.

![](/public/2010/image001.jpg)

Figure 1: La fenêtre de création du projet

La fenêtre "Create Unit Test Project" apparaît (Figure 2). Vous pouvez
utiliser cette fenêtre pour indiquer que vous souhaitez créer et ajouter un
projet de tests unitaires à votre solution pendant que vous êtes en train de
créer une application ASP.NET MVC. Normalement, nous n'allons pas réaliser de
tests unitaires au cours ce tutoriel, mais il est malgré tout conseillé de
conserver l'option "Yes, create a unit test project" parce qu'il est beaucoup
plus simple de définir un projet de tests dès la création d'une solution
ASP.NET MVC.

Note: Etant donné que Visual Web Developer ne gère pas les
projets de type MS Test, cette fenêtre ne vous sera proposée que si vous avez
installé un autre framework de tests unitaires tel que NUnit.

![](/public/2010/image002.jpg)

Figure 2: La fenêtre d'ajout d'un projet de tests unitaires

L'application ASP.NET MVC apparait dans l'explorateur de solution Visual
Studio (Figure 3). Vous pouvez constater que la solution contient 2 projets: le
projet ASP.NET MVC lui-même et le projet de tests unitaires. Le projet MVC
s'appelle MongoContact et le projet de tests s'appelle MongoContact.Tests.

![](/public/2010/image003.jpg)

Figure 3: L'explorateur de solution

## Supprimer les fichiers d'exemple

Le modèle de projet ASP.NET MVC contient des exemples d'implémentation pour
des contrôleurs et des vues. Avant de continuer à créer notre application, vous
devez supprimer ces fichiers. Vous pouvez les supprimer en vous rendant dans
l'explorateur de solution, en cliquant droit sur un fichier ou un répertoire et
en retenant l'option "Delete".

Vous devrez alors supprimer les fichiers suivant depuis le projet ASP.NET
MVC:

* \Controllers\HomeController.cs
* \Views\Home\About.aspx
* \Views\Home\Index.aspx

Ainsi que le fichier suivant depuis le projet de tests:

* \Controllers\HomeControllerTest.cs

Une fois ces modifications terminées, vous pouvez compiler l'application en
lançant les commandes "Générer, Régénérer la solution" avant d'enregistrer la
solution MongoContact à l'aide de la commande "Fichier, Enregistrer tout".

## Installer MongoDB

Notre application MongoContact est une application web orientée base de
données. Nous utiliserons donc une base de données pour stocker les
informations de nos contacts.

Le framework ASP.NET MVC fonctionne avec l'ensemble des bases de données
modernes du marché comme Microsoft SQL Server, Oracle, MySQL et IBM DB2. Dans
ce tutorial, nous viserons l'avant-garde de la modernité en utilisant une base
de données NoSQL, en l'occurrence MongoDB.

Par conséquent, vous allez devoir installer MongoDB sur votre ordinateur
avant de poursuivre la réalisation de l'application de gestion de contacts.
Pour cela, il faut se rendre sur le site internet de MongoDB à l'URL <http://www.mongodb.org/> pour:

* Télécharger la version de MongoDB adaptée à notre système
d'exploitation
* Décompacter le fichier téléchargé dans le répertoire C:\Mongo
* Créer le répertoire C:\Data qui est utilisé par défaut pour enregistrer les
bases de données
* Lancer le programme C:\Mongo\bin\mongod.exe

Le programme mongod.exe est le daemon pour MongoDB et une fois que vous
l'avez lancé, vous êtes fin prêt pour travailler. Si jamais cela ne
fonctionnait pas, c'est très certainement que vous n'avez pas récupéré la bonne
version de MongoDB (il existe une version 32 bits et une 64 bits) ou alors que
vous n'avez pas créé le répertoire C:\Data.

## Installer le provider LINQ pour MongoDB

Il est nécessaire d'installer un pilote pour pouvoir utiliser une base de
données MongoDB avec C#. Jusqu'à présent, il existait le projet mongodb-csharp
(<http://github.com/samus/mongodb-csharp>) pour cela, mais le but de ce
tutoriel est d'expérimenter NoRM, une librairie LINQ pour MongoDB.

A l'heure où j'écris ce tutoriel, ce pilote en est à ses toutes premières
versions et il est téléchargeable sur GitHub. Personnellement, je suis parti de
la version de Rob disponible à l'URL: <http://github.com/robconery/NoRM>. Une fois celui-ci récupéré, il faut
commencer par le compiler en mode Release pour pouvoir recopier le fichier
NoRM.dll et l'enregistrer dans un sous-répertoire "lib" du répertoire contenant
notre solution MongoContact (Figure 4).

![](/public/2010/image004.jpg)

Figure 4: Les répertoires de la solution MongoContact

Il faut ensuite référencer ce fichier NoRM.dll au niveau du projet
MongoContact (Figure 5).

![](/public/2010/image005.jpg)

Figure 5: Ajouter une référence à LINQ to MongoDB

Et pour finir, nous allons ajouter un fichier MongoSession.cs (Listing 1)
dans le répertoire Models du projet pour y adapter le pattern UnitOfWork
proposé par Rob Conery.

### Listing 1: Models\MongoSession.cs

```
using System;
using System.Linq;
using NoRM;
using NoRM.Linq;

namespace MongoContact.Models
{
    public class MongoSession : IDisposable
    {
        MongoQueryProvider _provider;

        public MongoSession()
        {
            _provider = new MongoQueryProvider("ContactManager");
        }

        public MongoQueryProvider Provider
        {
            get
            {
                return _provider;
            }
        }

        public IQueryable<Contact> Contacts
        {
            get { return new MongoQuery<Contact>(_provider); }
        }

        public T MapReduce<T>(string map, string reduce)
        {
            T result = default(T);
            using (var mr = _provider.Server.CreateMapReduce())
            {
                var response = mr.Execute(new MapReduceOptions(typeof(T).Name) { Map = map, Reduce = reduce });
                var coll = response.GetCollection<MapReduceResult>();
                var r = coll.Find().FirstOrDefault();
                result = (T)r.Value;
            }
            return result;
        }

        public void Add<T>(T item) where T : class, new()
        {
            _provider.DB.GetCollection<T>().Insert(item);
        }

        public void Update<T>(T item) where T : class, new()
        {
            _provider.DB.GetCollection<T>().UpdateOne(item, item);
        }

        public bool Updatable<T>(T item) where T : class, new()
        {
            return _provider.DB.GetCollection<T>().Updateable;
        }

        public void Drop<T>()
        {
            _provider.DB.DropCollection(typeof(T).Name);
        }

        public void Dispose()
        {
            _provider.Server.Dispose();
        }

    }
}
```

Par rapport au code d'origine de Rob, ce code présente deux différences
mineures:

· Il utilise la base de données "ContactManager" au lieu de la base de
données "test",

· Il travaille avec des objets de type "Contact" au lieu du type
"Product".

Si on tente de recompiler l'application en l'état, la compilation échoue
parce que nous n'avons pas encore défini la classe Product.

## Créer le modèle de données

Dans le tutoriel ContactManager d'origine, il faut d'abord créer la base de
données SQL Server puis lui ajouter une table Contacts et enfin générer
automatiquement la classe Contact à l'aide d'Entity Framework. Dans le cas de
MongoDB, nous procèderons différemment. Nous allons créer la classe Contact et
à partir de celle-ci, nous génèrerons la table dans la base de données MongoDB
qui sera automatiquement créée lors de la première utilisation de
l'application.

Pour créer cette classe Contact, nous ajoutons simplement un fichier
Contact.cs (Listing 2) dans le sous-répertoire Models de l'application.

### Listing 2: Models\Contact.cs

```
using NoRM;

namespace MongoContact.Models
{
    public class Contact
    {
        public ObjectId Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        public Contact()
        {
            Id = ObjectId.NewObjectId();
        }

    }
}
```

La première propriété "Id" est du type ObjectId. Il s'agit d'un type de
données défini par NoRM qui sert apparemment à gérer des identifiants
automatiques. Sa valeur est initialisée au moment de la création d'un objet
Contact grâce à la méthode statique NewObjectId().

Arrivés à ce stade, nous avons créé notre modèle de données. Nous pouvons
alors utiliser la classe Contact pour représenter un enregistrement particulier
de notre base de données dans notre application.

## Création du contrôleur par défaut

La prochaine étape consiste à créer le contrôleur Home qui sera appelé par
défaut par notre application ASP.NET MVC.

Pour créer la classe de ce contrôleur, vous devez faire un clic-droit sur le
répertoire Controllers dans l'explorateur de solution et choisir la commande
"Ajouter, Controller...", ce qui a pour effet de faire apparaitre la boite de
dialogue "Add Controller" (Figure 6). Notez la case à cocher "Add action
methods for Create, Update, and Details scenarios". Vous devez cocher cette
case avant de cliquer sur le bouton "Add" pour créer le contrôleur
HomeController.cs.

![](/public/2010/image006.jpg)

Figure 6: Ajout du contrôleur par défaut

Après avoir créé le contrôleur Home, vous obtenez le code source présenté
dans Listing 3.

### Listing 3: Controllers\HomeController.cs

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;

namespace MongoContact.Controllers
{
    public class HomeController : Controller
    {
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Home/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /Home/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Home/Create

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /Home/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /Home/Edit/5

        [AcceptVerbs(HttpVerbs.Post)]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
```

## Lister les contacts

Afin de lister les enregistrements depuis la table Contacts de notre base de
données, nous devons créer une action Index() et une vue Index. Le contrôleur
Home contient déjà une action Index(). Nous devons donc modifier cette méthode
pour qu'elle ressemble à celle du Listing 4.

### Listing 4: Controllers\HomeController.cs (action Index)

```
using MongoContact.Models;
...
namespace MongoContact.Controllers
{
    public class HomeController : Controller
    {

        private MongoSession _session = new MongoSession();

        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View(_session.Contacts.ToList());
        }

...
```

Notez que la classe du contrôleur du Listing 4 contient un champ privé nommé
_session. Ce champ _session représente les entités de notre modèle de données.
Nous utilisons le champ _session pour communiquer avec la base de données
MongoDB via NoRM.

La méthode Index() retourne une vue représentant tous les contacts de notre
table Contacts. L'expression _session.Contacts.ToList() retourne la liste des
contacts en tant que liste générique.

Maintenant que nous avons créé le contrôleur gérant l'Index, il nous faut
créer la vue associée. Avant de créer la vue Index, compilez votre application
via l'option "Générer, Régénérer la solution". Vous devez toujours compiler
votre projet avant d'ajouter une nouvelle vue afin de voir apparaître la liste
des modèles de classes dans la fenêtre "Add View".

![](/public/2010/image007.jpg)

Figure 7: Ajout de la vue Index

Créez la vue Index en cliquant-droit sur la méthode Index() et en
choisissant l'option "Add View..." (Figure 7). Dans la fenêtre "Add View" qui
apparait alors (Figure 8), cochez la case intitulée "Create a strongly-typed
view" (créer une vue fortement typée). Sélectionnez la classe de données
MongoContact.Models.Contact et retenez l'option List pour View Content. En
choisissant ces options, cela va générer une vue affichant la liste des
enregistrements de la table Contact.

![](/public/2010/image008.jpg)

Figure 8: la fenêtre d'ajout d'une vue

Lorsque vous cliquez sur le bouton "Add", la vue Index du Listing 5 est
générée pour vous. Remarquez la directive &lt;%@ Page %&gt; qui apparaît en
haut de page. La vue Index hérite de la classe
ViewPage&lt;IEnumerable&lt;MongoContact.Models.Contact&gt;&gt;. C'est ici que
s'effectue notre liaison fortement typée.

Le corps de notre vue Index contient une boucle foreach qui parcourt chacun
des contacts représenté par notre modèle de classes. La valeur de chacune des
propriétés de la classe Contact est affichée au sein d'une table HTML.

### Listing 5: Views\Home\Index.aspx (généré automatiquement)

```
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<MongoContact.Models.Contact>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
   Index
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Index</h2>

    <table>
        <tr>
            <th></th>
            <th>
                FirstName
            </th>
            <th>
                LastName
            </th>
            <th>
                Phone
            </th>
            <th>
                Email
            </th>
        </tr>

    <% foreach (var item in Model) { %>

        <tr>
            <td>
                <%= Html.ActionLink("Edit", "Edit", new { /* id=item.PrimaryKey */ }) %> |
                <%= Html.ActionLink("Details", "Details", new { /* id=item.PrimaryKey */ })%>
            </td>
            <td>
                <%= Html.Encode(item.FirstName) %>
            </td>
            <td>
                <%= Html.Encode(item.LastName) %>
            </td>
            <td>
                <%= Html.Encode(item.Phone) %>
            </td>
            <td>
                <%= Html.Encode(item.Email) %>
            </td>
        </tr>

    <% } %>

    </table>

    <p>
        <%= Html.ActionLink("Create New", "Create") %>
    </p>

</asp:Content>
```

Nous devons effectuer une modification à la vue Index. Comme nous ne créons
par de vue Détails, nous pouvons retirer le lien vers celle-ci. Et pour
l'instant, nous ne nous occuperons pas de la suppression d'un contact. Par
conséquent, vous pouvez retirer les deux lignes de code suivantes de la vue
Index:

```
<%= Html.ActionLink("Edit", "Edit", new { /* id=item.PrimaryKey */ }) %> |
<%= Html.ActionLink("Delete", "Delete", new { /* id=item.PrimaryKey */ }) %>
```

Après avoir modifié la vue Index, vous pouvez lancer l'application Contact
Manager. Pour cela, rendez-vous dans "Déboguer, Démarrer le débogage" ou
appuyer simplement sur F5. La première fois que vous lancerez l'application,
vous verrez apparaître la fenêtre de la Figure 9. Sélectionnez l'option
"Modifier le fichier Web.config pour activer le débogage" et cliquez sur le
bouton OK.

Note: Vérifiez que le daemon "mongod.exe" est toujours en
cours d'exécution avant de démarrer l'application MongoContact.

![](/public/2010/image009.jpg)

Figure 9: Activation du débogage

La vue Index (/) est retournée par défaut. Cette vue est destinée à lister
l'ensemble des données présentes dans la table Contacts (Figure 10).

![](/public/2010/image010.jpg)

Figure 10: La vue Index sans données

Mais comme vous pouvez le constater, cette vue Index n'affiche rien d'autre
que le titre des colonnes de notre liste.

## Créer un jeu d'exemple

Dans la version SQL Server de ce tutoriel, la vue Index affiche bien des
données parce qu'on avait inséré quelques enregistrements dans la table
Contacts immédiatement après l'avoir créée.

Par contre, la table Contacts de notre base de données MongoDB est encore
vide pour l'instant. Etant donné que nous n'avons pas de logiciel pour
administrer les bases de données MongoDB, nous allons créer quelques contacts
directement dans l'application.

Pour cela, vous pouvez modifier l'action Index à l'aide du code du Listing
6.

### Listing 6: Controllers\HomeController.cs

```
public ActionResult Index()
{
    // Ajout de quelques données d'exemple
    var count = _session.Contacts.Count();
    if (count == 0)
    {
        _session.Add(new Contact { FirstName = "Scott",
                                    LastName = "Guthrie",
                                    Phone = "555-444-5556",
                                    Email = "scott@somewhere.com" });
        _session.Add(new Contact { FirstName = "Phil",
                                    LastName = "Haack",
                                    Phone = "206-777-5555",
                                    Email = "phil@somewhere.com" });
        _session.Add(new Contact { FirstName = "Stephen",
                                    LastName = "Walther",
                                    Phone = "206-555-8988",
                                    Email = "steve@somewhere.com" });
        _session.Add(new Contact { FirstName = "Eilon",
                                    LastName = "Lipton",
                                    Phone = "415-777-5555",
                                    Email = "eilon@somewhere.com" });
        _session.Add(new Contact { FirstName = "Scott",
                                    LastName = "Hanselman",
                                    Phone = "555-444-5555",
                                    Email = "scottha@somewhere.com" });
        _session.Add(new Contact { FirstName = "Rob",
                                    LastName = "Conery",
                                    Phone = "333-899-9999",
                                    Email = "rob@somewhere.com" });
    }

    // Renvoie la vue pour afficher la liste des contacts
    return View(_session.Contacts.ToList());
}
```

Ce code commence par compter le nombre de contacts présents dans la base de
données. Dans le cas où la table des contacts est vide, il ajoute quelques
contacts pour que la vue Index ait quelque chose à afficher.

Nous pouvons maintenant relancer l'application MongoContact et cette fois
nous obtenons le résultat reproduit à la Figure 11.

![](/public/2010/image011.jpg)

Figure 11: La vue Index avec quelques données

Remarquez que la vue Index inclus un lien intitulé "Create New" (Créer un
nouveau contact) au bas de la vue. Dans la section suivante, vous allez
apprendre comment créer de nouveaux contacts.

Note: Si vous le souhaitez, vous pouvez supprimer le code
qui a servi à créer quelques contacts d'exemple avant de continuer ce
tutoriel.

## Créer de nouveaux contacts

Pour permettre aux utilisateurs de créer de nouveaux contacts, nous devons
ajouter deux actions Create() au contrôleur par défaut (Home). Nous devons en
effet créer une première action Create() retournant un formulaire HTML pour
nous laisser saisir les informations du nouveau contact à créer. Ensuite, il
nous faut une deuxième action Create() qui s'occupera d'insérer ces
informations saisies dans la base de données.

La méthode Create() que nous devons ajouter au contrôleur Home se trouve
dans le Listing 7.

### Listing 7: Controllers\HomeController.cs (avec les méthodes Create)

```
//
// GET: /Home/Create
public ActionResult Create()
{
    return View();
}

//
// POST: /Home/Create
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Create([Bind(Exclude = "Id")] Contact contactToCreate)
{
    if (!ModelState.IsValid)
        return View();

    try
    {
        _session.Add<Contact>(contactToCreate);
        return RedirectToAction("Index");
    }
    catch
    {
        return View();
    }
}
```

La première méthode Create() peut être appelée avec une requête HTTP GET
tant dis que la seconde méthode ne pourra être appelée que via un HTTP POST. En
d'autres termes, la seconde méthode Create() ne peut être appelée uniquement
lorsque nous allons soumettre le formulaire HTML. La première méthode s'occupe
uniquement de retourner une vue contenant le HTML nécessaire à la saisie des
informations d'un nouveau contact. C'est donc bien la seconde méthode la plus
intéressante: elle s'occupe d'ajouter réellement le contact dans la base.

Vous remarquerez aussi que la deuxième méthode a été modifiée pour accepter
une instance de la classe Contact. Grâce à cela, les valeurs du formulaire HTML
soumise par le POST sont automatiquement associées à celles de la classe
Contact par le framework ASP.NET MVC. Chaque valeur du formulaire HTML sera
donc assignée à une des propriétés du Contact passé en paramètre.

Notez également que le paramètre de type Contact est décoré avec l'attribut
[Bind]. Cet attribut est utilisé afin d'exclure la propriété Id de la classe
Contact du binding automatique. En effet, cette propriété représente une
propriété d'identité et nous ne souhaitons pas positionner cette propriété
manuellement mais bien laisser la base de données s'en occuper.

Dans le corps de la méthode Create(), la librairie NoRM est utilisé pour
insérer l'instance du nouveau Contact dans la base de données. Le nouveau
contact est simplement ajouté à la session, ce qui a pour effet de le
sauvegarder dans la base de données MongoDB.

Vous pouvez générer un formulaire HTML pour créer de nouveaux contacts en
cliquant-droit sur l'une des deux méthodes Create() et en choisissant l'option
Add View (Figure 12).

![](/public/2010/image012.jpg)

Figure 12: Ajout de la vue de création de contacts

Dans la fenêtre d'ajout d'une vue, choisissez la classe
MongoContact.Models.Contact et l'option création (Create) comme dans la Figure
13. Lorsque vous cliquez sur le bouton Add, une vue de création est
automatiquement générée pour vous.

![](/public/2010/image013.jpg)

Figure 13: configuration de la vue d'ajout d'un contact

La vue de création contient des champs pour chacune des propriétés de la
classe Contact. Vous pouvez constater que la propriété "Id" n'a pas été générée
dans le code présenté au Listing 8 parce qu'elle est de type ObjectId.

### Listing 8: Views\Home\Create.aspx

```
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<MongoContact.Models.Contact>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
   Create
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Create</h2>

    <%= Html.ValidationSummary("Create was unsuccessful. Please correct the errors and try again.") %>

    <% using (Html.BeginForm()) { %>

        <fieldset>
            <legend>Fields</legend>
            <p>
                <label for="FirstName">FirstName:</label>
                <%= Html.TextBox("FirstName") %>
                <%= Html.ValidationMessage("FirstName", "*") %>
            </p>
            <p>
                <label for="LastName">LastName:</label>
                <%= Html.TextBox("LastName") %>
                <%= Html.ValidationMessage("LastName", "*") %>
            </p>
            <p>
                <label for="Phone">Phone:</label>
                <%= Html.TextBox("Phone") %>
                <%= Html.ValidationMessage("Phone", "*") %>
            </p>
            <p>
                <label for="Email">Email:</label>
                <%= Html.TextBox("Email") %>
                <%= Html.ValidationMessage("Email", "*") %>
            </p>
            <p>
                <input type="submit" value="Create" />
            </p>
        </fieldset>

    <% } %>

    <div>
        <%=Html.ActionLink("Back to List", "Index") %>
    </div>

</asp:Content>
```

Maintenant que vous avez modifié les méthodes Create() et ajouté la vue
correspondante, vous pouvez lancer l'application MongoContact et créer de
nouveaux contacts. Cliquez sur le lien "Create New" en bas de la page Index
pour vous rendre sur la vue de création. Vous devriez avoir un résultat
similaire à la Figure 14.

![](/public/2010/image014.jpg)

Figure 14: la vue de création de contacts

Une fois que vous cliquez sur le bouton "Create", la vue Index est
réaffichée et vous pouvez vérifier qu'elle contient désormais le nouveau
contact que vous venez juste de créer (Figure 15).

![](/public/2010/image015.jpg)

Figure 15: La vue Index avec le nouveau contact

## Editer les contacts

Avant de pouvoir gérer la modification d'une fiche contact, il faut
commencer par ajouter un lien sur la liste des contacts qui permette d'appeler
cette fonctionnalité. Pour cela, il faut modifier la première colonne du
tableau dans la vue Index (Listing 9) et y utiliser le helper Html.ActionLink()
pour appeler l'action Edit.

### Listing 9: Views\Home\Index.aspx (1° essai)

```
<td>
    <%= Html.ActionLink("Edit", "Edit", new { id = item.Id })%>
</td>
```

Le problème, c'est qu'étant donné que la propriété "Id" est de type
ObjectId, cela ne fonctionne pas comme on pourrait l'espérer. En effet, les
liens obtenus ne contiennent pas l'identifiant du contact et ils sont de la
forme: "/Home/Edit/NoRM.ObjectId".

Et ça ne fonctionne pas mieux en essayant avec Id.ToString() ou
Id.Value...

Pour éviter de passer trop de temps pour trouver la "bonne" façon de faire,
nous allons simplement créer une nouvelle classe ContactExtensions dans le
répertoire Models (Listing 10) et y ajouter une méthode d'extension IdString()
qui permet de transformer la propriété "Id" en chaine de caractères:

### Listing 10: Models\ContactExtension.cs

```
using System;

namespace MongoContact.Models
{
    public static class ContactExtension
    {
        public static string IdString(this Contact c)
        {
            var result = BitConverter.ToString(c.Id.Value);
            result = result.Replace("-", string.Empty).ToLower();
            return result;
        }
    }
}
```

De cette façon, il est possible de remettre à jour la vue Index (Listing 11)
et cette fois-ci utiliser item.IdString() comme paramètre du helper
Html.ActionLink().

### Listing 11: Views\Home\Index.aspx (corrigé)

```
<%@ Import namespace="MongoContact.Models" %>
...
    <td>
        <%= Html.ActionLink("Edit", "Edit", new { id = item.IdString() })%>
    </td>
```

Une fois ce bricolage terminé, la façon de gérer la modification d'un
contact est très similaire à ce qui a été fait pour la création d'un nouveau
contact. Tout d'abord, il faut ajouter une méthode Edit() comme dans le Listing
12 pour afficher le formulaire de modification du contact sélectionné.

### Listing 12: Controllers\HomeController.cs (avec la méthode GET Edit)

```
using NoRM;
...

//
// GET: /Home/Edit/5

public ActionResult Edit(string id)
{
    ObjectId oid = new ObjectId(id);

    // LINQ ne fonctionne pas avec un ObjectId :(
    var contactToEdit = (from c in _session.Contacts
                         where c.Id == oid
                         select c).FirstOrDefault();

    contactToEdit = _session.Provider.DB.GetCollection<Contact>().Find(new { Id = oid }).FirstOrDefault();

    return View(contactToEdit);
}
```

Cette méthode Edit() est invoquée via une opération de type HTTP GET. Un
paramètre Id est passé à cette méthode représentant l'identifiant de
l'enregistrement devant être édité. Ce paramètre est tout d'abord transformé en
ObjectId puis utilisé par NoRM pour retrouver le contact correspondant à cette
identifiant. Ensuite, une vue contenant un formulaire HTML permettant d'éditer
cet enregistrement est retournée.

Note: pour l'instant, la version de NoRM employée ne permet
pas d'utiliser des ObjectId dans les requêtes LINQ. Par conséquent, le contact
est retrouvé en passant par les objets collections.

De manière analogue à la création d'un contact, vous pouvez ensuite générer
une vue contenant le formulaire d'édition en cliquant-droit sur la méthode
Edit() et en choisissant l'option Add View. Dans la fenêtre d'ajout d'une vue,
sélectionnez la classe MongoContact.Models.Contact et la valeur Edit pour View
content (Figure 16).

![](/public/2010/image016.jpg)

Figure 16: Ajout d'une vue d'édition

Lorsque vous cliquez sur bouton Add, une nouvelle vue d'édition est générée
automatiquement pour vous. Le formulaire HTML (Listing 13) qui est généré
contient des champs correspondant à nouveau à chacune des propriétés de la
classe Contact.

### Listing 13: Views\Home\Edit.aspx

```
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<MongoContact.Models.Contact>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
   Edit
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Edit</h2>

    <%= Html.ValidationSummary("Edit was unsuccessful. Please correct the errors and try again.") %>

    <% using (Html.BeginForm()) { %>

        <fieldset>
            <legend>Fields</legend>
            <p>
                <label for="FirstName">FirstName:</label>
                <%= Html.TextBox("FirstName", Model.FirstName) %>
                <%= Html.ValidationMessage("FirstName", "*") %>
            </p>
            <p>
                <label for="LastName">LastName:</label>
                <%= Html.TextBox("LastName", Model.LastName) %>
                <%= Html.ValidationMessage("LastName", "*") %>
            </p>
            <p>
                <label for="Phone">Phone:</label>
                <%= Html.TextBox("Phone", Model.Phone) %>
                <%= Html.ValidationMessage("Phone", "*") %>
            </p>
            <p>
                <label for="Email">Email:</label>
                <%= Html.TextBox("Email", Model.Email) %>
                <%= Html.ValidationMessage("Email", "*") %>
            </p>
            <p>
                <input type="submit" value="Save" />
            </p>
        </fieldset>

    <% } %>

    <div>
        <%=Html.ActionLink("Back to List", "Index") %>
    </div>

</asp:Content>
```

Après ces deux modifications, vous pouvez désormais lancer l'application et
cliquer sur le lien "Edit" dans la liste des contacts. Cela a pour effet
d'afficher un formulaire (Figure 17) qui vous permet de mettre à jour la fiche
de ce contact.

![](/public/2010/image017.jpg)

Figure 17: la vue de mise à jour des contacts

Mais pour l'instant, nous ne pouvons que cliquer sur le lien "Back to list"
puisque nous n'avons pas encore programmé l'action Edit en mode POST. Pour
cela, vous devez recopier le code du Listing 14.

### Listing 14: Controllers\HomeController.cs (avec la méthode POST Edit)

```
//
// POST: /Home/Edit/5

[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(string id, [Bind(Exclude = "Id")] Contact contactToEdit)
{
    if (!ModelState.IsValid)
        return View();

    try
    {
        ObjectId oid = new ObjectId(id);
        var originalContact = _session.Provider.Server.GetCollection<Contact>().Find(new { Id = oid }).FirstOrDefault();

        contactToEdit.Id = new ObjectId(id);
        _session.Update(originalContact, contactToEdit);

        return RedirectToAction("Index");
    }
    catch
    {
        return View();
    }
}
```

Cette seconde méthode Edit() s'occupe de la mise à jour des données vers la
base. Elle accepte une instance de la classe Contact comme paramètre. A
nouveau, le framework ASP.NET MVC effectue une liaison automatique entre les
valeurs des champs saisis dans le formulaire d'édition et les propriétés de la
classe Contact.

Comme lors de la création d'un contact, NoRM est utilisé pour sauver le
contact modifié dans la base de données. Pour cela, le contact original doit
d'abord être retrouvé depuis la base. Ensuite, la méthode Update() définie au
niveau de la classe MongoSession est appelée pour enregistrer les changements
du contact en mémoire et les faire persister au niveau de la base de
données.

Toutefois, pour que cela fonctionne réellement, il faut compléter la classe
MongoSession empruntée à Rob et ajouter une surcharge à la méthode Update
qu'elle contient d'origine (Listing 15).

### Listing 15: Models\MongoSession.cs (extrait)

```
public void Update<T>(T item) where T : class, new()
{
    _provider.DB.GetCollection<T>().UpdateOne(item, item);
}

public void Update<T>(T match, T value) where T : class, new()
{
    _provider.DB.GetCollection<T>().UpdateOne(match, value);
}
```

En effet, un simple "_session.Update(contactToEdit)" ne suffit pas pour
mettre à jour la fiche contact. Pour que la modification soit enregistrée, il
est nécessaire de faire passer la fiche d'origine et la fiche modifiée à la
méthode UpdateOne() sous-jacente.

Et maintenant, il devient possible de modifier une fiche contact (Figure
18).

![](/public/2010/image018.jpg)

Figure 18: modification d'un contact

Puis, après voir cliqué sur le bouton "Save", la vue Index est réaffichée et
l'adresse email du contact a bel et bien été modifiée (Figure 19).

![](/public/2010/image019.jpg)

Figure 19: La vue Index avec le contact mis à jour

## Suppression d'un contact

Si vous souhaitez supprimer des contacts alors vous devez ajouter deux
méthodes d'actions Delete() au contrôleur Home (Listing 16). La première action
Delete() affiche un formulaire de confirmation de suppression. La seconde
action Delete() s'occupe de réellement supprimer l'enregistrement.

### Listing 16: Controllers\HomeController.cs

```
//
// GET: /Home/Delete/5

public ActionResult Delete(string id)
{
    ObjectId oid = new ObjectId(id);
    var contactToDelete = _session.Provider.DB.GetCollection<Contact>().Find(new { Id = oid }).FirstOrDefault();

    return View(contactToDelete);
}

//
// POST: /Home/Delete/5

[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Delete(string id, string confirmButton)
{
    try
    {
        ObjectId oid = new ObjectId(id);
        var contactToDelete = _session.Provider.DB.GetCollection<Contact>().Find(new { Id = oid }).FirstOrDefault();

        _session.Delete(contactToDelete);

        return RedirectToAction("Index");
    }
    catch
    {
        return View();
    }
}
```

La première méthode Delete() sert à renvoyer un formulaire pour que
l'utilisateur confirme qu'il souhaite supprimer le contact. La seconde méthode
Delete() s'occupe quant à elle d'effectuer l'opération de suppression dans la
base de données. Une fois le contact original retrouvé depuis la base de
données, la méthode Delete () de NoRM est appelée pour effectuer la
suppression.

Cette fois encore, il est nécessaire de compléter la classe MongoSession.cs
(Listing 17) pour faciliter l'appel de la méthode Delete.

### Listing 17: Models\MongoSession.cs (méthode Delete)

```
public void Delete<T>(T item) where T : class, new()
{
    _provider.DB.GetCollection<T>().Delete(item);
}
```

Ensuite, pour permettre à l'utilisateur de supprimer un contact, il faut
modifier la vue Index pour qu'elle contienne un lien permettant la suppression
d'un enregistrement (Listing 18). Pour cela, il faut ajouter le code suivant
dans la cellule qui contient déjà le lien pour la modification.

### Listing 18: Views\Home\Index.aspx (lien Delete)

```
<td>
    <%= Html.ActionLink("Edit", "Edit", new { id = item.IdString() })%>
    | <%= Html.ActionLink("Delete", "Delete", new { id = item.IdString() })%>
</td>
```

Si vous relancez l'application, vous pouvez constater que la liste des
contacts (Figure 20) contient désormais un lien "Delete" sur chaque ligne.

![](/public/2010/image020.jpg)

Figure 20: La vue Index avec le lien de suppression

Maintenant, il nous faut créer la vue de confirmation pour la suppression.
Cliquez-droit sur la méthode Delete() dans le contrôleur Home et choisissez d'y
ajouter une vue. La fenêtre classique d'ajout de vue apparaît (Figure 21).

Contrairement aux vues pour lister, créer et éditer les vues, nous n'aurons
pas ici la possibilité de créer directement une vue de suppression. A la place,
choisissez comme toujours la classe MongoContact.Models.Contact mais cette fois
sélectionnez la valeur Empty (vide) pour View content. Le fait de choisir une
vue vide nous obligera simplement à créer le contenue de la vue nous-mêmes.

![](/public/2010/image021.jpg)

Figure 21: Ajout d'une vue de confirmation de suppression

Le contenu de la vue Delete est présent dans le Listing 19. Cette vue
contient un formulaire demandant si oui ou non ce contact doit être
supprimé.

### Listing 19: Views\Home\Delete.aspx

```
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<MongoContact.Models.Contact>" %>
<%@ Import namespace="MongoContact.Models" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
   Delete
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Delete</h2>

    <p>
        Are you sure that you want to delete the entry for
        <%= Model.FirstName %> <%= Model.LastName %>?
    </p>

    <% using (Html.BeginForm(new { Id = Model.IdString() }))
    { %>
        <p>
            <input type="submit" value="Delete" />
        </p>
    <% } %>

    <div>
        <%=Html.ActionLink("Back to List", "Index") %>
    </div>

</asp:Content>
```

Note: il est nécessaire de faire un import du namespace
MongoContact.Models en début de cette vue pour pouvoir utiliser la méthode
d'extension IdString() destinée à faire passer l'identifiant du contact à
supprimer à la méthode HTTP POST Delete().

Nous pouvons alors relancer l'application et demander la suppression d'un
contact (Figure 22).

![](/public/2010/image022.jpg)

Figure 22: La vue pour confirmer la suppression d'un contact

Lorsque nous confirmons que nous voulons supprimer ce contact en cliquant
sur le bouton "Delete", l'enregistrement est alors supprimé de la base de
données comme vous pouvez le constater lorsque la liste des contacts réapparait
(Figure 23).

![](/public/2010/image023.jpg)

Figure 23: La vue Index sans le contact supprimé

## Conclusion

Dans ce tutoriel, nous avons créé une application basique de gestion de
contacts de manière très rapide. Nous avons utilisé NoRM pour lister, créer,
éditer et supprimer des enregistrements de type contact dans une base de
données MongoDB.

En d'autres termes, bien que NoRM en soit à ses tout débuts, nous avons pu
effectuer toutes les opérations de base d'une application web connectée à une
base de données, à peu près aussi simplement qu'en utilisant Entity Framework
pour travailler avec une base de données SQL Server.
