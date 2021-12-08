---
date: 2009-12-01 13:35:00
layout: page
permalink: nerddinner/controleurs-vues/
redirect_from: "pages/NerdDinner/Controleurs-Vues"
title: "NerdDinner(fr) : Contrôleurs et Vues"
---

Avec les frameworks web habituels (ASP 3, PHP, ASP.NET, etc…), les URL
appelées correspondent à des fichiers existants sur le disque. Par exemple, une
requête pour l'URL "/Products.aspx" ou "Products.php" serait traitée par un
fichier "Products.aspx" ou "Products.php".

Les frameworks web MVC gèrent les URL d'une façon un peu différente. Au lieu
de faire correspondre les URL demandées à des fichiers, ils les font
correspondre à des méthodes dans une classe. Ces classes sont appelées
"Contrôleurs" et elles sont chargées de traiter les requêtes http, de gérer les
saisies utilisateurs, de retrouver et sauvegarder les données et de déterminer
quelle réponse à renvoyer au client (afficher du code HTML, télécharger un
fichier, le rediriger vers une autre URL, etc…).

Maintenant que nous avons développé le modèle de notre application
NerdDinner, la prochaine étape va consister à lui ajouter un contrôleur.
Celui-ci offrira aux utilisateurs une navigation de type liste / détails pour
consulter les dîners enregistrés sur notre site.

## Ajout d'un contrôleur DinnersController

Pour commencer, on fait un clic-droit sur le dossier "Controllers" de notre
projet web et on sélectionne la commande __Add -&gt; Controller__ (astuce : on
peut aussi exécuter cette commande en tapant Ctrl-M, Ctrl-C) :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image052.png)

On obtient alors la boite de dialogue "Add Controller" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image053.png)

On appelle notre nouveau contrôleur "DinnersController" puis on clique sur
le bouton "Add". Visual Studio ajoute alors un fichier DinnersController.cs
dans le répertoire \Controllers :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image054.png)

Et il ouvre automatiquement ce nouveau fichier DinnersController.cs dans
l'éditeur de code.

## Ajout des méthodes d'action Index() et Details() à notre classe contrôleur

Nous voulons que les visiteurs qui viennent sur notre site aient la
possibilité de parcourir la liste des dîners prévus et qu'ils puissent cliquer
sur un de ces dîners pour consulter une fiche détaillée à son sujet. Pour cela,
nous allons publier les URLs suivantes à partir de notre application :

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Fonction</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/Dinners/</td>
      <td>Affiche une liste HTML des prochains dîners</td>
    </tr>
    <tr>
      <td>/Dinners/Details/[id]</td>
      <td>
        Affiche des informations détaillées sur le dîner correspondant au
        paramètre "id" contenu dans l'URL, qui correspond à l'identifiant
        DinnerID pour le dîner dans notre base de données.<br>
        Par exemple, l'URL /Dinners/Details/2 affichera une page HTML contenant
        des informations au sujet du dîner avec la valeur 2 dans la colonne
        DinnerID.
      </td>
    </tr>
  </tbody>
</table>

Nous pouvons d'ores et déjà publier ces URLs sans rien dedans, en ajoutant
deux "méthodes action" publiques dans notre classe DinnersControllers.cs :

```
public class DinnersController : Controller {

   //
   // GET: /Dinners/

   public void Index() {
     Response.Write("<h1>Coming Soon: Dinners</h1>");
   }

   //
   // GET: /Dinners/Details/2

   public void Details(int id) {
     Response.Write("<h1>Details DinnerID: " + id + "</h1>");
   }

}
```

Nous pouvons alors lancer l'application et employer notre navigateur pour la
tester. Le fait de saisir l'URL "/Dinners/" provoque l'exécution de notre
méthode *Index()*, ce qui nous renvoie la réponse suivante :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image055.png)

En saisissant l'url "/Dinners/Details/2" nous exécutons la méthode Details()
et nous recevons la réponse associée :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image056.png)

