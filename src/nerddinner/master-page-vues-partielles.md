---
date: 2010-01-07 17:29:00
layout: page
permalink: nerddinner/master-page-vues-partielles/
redirect_from: "pages/NerdDinner/Master-Page-et-Vues-Partielles"
title: "NerdDinner(fr) : Master page et Vues partielles"
---

ASP.NET MVC favorise l'adhésion à la philosophie de conception DRY,
abréviation de "Don't Repeat Yourself". Le fait de suivre ce principe permet
d'éviter toute répétition de code ou de traitement et au final de rendre les
applications plus rapides à développer et plus facile à maintenir.

Au cours de la réalisation de l'application NerdDinner, nous avons souvent
appliqué l'approche DRY. Quelques exemples : la  validation des données est
réalisée dans la couche modèle, ce qui permet à notre contrôleur de l'employer
aussi bien lors d'une création que d'une modification; la vue "NotFound" sert
au niveau des actions Edit, Details et Delete; le respect de conventions de
nommages nous évite de définir le nom des vues dans la méthode View(); et la
classe DinnerFormViewModel est utilisée pour les deux formulaires de création
et de modification.

Nous allons maintenant voir comment appliquer cette "philosophie DRY" au
niveau des vues, pour là aussi faire disparaitre toute duplication de code.

## Amélioration des vues Edit et Create

Nous employons actuellement deux vues différentes - "Edit.aspx" et
"Create.aspx" - pour afficher un formulaire de mise à jour des dîners. Un
simple coup d'œil suffit pour se rendre compte à quel point ils sont
similaires. Voici tout d'abord ce que donne le formulaire de création d'un
dîner :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image100.png)

Et maintenant voici à quoi ressemble le formulaire de modification :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image101.png)

On ne peut pas dire qu'il y ait beaucoup de différence. A part le titre, la
présentation du formulaire et les contrôles utilisés semblent parfaitement
identiques.

Si on regarde les sources de "Edit.aspx" et de "Create.aspx", on peut voir
que c'est exactement la même chose en ce qui concerne le formulaire et ses
contrôles de saisie. Avec une telle répétition, nous devrons donc refaire
chaque modification en double toutes les fois où nous ferons évoluer l'objet
Dinner, ce qui n'est vraiment pas une bonne chose.

## Utiliser une vue partielle

ASP.NET MVC offre la possibilité de créer des "vues partielles" qui peuvent
ensuite être utilisées pour incorporer les traitements de présentation des vues
à l'intérieur d'une page. Les vues partielles fournissent une façon pratique de
définir cette présentation une seule fois, puis de réutiliser celle-ci dans
plusieurs parties de l'application.

Pour aider nos vues Edit.aspx et Create.aspx à respecter l'approche DRY,
nous allons créer une vue partielle "DinnerForm.ascx" qui contiendra le code
source commun aux deux vues pour assurer la présentation du formulaire et de
ses contrôles de saisie utilisateur. Pour cela, nous commençons par un clic
droit dans le répertoire /Views/Dinners afin de sélectionner la commande "Add
-&gt; View" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image102.png)

Cela affiche la boite de dialogue "Add View". Nous allons appeler notre
nouvelle vue "DinnerForm" puis cocher "Create a partial view (.ascx)" pour
indiquer qu'il s'agira d'une vue partielle avant de définir que nous lui ferons
passer un objet DinnerFormViewModel :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image103.png)

Suite au clic sur le bouton "Ajouter", Visual Studio insère un nouveau
fichier "DinnerForm.ascx" dans le répertoire "\Views\Dinners".

Nous pouvons alors copier le code qui gère la présentation du formulaire et
les contrôles de saisie utilisateur depuis une des vues Edit.aspx ou
Create.aspx puis le coller dans notre nouvelle vue partielle
"DinnerForm.ascx" :

```
<%= Html.ValidationSummary("Please correct the errors and try again.") %>

<% using (Html.BeginForm()) { %>

   <fieldset>

     <p>
        <label for="Title">Dinner Title:</label>
        <%= Html.TextBox("Title", Model.Dinner.Title) %>
        <%= Html.ValidationMessage("Title", "*") %>
     </p>
     <p>
        <label for="EventDate">Event Date:</label>
        <%= Html.TextBox("EventDate", Model.Dinner.EventDate) %>
        <%= Html.ValidationMessage("EventDate", "*") %>
     </p>
     <p>
        <label for="Description">Description:</label>
        <%= Html.TextArea("Description", Model.Dinner.Description) %>
        <%= Html.ValidationMessage("Description", "*")%>
     </p>
     <p>
        <label for="Address">Address:</label>
        <%= Html.TextBox("Address", Model.Dinner.Address) %>
        <%= Html.ValidationMessage("Address", "*") %>
     </p>
     <p>
        <label for="Country">Country:</label>
        <%= Html.DropDownList("Country", Model.Countries) %>
        <%= Html.ValidationMessage("Country", "*") %>
     </p>
     <p>
        <label for="ContactPhone">Contact Phone #:</label>
        <%= Html.TextBox("ContactPhone", Model.Dinner.ContactPhone) %>
        <%= Html.ValidationMessage("ContactPhone", "*") %>
</p>
<p>
        <input type="submit" value="Save" />
     </p>
   </fieldset>
<% } %>
```

