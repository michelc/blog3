---
date: 2009-10-29 19:44:00
layout: post
redirect_from: "post/2009/10/29/Test-Driven-Development-avec-ASP.NET-MVC-(suite)"
tags: mvc, unit-test
title: "Test-Driven Development avec ASP.NET MVC (suite)"
---

Je dois avouer que j'ai pas mal dévié de l'objectif de cette [6° partie du tutoriel de Gestion des Contacts]({% post_url 2009-10-20-test-driven-development-aspnetmvc-suite %}). Son but était
d'illustrer l'intérêt du test-driven-development en prenant pour exemple
l'ajout d'une notion de groupes de contacts. Comme je trouvais que la fin du
tutoriel passait un peu vite sur la réalisation concrète des modifications
réalisées et que je ne voulais pas me contenter de les récupérer toutes faites,
j'ai pris ça comme un exercice pour compléter mon apprentissage d'ASP.NET
MVC.

## Première tentative

Dans ce billet, je vais donc continuer la modification de la base de
données, c'est à dire ajouter une colonne groupId à la table des contacts et
définir une relation entre les deux tables Contacts et Groups.

Je commence par l'ajout de la colonne groupId de type int, en prenant soin
de définir sa propriété "Default Value or Binding" à 1. Cette petite astuce
m'évite d'avoir à vider la table des contacts lorsque j'ajoute la relation
entre cette nouvelle colonne et la table Groups créée la fois précédente.