Peut-être que vous vous demandez comment ASP.NET MVC sait qu'il faut créer
notre classe DinnersController et appeler ces méthodes ? Pour comprendre cela,
nous allons jeter un coup d'œil à la façon dont fonctionne le routage.

## Comprendre le routage dans ASP.NET MVC

ASP.NET MVC possède un puissant moteur de routage des URLs qui offre une
grande souplesse pour contrôler la façon dont les URLs sont associées aux
classes contrôleur. Ce moteur nous permet de personnaliser complètement la
façon dont ASP.NET MVC décide quelle classe contrôleur créer, et laquelle de
ses méthodes appeler. Nous pouvons aussi configurer plusieurs méthodes pour
extraire automatiquement les variables à partir de l'URL ou de la Querystring
et les transmettre en tant qu'arguments aux méthodes. Nous disposons ainsi de
toute la souplesse nécessaire pour optimiser totalement le SEO d'un site pour
les moteurs de recherche et pouvoir construire n'importe quelle structure
d'URL.

Par défaut, les nouveaux projets ASP.NET MVC sont préconfigurés avec une
série de règles de routage des URLs déjà enregistrée. Cela nous permet de
démarrer facilement une nouvelle application sans avoir à paramétrer
explicitement quoi que ce soit. Les règles de routage par défaut se trouvent
dans la classe "Application" de notre projet que l'on peut ouvrir en
double-cliquant sur le fichier "Global.asax" dans la racine du projet :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image057.png)

Les règles de routage par défaut d'ASP.NET MVC sont enregistrées au niveau
de la méthode "RegisterRoutes" de cette classe :

```
public void RegisterRoutes(RouteCollection routes)
{
   routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

   routes.MapRoute(
     "Default",                                          // Route name
     "{controller}/{action}/{id}",                      // URL w/ params
     new { controller="Home", action="Index", id="" }    // Param defaults
   );
}
```

L'appel à la méthode "routes.MapRoute()" dans le code ci-dessus enregistre
une règle de routage par défaut qui associe les URLs entrantes aux classes
contrôleurs en se basant sur le format d'URLs "/{controller}/{action}/{id}", où
"controller" est le nom de la classe contrôleur à instancier, "action" est le
nom de sa méthode publique à appeler et "id" est un paramètre optionnel contenu
dans l'URL qui peut être envoyé en tant qu'argument à la méthode. Le 3°
paramètre passé à la méthode "MapRoute()" défini les valeurs à utiliser par
défaut pour remplacer les valeurs controller/action/id dans le cas où elles
n'apparaissent pas dans l'URL (contrôleur = "Home", action = "Index" et id =
"").

Le tableau ci-dessous présente comment différentes URLs sont traitées en
fonction de la règle de routage "/{controller}/{action}/{id}" :

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Classe contrôleur</th>
      <th>Méthode action</th>
      <th>Paramètre envoyé</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/Dinners/Details/2</td>
      <td>DinnersController</td>
      <td>Details(id)</td>
      <td>Id=2</td>
    </tr>
    <tr>
      <td>/Dinners/Edit/5</td>
      <td>DinnersController</td>
      <td>Edit(id)</td>
      <td>Id=5</td>
    </tr>
    <tr>
      <td>/Dinners/Create</td>
      <td>DinnersController</td>
      <td>Create()</td>
      <td>N/A</td>
    </tr>
    <tr>
      <td>/Dinners</td>
      <td>DinnersController</td>
      <td>Index()</td>
      <td>N/A</td>
    </tr>
    <tr>
      <td>/Home</td>
      <td>HomeController</td>
      <td>Index()</td>
      <td>N/A</td>
    </tr>
    <tr>
      <td>/</td>
      <td>HomeController</td>
      <td>Index()</td>
      <td>N/A</td>
    </tr>
  </tbody>
</table>