Nous pouvons ensuite mettre à jour les vues "Edit.aspx" et "Create.aspx"
pour y appeler la vue partielle "DinnerForm.ascx" et ainsi élimer le code en
double. Pour cela, nous devons utiliser le helper
Html.RenderPartial("DinnerForm") :

### Create.aspx

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   Host a Dinner
</asp:Content>

<asp:Content ID="Create" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Host a Dinner</h2>

   <% Html.RenderPartial("DinnerForm"); %>

</asp:Content>
```

### Edit.aspx

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   Edit: <%=Html.Encode(Model.Dinner.Title) %>
</asp:Content>

<asp:Content ID="Edit" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Edit Dinner</h2>

   <% Html.RenderPartial("DinnerForm"); %>

</asp:Content>
```

Il est possible de définir explicitement le chemin de la vue partielle que
l'on veut utiliser quand on appelle la fonction Html.RenderPartial (par
exemple, ~Views/Dinners/DinnerForm.ascx). Mais dans notre exemple, nous
profitons des possibilités de convention de nommage d'ASP.NET MVC, ce qui nous
permet d'indiquer seulement "DinnerForm". ASP.NET MVC regarde d'abord dans le
répertoire des vues correspondant aux conventions de nommage (pour le
contrôleur DinnersController il s'agit de /Views/Dinners). S'il n'y trouve pas
la vue partielle attendue, il la cherche alors dans le répertoire
/Views/Shared.

Lorsque la méthode Html.RenderPartial() est appelée avec comme seul
paramètre le nom de la vue partielle, ASP.NET MVC lui fait suivre les mêmes
objets Model et ViewData que ceux utilisés par la vue appelante. Il existe
cependant des versions surchargées de Html.RenderPartial() qui vous permettent
de faire passer d'autres objets Model ou un autre dictionnaire ViewData à la
vue partielle. Cela peut servir dans le cas où vous souhaitez seulement
transmettre un sous-ensemble de l'objet Model ou ViewModel à la vue.

## Remarque : Pourquoi &lt;% %&gt; et pas &lt;%= %&gt; ?

Une des petites subtilités que vous avez peut-être remarqué dans le code
ci-dessus est que nous avons utilisé un bloc &lt;% %&gt; au lieu d'un bloc
&lt;%= %&gt; pour appeler Html.RenderPartial().

En ASP.NET, les blocs &lt;%= %&gt; servent pour afficher une valeur
particulière (comme par exemple &lt;%= "Hello" %&gt; qui va renvoyer le texte
"Hello"). Les blocs &lt;% %&gt; servent plutôt pour exécuter un morceau de
code, à l'intérieur duquel il faut explicitement effectuer le rendu du contenu
(par exemple en écrivant &lt;% Response.Write("Hello") %&gt;).

Nous avons donc dû employer un bloc &lt;% %&gt; parce que la fonction
Html.RenderPartial() ne retourne pas une chaîne mais renvoie directement son
contenu dans le flux de sortie de la vue appelante. Cette façon de faire offre
de bien meilleures performances car il n'est alors pas nécessaire de créer un
objet chaîne temporaire (surtout dans le cas où celle-ci serait très grande).
Cela diminue l'utilisation de la mémoire et améliore la vitesse de
l'application.

Quand on utilise la fonction Html.RenderPartial() dans un bloc &lt;% %&gt;,
on oublie fréquemment de mettre un point-virgule après celle-ci. Par exemple,
le code ci-dessous va provoquer une erreur du compilateur :

```
<% Html.RenderPartial("DinnerForm") %>
```

Il faut bien faire attention à écrire le code suivant :

```
<% Html.RenderPartial("DinnerForm"); %>
```

Ceci est dû au fait que les blocs &lt;% %&gt; sont des instructions et qu'en
C# les instructions doivent se terminer par un point-virgule.

## Rendre le code plus lisible avec une vue partielle

Nous avons créé la vue partielle "DinnerForm" pour éviter d'avoir à répéter
le même code dans plusieurs vues. C'est la principale raison qui motive la
création d'une vue partielle.

Cependant, il est parfois justifié de créer une vue partielle même si elle
ne doit être utilisée qu'une seule fois. Une vue très compliquée gagne
généralement en lisibilité quand les traitements pour son rendu sont répartis
dans une ou plusieurs vues partielles.

Prenons par exemple le cas du code ci-dessous tiré du fichier Site.master de
notre projet (auquel nous nous intéresserons très bientôt). Ce source est
relativement facile à lire - en partie parce que tout le traitement pour
afficher le lien login/logout en haut à droite de l'écran est délégué à la vue
partielle "LogOnUserControl" :

```
<div id="header">
   <div id="title">
     <h1>My MVC Application</h1>
   </div>

   <div id="logindisplay">
     <% Html.RenderPartial("LogOnUserControl"); %>
   </div>

   <div id="menucontainer">

     <ul id="menu">
        <li><%= Html.ActionLink("Home", "Index", "Home")%></li>
        <li><%= Html.ActionLink("About", "About", "Home")%></li>
     </ul>

   </div>
</div>
```

Chaque fois que vous commencerez à avoir mal à la tête en tentant de
comprendre comment fonctionne le code ou le html d'une vue, prenez le temps de
vous demander si cela ne deviendrait pas plus clair en la découpant en
plusieurs vues partielles avec des noms évocateurs.

## Pages Maîtres

En complément des vues partielles, ASP.NET MVC offre aussi la possibilité de
créer une "page maître" qui permet de définir la présentation globale et le
squelette html d'un site. Il est alors possible d'ajouter des contrôles
ContentPlaceHolder à cette page maître pour y définir des zones qui seront
ensuite remplacées ou "remplies" par le contenu des vues. En plus de respecter
parfaitement la philosophie DRY, c'est une méthode très pratique pour appliquer
une présentation homogène dans toute l'application.

Quand on crée un nouveau projet ASP.NET MVC, Visual Studio ajoute
automatiquement une page maître par défaut. Ce fichier d'appelle "Site.master"
et se trouve dans le répertoire \Views\Shared :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image104.png)

