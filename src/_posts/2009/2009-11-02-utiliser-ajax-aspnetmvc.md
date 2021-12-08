---
date: 2009-11-02 18:31:00
layout: post
redirect_from: "post/2009/11/02/Utiliser-Ajax-avec-ASP.NET-MVC"
tags: mvc
title: "Utiliser Ajax avec ASP.NET MVC"
---

C'est la dernière ligne droite : plus que 14 pages de tutoriel à avaler
et je pourrai cocher la case "Finir le tutoriel de Gestion de Contacts" de ma
totolist. Pour cette 7° partie, il va s'agir d'[ajouter
le support d'Ajax à notre gestion de contacts en ASP.NET MVC](http://msdn.microsoft.com/fr-fr/asp.net/dd823279.aspx), dans le but
d'améliorer ses performances et son ergonomie (en quelque sorte donner
l'impression à l'utilisateur qu'il est en train d'utiliser une application
Windows).

Les deux premières pages passent comme une lettre à la poste : pourquoi
utiliser Ajax, ce qu'on va faire avec, Ajax c'est gentil... Il faut juste faire
attention à la version du jQuery disponible dans le dossier Scripts.

## Utilisation d'une vue partielle avec Ajax

Puis on s'attaque au vif du sujet pour modifier la vue Index des contacts,
afin déviter de recharger toute la page juste quand on change de groupe de
contacts.

Pour commencer, on utilise une vue partielle qui sera chargé d'afficher la
table html contenant les contacts rattachés au groupe sélectionné.
Concrètement, on fait un contrôle utilisateur .ASCX dans lequel on déporte tout
le code générant la `<table>` qui existe actuellement dans la
vue Index.aspx

Ce qui nous donne le fichier Views\Contact\ContactList.ascx
suivant :

```
<%@ Control Language="C#" Inherits="System.Web.Mvc.ViewUserControl<ContactManager.Models.Group>" %>
<%@ Import Namespace="Helpers" %>
<table class="data-table" cellpadding="0" cellspacing="0">
    <thead>
        <tr>
            <th class="actions edit">
                Edit
            </th>
            <th class="actions delete">
                Delete
            </th>
            <th>
                Name
            </th>
            <th>
                Phone
            </th>
            <th>
                Email
            </th>
        </tr>
    </thead>
    <tbody>
        <% foreach (var item in Model.Contacts)
           { %>
        <tr>
            <td class="actions edit">
                <a href='<%= Url.Action("Edit", new {id=item.Id}) %>'><img src="../../Content/Edit.png" alt="Edit" /></a>
            </td>
            <td class="actions delete">
                <a href='<%= Url.Action("Delete", new {id=item.Id}) %>'><img src="../../Content/Delete.png" alt="Delete" /></a>
            </td>
            <td>
                <%= Html.Encode(item.FirstName) %> <%= Html.Encode(item.LastName) %>
            </td>
            <td>
                <%= Html.Encode(item.Phone) %>
            </td>
            <td>
                <%= Html.Encode(item.Email) %>
            </td>
        </tr>
        <% } %>
    </tbody>
</table>
```

Et on remplace ce code par une simple ligne :

```
<% Html.RenderPartial("ContactList", Model.SelectedGroup); %>
```

Ce qui fait que notre fichier Contact\Index.aspx ne contient plus que le
code ci-dessous :

```
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<ContactManager.Models.ViewData.IndexModel>" %>
<%@ Import Namespace="Helpers" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
        Index
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

<div class="container">

    <ul id="leftColumn">
    <% foreach (var item in Model.Groups) { %>
        <li<%= Html.Selected(item.Id, Model.SelectedGroup.Id) %>>
            <%= Html.ActionLink(item.Name, "Index", new { id = item.Id }) %>
        </li>
    <% } %>
    </ul>

    <div id="divContactList">
        <% Html.RenderPartial("ContactList", Model.SelectedGroup); %>
    </div>

    <div class="clear"></div>

</div>

</asp:Content>
```

Perso, je ne vais même pas plus loin et je lance le tout pour vérifier que
tout fonctionne correctement. Il me faut quand même supprimer
ContactList.ascx.cs mais au final ça marche sans problème.