Les trois dernières lignes de ce tableau montrent l'utilisation des valeurs
par défaut (contrôleur = "Home", action = "Index" et id = ""). Etant donné que
la méthode "Index" est définie comme étant le nom de l'action par défaut quand
il n'y en a pas de définie, les URL "/Dinners" et "/Home" déclenchent l'appel
de la méthode action "Index()" pour la classe contrôleur correspondante. De
même, le nom du contrôleur par défaut étant défini à "Home", l'URL "/" entraine
l'instanciation de HomeController et l'appel de sa méthode action
"Index()".

Si ces règles de routage ne vous plaisent pas, vous serez heureux
d'apprendre qu'elles sont très faciles à changer. Il suffit tout simplement de
les modifier dans la méthode RegisterRoutes vue plus haut. Mais pour notre
application NerdDinner, nous n'en ferons rien et nous les utiliserons telles
quelles.

## Utiliser DinnerRepository dans DinnersController

Nous allons maintenant réellement écrire le code pour gérer nos deux actions
Index() et Détails() en utilisant notre modèle (c'est à dire la partie Modèle
de notre application MVC).

Nous allons utiliser la classe DinnerRepository que nous avons développée
plus tôt dans ce chapitre pour réaliser cela. Nous commençons par ajouter une
commande "using" pour référencer l'espace de nom "NerdDinner.Models" puis nous
déclarerons une instance de notre classe DinnerRepository dans notre classe
DinnersController.

Plus loin dans ce chapitre, nous aborderons le concept de "l'injection de
dépendance" et verrons une autre façon pour fournir à nos contrôleurs une
référence à la classe DinnerRepository qui sera plus pratique pour réaliser des
tests unitaires. Mais pour le moment, nous nous contentons d'instancier notre
classe DinnerRepository comme ci-dessous :

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NerdDinner.Models;

namespace NerdDinner.Controllers {

   public class DinnersController : Controller {

     DinnerRepository dinnerRepository = new DinnerRepository();

      //
     // GET: /Dinners/
     public void Index() {
        var dinners = dinnerRepository.FindUpcomingDinners().ToList();
     }

     //
     // GET: /Dinners/Details/2
     public void Details(int id) {
        Dinner dinner = dinnerRepository.GetDinner(id);
     }
   }
}
```

Nous sommes maintenant prêts pour générer une réponse HTML en utilisant nos
objets modèle de données.

## Utilisation de vues avec notre contrôleur

Bien qu'il soit possible d'écrire du code dans nos méthodes actions pour
générer du HTML puis d'utiliser la méthode Response.Write() pour envoyer
celui-ci au client, cette approche risque vite de devenir assez lourde. Il est
de loin préférable que les méthodes actions de DinnersController se concentrent
sur la logique données et applicative. Ensuite, elles n'ont plus qu'à
transmettre les informations nécessaires pour générer une réponse HTML à la
vue, celle-ci étant chargée d'assurer le rendu et la représentation sous forme
HTML de ces données. Comme nous le verront d'ici peu, un template "Vue" est un
fichier texte qui contient généralement une combinaison de balises HTML et de
blocs de code serveur.

Le fait que le code de notre contrôleur soit séparé du rendu de notre vue
présente de nombreux avantages. En premier lieu, cela favorise une franche
"séparation des préoccupations" entre le code applicatif et le code relatif à
l'interface utilisateur. Il devient alors beaucoup plus simple d'appliquer des
tests unitaires sur la partie applicative sans impacter l'interface
utilisateur. Le cas échéant, cela nous permet de modifier notre UI sans avoir à
intervenir sur le code de notre application. Et enfin, cela peut simplifier la
collaboration entre développeurs et graphistes sur un même projet.

Afin d'indiquer que nous utilisons une vue pour renvoyer la réponse HTML,
nous devons modifier nos deux méthodes actions pour qu'elles ne retournent plus
un "void" mais un objet de type "ViewResult". Nous pouvons alors utiliser la
méthode "View()" héritée de la classe Controller pour renvoyer un objet de type
"ViewResult" :

```
public class DinnersController : Controller {