Ce fichier Site.master ressemble au code source ci-dessous. Il contient le
code html pour la présentation générale du site avec un menu de navigation en
haut et il défini deux contrôles ContentPlaceHolder destinés à accueillir le
contenu spécifique de chaque écran : le premier pour le titre de l'écran et le
second pour le contenu principal de la page concernée :

```
<%@ Master Language="C#" Inherits="System.Web.Mvc.ViewMasterPage" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
   <title><asp:ContentPlaceHolder ID="TitleContent" runat="server" /></title>
   <link href="../../Content/Site.css" rel="stylesheet" type="text/css" />
</head>

<body>
   <div class="page">

     <div id="header">
        <div id="title">
           <h1>My MVC Application</h1>
        </div>

        <div id="logindisplay">
           <% Html.RenderPartial("LogOnUserControl"); %>
        </div>

        <div id="menucontainer">

           <ul id="menu">
                <li><%= Html.ActionLink("Home", "Index", "Home")%></li>
                <li><%= Html.ActionLink("About", "About", "Home")%></li>
           </ul>

        </div>
     </div>

     <div id="main">
        <asp:ContentPlaceHolder ID="MainContent" runat="server" />
     </div>
   </div>
</body>
</html>
```

Toutes les vues qui ont été créées dans le cadre de notre application
NerdDinner ("List", "Details", "Edit", "Create", "NotFound", etc…) sont basées
sur ce fichier Site.master. C'est ce qu'indique l'attribut "MasterPageFile"
inséré par défaut dans la directive &lt;%@ Page %&gt; pour chacun des fichiers
générés via la boite de dialogue "Add View" :

```
<%@ Page Language="C#"
Inherits="System.Web.Mvc.ViewPage<NerdDinner.Controllers.DinnerViewModel>"
MasterPageFile="~/Views/Shared/Site.Master" %>
```

Par conséquent, si nous changeons le source de Site.master, les
modifications apportées seront automatiquement prises en compte quand nous
afficherons les vues qui sont basées dessus.

Nous pouvons ainsi mettre à jour la partie "header" du fichier Site.master
pour que le titre de l'application devienne "NerdDinner" au lieu de "My MVC
Application". Nous pouvons aussi modifier le menu de navigation pour que son
premier onglet soit "Find a Dinner" (géré par l'action Index() du contrôleur
HomeController) et pour lui ajouter un nouvel onglet "Host a Dinner" (géré par
l'action Create() du contrôleur DinnersController) :

```
<div id="header">
   <div id="title">
     <h1>NerdDinner</h1>
   </div>

   <div id="logindisplay">
     <% Html.RenderPartial("LoginStatus"); %>
   </div>

   <div id="menucontainer">
     <ul id="menu">
        <li><%= Html.ActionLink("Find Dinner", "Index", "Home")%></li>
        <li><%= Html.ActionLink("Host Dinner", "Create", "Dinners")%></li>
        <li><%= Html.ActionLink("About", "About", "Home")%></li>
     </ul>
   </div>
</div>
```

Après avoir sauvegardé le fichier Site.master puis actualisé l'affichage du
navigateur, nous pouvons constater que les modifications apportées à l'en-tête
de page sont bien prises en compte dans les différentes vues de l'application.
Comme par exemple :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image105.png)

Ou dans le cas de l'URL /Dinners/Edit/[id] :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image106.png)

Les vues partielles et les pages maîtres procurent une très grande souplesse
pour organiser les  vues le plus clairement possible. A l'usage, vous
verrez qu'elles évitent d'avoir du code en double au sein des vues, ce qui les
rend plus faciles à relire et donc à maintenir.

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Gérer
la pagination](/nerddinner/gerer-pagination/)
