---
date: 2010-03-03 21:49:00
layout: post
redirect_from: "post/2010/03/03/asp-net-mvc-c-est-pas-forcement-linq-to-sql"
tags: mvc
title: "ASP.NET MVC c'est pas forcément LINQ to SQL"
---

{:.encart}
Ceci est la traduction du billet "[ASP.NET MVC is not all about Linq to SQL](http://www.mikesdotnetting.com/Article/132/ASP.NET-MVC-is-not-all-about-Linq-to-SQL)" de Mike Brind.

La plupart des exemples destinés à illustrer l'utilisation de ASP.NET MVC
sont tous basés sur l'utilisation de LINQ to SQL ou d'Entity Framework pour
gérer l'accès aux données. Les forums sur [www.asp.net](http://www.asp.net/) regorgent de questions pour savoir s'il existe
des alternatives et en effet, il est possible de faire autrement. Cet article
va montrer comment utiliser une couche d'accès aux données en ADO.NET pur afin
de gérer le contenu dynamique d'une application de type CRUD toute simple.

Pour les besoins de cette démonstration, je vais énormément emprunter à la
série d'articles qu'Imar Spaanjaar a consacré à la [réalisation d'applications web multi-couches en ASP.NET 2.0](http://imar.spaanjaars.com/QuickDocId.aspx?quickdoc=416). Je vous
recommande fortement de lire ces articles ou au minimum les deux premiers afin
de vous familiariser avec les rudiments d'une approche multi-couches lors de la
conception d'une application ASP.NET. Je vais reprendre quasiment telles
quelles 3 des principales couches de son application : Business Objects,
Business Logic et Data Access dont la construction est expliquée de façon très
détaillée dans les articles d'Imar. Par conséquent, cet article se contentera
d'étudier à quoi servent ces couches sans chercher à entrer dans le détail de
leur code.

Pour commencer, nous allons jeter un coup d'œil à l'application présentée
par Imar. Il s'agit d'une application toute simple où on retrouve les
opérations CRUD typiques. Elle permet aux utilisateurs de gérer des contacts,
avec leurs adresses, numéros de téléphone et adresses e-mail, et leur offre la
possibilité de créer, lire, mettre à jour et supprimer l'une ou l'autre de ces
entités.

![](http://www.mikesdotnetting.com/images/nlayermvc1.gif)

Les entités gérées par l'application sont ContactPersons, PhoneNumbers,
Addresses and EmailAddresses. Elles sont toutes définies dans la couche des
objets métiers (BO = Business Objects) de l'application. Dans l'exemple
d'origine, chacune de ces classe contient uniquement des propriétés publiques
(avec leurs méthodes get et set) et elles ne gèrent absolument aucun
traitement. Ceux-ci sont gérés au sein de la couche des règles métiers (BLL =
Business Logic Layer) dans des classes *NomEntité*Manager. Il existe une
correspondance une-à-une entre une entité et sa classe Manager associée.
Chacune des classes Manager contient des méthodes pour retrouver une instance
de l'entité ou une collection d'entités, pour enregistrer une entité (ajout ou
modification) et pour supprimer une entité. Cette partie de l'application peut
aussi être utilisée pour gérer la validation, les autorisations, etc... Mais il
n'y en a pas dans l'exemple pour qu'il reste suffisamment compréhensible. Si
vous souhaitez voir comment mettre en œuvre des règles de validation dans la
couche métier, vous pouvez vous reporter à la [seconde
série d'articles](http://imar.spaanjaars.com/QuickDocId.aspx?quickdoc=476) dans laquelle Imar présente les évolutions apportées à son
application, y compris sa migration sous ASP.NET 3.5.

La dernière couche est la couche d'accès aux données (DAL = Data Access
Layer). Cette couche comprend elle aussi des classes qui ont une correspondance
une-à-une avec les classes Manager dans la couche BLL. En pratique, les
méthodes de la couche BLL appellent les méthodes correspondantes dans la couche
DAL. Les méthodes de la DAL sont les seules de l'application qui ont à
connaitre le mécanisme utilisé pour conserver (stocker) les entités. Pour notre
exemple, il s'agit d'une base de données SQL Server Express. Par conséquent,
les classes de la DAL utilisent ADO.NET et les classes SqlClient. Le principe
derrière cette approche est que si jamais vous souhaitez changer le mécanisme
employé pour le stockage (pour utiliser XML, Oracle, un Web service ou même
LINQ to SQL ou tout autre ORM), vous n'aurez qu'à remplacer cette couche DAL.
Du moment que votre nouvelle DAL exposera des méthodes avec les signatures
attendues par la couche BLL, tout devrait continuer à fonctionner sans qu'il
soit nécessaire de faire la moindre modification dans le reste de
l'application. Pour être sûr que la nouvelle DAL respecte bien les mêmes
signatures de méthode que la DAL actuelle, le plus simple est de définir des
Interfaces (ce qui pourrait faire un très bon sujet d'article).

## Architecture MVC

Il existe tout un tas de très bons articles qui expliquent ce qu'est
l'architecture MVC, c'est pourquoi ce billet ne va pas entrer trop dans le
détail. Pour une présentation plus détaillée, je vous recommande de consulter
directement les [tutoriels sur
ASP.NET MVC sur le site de Microsoft](http://www.asp.net/mvc/) (ou leurs [traductions en français sur
le site Developpez](http://dotnet.developpez.com/mvc/)). Très succinctement, le **M** est pour le
Modèle, dans lequel on va retrouver les couches BO, BLL et DAL. Le
**V** est pour les Vues, qui correspond à toute la partie
interface utilisateur (ce que nos utilisateurs verront). Et le
**C** est pour les Contrôleurs. Le rôle des contrôleurs est de
coordonner les réponses de l'application aux demandes faites par les
utilisateurs. Si un utilisateur clique sur un bouton qui pointe vers une URL
spécifique, cette demande est mappée à une action du contrôleur (c'est à dire
une méthode dans la classe contrôleur) qui a alors la responsabilité de gérer
tous les traitements nécessaires pour répondre à cette demande et renvoyer une
réponse à l'utilisateur, généralement sous la forme d'une nouvelle Vue ou d'une
mise à jour de la vue en cours.

Après avoir créé une nouvelle application MVC dans Visual Studio puis
supprimé les vues et les contrôleurs créés par défaut, la première chose que
j'ai faite a été de copier les fichiers correspondant aux couches BO, BLL et
DAL depuis l'application d'Imar dans le dossier Models de ma nouvelle
application. J'ai également copié la base de données SQL Server du répertoire
App_Data depuis l'application d'origine dans le dossier App_Data de
l'application MVC puis j'ai fait de même pour le fichier Style.ccs que j'ai
placé dans le dossier Content.

![](http://www.mikesdotnetting.com/images/nlayermvc2.gif)

J'ai aussi changé quelques petits trucs. Il faut ajouter la chaine de
connexion à la base de données dans le fichier Web.config de l'application MVC.
Même si ce n'était pas vraiment indispensable, j'ai aussi modifié les
namespaces au niveau des fichiers copiés puis un peu mis à jour quelques
morceaux du code de la DAL pour utiliser des fonctionnalités du C# 3.0. Une
fois tout ça fini, j'ai fait un rapide Ctrl + Maj + F5 pour vérifier que le
projet compilait. Par la suite, je n'aurait pas à revenir sur ces fichiers, à
part pour quelques méthodes de la DAL et les méthodes correspondantes dans la
BLL, comme nous le verrons par la suite.

## Les Contrôleurs

Ayant supprimé les contrôleurs créés par défaut par Visual Studio, j'ai
ajouté quatre contrôleurs, un pour chaque entité. ce qui me donne donc au final
les contrôleurs suivants : ContactController, PhoneController,
AddressController et EmailController.

![](http://www.mikesdotnetting.com/images/nlayermvc3.gif)

Chacun de ces contrôleurs sera chargé de coordoner 4 actions : List,
Add, Edit et Delete. Par conséquent, la première chose à faire est de définir
la route pour ces différentes actions au niveau du fichier
Global.asax.cs :

```
public static void RegisterRoutes(RouteCollection routes)
{
  routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

  routes.MapRoute(
      "Default",
      "{controller}/{action}/{id}",
      new { controller = "Contact", action = "List", id = "" }
  );
}
```

La page par défaut de l'application sera chargée d'afficher la liste des
contacts. Les données sur les contacts sont obtenues grâce à la méthode
GetList() dans la classe ContactPersonManager de la BLL. Par conséquent, le
code source pour l'action List() du contrôleur est le suivant :

```
public ActionResult List()
{
  var model = ContactPersonManager.GetList();
  return View(model);
}
```

## Les vues fortement typées

Je vais utiliser des vues fortement typées tout au long de l'application.
D'une part parce que cela permet de profiter de l'intellisense dans le code
source des vues et d'autre part parce qu'elles ne dépendent pas du ViewData qui
est source d'erreur à cause de l'utilisation de chaines pour indexer les
différentes valeurs. Pour faire un peu de ménage, j'ai ajouté quelques
namespaces de type ContactManagerMVC.Xxxxx dans la section &lt;namespaces&gt;
du fichier Web.Config. Voici donc les namespaces que j'utilise par rapport à
ceux définis dans le code d'Imar :

```
<namespaces>
<add namespace="System.Web.Mvc"/>
<add namespace="System.Web.Mvc.Ajax"/>
<add namespace="System.Web.Mvc.Html"/>
<add namespace="System.Web.Routing"/>
<add namespace="System.Linq"/>
<add namespace="System.Collections.Generic"/>
<add namespace="ContactManagerMVC.Views.ViewModels"/>
<add namespace="ContactManagerMVC.Models.BusinessObject"/>
<add namespace="ContactManagerMVC.Models.BusinessObject.Collections"/>
<add namespace="ContactManagerMVC.Models.BusinessLogic"/>
<add namespace="ContactManagerMVC.Models.DataAccess"/>
<add namespace="ContactManagerMVC.Models.Enums"/>
</namespaces>
```

Cela a pour effet de les rendre disponibles dans toute l'application et
d'éviter d'avoir à saisir les types complets à l'intérieur des vues. L'objet
renvoyé par la méthode GetList() est de type ContactPersonList qui est défini
dans le dossier Collections à l'intérieur de la couche BO. Il s'agit tout
simplement d'une collection d'objets ContactPerson. La déclaration de page en
première ligne de la vues List est la suivante :

```
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master"
    Inherits="System.Web.Mvc.ViewPage<ContactPersonList>" %>
```

Vous pouvez aussi voir que j'utilise une page maître. Dans celle-ci, j'ai
fait référence au fichier css récupéré du code d'Imar. Le code html qui gère
l'affichage des objets ContactPerson de la collection est le suivant :

```
<table class="table">
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Full Name</th>
      <th scope="col">Date of Birth</th>
      <th scope="col">Type</th>
      <th scope="col">&nbsp;</th>
      <th scope="col">&nbsp;</th>
      <th scope="col">&nbsp;</th>
      <th scope="col">&nbsp;</th>
      <th scope="col">&nbsp;</th>
    </tr>
    <%
      if (Model != null)
      {
        foreach (var person in Model)
        { %>
    <tr>
      <td><%= person.Id %></td>
      <td><%= person.FullName %></td>
      <td><%= person.DateOfBirth.ToString("d") %></td>
      <td><%= person.Type %></td>
      <td title="address/list" class="link">Addresses</td>
      <td title="email/list" class="link">Email</td>
      <td title="phone/list" class="link">Phone Numbers</td>
      <td title="contact/edit" class="link">Edit</td>
      <td title="contact/delete" class="link">Delete</td>
    </tr>
    <%
        }
      }else{ %>
    <tr>
      <td colspan="9">No Contacts Yet</td>
    </tr>
     <% }%>
  </table>
```

Vous pouvez constater au premier coup d'oeil l'avantage d'avoir des vues
fortement typées. L'objet Model est du type ContactPersonList, ce qui fait que
chaque élément est du type ContactPerson et que ses propriétés sont disponibles
sans qu'il soit nécessaire de caster le Model en ContactPersonList. Si on avait
dû faire un cast et qu'on ait fait une erreur, cette erreur de casting n'aurait
été détectée qu'au moment de l'exécution, ce qui est pour le moins
embêtant.

J'ai un petit peu triché pour le code html. J'aurai pu demander à générer un
contenu de type "List" quand j'ai créé la vue, ce qui m'aurait permis d'avoir
un squelette de page approprié pour les listes. Mais je ne l'ai pas fait. Je
voulais obtenir quelque chose qui puisse fonctionner plus simplement avec la
css d'Imar. J'ai donc lancé son application sur mon PC et une fois qu'elle
s'est affichée dans mon navigateur, j'ai affiché la source et copié le html à
partir de celle-ci. Imar utilise des GridViews dans son application webforms et
par conséquent il y a pas mal de css et autre qui est automatiquement inséré
dans le html généré. J'ai donc nettoyé un peu cette soupe et défini les styles
correspondant à la table dans le fichier Site.css. J'en ai également profité
pour ajouter un peu de css pour les éléments &lt;th&gt; et &lt;td&gt; comme
vous le verrez si vous téléchargez mon application.

J'ai aussi ajouté des attributs "title" aux cellules de la table qui
contiennent les liens vers les autres actions dans l'application d'origine. Je
ne souhaitais pas que toute la page soit repostée pour afficher les adresses ou
les numéros de téléphone ou lorsque l'utilisateur veut modifier ou supprimer un
enregistrement existant, mais que le site utilise de l'Ajax pour tout cela. Ces
attributs "title" vont jouer un rôle clé dans la façon dont je compte gérer
Ajax dans mon application. Et pour finir, la classe css "link" me sert pour que
le texte agisse comme un lien avec du souligné et un pointeur de type main
lorsque la souris passe dessus.

## Utiliser jQuery pour la partie Ajax

Avant de jeter un coup d'œil au gros morceau de script qui gère les
fonctionnalités Ajax de l'application, voici trois lignes supplémentaires de
html que j'ai ajouté en bas de la vue List :

```
<input type="button" id="addContact" name="addContact" value="Add Contact" />
<div id="details"></div>
<div id="dialog" title="Confirmation Required">Are you sure about this?</div>
```

La première ligne affiche le bouton qui permet aux utilisateurs de créer un
nouveau contact. La deuxième ligne contient une balise &lt;div&gt; vide qui
sert de conteneur pour du contenu à venir. La troisième ligne est destinée à la
boite de confirmation en jQuery qui servira pour demander aux utilisateurs de
valider le fait qu'ils souhaitent supprimer un contact.

Pour que tout cela puisse fonctionner, il faut encore ajouter 3 fichiers
dans la page maître : un pour insérer la librairie jQuery en elle-même et
les deux autres pour certaines fonctionnalités de la librairie jQuery.UI (pour
gérer une boite de dialogue modale et saisir des dates à l'aide d'un
calendrier) :

```
<script src="../../Scripts/jquery-1.3.2.min.js" type="text/javascript"></script>
<script src="../../Scripts/ui.core.min.js" type="text/javascript"></script>
<script src="../../Scripts/jquery-ui.min.js" type="text/javascript"></script>
```

Voici ce que donne la vue List quand on y accède :

![](http://www.mikesdotnetting.com/images/nlayermvc4.gif)

Et voici le source jQuery complet nécessaire pour gérer entièrement cette
vue List :

```
<script type="text/javascript">
  $(function() {
    // row colours
    $('tr:even').css('background-color', '#EFF3FB');
    $('tr:odd').css('background-color', '#FFFFFF');
    // selected row managment
    $('tr').click(function() {
      $('tr').each(function() {
        $(this).removeClass('SelectedRowStyle');
      });
      $(this).addClass('SelectedRowStyle');
    });
    // hide the dialog div
    $('#dialog').hide();
    // set up ajax to prevent caching of results in IE
    $.ajaxSetup({ cache: false });
    // add an onclick handler to items with the "link" css class
    $('.link').live('click', function(event) {
      var id = $.trim($('td:first', $(this).parents('tr')).text());
      var loc = $(this).attr('title');
      // check to ensure the link is not a delete link
      if (loc.lastIndexOf('delete') == -1) {
        $.get(loc + '/' + id, function(data) {
          $('#details').html(data);
        });
      // if it is, show the modal dialog
      } else {
        $('#dialog').dialog({
          buttons: {
            'Confirm': function() {
              window.location.href = loc + '/' + id;
            },
            'Cancel': function() {
              $(this).dialog('close');
            }
          }
        });
        $('#dialog').dialog('open');
        }
      });
      // add an onclick event handler to the add contact button
      $('#addContact').click(function() {
        $.get('Contact/Add', function(data) {
          $('#details').html(data);
        });
      });
    });
</script>
```

Cela peut paraitre un peu compliqué, mais comme pour tout avec jQuery c'est
en fait assez simple. J'ai séparé du mieux possible les différentes parties du
code à l'aide de commentaires pour essayer de faciliter sa
compréhension :

* La première chose que ce script effectue, c'est de remplacer la
fonctionnalité AlternatingRowColor qui existe au niveau des contrôles serveurs
quand on utilise les webforms. Au lieu de cela, le script applique un style css
aux lignes de la table une fois que la table a été affichée.
* Puis j'ai ajouté un peu de code pour mettre en évidence la ligne en cours
de sélection, comme Imar l'avait fait dans l'application d'origine.
* La &lt;div&gt; créée pour gérer le message de confirmation de la boite de
dialogue est ensuite masquée pour qu'elle ne s'affiche pas sous la liste
* La ligne `$.ajaxSetup({ cache: false });` sert à éviter que IE
mette en cache les informations. Si vous ne faites pas cela, vous allez vous
creuser les méninges en vous demandant pourquoi vos mises à jours et vos
suppressions ne sont pas répercutées à l'affichage alors qu'elles ont bien été
prises en compte dans la base de données.

Le dernier gros bloc de code est assez intéressant. Il utilise la méthode
.live() qui fait en sorte que les gestionnaires d'évènements sont bien attachés
à tous les éléments correspondants, qu'ils existent déjà à cet instant précis
ou pas encore. Par exemple, lorsque l'utilisateur clique sur le lien
"Adresses", le résultat est l'affichage d'une autre table qui liste les numéros
de téléphone correspondant :

![](http://www.mikesdotnetting.com/images/nlayermvc5.gif)

Vous pouvez voir que cette table contient des liens "Edit" et "Delete". Si
je n'avais pas utilisé la méthode .live(), les gestionnaires d'évènements
n'auraient pas été attachés à ces deux liens. Le gestionnaire d'évènement est
attaché aux cellules ayant la classe css "link". Il commence par récupérer la
valeur de l'identifiant pour l'enregistrement. Dans le cas de la table des
contacts, il s'agira du champ ContactPersonId (puisque c'est ce que contient la
première cellule de la ligne). Pour les sous-listes, il s'agira de
l'identifiant du numéro de téléphone ou de l'adresse email. Nous avons besoin
de ces identifiants pour les faire passer aux actions du contrôleur chargées de
gérer la modification, la suppression ou l'affichage des sous-listes. Nous
verrons cela un peu plus loin.

Vous devez maintenant commencer à comprendre pourquoi j'ai ajouté des
attributs "title" aux cellules de la table. Ils contiennent la route qu'il faut
appeler après avoir construit l'url complète en lui ajoutant l'identifiant.
Ensuite, j'effectue un contrôle pour voir si la route contient le mot "delete".
Si ce n'est pas le cas, la requête est lancée et son résultat affiché dans la
balise &lt;div&gt; masquée. S'il s'agit d'un lien pour supprimer un
enregistrement, la boite de confirmation modale est affichée avant de supprimer
l'enregistrement, ce qui donne ainsi la possibilité à l'utilisateur de changer
d'avis.

Et pour finir, j'attache un gestionnaire d'évènement au clic sur le bouton
"Add Contact". Mais nous verrons ça dans la partie suivante.

Vous voyez ? Je vous avais bien dit que c'était simple !

## Ajouter un contact

Quand on ajoute des enregistrements dans une application ASP.NET, la
pratique habituelle est de proposer à l'utilisateur un formulaire contenant une
série de zones de saisies dans lesquelles il peut entrer des données. La
plupart des zones de saisie pour un objet ContactPerson sont basiques :
nom, prénom, date de naissance. Mais une d'entre elle n'est pas si
évidente : le type. Cette valeur doit être obtenue à partir de
l'énumération (ami, collègue, etc...) définie au niveau de la classe
PersonType.cs dans le dossier Models\Enums. Nous devons donc faire en sorte de
proposer à l'utilisateur un choix restreint de valeurs possibles. Pour cela,
une DropDownList fera parfaitement l'affaire. Cependant, cette série de valeurs
ne fait pas parti de l'objet ContactPerson existant. Il va donc falloir
présenter une version personnalisée de cet objet ContactPerson à la vue pour
pouvoir gérer cela. Et c'est là que les ViewModels personnalisés entrent en
jeu.

J'ai vu qu'il y avait débat pour savoir où est-ce qu'il fallait placer les
ViewModels dans l'application. Certains pensent qu'ils font parti du modèle. A
mon avis, ils sont plutôt liés aux vues. Ils n'ont vraiment de sens que dans le
cadre des applications MVC et ils ne sont pas vraiment réutilisables, et donc
ils ne devraient pas se retrouver dans le modèle. C'est pourquoi j'ai choisi de
créer un répertoire ViewModels à l'intérieur du répertoire Views. Puis j'ai
créé le fichier ContactPersonViewModel.cs en saisissant le code source
suivant :

```
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ContactManagerMVC.Views.ViewModels
{
  public class ContactPersonViewModel
  {
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }
    public IEnumerable<SelectListItem> Type { get; set; }
  }
}
```

Si vous regardez la dernière propriété de cette classe, vous pouvez
constater que j'ai défini Type comme étant une collection de
IEnumerable&lt;SelectListItem&gt;. C'est ce qui sera rattaché à la liste
déroulante au niveau de la vue.

Au niveau du contrôleur, il y a besoin de deux actions pour gérer l'ajout.
La première action est décoré avec l'attribut [AcceptVerbs(HttpVerbs.Get)] et
la seconde avec l'attribut [AcceptVerbs(HttpVerbs.Post)]. Le but de la première
action est de renvoyer le formulaire destiné à saisir le contact alors que la
seconde doit gérer les valeurs qui sont envoyées lorsque le formulaire est
posté :

```
[AcceptVerbs(HttpVerbs.Get)]
public ActionResult Add()
{
  var personTypes = Enum.GetValues(typeof (PersonType))
    .Cast<PersonType>()
    .Select(p => new
                   {
                     ID = p, Name = p.ToString()
                   });
  var model = new ContactPersonViewModel
                {
                  Type = new SelectList(personTypes, "ID", "Name")
                };
  return PartialView(model);
}

[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Add(ContactPerson person)
{
  ContactPersonManager.Save(person);
  return RedirectToAction("List");
}
```

Les premières lignes dans la première action sont chargées de transférer les
valeurs de l'énumération ContactType dans un tableau, chaque élément étant
ensuite casté en objet anonyme avec une propriété ID et une propriété Name. ID
est la valeur d'énumération, et Name la valeur constante qui va de pair avec
l'énumération. Un objet ContactPersonViewModel est ensuite instancié et sa
propriété Type est initialisé avec un objet SelectList auquel on transmet un
IEnumerable des objets anonymes obtenus précédemment et on indique quels champs
utiliser pour la valeur et pour le libellé.

Pour ajouter un contact, j'ai créé une vue partielle fortement typée et
choisi le type ContactPersonViewModel. Le code pour la vue partielle est le
suivant :

```
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<ContactPersonViewModel>" %>

<script type="text/javascript">
  $(function() {
  $('#DateOfBirth').datepicker({ dateFormat: 'yy/mm/dd' });
  });
</script>

<% using (Html.BeginForm("Add", "Contact", FormMethod.Post)) { %>
      <table>
        <tr>
          <td class="LabelCell">Name</td>
          <td><%= Html.TextBox("FirstName") %></td>
        </tr>
        <tr>
          <td class="LabelCell">Middle Name</td>
          <td><%= Html.TextBox("MiddleName") %></td>
        </tr>
        <tr>v
          <td class="LabelCell">Last Name</td>
          <td><%= Html.TextBox("LastName") %></td>
        </tr>
        <tr>
          <td class="LabelCell">Date of Birth</td>
          <td><%= Html.TextBox("DateOfBirth", String.Empty)%></td>
        </tr>
        <tr>
          <td class="LabelCell">Type</td>
          <td><%=Html.DropDownList("Type")%>
          </td>
        </tr>
        <tr>
          <td class="LabelCell"></td>
          <td><input type="submit" name="submit" id="submit" value="Save" /></td>
        </tr>
      </table>
<% } %>
```

Le jQuery au début de cette vue sert à associer un datepicker jQuery.UI à la
zone de saisie DateOfBirth. Au niveau du html helper qui défini la zone de
saisie DateOfBirth, le second paramètre nous assure que par défaut, sa valeur
sera vide. Et pour le reste, toutes les zone de saisie prennent le même nom que
la propriété correspondante de ContactPerson que nous voulons saisir. Cela nous
permet d'être sûr qu'au moment du post, la correspondance entre les zones de
saisie et le modèle fonctionnera de façon correcte. L'enum pour le ContactType
est lui aussi automatiquement lié pour nous par MVC :

![](http://www.mikesdotnetting.com/images/nlayermvc6.gif)

La méthode action qui répond à la requête POST est alors capable de faire
correspondre les valeurs du formulaire aux propriété d'un objet ContactPerson
avant d'appeler la méthode Save() de la BLL en trois fois rien de code avant de
renvoyer l'utilisateur vers l'action List.

## Modifier un contact

Cette fois encore, il existe deux actions dans le contrôleur pour gérer les
modifications : une pour la requête GET initiale et une autre pour la
requête POST lorsque le formulaire est validé :

```
[AcceptVerbs(HttpVerbs.Get)]
    public ActionResult Edit(int id)
    {
      var personTypes = Enum.GetValues(typeof (PersonType))
        .Cast<PersonType>()
        .Select(p => new { ID = p, Name = p.ToString() });

      var contactPerson = ContactPersonManager.GetItem(id);
      var model = new ContactPersonViewModel
                    {
                      Id = id,
                      FirstName = contactPerson.FirstName,
                      MiddleName = contactPerson.MiddleName,
                      LastName = contactPerson.LastName,
                      DateOfBirth = contactPerson.DateOfBirth,
                      Type = new SelectList(personTypes, "ID", "Name", contactPerson.Type)
                    };
      return PartialView(model);
    }

    [AcceptVerbs(HttpVerbs.Post)]
    public ActionResult Edit(ContactPerson person)
    {
      ContactPersonManager.Save(person);
      return RedirectToAction("List");
    }
```

Nous avons déjà vu comment jQuery est utilisé pour appeler l'action Edit en
lui faisant passer l'ID du contact à modifier. Cet identifiant est utilisé pour
retrouver les informations sur ce contact dans la base de données en passant
comme d'habitude par la BLL qui fait ensuite appel à la DAL. L'objet
ContactPersonViewModel est construit à partir des informations du contact et
complété par une SelectList comme pour l'action Add. Mais cette fois, le
constructeur de SelectList utilise un quatrième paramètre pour définir la
valeur actuelle de la propriété Type pour le contact à modifier. Ce dernier
paramètre correspond à la valeur qui sera pré-sélectionné dans la liste
déroulante.

Le code de la vue partielle Edit est lui aussi quasiment identique à celui
de la vue Add :

```
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<ContactPersonViewModel>" %>

<script type="text/javascript">
  $(function() {
    $('#DateOfBirth').datepicker({dateFormat: 'yy/mm/dd'});
  });
</script>

<% using (Html.BeginForm("Edit", "Contact", FormMethod.Post)) { %>
     <table>
        <tr>
          <td class="LabelCell">Name</td>
          <td><%= Html.TextBox("FirstName") %></td>
        </tr>
        <tr>
          <td class="LabelCell">Middle Name</td>
          <td><%= Html.TextBox("MiddleName") %></td>
        </tr>
        <tr>
          <td class="LabelCell">Last Name</td>
          <td><%= Html.TextBox("LastName") %></td>
        </tr>
        <tr>
          <td class="LabelCell">Date of Birth</td>
          <td><%= Html.TextBox("DateOfBirth", Model.DateOfBirth.ToString("yyyy/MM/dd")) %></td>
        </tr>
        <tr>
          <td class="LabelCell">Type</td>
          <td><%= Html.DropDownList("Type")%></td>
        </tr>
        <tr>
          <td class="LabelCell"><%= Html.Hidden("Id") %></td>
          <td><input type="submit" name="submit" id="submit" value="Save" /></td>
        </tr>
      </table>
<% } %>
```

Les principales différences viennent du fait que la zone DateOfBirth
contient une chaîne pour formater la date et l'afficher de façon plus
conviviale. Et juste avant le bouton de validation du formulaire, il y a
maintenant un helper Html.Hidden() qui sert pour conserver l'identifiant du
contact en cours de modification. Et bien sûr, le post du formulaire pointe
vers une action différente du contrôleur. Il y aurait sans doute des avantages
à combiner les formulaires (et les actions) Add et Edit et à se baser sur un
drapeau pour savoir dans quel mode on se trouve (Add ou Edit) afin de pouvoir
présenter tel ou tel code html au niveau de la vue et effectuer tel ou tel
traitement au niveau de l'action. Cela permettrait d'éviter pas mal de
répétitions. Mais j'ai préféré les garder séparés pour que l'application de
démonstration reste le plus claire possible.

## Supprimer un contact

L'action de suppression est assez simple et elle n'a pas besoin d'avoir une
vue correspondante. Une fois la suppression réalisée, elle se contente de
rediriger l'utilisateur sur l'action List :

```
public ActionResult Delete(int id)
{
  ContactPersonManager.Delete(id);
  return RedirectToAction("List");
}
```

J'ai fait quelques modifications par rapport au code d'origine des couches
BLL et DAL. Au départ, la méthode ContactPersonManager.Delete() utilisait une
instance du contact à supprimer. Et au niveau de la méthode Delete() dans la
DAL, il n'y avait que l'identifiant de ce contact qui était utilisé (et donc
nécessaire). Comme je ne vois pas l'intérêt de passer un objet complet quand on
n'a besoin que de son identifiant, j'ai modifié ces deux méthodes pour qu'elles
fonctionnent avec un entier. L'autre avantage, c'est que cela simplifie le code
puisqu'avant il fallait instancier un objet ContactPerson juste pour pouvoir le
supprimer.

Quand on clique sur un lien "Delete", le code jQuery déclenche l'affichage
de la boite de dialogue pour confirmer la suppression.

![](http://www.mikesdotnetting.com/images/nlayermvc7.gif)

Si l'utilisateur clique sur le bouton "Cancel", rien ne se passe (à part la
fermeture de la boite de dialogue). Par contre, s'il clique sur le bouton
"Confirm", l'url qui a été construite par le jQuery est appelée afin de pointer
sur l'action Delete du contrôleur.

## Gérer les collections

Toutes les collections (PhoneNumberList, EmailAddressList et AddressList)
sont gérées exactement de la même manière. Par conséquence, je n'ai qu'à en
choisir une (EmailAddressList en l'occurrence) pour illustrer leur
fonctionnement. Vous pourrez aussi consulter les sources de l'application pour
voir exactement comment les autres fonctionnent.

Pour commencer, nous allons voir comment afficher les adresses email
associées au contact sélectionné. Pour cela, il y a besoin d'avoir une action
List au niveau du contrôleur :

```
public ActionResult List(int id)
{
  var model = new EmailAddressListViewModel
                {
                  EmailAddresses = EmailAddressManager.GetList(id),
                  ContactPersonId = id
                };
  return PartialView(model);
}
```

Cette méthode action prend l'identifiant du contact (souvenez-vous, il est
obtenu à partir de la première cellule dans la ligne qui a été cliquée) puis
renvoie un autre ViewModel personnalisé (EmailAddressListViewModel). C'est
grâce à ça que l'identifiant du contact peut être transmis à la vue :

```
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EmailAddressListViewModel>" %>
<script type="text/javascript">
  $(function() {
    $('#add').click(function() {
      $.get('Email/Add/<%= Model.ContactPersonId %>', function(data) {
        $('#details').html(data);
      });
    });
  });
</script>
<table class="table">
   <tr>
     <th scope="col">Contact Person Id</th>
     <th scope="col">Email</th>
     <th scope="col">Type</th>
     <th scope="col">&nbsp;</th>
     <th scope="col">&nbsp;</th>
   </tr>
   <%if(Model.EmailAddresses != null)
     {foreach (var email in Model.EmailAddresses) { %>
   <tr>
     <td><%= email.Id %></td>
     <td><%= email.Email %></td>
     <td><%= email.Type %></td>
     <td title="email/edit" class="link">Edit</td>
     <td title="email/delete" class="link">Delete</td>
   </tr>
        <%}
    }else
 { %>
   <tr>
     <td colspan="9">No email addresses for this contact</td>
   </tr>
 <%}%>
</table>
<input type="button" name="add" value="Add Email" id="add" />
```

Vous pouvez voir que la propriété ContactPersonId est nécessaire pour
utiliser la méthode d'action Add. Nous devons être certain que nous allons
ajouter le nouvel élément à la collection en le reliant au bon contact. En ce
qui concerne les méthodes d'action Edit et Delete, elles fonctionnent
exactement de la même façon que pour l'objet ContactPerson : l'identifiant
de l'élément qui doit être mis à jour ou supprimé est passé via l'URL et les
cellules de la table sont complétées par un attribut "title" ce qui leur permet
d'être prises en compte par la méthode jQuery .live() qu'on avait mis en place
au niveau de la vue List pour les contacts.

```
[AcceptVerbs(HttpVerbs.Get)]
public ActionResult Add(int id)
{
  var contactTypes = Enum.GetValues(typeof(ContactType))
    .Cast<ContactType>()
    .Select(c => new
    {
      Id = c,
      Name = c.ToString()
    });
  var model = new EmailAddressViewModel
                {
                  ContactPersonId = id,
                  Type = new SelectList(contactTypes, "ID", "Name")
                };
  return PartialView("Add", model);
}

[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Add(EmailAddress emailAddress)
{
  emailAddress.Id = -1;
  EmailAddressManager.Save(emailAddress);
  return RedirectToAction("List", new {id = emailAddress.ContactPersonId});
}
```

Une ViewModel personnalisée a été créé exprès pour afficher les objets
EmailAddress existants dans le but de les modifier ou d'en ajouter. Celle-ci
possède le même type de propriété pour associer la collection
IEnumerable&lt;SelectListItem&gt; à la liste déroulante des types de contacts.
Ces méthodes se distinguent de leur équivalent dans ContactController par ce
qu'elles renvoient. La première renvoie le formulaire Add sous forme de vue
partielle alors que la seconde redirige vers l'action List du contrôleur, ce
qui a pour effet de rafraichir l'affichage de la collection une fois qu'elle a
été mise à jour (et c'est aussi la raison pour laquelle nous avions spécifié
l'option "cache" à faux dans le script jQuery).

En ce qui concerne l'enregistrement d'un élément de la collection, nous
devons définir sa propriété Id à -1 avant d'effectuer le Save. Ceci est
nécessaire pour que la procédure stockée "Upsert" soit correctement capable de
déterminer s'il faut ajouter ou modifier l'élément. En effet, la propriété Id
de l'élément est initialisée par défaut par le système de routage ce qui fait
que dans la pratique elle va contenir la valeur de ContactPerson.Id. Par
conséquent, si nous ne l'initialisions pas explicitement à -1, la procédure
"Upsert" ne chercherait pas à créer un nouvel enregistrement pour l'objet
EmailAddress, mais plutôt à modifier l'élément EmailAddress dont l'identifiant
serait en fait l'identifiant du contact en cours. Ceci est dû au fait qu'Imar a
choisi d'utiliser une approche de type "Upsert" pour modifier (UPdate) et
ajouter (inSERT) des données avec une seule procédure.

Quoiqu'il en soit, voici le code de la vue partielle destinée à ajouter une
adresse email :

```
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EmailAddressViewModel>" %>

<script type="text/javascript">
  $(function() {
    $('#save').click(function() {
      $.ajax({
        type: "POST",
        url: $("#AddEmail").attr('action'),
        data: $("#AddEmail").serialize(),
        dataType: "text/plain",
        success: function(response) {
          $("#details").html(response);
        }
      });
    });
  });
</script>

<% using(Html.BeginForm("Add", "Email", FormMethod.Post, new { id = "AddEmail" })) { %>
<table class="table">
<tr>
  <td>Email:</td>
  <td><%= Html.TextBox("Email")%></td>
</tr>
<tr>
  <td>Type:</td>
  <td><%= Html.DropDownList("Type") %></td>
</tr>
<tr>
  <td><%= Html.Hidden("ContactPersonId") %></td>
  <td><input type="button" name="save" id="save" value="Save" /></td>
</tr>
</table>
<% } %>
```

Dans ce cas particulier, le code jQuery est chargé d'envoyer le formulaire
par Ajax. Si vous faites attention, vous pouvez constater que ce code est
rattaché à un bouton html et pas à un input type="submit". Il va d'abord
sérialiser le contenu des champs du formulaire puis faire une requête pour
atteindre l'action Add() décoré avec l'attribut
[AcceptVerbs(HttpVerbs.Post)].

## Modifier et supprimer des adresses email

Pour la modification des objets EmailAddress nous avons besoin du même genre
d'actions et de vues que celles auxquelles nous avons eu à faire jusqu'à
présent. Il faut ajouter deux actions au niveau du contrôleur, une pour le GET
et l'autre pour le POST :

```
[AcceptVerbs(HttpVerbs.Get)]
public ActionResult Edit(int id)
{
  var emailAddress = EmailAddressManager.GetItem(id);
  var contactTypes = Enum.GetValues(typeof(ContactType))
    .Cast<ContactType>()
    .Select(c => new
    {
      Id = c,
      Name = c.ToString()
    });
  var model = new EmailAddressViewModel
  {
    Type = new SelectList(contactTypes, "ID", "Name", emailAddress.Type),
    Email = emailAddress.Email,
    ContactPersonId = emailAddress.ContactPersonId,
    Id = emailAddress.Id
  };
  return View(model);
}

[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(EmailAddress emailAddress)
{
  EmailAddressManager.Save(emailAddress);
  return RedirectToAction("List", "Email", new { id = emailAddress.ContactPersonId });
}
```

Puis la vue partielle pour la modification qui doit commencer à devenir
familière :

```
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<EmailAddressViewModel>" %>

<script type="text/javascript">
  $(function() {
    $('#save').click(function() {
      $.ajax({
        type: "POST",
        url: $("#EditEmail").attr('action'),
        data: $("#EditEmail").serialize(),
        dataType: "text/plain",
        success: function(response) {
          $("#details").html(response);
        }
      });
    });
  });
</script>

<% using(Html.BeginForm("Edit", "Email", FormMethod.Post, new { id = "EditEmail" })) { %>
<table class="table">
<tr>
  <td>Email:</td>
  <td><%= Html.TextBox("Email")%></td>
</tr>
<tr>
  <td>Type:</td>
  <td><%= Html.DropDownList("Type") %></td>
</tr>
<tr>
  <td><%= Html.Hidden("ContactPersonId") %><%= Html.Hidden("Id") %></td>
  <td><input type="button" name="save" id="save" value="Save" /></td>
</tr>
</table>
<% } %>
```

Une fois encore, c'est presque le même chose que pour la vue Add, si ce
n'est la présence d'un champ caché pour stocker la valeur EmailAddress.Id afin
de pouvoir ensuite mettre à jour la bonne adresse email.

En ce qui concerne l'action Delete, il n'y a pas vraiment besoin
d'explications supplémentaires :

```
public ActionResult Delete(int id)
{
  EmailAddressManager.Delete(id);
  return RedirectToAction("List", "Contact");
}
```

## Conclusion

Le but de ce petit exercice était de démontrer qu'il est parfaitement
possible de réaliser des applications MVC sans recourir à LINQ to SQL ou Entity
Framework. Je suis parti d'une application de type Web Forms déjà développée en
ASP.NET 2.0. Le fait qu'elle soit dès le départ très bien structurée en couches
m'a permis de réutiliser ses couches Business Objects, Business Logic et Data
access avec peu ou pas de modification. La couche DAL d'accès aux données DAL
utilise toujours ADO.NET et fait appel à des procédures stockées de base de
données SQL Server.

Tout au long de cet exercice, j'ai présenté comment utiliser des vues
fortement typées basées sur des ViewModels personnalisés et comment une petite
dose de jQuery peut grandement améliorer l'interface utilisateur. Bien entendu,
cette application n'est en aucun cas l'application idéale et elle est loin
d'être prête pour une utilisation réelle. Il resterait beaucoup de choses à
faire pour l'améliorer, comme par exemple refactoriser les vues et les actions
liées aux opérations d'ajout et de modification. D'autre part, elle est
totalement dépourvue de toute forme de validation. Les suppressions renvoient
toujours à la page d'accueil, alors qu'il serait plus pratique pour
l'utilisateur qu'après avoir supprimé un téléphone, un email ou une adresse on
ré-affiche directement la sous-liste correspondante mise à jour. Cela
impliquerait de faire passer l'identifiant ContactPersonId à l'action Delete()
et devrait être relativement facile à réaliser.

{:.encart}
Il est possible de télécharger le code source de cette application à la fin
du billet "[ASP.NET MVC is not all about Linq to SQL](http://www.mikesdotnetting.com/Article/132/ASP.NET-MVC-is-not-all-about-Linq-to-SQL)" de Mike Brind.