   DinnerRepository dinnerRepository = new DinnerRepository();

   //
   // GET: /Dinners/
   public ActionResult Index() {

     var dinners = dinnerRepository.FindUpcomingDinners().ToList();

     return View("Index", dinners);
   }

   //
   // GET: /Dinners/Details/2
   public ActionResult Details(int id) {

     Dinner dinner = dinnerRepository.GetDinner(id);

     if (dinner == null)
        return View("NotFound");
     else
        return View("Details", dinner);
   }
}
```

La signature de la méthode View() que nous avons utilisée est la suivante :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image058.png)

Le premier argument de la méthode "View()" est le nom du fichier vue que
nous voulons utiliser pour renvoyer la réponse HTML. Le second argument est un
objet du modèle qui contient les données dont notre vue a besoin pour générer
le code HTML à renvoyer.

Dans la méthode action Index(), nous appelons la méthode View() en indiquant
que nous voulons renvoyer une liste HTML des dîners en utilisant la vue
"Index". Et nous passons à notre vue une séquence d'objets Dinner à partir de
laquelle elle pourra générer la liste HTML :

```
//
// GET: /Dinners/

public ActionResult Index() {

   var dinners = dinnerRepository.FindUpcomingDinners().ToList();

   return View("Index", dinners);
}
```

Pour la méthode action Détails(), nous essayons de retrouver un objet Dinner
en utilisant l'identifiant présent dans l'URL. Si nous récupérons bien un objet
Dinner valide, nous appelons alors la méthode View() en indiquant que nous
voulons utiliser la vue "Détails" pour afficher cet objet Dinner. Par contre,
si le dîner obtenu n'est pas valide, nous renvoyons un message d'erreur pour
expliquer que ce dîner n'existe pas. Pour cela, nous utilisons une vue
"NotFound" en appelant une version surchargée de la méthode View() qui n'attend
que le nom de la vue en paramètre :

```
//
// GET: /Dinners/Details/2

public ActionResult Details(int id) {

   Dinner dinner = dinnerRepository.FindDinner(id);

   if (dinner == null)
     return View("NotFound");
   else
     return View("Details", dinner);
}
```

Et maintenant il ne nous reste plus qu'à coder les vues "NotFound",
"Details" et "Index".

## Réalisation de la vue "NotFound"

Nous allons commencer avec la vue "NotFound" qui se contente d'afficher un
message d'erreur pour indiquer que le dîner demandé n'a pas été trouvé.

Pour créer une nouvelle vue, nous pouvons placer notre curseur à l'intérieur
du code d'une méthode action de notre contrôleur avant de faire un clic-droit
pour choisir la commande "Add View" (on peut aussi taper Ctrl-M puis Ctrl-V au
clavier) :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image059.png)

Cela fait alors apparaître la boite de dialogue "Add View" ci-dessous. Par
défaut, le nom de la vue à créer est pré-rempli avec le nom de la méthode
action à l'intérieur de laquelle se trouvait le curseur ("Details" dans notre
cas). Mais comme nous voulons d'abord implémenter la vue "NotFound", nous
remplaçons le nom "Details" pour y mettre "NotFound" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image060.png)

Quand nous cliquons sur le bouton "Add", Visual Studio crée un nouveau
fichier vue "NotFound.aspx" dans le répertoire "\Views\Dinners" (qu'il va créer
s'il n'existait pas déjà) :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image061.png)

Notre nouvelle vue "NotFound.aspx" est alors directement chargée dans
l'éditeur de code :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image062.png)

Par défaut, les fichiers vues sont composés de deux zones où nous pourrons
ajouter du code et du contenu. La 1° zone nous permet de modifier le "titre" de
la page HTML renvoyée à l'utilisateur et la seconde contiendra le contenu
principal de cette page.

Pour construire notre vue "NotFound", nous allons ajouter le code
ci-dessous :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   Dinner Not Found
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Dinner Not Found</h2>

   <p>Sorry - but the dinner you requested doesn't exist or was deleted.</p>

</asp:Content>
```

