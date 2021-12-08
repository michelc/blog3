---
date: 2009-10-06 17:12:00
layout: post
redirect_from: "post/2009/10/06/Test-Driven-Development-avec-ASP.NET-MVC"
tags: mvc, unit-test
title: "Test-Driven Development avec ASP.NET MVC"
---

Dans la [sixième
étape](http://msdn.microsoft.com/fr-fr/asp.net/dd823287.aspx "Utiliser la programmation pilotée par les tests") du tutoriel pour créer une application de gestion de contacts avec
ASP.NET MVC, le but est de faire encore mieux que de simples tests unitaires et
d'apprendre à développer selon les principes du "test-driven development" (=
programmation pilotée par les tests) qui implique d'écrire d'abord les tests
unitaires puis ensuite le "vrai" code fonctionnel en respectant le moule des
tests unitaires. L'idée, c'est qu'à la fin du codage, on a forcément un code
qui fait correctement ce qu'on avait prévu de faire (et accessoirement que ce
qui était prévu de faire).

Par rapport aux parties précédentes, je vais détailler un peu plus ce que
j'ai fait, parce que j'ai eu plus de mal à en venir à bout :

* c'est assez compliqué, ou en tout cas assez nouveau pour moi
* il ya sans doute quelques petites erreurs dans le code fourni en
exemple
* les modifications réalisées ne sont pas toujours toutes expliquées

Par contre, je ne vais pas revenir pas sur l'intérêt du TDD, la façon de le
mettre en œuvre ou tous les avantages que cela apporte, mais plutôt sur la
façon dont se déroule le tutoriel.

## 1° scénario : lister les groupes de contacts

Le premier contact avec le TDD a pour but de répondre au user story (=
scénario utilisateur) suivant : "*L'utilisateur peut voir une liste de
groupes de contacts*".

Je commence donc par taper le premier test unitaire destiné à tester que la
méthode Index() du contrôleur Group renvoie bien un ensemble de groupes.

Mais comme pour l'instant, il n'y a pas encore de "vrai" code,
l'IntelliSense ne m'aide pas vraiment voire me complique la vie en remplaçant
GroupController() par GroupControllerTest() dès que je je tape la parenthèse
ouvrante !

Mais bon, c'est le but... Le fait que rien ne marche (et que l'application
ne compile plus) constitue la 1° étape du TDD, à savoir "écrire un test
unitaire qui échoue". **1° étape TDD : OK** (je trouve quand
même que c'est un raisonnement un peu tiré par les cheveux).

Le bon côté des choses, c'est que cela m'a au moins permis d'identifier une
petite différence entre MSTest :

```
Assert.IsInstanceOfType(result.ViewData.Model, typeof(IEnumerable));
```

et NUnit :

```
Assert.IsInstanceOfType(typeof(IEnumerable), result.ViewData.Model);
```

Le truc important, c'est que l'ordre des paramètres est inversé. Et
accessoirement, cette méthode IsInstanceOfType est maintenant obsolète avec
NUnit et il faudrait employer :

```
Assert.IsInstanceOf(typeof(IEnumerable), result.ViewData.Model);
```