Puis je m'occupe de la mise à jour du modèle. Mais ça ne se fait pas tout
seul :( Je dois passer par la toolbox pour ajouter l'association entre les deux
tables. Et même après ça, j'ai des erreurs de compilation ! je recommence,
je bidouille, mais rien à faire, ça ne veut pas compiler...

## Seconde tentative

Pour aller plus vite, je récupère la base de données
(App_Data\ContactManagerDB\*.\*) et le modèle (Models\ContactManagerModel.\*) qui
datent d'avant l'ajout de la table "Groups" et je refais tout comme indiqué
dans le tutorial (ou à peu près).

* ajout de la table "Groups"
* création d'un premier groupe "Business"
* ajout de la colonne "groupId" à la table "Contacts", en mettant 1 comme
"Default Value or Binding"
* définition de la relation entre les deux tables
* mise à jour du modèle

Et cette fois-ci, tout marche comme sur des roulettes ! Je vérifie que
ça compile (Ok), je quitte VWD et je sauvegarde. On ne sait jamais...

## Prise en compte de groupId dans la table Contacts

Pour la suite, je vais déjà tenter de faire apparaitre la liste des groupes
dans les formulaires de création et de mise à jour des contacts, mais juste
pour l'affichage, sans chercher à en tenir compte pour enregistrer les
contacts.

Je commence par modifier la classe EntityContactManagerRepository.cs pour
modifier les requêtes LINQ et leur ajouter les .Include() afin de gérer la
relation entre les tables :

```
...
public Contact GetContact(int id)
{
    return (from c in _entities.ContactSet.Include("Group")
            where c.Id == id
            select c).FirstOrDefault();
}
...
public Group GetGroup(int id)
{
    return (from g in _entities.GroupSet.Include("Contacts")
            where g.Id == id
                    select g).FirstOrDefault();
}
...
```

J'exécute et je teste l'ajout d'un groupe "Friends" et ça passe. J'essaie
alors de créer un nouveau contact mais là le clic sur le bouton "Create" n'a
plus aucun effet. Un petit débugage m'apprend que
`_entities.SaveChanges()` ne fonctionne plus.

Qu'à cela ne tienne, je fais une autre modification au repository pour
associer le contact à créer au groupe par défaut juste avant de procéder à son
enregistrement et là ça marche.

```
public Contact CreateContact(Contact contactToCreate)
{
    // Associate group with contact
    contactToCreate.Group = GetGroup(1);

    // Save new contact
    _entities.AddToContactSet(contactToCreate);
    _entities.SaveChanges();
    return contactToCreate;
}
```

Et ça marche même pour la mise à jour sans qu'il n'y ait rien d'autre à
faire. Tant mieux.

Bon. Aux vues maintenant.

## Mise à jour des vues contacts pour lister les groupes

Je démarre avec la vue Create.aspx en regardant comment c'est fait dans les
sources finis de la 6° partie et en refaisant la même chose pas à pas.

Ajouter une dropdown list des groupes dans le formulaire
Views\Contact\Create/aspx :

```
<p>
    <label for="GroupId">Group:</label>
    <%= Html.DropDownList("GroupId") %>
</p>
```

Tel quel, ça reste insuffisant et on obtient une erreur "*There is no
ViewData item with the key 'GroupId' of type
'IEnumerable&lt;SelectListItem&gt;'.*" quand on essaie d'afficher le
formulaire de création d'un contact.

Il faut donc que le contrôleur fasse passer la liste des groupes à la
vue :

```
public ActionResult Create()
{
    if (!AddGroupsToViewData(-1))
        return RedirectToAction("Index", "Group");
    return View("Create");
}

protected bool AddGroupsToViewData(int selectedId)
{
    var groups = _service.ListGroups();
    ViewData["GroupId"] = new SelectList(groups, "Id", "Name", selectedId);
    return groups.Count() > 0;
}
```

La fonction AddGroupsToViewData() ajoute la liste des groupes à la
collection ViewData et dans le cas où cette collection serait vide, le
contrôleur redirige l'utilisateur vers la liste des groupes afin qu'il puisse y
créer au moins un nouveau groupe.

Pour que cela fonctionne, il faut encore ajouter `using
System.Linq;`, sinon la syntaxe `groups.Count()` n'est pas
acceptée.

Après avoir vérifié que ça marche bien, j'en ai profité pour présenter les
noms des groupes dans l'ordre alphabétique. Après pas mal de Google, j'ai
trouvé comment faire :

```
public IEnumerable<Group> ListGroups()
{
    return _entities.GroupSet.OrderBy(o => o.Name).ToList();
}
```

C'est quand même plus joli.

Je continue donc avec la vue Edit.aspx où je refais <s>quasiment</s> la
même chose.

Ca avance ! Je peux maintenant associer un contact au groupe de
contacts de mon choix. Y'a plus qu'à faire en sorte que ce choix soit
enregistré dans la base de données.

Mais avant, je ne résiste pas au plaisir de trier aussi la liste des
contacts :

```
public IEnumerable<Contact> ListContacts()
{
    return _entities.ContactSet.OrderBy(o => o.FirstName).ThenBy(o => o.LastName).ToList();
}
```

## Utilisation du groupe sélectionné pour créer un contact

Maintenant, je vais essayer de tenir compte du groupe sélectionné lors de la
création d'un contact.

Pour cela, il faut théoriquement :

* récupérer l'identifiant du groupe sélectionné dans le formulaire
* utiliser cet identifiant au moment de l'enregistrement du contact, en lieu
et place du "1" que j'avais mis en dur

Facile ! Si je regarde le code fini de la 6° partie, un paramètre
`int groupId` a été ajouté à l'action Create de
ContactController.cs.

```
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Create(int groupId, [Bind(Exclude = "Id")] Contact contactToCreate)
{
    if (_service.CreateContact(contactToCreate))
        return RedirectToAction("Index");
    AddGroupsToViewData(-1);
    return View("Create");
}
```

Et pour que ça marche, il faut aussi modifier ContactControllerTest.cs qui
teste cette action en donnant la valeur 1 à ce nouveau paramètre.

Donc pour l'instant le contrôleur récupère l'identifiant du groupe qui a été
choisi. Il faut ensuite trouver comment faire suivre cet identifiant au
repository pour qu'il en tienne compte. J'aurai eu tendance à écrire
`contactToCreate.groupId = groupId`, mais malheureusement l'objet
Contact n'a pas de propriété groupId.

Il faut donc procéder pas à pas et commencer par faire passer le groupId du
contrôleur au service :
`_service.CreateContact(contactToCreate)` devient
`_service.CreateContact(groupId, contactToCreate)`, ce qui implique
de modifier IContactManagerService.cs, ContactManagerService.cs et
ContactManagerServiceTest.cs

Puis ensuite faire suivre le groupId du service au repository, ce qui
nécessite la mise à jour de IContactManagerRepository.cs,
EntityContactManagerRepository.cs et FakeContactManagerRepository.cs

1. ContactController.cs récupère groupId de la vue et l'envoie au
service

```
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Create(int groupId, [Bind(Exclude = "Id")] Contact contactToCreate)
{
    if (_service.CreateContact(groupId, contactToCreate))
        return RedirectToAction("Index");
    AddGroupsToViewData(-1);
    return View("Create");
}
```

2. ContactManagerService.cs récupère groupId du contrôleur et l'envoie au
repository

```
public bool CreateContact(int groupId, Contact contactToCreate)
{
    // Validation logic
    if (!ValidateContact(contactToCreate))
        return false;

    // Database logic
    try
    {
        _repository.CreateContact(groupId, contactToCreate);
    }
    catch
    {
        return false;
    }
    return true;
}
```

3. EntityContactManagerRepository.cs : récupère groupId du service et
l'utilise pour créer le contact

```
public Contact CreateContact(int groupId, Contact contactToCreate)
{
    // Associate group with contact
    contactToCreate.Group = GetGroup(groupId);

    // Save new contact
    _entities.AddToContactSet(contactToCreate);
    _entities.SaveChanges();
    return contactToCreate;
}
```

Je lance l'application et crée un nouveau contact après avoir sélectionné
"Friends" dans la dropdown list des groupes, je clique sur le bouton "Create"
et ça marche ! Faut vérifier dans la table Contacts pour le croire mais
c'est bien le cas.

## Utilisation du groupe pour modifier un contact

Ca consiste très simplement à refaire à peu près pareil avec la vue
Edit.aspx et les méthode Edit() qu'on trouve un peu partout dans le contrôleur,
le service et le repository.

Déjà il faut faire en sorte que la vue Edit.aspx fasse apparaitre
correctement le groupe auquel le contact a été rattaché. Pour cela, il suffit
que le contrôleur lui donne la bonne information :

```
public ActionResult Edit(int id)
{
    var contactToEdit = _service.GetContact(id);
    AddGroupsToViewData(contactToEdit.Group.Id);
    return View(contactToEdit);
}
```

Au moins maintenant quand je vais en modification du contact que je viens de
créer, c'est bien le "Friends" qui apparait sélectionné dans la dropdown list
des groupes.

Reste plus qu'à refaire les 3 étapes pour que le groupe sélectionné au
niveau de la vue Edit.aspx soit transmis jusqu'au niveau du repository.

1. ContactController.cs récupère groupId de la vue et l'envoie au
service

```
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(int groupId, Contact contactToEdit)
{
    if (_service.EditContact(groupId, contactToEdit))
        return RedirectToAction("Index");
    AddGroupsToViewData(groupId);
    return View("Edit");
}
```

2. ContactManagerService.cs récupère groupId du contrôleur et l'envoie au
repository

```
public bool EditContact(int groupId, Contact contactToEdit)
{
    // Validation logic
    if (!ValidateContact(contactToEdit))
        return false;

    // Database logic
    try
    {
        _repository.EditContact(groupId, contactToEdit);
    }
    catch
    {
        return false;
    }
    return true;
}
```

3. EntityContactManagerRepository.cs : récupère groupId du service et
l'utilise pour mettre à jour le contact

```
public Contact EditContact(int groupId, Contact contactToEdit)
{
    // Get original contact
    var originalContact = GetContact(contactToEdit.Id);

    // Update with new group
    originalContact.Group = GetGroup(groupId);

    // Save changes
    _entities.ApplyPropertyChanges(originalContact.EntityKey.EntitySetName, contactToEdit);
    _entities.SaveChanges();
    return contactToEdit;
}
```

Quel progrès ! Je peux enfin rattacher un contact à un groupe au moment
de sa création et même en changer lors de sa modification, et tout ça pour de
vrai. Et sans compter que les tests unitaires sont toujours au vert.

## Je touche au but

Pour enfin arriver au bout de cette 6° étape, il me reste juste à faire
apparaitre les groupes au niveau de la vue Contact\Index.aspx qui affiche la
liste des groupes. Malheureusement pour moi, le tutoriel n'a pas choisi la
facilité en se contentant d'ajouter une colonne "Group" à cette liste mais a
préféré filtrer la liste par groupe.

Juste pour le fun, je commence par essayer d'ajouter une colonne "Group" à
la liste en modifiant Contact\Index.aspx :

```
<td>
    <%= Html.Encode(item.Group.Name) %>
</td>
```

Mais à l'exécution, ça ne passe pas et j'ai une erreur "*La référence
d'objet n'est pas définie à une instance d'un objet.*" à cause de
`item.Group.Name`. Je fais des progrès parce que je comprend de
suite que la liste des contacts que le contrôleur ContactController.cs fait
passer à la vue n'a pas été modifiée pour y faire apparaitre le groupe.

Une très légère modification à EntityContactManagerRepository.cs et c'est
résolu :

```
public IEnumerable<Contact> ListContacts()
{
    return _entities.ContactSet.Include("Group").OrderBy(o => o.FirstName).ThenBy(o => o.LastName).ToList();
}
```

J'en serais bien resté là, mais la septième (et dernière !) étape du
tutoriel va modifier cette vue Index pour utiliser Ajax. Si je veux vraiment
aller jusqu'au bout de ce tutoriel il va falloir que j'en passe par le filtrage
des contacts en fonction du groupe...

Je supprime donc mes modifications et c'est reparti.

Pour ce qui concerne la vue, je fais du copier / coller depuis le résultat
du tutoriel, parce que c'est un peu tard et que je n'ai plus le courage de tout
faire moi même. De toute façon, le principe est assez simple. On commence par
faire deux blocs dans le html, le premier avec la liste des groupes (c'est le
`<ul id="leftColumn">`) et le second avec la table des
contacts (le `<div id="divContactList">`).

```
<ul id="leftColumn">
<% foreach (var item in Model.Groups) { %>
    <li <%= Html.Selected(item.Id, Model.SelectedGroup.Id) %>>
    <%= Html.ActionLink(item.Name, "Index", new { id = item.Id }) %>
    </li>
<% } %>
</ul>

<div id="divContactList">
    <table class="data-table" cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                ...
            </tr>
        </thead>
        <tbody>
            <% foreach (var item in Model.SelectedGroup.Contacts)
               { %>
            <tr>
                ...
            </tr>
            <% } %>
        </tbody>
    </table>
</div>
```

Puis on ajoute un peu de CSS pour <s>faire flotter tout ça</s> que les
deux blocs apparaissent côte à côte.

F5 pour voir ce que ça donne... et c'est la grosse erreur :

```
c:\MVC\ContactManager\ContactManager\Views\Contact\Index.aspx(12): error CS1061: 'System.Collections.Generic.IEnumerable<ContactManager.Models.Contact>' ne contient pas une définition pour 'Groups' et aucune méthode d'extension 'Groups' acceptant un premier argument de type 'System.Collections.Generic.IEnumerable<ContactManager.Models.Contact>' n'a été trouvée (une directive using ou une référence d'assembly est-elle manquante ?)
```

Comme maintenant je commence à être doué, je vois très vite que la vue Index
hérite toujours de
`System.Web.Mvc.ViewPage<IEnumerable<ContactManager.Models.Contact>>`
et que par conséquent il n'y a rien pour remplir la liste des groupes. Zut
alors, il fallait aussi que je copie / colle la première ligne de l'Index.aspx
du tutoriel.

```
<%@ Page Title="" Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage<ContactManager.Models.ViewData.IndexModel>" %>
```

Attendez-voir. Y'a un IndexModel. Il sort d'où lui ?

Je relance l'application pour la forme, mais je sais bien que ça va
planter.

```
c:\WINDOWS\Microsoft.NET\Framework\v2.0.50727\Temporary ASP.NET Files\root\01b85515\43ff20e2\App_Web_index.aspx.ebd9867.w7_tnpa3.0.cs(148): error CS0234: Le type ou le nom d'espace de noms 'ViewData' n'existe pas dans l'espace de noms 'ContactManager.Models' (une référence d'assembly est-elle manquante ?)
```

Finalement, c'est pas ce soir que je vais finir...

---
Billet suivant dans la série : [Test-Driven Development avec ASP.NET MVC (fin)]({% post_url 2009-10-30-test-driven-development-aspnetmvc-fin %})