Nous pouvons dès maintenant faire un essai en appelant l'URL
"/Dinners/Details/9999" dans notre navigateur. Etant donné que cette URL fait
référence à un dîner qui n'existe pas dans la base de données, notre méthode
action DinnersController.Details() va renvoyer la vue "NotFound" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image063.png)

Comme vous pouvez le constater dans la copie d'écran ci-dessus, le code HTML
de notre vue ne représente qu'une partie de ce qui apparait à l'écran. Ceci est
dû au fait qu'elle utilise une "master page", ce qui nous permet d'appliquer
une présentation homogène à toutes les vues de notre site. Nous approfondirons
cette notion de "page maître" dans une autre section de ce tutoriel.

## Réalisation de la vue "Details"

Nous allons maintenant programmer la vue "Détails" destinée à générer le
code HTML qui sert à afficher un dîner.

Pour cela, nous positionnons le curseur à l'intérieur de la méthode action
Détails, puis nous cliquons avec le bouton droit et choisissons la commande
"Add View" (ou Ctrl-M, Ctrl-V au clavier) :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image064.png)

Après apparition de la boite de dialogue "Add View", nous conservons le nom
proposé par défaut, puis nous cochons "Create a strongly-typed View" pour
pouvoir définir le type d'objet que le contrôleur va transmettre à la vue. Dans
notre cas, nous allons passer un objet Dinner dont le nom de classe complet est
"NerdDinner.Models.Dinner" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image065.png)

Contrairement à la vue précédente où nous avions choisi de créer une "Empty
View", nous allons cette fois-ci construire automatiquement la vue en
sélectionnant le modèle de vue "Details" dans la drop-down list "View
content".

Le "scaffolding" va générer une première implémentation de notre vue
"Details" en se basant sur l'objet Dinner que nous lui avons passé en
paramètre. C'est une technique extrêmement rapide pour obtenir le point de
départ de notre vue.

Lorsque nous cliquons sur le bouton "Add", Visual Studio va créer un nouveau
fichier "Details.aspx" dans le répertoire "\Views\Dinners" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image066.png)

Il va également ouvrir ce nouveau fichier "Details.aspx" dans l'éditeur de
code. Celui-ci correspond à une première ébauche d'une vue de type détail
construite à partir du type d'objet que nous lui avons passé. Le moteur de
scaffolding utilise la reflection pour retrouver les propriétés publiques de la
classe transmise et génère le code approprié en fonction des types de données
trouvés :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   Details
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Details</h2>
   <fieldset>
     <legend>Fields</legend>
     <p>
        DinnerID:
        <%= Html.Encode(Model.DinnerID) %>
     </p>
     <p>
        Title:
        <%= Html.Encode(Model.Title) %>
     </p>
     <p>
        EventDate:
        <%= Html.Encode(String.Format("{0:g}", Model.EventDate)) %>
     </p>
     <p>
        Description:
        <%= Html.Encode(Model.Description) %>
     </p>
     <p>
        HostedBy:
        <%= Html.Encode(Model.HostedBy) %>
     </p>
     <p>
        ContactPhone:
        <%= Html.Encode(Model.ContactPhone) %>
     </p>
     <p>
        Address:
        <%= Html.Encode(Model.Address) %>
     </p>
     <p>
        Country:
        <%= Html.Encode(Model.Country) %>
     </p>
     <p>
        Latitude:
        <%= Html.Encode(String.Format("{0:F}", Model.Latitude)) %>
     </p>
     <p>
        Longitude:
        <%= Html.Encode(String.Format("{0:F}", Model.Longitude)) %>
     </p>
   </fieldset>
<p>
   <%=Html.ActionLink("Edit", "Edit", new { id=Model.DinnerID }) %> |
   <%=Html.ActionLink("Back to List", "Index") %>
