---
date: 2009-10-20 16:30:00
layout: post
redirect_from: "post/2009/10/20/Test-Driven-Development-avec-ASP.NET-MVC-(suite)"
tags: mvc, unit-test
title: "Test-Driven Development avec ASP.NET MVC (suite)"
---

Enfin, ça y est, je vais enfin faire des trucs pour de vrai : modifier
la base de données, écrire du code qui permet à l'utilisateur de réellement
gérer des groupes de contacts... et venir à bout de la [6°
partie du tutoriel pour gérer des contacts]({% post_url 2009-10-09-test-driven-development-aspnetmvc-suite %} "Test-Driven Development avec ASP.NET MVC (suite)").

## Mises à jour comme dans le tutoriel

### La base de données : facile

Pour commencer, direction le "Database Explorer" pour modifier la base de
données :

* création d'une table "Groups" pour enregistrer les groupes de contacts
* ajout d'une colonne "GroupId" à la table "Contacts" pour y stocker
l'identifiant du groupe auquel est rattaché le contact
* définition de la relation entre les tables "Contacts" et "Groups"

### Le modèle : encore plus facile

Rien à ajouter au tutoriel.

### Le Repositiry : ça se complique

Zut ! Le tutoriel donne bien les modifications à apporter repository
(l'interface et la classe), mais pas un seul mot sur les autres modifications
nécessaires...

* Au début de cette 6° partie, on avait créé une [classe Group]({% post_url 2009-10-06-test-driven-development-aspnetmvc %}) à la main puisqu'on n'avait pas encore touché à
la base de données. Ce coup-ci, pour que ça marche il faut la supprimer sinon
on ne peut pas compiler parce que "*Missing partial modifier on declaration
of type 'ContactManager.Models.Group'; another partial declaration of this type
exists*".
* Les méthodes CreateContact() et EditContact() du repository attendent
désormais un premier paramètre `int groupId` => il faut donc
modifier le service ContactManagerService pour que celui-ci le leur fasse
passer !
* Qu'à cela ne tienne, un rapide coup d'oeil sur sur les sources finis de la
6° partie me confirme qu'il faut aussi faire apparaitre ce paramètre groupId au
niveau du service : dans l'appel aux méthodes du repository mais aussi
dans les signatures des méthodes du service
* Et bien sûr, ça ne compile toujours pas puisque le contrôleur
ContactController ne fait pas passer ce paramètre groupId aux méthodes de
ContactManagerService...

Stop ! J'efface tout et je recommence pas à pas. En un, gérer la table
des groupes. En deux, modifier la gestion des contacts pour tenir compte des
groupes.

## Mises à jour à ma façon

Une fois revenu en arrière :

* mise à jour de la base de données en créant seulement la table "Groups",
sans toucher à la table "Contacts"
* mise à jour du modèle pour prendre en compte la nouvelle table (et pas la
relation entre les tables "Groups" et "Contacts" puisqu'elle n'a pas été
créée)
* suppression de Models/Group.cs
* mise à jour du repository pour la partie qui concerne les opérations sur la
table "Groups"
* mise à jour du FaleRepository pour que ça compile
* un coup de tests unitaires et tout continue à être bon.

## Ajout de la vue Index

Ca avance bien, donc je continue :

* création d'une vue Groups/Index en automatique
* modification de site.master pour ajouter un onglet "Manage Contact
Groups"
* compilation => ça marche, mais la liste est vide (normal puisque la
table "Groups" est vide)

Passage par le "Database Explorer" (Show Table Data) pour ajouter un premier
groupe "Business" et là la liste ressemble enfin à quelque chose. Et toujours
rien de cassé niveau tests unitaires !

D'après ce que je vois dans la copie d'écran du tutoriel, la liste des
groupes est un peu "spéciale". Elle ne contient pas de bouton "Edit" mais
seulement un lien image pour supprimer. Et pas de lien pour créer un nouveau
groupe, mais directement une zone de texte pour saisir le libellé d'un nouveau
groupe et un nouton "Create" pour l'enregistrer.

Donc retour sur la vue Index pour essayer d'arriver à la même chose. Pour
commencer, de simples copier / coller depuis la vue Index des Contacts
suffisent pour modifier la liste. C'est juste un peu plus compliqué pour
ajouter les contrôles nécessaires pour la création d'un nouveau groupe, mais
pas infaisable.

```
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<IEnumerable<ContactManager.Models.Group>>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
        Index
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Index</h2>

    <%= Html.ValidationSummary() %>

    <table>
        <tr>
            <th class="actions delete">
                Delete
            </th>
            <th>
                Name
            </th>
        </tr>

    <% foreach (var item in Model) { %>

        <tr>
            <td class="actions delete">
                <a href='<%= Url.Action("Delete", new {id=item.Id}) %>'><img src="../../Content/Delete.png" alt="Delete" /></a>
            </td>
            <td>
                <%= Html.Encode(item.Name) %>
            </td>
        </tr>

    <% } %>

        <tr>
            <th>
                Add
            </th>
            <th>
                <%= Html.TextBox("Name") %>
                <input type="submit" value="Create" />
                <%= Html.ValidationMessage("Name", "*") %>
            </th>
        </tr>

    </table>

</asp:Content>
```

Et c'est OK pour l'interface utilisateur. Après avoir vérifié que le
contrôleur a bien le code nécessaire pour gérer le Create, je compile,
j'exécute et je tente de créer un nouveau groupe "Friends". Et ça ne marche pas
:( J'ai beau m'acharner sur le bouton "Create", rien ne se passe...

Ok ! J'ai pas de balise &lt;form&gt; dans ma page ! Il faut penser
à englober les contrôles &lt;input&gt; entre

```
<% using (Html.BeginForm("Create", "Group")) { %>
```

et

```
<% } %>
```

MVC, c'est pas encore automatique pour moi. Je recommence, resaisi
"Friends", clique sur le bouton "Create" et boum !

```
Erreur du serveur dans l'application '/'.
--------------------------------------------------------------------------------
The view 'Create' or its master could not be found. The following locations were searched:
~/Views/Group/Create.aspx
~/Views/Group/Create.ascx
~/Views/Shared/Create.aspx
~/Views/Shared/Create.ascx
Description : Une exception non gérée s'est produite au moment de l'exécution de la demande Web actuelle. Contrôlez la trace de la pile pour plus d'informations sur l'erreur et son origine dans le code.
```

Quoi encore ? Pourquoi diable est-ce que ça veut afficher une vue
Create ? J'ai rien demandé moi !

...

Ca y est, j'ai trouvé le coupable dans GroupController.cs :

```
public ActionResult Create(Group groupToCreate)
{
    if (_service.CreateGroup(groupToCreate))
        return RedirectToAction("Index");
    return View("Create");
}
```

Il y a un `return View("Create");` alors que la création se fait
dans la vue Index => à remplacer par `return View("Index");`.

Je re-lance, re-saisi "Friends", re-clique sur "Create" et re-boum. Mais ce
coup-ci je me retrouve dans le débugueur avec une erreur
"*NullReferenceException was Unhandled by user code*" sur la ligne
`<% foreach (var item in Model) { %>`.

...

Ca va bien finir par marcher. Mais pour gagner du temps, je vais pomper sur
le source de GroupController.cs du tutoriel où il y a un `return
View("Index", _service.ListGroups());`. J'aurai pu trouver ! Dans
l'action Index il y a déjà un `return View(_service.ListGroups());`.
C'est sûr que si je renvoie la vue Index sans lui passer la liste des groupes,
ça peut pas marcher...

Je re-lance, re-saisi "Friends", re-clique sur "Create" et voilà-t-y pas que
ça me dit "*A value is required.*" (en rouge en plus). Je re-lance,
re-saisi "Friends" (des fois que le coup d'avant j'ai oublié ou qu'il aurait
pas bien compris), re-clique sur "Create" et pareil.

C'est parce que je suis idiot. Comment qu'elle fait mon action Create si je
lui dit pas de récupérer les valeurs du POST pour fabriquer l'objet Group à
insérer ? Je regarde comment fait le Create dans ContactController.cs,
copie / colle et c'est parti :

```
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Create([Bind(Exclude = "Id")]Group groupToCreate)
{
    if (_service.CreateGroup(groupToCreate))
        return RedirectToAction("Index");
    return View("Index", _service.ListGroups());
}
```

Je re-lance, re-saisi "Friends", re-clique sur "Create" et euréka !
J'ai réussi à insérer un nouveau groupe !!!

Je re-lance, ne saisi rien dans la zone texte, clique sur le bouton "Create"
et j'ai bien un message "*Name is required.*" pour m'apprendre à vouloir
créer un groupe sans lui donner de nom.

Je re-lance, clique sur l'image "Delete" devant le groupe "Friends" et ça me
sort une erreur "*La ressource est introuvable.*". Ah ouais, j'ai pas
encore géré la suppression.

## Ajout de la suppression d'un groupe

Avant d'attaquer ça, je refais vite un coup de tests unitaires pour vérifier
que tout continue de fonctionner comme prévu et ouf! rien de cassé.

J'ajoute l'action Delete au contrôleur GroupController.cs, en faisant tout
comme dans GroupContact.cs :

```
public ActionResult Delete(int id)
{
    var groupToDelete = _service.GetGroup(id);
    return View(groupToDelete);
}

[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Delete(Contact groupToDelete)
{
    if (_service.DeleteGroup(groupToDelete))
        return RedirectToAction("Index");
    return View();
}
```

Un filet rouge sous `_service.GetGroup` et
`_service.DeleteGroup` me rappelle que ces deux méthodes ne sont pas
encore implémentées dans ContactManagerService.cs (et pas déclarées dans
IContactManagerService.cs par la même occasion).

```
public bool DeleteGroup(Group groupToDelete)
{
    // Database logic
    try
    {
        _repository.DeleteGroup(groupToDelete);
    }
    catch
    {
        return false;
    }
    return true;
}

public Group GetGroup(int id)
{
    return _repository.GetGroup(id);
}
```

Il me reste alors à créer une vue Delete (strongly-typed view, empty
content) puis à m'inspirer de la vue Contact/Delete.aspx pour la
compléter :

```
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<ContactManager.Models.Group>" %>

<asp:Content ID="Content1" ContentPlaceHolderID="TitleContent" runat="server">
        Delete
</asp:Content>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <h2>Delete</h2>

    <p>
    Are you sure that you want to delete the entry for
    <%= Model.Name %>
    </p>

    <% using (Html.BeginForm(new { Id = Model.Id }))
       { %>
       <p>
            <input type="submit" value="Delete" /> &nbsp; <%=Html.ActionLink("Cancel", "Index") %>
        </p>
    <% } %>

</asp:Content>
```

Je lance, clique sur l'image "Delete" devant le groupe "Friends", clique sur
le bouton "Delete" pour confirmer et plus de groupe "Friends". Trop fort, je
peux aussi supprimer un groupe !!!

Je re-lance, clique sur l'image "Delete" devant le groupe "Business", clique
sur le lien "Cancel" pour annuler et le groupe "Business" est toujours là. Des
fois, l'informatique ça marche comme on voudrait...

Allez hop ! Encore un coup de tests unitaires pour me conditionner et
c'est tout pour aujourd'hui.

---
Billet suivant dans la série : [Test-Driven Development avec ASP.NET MVC (suite)]({% post_url 2009-10-29-test-driven-development-aspnetmvc-suite %})
