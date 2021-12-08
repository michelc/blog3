---
date: 2009-10-30 15:46:00
layout: post
redirect_from: "post/2009/10/30/Test-Driven-Development-avec-ASP.NET-MVC-(fin)"
tags: mvc, unit-test
title: "Test-Driven Development avec ASP.NET MVC (fin)"
---

Cette fois je termine cette [6° partie du tutoriel de Gestion des Contacts]({% post_url 2009-10-29-test-driven-development-aspnetmvc-suite %}). En un, il me
reste pas grand chose à faire. En deux, j'utilise les grands moyens et je lance
deux Visual Web Developper, un avec ma solution en cours de finition et un avec
la solution "finie" de l'étape 6 du tutoriel.

Si je regarde au niveau du contrôleur des contacts, je constate que l'action
Index a pas mal changé par rapport à ce qui existait avant. On est passé d'une
seule ligne :

```
public ActionResult Index()
{
    return View(_service.ListContacts());
}
```

A tout ça :

```
public ActionResult Index(int? id)
{
    var model = new IndexModel
    {
        Groups = _service.ListGroups(),
        SelectedGroup = _service.GetGroup(id)
    };

    if (model.SelectedGroup == null)
        return RedirectToAction("Index", "Group");

    return View(model);
}
```

Si je tente de comprendre ce qui est fait :

* on crée un objet de type IndexModel (à voir d'où il sort) et on défini sa
propriété "Groups" avec la liste des groupes et sa propriété SelectedGroup avec
un objet Group correspondant à l'identifiant passé en paramètre.
* s'il n'y de groupe sélectionné, le contrôleur redirige l'utilisateur vers
la gestion des groupes (soit vers l'action Index du contrôleur des
groupes)
* sinon, l'objet IndexModel est transmis à la vue Index pour affichage

Première étape, trouver à quoi correspond le type IndexModel. Il était bien
planqué dans un sous-répertoire ViewData du dossier Models, mais j'ai fini par
trouver à quoi ressemble IndexModel.cs :

```
using System.Collections.Generic;

namespace ContactManager.Models.ViewData
{
    public class IndexModel
    {
        public Group SelectedGroup { get; set; }
        public IEnumerable<Group> Groups { get; set; }
    }
}
```

C'est ni plus ni moins qu'une classe qui sert à contenir les 2 objets
attendus par la nouvelle vue Contacts\Index.aspx :

* la liste des groupes qui apparaitra dans le &lt;ul id="leftColumn"&gt;
* la liste des contacts qui sera rendue dans le &lt;div
id="divContactList"&gt;

Je fais pareil mais ça ne compile pas car la méthode GetGroup() attend un
paramètre de type "int" alors que l'action Index ne peut que lui envoyer un
paramètre de type "int?". Il me faut donc modifier la méthode GetGroup() du
service et par conséquent celle du repository pour qu'elles gèrent un paramètre
"int?" (sans oublier les interfaces et le FakeContactManagerRepository.cs).

En fait non. Il faut seulement modifier le GetGroup() du service pour qu'il
prenne en compte le fait que le paramètre "id" peut être null :

```
public Group GetGroup(int? id)
{
    if (id.HasValue)
        return _repository.GetGroup(id.Value);
    return _repository.GetFirstGroup();
}
```

Ce coup-ci ça compile, mais ça ne s'exécute toujours pas :(

```
c:\MVC\ContactManager\ContactManager\Views\Contact\Index.aspx(13): error CS1061: 'System.Web.Mvc.HtmlHelper<ContactManager.Models.ViewData.IndexModel>' ne contient pas une définition pour 'Selected' et aucune méthode d'extension 'Selected' acceptant un premier argument de type 'System.Web.Mvc.HtmlHelper<ContactManager.Models.ViewData.IndexModel>' n'a été trouvée (une directive using ou une référence d'assembly est-elle manquante ?)
```

D'où qu'il sort ce "Selected" ? Normalement il ne devrait y avoir que
des "SelectedGroup" dans Contacts\Index.aspx. Ou alors c'est pas ma faute parce
que j'ai copié / collé du tutoriel. Je regarde quand même et que
vois-je ?

```
<li <%= Html.Selected(item.Id, Model.SelectedGroup.Id) %>>
```

Oh! Un Html Helper. Voyons-voir s'il y a du nouveau dans le dossier
Helpers ? Oh! un fichier SelectedHelper.cs

```
using System;
using System.Web.Mvc;

namespace Helpers
{
    public static class SelectedHelper
    {

        public static string Selected<T>(this HtmlHelper helper, T value1, T value2)
        {
            if (value1.Equals(value2))
                return "class=\"selected\"";
            return String.Empty;
        }
    }
}
```

J'ajoute ce fichier à mon projet, je recompile et j'exécute mais j'ai
toujours une erreur.

```
c:\MVC\ContactManager\ContactManager\Views\Contact\Index.aspx(14): error CS1061: 'System.Web.Mvc.HtmlHelper<ContactManager.Models.ViewData.IndexModel>' ne contient pas une définition pour 'Selected' et aucune méthode d'extension 'Selected' acceptant un premier argument de type 'System.Web.Mvc.HtmlHelper<ContactManager.Models.ViewData.IndexModel>' n'a été trouvée (une directive using ou une référence d'assembly est-elle manquante ?)
```

Ok, j'ai oublié le `<%@ Import Namespace="Helpers" %>` dans
Index.aspx. Je recompile, j'exécute et ça marche !

Je vais enfin pouvoir passer à la [7° partie du tutoriel](http://msdn.microsoft.com/fr-fr/asp.net/dd823279.aspx "Ajouter le support d'Ajax") et faire de l'Ajax. Mais
là tout de suite, c'est le week-end !

---
Billet suivant dans la série : [Utiliser Ajax avec ASP.NET MVC]({% post_url 2009-11-02-utiliser-ajax-aspnetmvc %})