Donc, même sans faire d'Ajax, cette vue partielle permet de simplifier le
code dans le cas de vues un peu compliquées, en évitant de tout faire au même
endroit...

Ensuite, si on veut vraiment faire de l'Ajax, il faut faire en sorte que
quand on clique sur un des groupes dans la 1° colonne, au lieu de redemander
l'action Index avec un autre `groupId`, on fasse seulement un appel
à une fonction Ajax pour ne récupérer que le résultat de cette vue partielle
avec les contacts correspondant au groupId sélectionné.

Pour cela, on remplace la méthode Html.ActionLink() par une méthode
Ajax.ActionLink()

```
<%= Ajax.ActionLink(item.Name, "Index", new { id = item.Id }, new AjaxOptions { UpdateTargetId = "divContactList"})%>
```

Ce coup-ci, je ne me fais pas avoir et je vérifie directement pour voir s'il
s'agit d'un Html Helper standard de ASP.NET MVC ou s'il a été fait à la main
pour le tutoriel. Rien de nouveau dans le dossier Helpers => c'est du
standard.

Donc, du côté de la vue on fait en sorte de faire un appel Ajax pour
demander la mise à jour du contenu. Par conséquent, il faut qu'il y ait du
répondant côté contrôleur. Pour cela, nous devons modifier l'action Index pour
qu'elle gère le cas où elle est invoquée dans le cadre d'une demande Ajax.

Et dans ce cas, elle ne renvoie que la vue partielle destinée à afficher la
liste des contacts et pas toute la vue Contact\Index.

```
public ActionResult Index(int? id)
{
    // Get selected group
    var selectedGroup = _service.GetGroup(id);
    if (selectedGroup == null)
        return RedirectToAction("Index", "Group");

    // Ajax Request
    if (Request.IsAjaxRequest())
        return PartialView("ContactList", selectedGroup);

    // Normal Request
    var model = new IndexModel
    {
        Groups = _service.ListGroups(),
        SelectedGroup = selectedGroup
    };
    return View("Index", model);
}
```

Je compile, j'exécute et tout marche comme prévu dans le tutoriel. Y compris
le fait que le groupe sélectionné n'est pas mis en évidence (puisqu'il n'y a
pas de classe "selected").

## Ajout d'une animation jQuery

Pour résoudre le petit problème de CSS et aussi pour que l'utilisateur se
rende compte qu'il se passe quelque chose, on va utiliser la librairie jQuery
(*qui est incluse dans le framework ASP.NET MVC*) pour :

* changer la classe CSS du groupe sélectionné
* ajouter une animation pour que l'utilisateur comprenne qu'il se passe
quelque chose

C'est assez simple à faire puisque dans les options Ajax on dispose des
évènements OnBegin, OnSuccess et OnFailure :

```
<%= Ajax.ActionLink(item.Name, "Index", new { id = item.Id }, new AjaxOptions { UpdateTargetId = "divContactList", OnBegin = "beginContactList", OnSuccess = "successContactList", OnFailure = "failureContactList" })%>
```

Ce qui nous permet de définir les fonctions Javascript à appeller
quand :

* la requête Ajax va commencer
* la requête Ajax s'est terminée correctement
* la requête Ajax a échoué

```
<script type="text/javascript">

    function beginContactList(args) {
        // Highlight selected group
        $('#leftColumn li').removeClass('selected');
        $(this).parent().addClass('selected');
        // Animate
        $('#divContactList').fadeOut('normal');
    }

    function successContactList() {
        // Animate
        $('#divContactList').fadeIn('normal');
    }

    function failureContactList() {
        alert("Could not retrieve contacts.");
    }

</script>
```

## Ajout du support de l'historique du navigateur

J'ai lu cette partie, mais c'est tout. Utiliser Ajax pour faire croire à un
utilisateur qu'il est dans une application Windows puis faire des bidouilles
interminables pour qu'il retrouve des automatismes du monde web, très peu pour
moi.

## Faire des suppressions en Ajax