Quoiqu'il en soit, pour passer à l'étape suivante du TDD ("Ecrire un code
qui passe le test unitaire avec succès"), il faut au minimum réussir à
compiler. Pour cela, il faut modifier le projet pour ajouter la classe
Controllers\GroupController.cs :

```
using System.Collections.Generic;
using System.Web.Mvc;
using ContactManager.Models;

namespace ContactManager.Controllers
{
    public class GroupController : Controller
    {
        //
        // GET: /Group/

        public ActionResult Index()
        {
            var groups = new List();
            return View(groups);
        }

    }
}
```

Mais c'est malheureusement toujours impossible à compiler, puisqu'on obtient
le message d'erreur `Using the generic type
'System.Collections.Generic.List<T>' requires '1' type arguments`.
C'est sans doute pour cela que le tutoriel fait aussi saisir la classe
Models\Group.cs (sinon elle semblait servir à rien) :

```
namespace ContactManager.Models
{
    public class Group
    {
    }
}
```

Il suffit alors de modifier la classe GroupController.cs pour y remplacer la
ligne `var groups = new List();` par `var groups = new
List<Group>();` pour que ça compile et que le test unitaire soit
passé avec succès. **2° étape TDD : OK** (déjà 5 pages de
passées sur 21, ça avance vite!).

Pour relativiser un peu, on a "juste" mis au point la façon de vérifier que
notre futur contrôleur GroupController aura bien une méthode Index() qui
renverra une liste d'objets de type Group.

## 2° scénario : créer un groupe de contacts

Avant de passer à la programmation du "vrai" code, on remet ça avec la prise
en compte d'un second scénario utilisateur, à savoir : "*L'utilisateur
peut créer un nouveau groupe de contacts*".

Pour ça, il faudra donc que le contrôleur GroupController ait une méthode
Create et que l'utilisation de cette méthode ajoute bien un nouveau groupe dans
la liste des groupes. On va donc commencer par écrire un test unitaire qui
contrôle ça.

```
[TestMethod]
public void Create()
{
    // Arrange
    var controller = new GroupController();
    // Act
    var groupToCreate = new Group();
    controller.Create(groupToCreate);
    // Assert
    var result = (ViewResult)controller.Index();
    var groups = (IEnumerable<Group>)result.ViewData.Model;
    CollectionAssert.Contains(groups.ToList(), groupToCreate);
}
```

Encore une fois, la 1° étape du TDD est OK par KO : le test échoue
puisqu'on ne peut pas compiler. On peut donc se précipiter pour écrire le
minimum du code nécessaire pour que le test réussisse. Pour ça, on ajoute une
méthode action Create() à notre contrôleur GroupController et celle-ci ajoute
l'objet Group qui lui est passé en paramètre à la collection des groupes. Pour
que tout fonctionne, la collection des groupe est désormais renvoyée par
l'action Index().

Notre contrôleur GroupController.cs contient donc le code suivant :

```
using System.Collections.Generic;
using System.Web.Mvc;
using ContactManager.Models;

namespace ContactManager.Controllers
{
    public class GroupController : Controller
    {
        private IList<Group> _groups = new List<Group>();

        public ActionResult Index()
        {
            return View(_groups);
        }

        public ActionResult Create(Group groupToCreate)
        {
            _groups.Add(groupToCreate);
            return RedirectToAction("Index");
        }
    }
}
```

Zut! Ca ne compile toujours pas ! Il y a un problème au niveau de la
ligne

```
CollectionAssert.Contains(groups.ToList(), groupToCreate);
```

dans la classe de test GroupControllerTest.cs :

`'System.Collections.Generic.IEnumerable<ContactManager.Models.Group>'
does not contain a definition for 'ToList' and no extension method 'ToList'
accepting a first argument of type
'System.Collections.Generic.IEnumerable<ContactManager.Models.Group>'
could be found (are you missing a using directive or an assembly
reference?)`

J'efface .ToList(), je colle un point après groups et l'IntelliSense me
propose Equals, GetEnumerator, GetHashCode, GetType et ToString. C'est ma foi
vrai qu'il n'y a pas de ToList() ! Que faire ? Je tente le coup en
laissant juste :

```
CollectionAssert.Contains(groups, groupToCreate);
```

Ca compile et le test réussit. Que demander de plus ? Ca fait ma
seconde 2° étape TDD OK de la journée. La suite sera pour plus tard...

> Mise à jour du 2/12/9 : En fait, il manquait un `using
> System.Linq;` au début de GroupControlletTest.cs pour pouvoir utiliser
> `.ToList()`.

## 3° scénario : valider la création d'un groupe de contacts

(Plus tard) Pour bien faire les choses, notre création d'un nouveau groupe
de contacts est un peu limite. On ne peut pas en créer un comme ça à la bonne
franquette, sans vérifier ce que saisi l'utilisateur. Ce qui implique un
nouveau scénario utilisateur : "*L'utilisateur ne peut pas créer un
nouveau groupe de contacts sans lui donner un nom*".

C'était pas une fonctionnalité prévue dans les scénarios utilisateurs du
départ, mais cela semble logique. Soyons réactifs, on fait du TDD, pas du
[Cycle en
V](http://fr.wikipedia.org/wiki/Cycle_en_V) !

On écrit donc un test unitaire "CreateRequiredName" qui va s'assurer que
l'on a bien une erreur quand on essaie créer un groupe de contacts sans lui
donner de nom.

```
[TestMethod]
public void CreateRequiredName()
{
    // Arrange
    var controller = new GroupController();
    // Act
    var groupToCreate = new Group();
    groupToCreate.Name = String.Empty;
    var result = (ViewResult)controller.Create(groupToCreate);
    // Assert
    var error = result.ViewData.ModelState["Name"].Errors[0];
    Assert.AreEqual("Name is required.", error.ErrorMessage);
}
```

Attention, il faut également modifier le test unitaire "Create" précédent
pour renseigner le nom du groupe afin qu'il continue à fonctionner :

```
...
// Act
var groupToCreate = new Group();
groupToCreate.Name = "Test";
controller.Create(groupToCreate);
...
```

Ca ne compile plus <=> le test unitaire échoue => on peut coder
vite fait quelque chose pour le passer. (Finalement, c'est assez rigolo comme
méthode).

Déjà, pour que cela ait une chance de marcher, il faut ajouter une propriété
Name à notre classe Group. Pour cela, on a seulement besoin d'insérer une ligne
pour définir une [propriété automatique]({% post_url 2009-06-25-proprietes-automatiques-c-sharp %}) :

```
namespace ContactManager.Models
{
    public class Group
    {
        public string Name { get; set; }
    }
}
```

Ca re-compile, le test "Create" réussi toujours mais le test
"CreateRequiredName" échoue => c'est pas fini : il faut encore vérifier
que le nom du groupe n'est pas vide avant de le créer. Pour cela, il suffit
d'ajouter quelques lignes à l'action "Create" du contrôleur
GroupController :

```
public ActionResult Create(Group groupToCreate)
{
    // Validation logic
    if (groupToCreate.Name.Trim().Length == 0)
    {
        ModelState.AddModelError("Name", "Name is required.");
        return View("Create");
    }
    // Database logic
    _groups.Add(groupToCreate);
    return RedirectToAction("Index");
}
```

Mission accomplie : ça continue de compiler et tous les tests unitaires
sont réussis.

## Petit bilan avant de continuer

On progresse peu à peu sur la voie du développement piloté par les
tests : création des scénarios utilisateur, écriture des tests unitaires
et codage à la hussarde pour respecter ces tests. Mais il ne faut pas perdre de
vue que ce n'est que le tout début du chemin :

* la façon dont on a codé c'est du ni fait ni à faire...
* on ne peut a toujours pas créer un groupe de contacts pour de
"vrai" !

---
Billet suivant dans la série : [Test-Driven Development avec ASP.NET MVC (suite)]({% post_url 2009-10-09-test-driven-development-aspnetmvc-suite %})