</p>

</asp:Content>
```

Nous pouvons maintenant appeler l'URL "/Dinners/Details/1" pour voir ce que
donne cette génération automatique. Cette page va afficher le premier dîner que
nous avons inséré manuellement dans notre base de données lors de sa
création :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image067.png)

Cela nous permet d'obtenir un résultat très rapidement et cela nous fourni
une première version de notre vue Details.aspx. Nous pouvons alors la faire
évoluer  pour qu'elle réponde le mieux possible à nos besoins.

Quand nous observons notre template Details.aspx d'un peu plus près, nous
voyons qu'il contient du code HTML statique ainsi que du code pour générer du
HTML de façon dynamique. Lorsque la vue est affichée, les balises &lt;%%&gt;
servent pour exécuter le code contenu à l'intérieur de celles-ci et les balises
&lt;%=%&gt; pour exécuter le code et renvoyer son résultat dans la vue en
cours.

A l'intérieur de notre vue, nous pouvons écrire du code qui accède à l'objet
"Dinner" que nous lui avons fait passer depuis le contrôleur à l'aide de la
propriété fortement typée "Model". Nous bénéficions ainsi de l'IntelliSense
lorsque nous utilisons la propriété "Model" dans l'éditeur de Visual
Studio :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image068.png)

Modifions quelque peu notre code pour qu'au final la vue Details.aspx
ressemble au code source ci-dessous :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   Dinner: <%= Html.Encode(Model.Title) %>
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

   <h2><%= Html.Encode(Model.Title) %></h2>
   <p>
     <strong>When:</strong>
     <%= Model.EventDate.ToShortDateString() %>

     <strong>@</strong>
     <%= Model.EventDate.ToShortTimeString() %>
   </p>
   <p>
     <strong>Where:</strong>
     <%= Html.Encode(Model.Address) %>,
     <%= Html.Encode(Model.Country) %>
   </p>
   <p>
     <strong>Description:</strong>
     <%= Html.Encode(Model.Description) %>
   </p>
   <p>
     <strong>Organizer:</strong>
     <%= Html.Encode(Model.HostedBy) %>
     (<%= Html.Encode(Model.ContactPhone) %>)
   </p>

   <%= Html.ActionLink("Edit Dinner", "Edit", new { id=Model.DinnerID })%> |
   <%= Html.ActionLink("Delete Dinner","Delete", new { id=Model.DinnerID})%>

</asp:Content>
```

Lorsque nous rappelons l'url "/Dinners/Details/1", nous obtenons maintenant
la présentation suivante :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image069.png)

## Réalisation de la vue "Index"

A présent, nous allons réaliser la vue "Index" qui servira à générer la
liste des dîners à venir. Pour cela, nous plaçons le curseur dans la méthode
action "Index" puis nous choisissons la commande "Add View" après avoir fait un
clic-droit (ou Ctrl-M puis Ctrl-V au clavier).

Dans la boite de dialogue "Add View", nous conservons "Index" pour le nom de
notre vue et nous cochons "Create a strongly-typed view". Cette fois-ci, nous
choisissons de générer automatiquement un template de vue "List" et nous
sélectionnons "NerdDinner.Models.Dinner" pour la classe de données à
transmettre à notre vue. Et comme nous avons indiqué que nous allions créer une
vue de type "List", la boite de dialogue "Add View" détermine que notre
contrôleur doit faire passer une séquence d'objets Dinner à notre vue :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image070.png)

Après un clic sur le bouton "Add", Visual Studio va créer un nouveau fichier
"Index.aspx" dans le répertoire "\Views\Dinners". Ce fichier contient une
première implémentation qui utilise une table HTML pour afficher la liste des
dîners que nous avons passée à la vue.

Quand nous lançons l'application pour accéder à l'URL "/Dinners", notre
liste des dîners se présente sous la forme suivante :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image071.png)