Ca c'est quelque chose de beaucoup plus intéressant. Pas vraiment d'un point
de vue interface utilisateur (je préfère afficher un écran de détail où on voit
clairement la fiche qui va être supprimée si on confirme), mais plus pour le
côté "si je veux faire une suppression, j'utilise une méthode HTTP DELETE".

Pour commencer, il faut remplacer l'image du lien "Supprimer" par un nouveau
Helper ImageActionLinkHelper.cs créé spécialement. Son but est simplement de
nous permettre d'avoir une méthode Ajax.ActionLink() associé à l'image utilisée
pour matérialiser l'action de suppression.

Le nouveau helper Ajax.ImageActionLink() gère l'appel Ajax côté client et
côté serveur on ajoute une nouvelle action AjaxDelete au contrôleur
Contact.

```
[AcceptVerbs(HttpVerbs.Delete)]
[ActionName("Delete")]
public ActionResult AjaxDelete(int id)
{
    // Get contact to delete
    Contact contactToDelete = _service.GetContact(id);

    // Get group from the contact
    var selectedGroup = _service.GetGroup(contactToDelete.Group.Id);

    // Delete from database
    _service.DeleteContact(contactToDelete);

    // Return Contact List
    return PartialView("ContactList", selectedGroup);
}
```

Cette action a deux particularités :

* L'attribut [AcceptVerbs(HttpVerbs.Delete)] la rend utilisable seulement
dans le cas d'une opération HTTP DELETE (et donc pas via un simple GET ou
POST)
* L'attribut [ActionName("Delete")] sert à avoir un nom d'action ("Delete")
qui est différent du nom de la méthode ("AjaxDelete")

Il est à noter que dans le cas où Javascript est désactivé, la suppression
d'un contact continue de fonctionner :

* un clic sur l'image "Supprimer" fait suivre le lien
/Contact/Delete/123
* le lien /Contact/Delete/123 correspond à l'action Delete(int id) d'origine
en mode GET qui renvoie la vue Delete.aspx pour faire confirmer
* un clic sur le bouton "Delete" pour confirmer effectue un POST vers
/Contact/Delete/123
* un post sur /Contact/Delete/123 correspond à l'action Delete(Contact
contactToDelete) en mode POST qui supprime le contact et renvoie la vue
Index.

## Conclusion

Ouf ! Ca a été long ([plus d'un mois]({% post_url 2009-09-23-troisieme-etape-aspnetmvc %})) et [pas]({% post_url 2009-10-20-test-driven-development-aspnetmvc-suite %}) [toujours]({% post_url 2009-10-29-test-driven-development-aspnetmvc-suite %}) [facile]({% post_url 2009-10-30-test-driven-development-aspnetmvc-fin %}), mais j'ai finalement réussi à suivre ce tutoriel d'un
bout à l'autre. Avec du recul, je me rend compte qu'il aurait été préférable de
suivre les [tutoriels ASP.NET MVC](http://www.asp.net/learn/mvc/)
dans l'ordre, plutôt que d'attaquer directement avec l'exercice de fin de
cours ! Mais il n'est jamais trop tard pour bien faire, surtout maintenant
que la [traduction
française](http://dotnet.developpez.com/mvc/) est disponible. Je vais donc pouvoir continuer mon apprentissage
avant de retrouver le [tutoriel NerdDinner]({% post_url 2009-07-17-premier-essai-aspnet-mvc %}).

Plus tard, j'aimerais utiliser cette application de Gestion de Contacts
comme une base. Je pense qu'il serait intéressant de la refaire en remplaçant
Entity Framework par LINQ to SQL et voir ce que cela change et en particulier
si les différences sont bien cantonnées au niveau du repository. Et puis
continuer en testant ça avec [SubSonic](http://www.subsonicproject.com/) ou [NHibernate](http://www.nhforge.org/), en particulier avec [Fluent NHibernate](http://www.bengtbe.com/blog/post/2009/08/10/NerdDinner-with-Fluent-NHibernate-Part-1-The-domain-model.aspx)...

---
Billet suivant dans la série : [Gestion de contacts avec ASP.NET MVC et jQuery]({% post_url 2009-11-03-gestion-contacts-aspnetmvc-jquery %})