La table ci-dessus fourni une grille qui reprend toutes les colonnes de la
base de données. Ceci n'est pas exactement ce que nous souhaitons présenter aux
utilisateurs. Nous pouvons modifier le code du template Index.aspx pour qu'il
ne contienne pas toutes les colonnes du modèle Dinners et pour qu'il utilise
une balise &lt;ul&gt; au lieu d'une balise &lt;table&gt; :

```
<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Upcoming Dinners</h2>

   <ul>
     <% foreach (var dinner in Model) { %>

        <li>
           <%= Html.Encode(dinner.Title) %>
           on
           <%= Html.Encode(dinner.EventDate.ToShortDateString())%>
           @
           <%= Html.Encode(dinner.EventDate.ToShortTimeString())%>
        </li>

     <% } %>
   </ul>

</asp:Content>
```

Au niveau de la commande foreach, nous utilisons le mot-clé "var" pour
boucler sur chaque dîner de notre modèle. Si vous n'êtes pas familier avec C#
3.0, vous pensez peut-être qu'en utilisant "var", le type de l'objet "dinner"ne
sera connu qu'à l'exécution (late-binding). En fait, grâce au mot-clé "var", le
compilateur sait déterminer implicitement le bon type pour l'objet "Dinner" à
partir du type de la propriété "Model" (qui est
"&lt;IEnumerable&lt;Dinner&gt;"). Il peut donc en déduire que la variable
locale "dinner" est du type "Dinner", ce qui nous permet de profiter pleinement
de l'IntelliSense et du contrôle de code pendant la saisie :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image072.png)

Lorsque nous rafraichissons l'URL "/Dinners" dans le navigateur, la liste
des dîners se présente désormais de la façon suivante :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image073.png)

C'est déjà mieux, mais pas tout à fait fini. Il faut encore permettre aux
utilisateurs de cliquer sur un des dîners de la liste pour consulter sa fiche
détaillée. Pour cela, nous utiliserons un lien hypertexte HTML qui pointera sur
l'action "Details" du contrôleur DinnersController.

Nous pouvons générer des liens hypertextes dans la vue Index de deux façons.
La première méthode est de créer manuellement des balises &lt;a&gt; dans
lesquelles nous insèrerons des blocs de code &lt;%%&gt; comme ci-dessous :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image074.png)

Une autre manière de procéder est d'employer la méthode helper
"Html.ActionLink()" qui permet de générer une balise &lt;a&gt; qui établi un
lien vers une action du contrôleur :

```
<%= Html.ActionLink(dinner.Title, "Details", new { id=dinner.DinnerID }) %>
```

Le premier argument du helper "Html.ActionLink()" défini quel est le libellé
à afficher dans le lien (le nom du dîner dans notre cas), le second argument
correspond au nom de l'action que nous voulons appeler (la méthode Details dans
notre cas) et le troisième argument représente une série de paramètres à faire
passer à l'action du contrôleur. Ce dernier élément est implémenté en tant que
type anonyme sous forme de paires de propriétés nom / valeur. Dans notre
exemple, nous déclarons un paramètre dont le nom est "id" en lui donnant comme
valeur l'identifiant du dîner que nous voulons lier. Etant donné que par défaut
la règle de routage est "{controller}/{action}/{id}", le helper
"Html.ActionLink()" va générer le code HTML suivant :

```
<a href="/Dinners/Details/1">.NET Futures</a>
```

Nous allons utiliser la solution basée sur le helper Html.ActionLink() pour
faire en sorte que chaque dîner de notre liste pointe vers l'URL qui détaille
son contenu :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   Upcoming Dinners
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Upcoming Dinners</h2>
   <ul>
     <% foreach (var dinner in Model) { %>
        <li>
           <%= Html.ActionLink(dinner.Title, "Details",
                                    new { id=dinner.DinnerID }) %>
           on
           <%= Html.Encode(dinner.EventDate.ToShortDateString())%>
           @
           <%= Html.Encode(dinner.EventDate.ToShortTimeString())%>
        </li>
     <% } %>
   </ul>

</asp:Content>
```

Et maintenant, lorsque nous appelons l'URL "/Dinners", notre liste ressemble
à ça :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image075.png)

Quand nous cliquons sur un des dîners proposé dans cette liste, le lien
qu'il contient nous conduit vers la fiche complète du dîner :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image076.png)

## Gestion de vues basées sur les conventions

Par défaut, les applications ASP.NET MVC utilisent une convention de nommage
basée sur la structure des répertoires pour déterminer l'emplacement des vues.
Cela permet aux développeurs d'éviter de préciser un chemin complet vers la vue
à utiliser quand ils font référence à une vue dans le code du contrôleur. Par
défaut, ASP.NET MVC va rechercher cette vue dans le répertoire
\Views\[ControllerName] de l'application.

Par exemple, nous avons jusqu'à présent travaillé avec la classe
DinnersController qui fait explicitement référence à trois vues : "Index",
"Details" et "NotFound". Pour retrouver ces trois vues, ASP.NET MVC regardera
par défaut à l'intérieur du répertoire \Views\Dinners :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image077.png)

Dans la copie d'écran ci-dessus, vous pouvez remarquer qu'il existe
actuellement trois classes contrôleurs dans notre projet (DinnersController,
HomeController et AccountController - ces deux dernières ayant été ajoutées par
défaut lorsque nous avons créé le projet), et qu'il y a trois sous-répertoire
(un pour chaque contrôleur) à l'intérieur du répertoire \Views.

Les vues référencées à partir des contrôleurs HomeController et
AccountsController vont être recherchées dans les répertoires \Views\Home et
\Views\Accounts respectivement. Le sous-répertoire supplémentaire \Views\Shared
sert pour gérer des vues qui sont utilisées par plusieurs contrôleurs au sein
de l'application. Lorsque ASP.NET MVC tente de retrouver l'emplacement d'une
vue, il commence par regarder dans le répertoire spécifique
\Views\[ControllerName]. Puis, s'il n'y trouve pas la vue attendue, il regarde
ensuite dans le répertoire \Views\Shared.

En ce qui concerne la façon de nommer les vues, la méthode recommandée est
de donner le même nom à la vue et à l'action qui l'utilise. Par exemple, dans
le cas qui nous concerne, l'action "Index" appelle la vue "Index" pour afficher
son résultat et l'action "Details" utilise quant à elle la vue "Details". C'est
beaucoup pratique pour comprendre en un coup d'œil quelle vue correspond à
quelle action.

Pour le développeur, il n'est donc pas nécessaire d'indiquer explicitement
le nom de la vue à employer lorsque celle-ci a le même nom que l'action qui
l'appelle. On peut donc se contenter d'utiliser directement la méthode "View()"
sans préciser le nom de la vue et ASP.NET MVC sera capable de déterminer
automatiquement que nous souhaitons utiliser la vue
\Views\[ControllerName]\[ActionName].

Cela nous permet d'alléger quelque peu le code de notre contrôleur et
d'éviter de répéter les mêmes noms plusieurs fois dans le code :

```
public class DinnersController : Controller {

   DinnerRepository dinnerRepository = new DinnerRepository();

   //
   // GET: /Dinners/

   public ActionResult Index() {

     var dinners = dinnerRepository.FindUpcomingDinners().ToList();

     return View(dinners);
   }

   //
   // GET: /Dinners/Details/2

   public ActionResult Details(int id) {

     Dinner dinner = dinnerRepository.GetDinner(id);

     if (dinner == null)
        return View("NotFound");
     else
        return View(dinner);
   }
}
```

Au final, les quelques lignes de code ci-dessus sont tout ce dont nous avons
besoin pour gérer correctement la fonctionnalité liste / détails de notre
site.

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Les
formulaires CRUD](/nerddinner/formulaires-crud/)
