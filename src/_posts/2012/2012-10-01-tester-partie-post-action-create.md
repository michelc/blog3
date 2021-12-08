---
date: 2012-10-01 19:35:00
layout: post
redirect_from: "post/2012/10/01/tester-partie-post-action-create"
tags: mvc, unit-test
title: "Tester la partie POST d'une action Create() - 1/2"
---

## L'action à tester

Il s'agit de l'action Create() en mode POST de mon application de gestion de
contacts, pour le cas où l'utilisateur valide son formulaire pour créer un
nouveau contact de type "personne".

Typiquement, son rôle est de vérifier que la saisie est correcte et en
fonction de cela de déterminer s'il faut :

* créer la nouvelle personne dans la base de données
* renvoyer l'utilisateur en saisie pour correction

```
//
// POST: /People/Create

[HttpPost, ValidateAntiForgeryToken]
public ActionResult Create(ViewPerson person)
{
  if (ModelState.IsValid)
  {
    var contact = new Contact();
    contact.Update_With_ViewPerson(person);
    db.Contacts.Add(contact);
    db.SaveChanges();

    this.Flash(string.Format("La fiche de {0} a été insérée", contact.DisplayName));
    return RedirectToAction("Details", new { id = contact.Contact_ID, slug = contact.Slug });
  }

  person.Companies = ListCompanies(person.Company_ID);
  return View(person);
}
```

Pour l'instant, je vais concentrer mes tests unitaires sur le cas où la
saisie est incorrecte.

Comme je débute encore en ce qui concerne les tests unitaires, pour être
bien certain que je fais mon test à peu près correctement, je modifie
légèrement le code de l'action pour éviter les effets de bord :

```
//
// POST: /People/Create

[HttpPost, ValidateAntiForgeryToken]
public ActionResult Create(ViewPerson person)
{
  if (ModelState.IsValid)
  {
    var contact = new Contact();
    /*
    contact.Update_With_ViewPerson(person);
    db.Contacts.Add(contact);
    db.SaveChanges();

    this.Flash(string.Format("La fiche de {0} a été insérée", contact.DisplayName));
    */
    return RedirectToAction("Details", new { id = contact.Contact_ID, slug = contact.Slug });
  }

  person.Companies = ListCompanies(person.Company_ID);
  return View(person);
}
```

## 1° test : Si erreur Alors je reste en saisie

Je vais commencer par vérifier que Create() me renvoie la vue par défaut
quand j'ai une erreur de saisie :

```
[TestMethod]
public void PeopleCreate_post_doit_renvoyer_la_vue_par_defaut_quand_saisie_incorrecte()
{
  // Arrange
  var controller = new PeopleController();
  var person = new ViewPerson
  {
    LastName = "test",
    Phone1 = "0"
  };
  controller.ModelState.AddModelError("global", "message");

  // Act
  var result = controller.Create(person) as ViewResult;

  // Assert
  Assert.IsNotNull(result, "People.Create() aurait dû renvoyer un ViewResult");
  Assert.IsTrue(string.IsNullOrEmpty(result.ViewName), "People.Create() aurait dû utiliser la vue par défaut");
}
```

```
var person = new ViewPerson { LastName = "test", Phone1 = "0"
};
```

=> initialise un objet ViewPerson que je sais valide.

```
controller.ModelState.AddModelError("global", "message");
```

=> déclare que l'objet comporte une erreur.

```
var result = controller.Create(person) as ViewResult;
```

=> appelle l'action People.Create() en lui passant mon objet ViewPerson,
ce qui me permet d'accéder à la version "POST" de mon action.

```
Assert.IsNotNull(result, "...");
```

=> 1° test pour vérifier que l'action répond bien par un `return
View` et pas par un `return RedirectToAction`.

```
Assert.IsTrue(string.IsNullOrEmpty(result.ViewName),
"...");
```

=> 2° test pour vérifier que l'action n'a pas défini le nom de la vue à
utiliser et qu'elle laisse faire le moteur de vue pour qu'il utilise la vue par
défaut

Comme je débute vraiment, je fais deux contre-vérifications :

* je commente la ligne avec `AddModelError` et je relance le test
pour vérifier que dans ce cas il va bien échouer parce que n'ayant pas défini
d'erreur, l'action a renvoyé un `RedirectResult` et pas un
`ViewResult` et j'ai donc le message "People.Create() aurait dû
renvoyer un ViewResult" : OK
* je modifie `return View(person);` en `return View("Create",
person);` dans l'action et je relance le test pour pour vérifier que j'ai
bien le message "People.Create() aurait dû utiliser la vue par défaut" :
OK

Note : Je n'ai pas à tester que la vue par défaut sera
bien Create.cshtml. Ca, c'est le travail de ceux qui ont développé ASP.NET
MVC.

Conclusion : Grâce à ce test unitaire, je suis
maintenant certain qu'en cas d'erreur de saisie l'action People.Create() me
renverra en saisie. C'est donc quelque chose que je n'ai plus à vérifier dans
les tests suivants.

## 2° test : Si erreur Alors on me dit quoi

Là, je vais vérifier que quand j'ai une erreur de saisie, Create() me
renvoie bien la liste de ces erreurs dans ModelState, ce qui me permettra de
les afficher dans la vue :

```
[TestMethod]
public void PeopleCreate_post_doit_renvoyer_les_erreurs_quand_saisie_incorrecte()
{
  // Arrange
  var controller = new PeopleController();
  var person = new ViewPerson
  {
    LastName = "test",
    Phone1 = "0"
  };
  controller.ModelState.AddModelError("global", "message");

  // Act
  var result = controller.Create(person) as ViewResult;

  // Assert
  Assert.IsTrue(result.ViewData.ModelState.Count > 0, "People.Create() aurait dû renvoyer des erreurs dans ModelState");
}
```

```
Assert.IsTrue(result.ViewData.ModelState.Count > 0,
"...");
```

=> test pour vérifier que le ModelState contient bien des erreurs.

Note : En fait, c'est un test idiot ! S'il y a
des erreurs dans le ModelState en entrée, c'est le boulot de ASP.NET MVC de
mettre ModelState.IsValid à false et de renvoyer ces erreurs dans
`result.ViewData.ModelState`. Et c'est donc le boulot de ceux qui
ont développé ça d'avoir unitairement testé tout ce qui va bien.

Conclusion : un test pour rien à supprimer.

## 2° test : Si erreur Alors la liste des sociétés est initialisée

Dans ce "vrai" 2° test, je vais vérifier que l'action Create() a bien
initialisé la liste des sociétés existantes dont la vue Create.cshtml a besoin
pour générer une liste déroulante qui permet aux utilisateur de rattacher la
personne créée à une société.

```
[TestMethod]
public void PeopleCreate_post_doit_initialiser_la_liste_des_societes_quand_saisie_incorrecte()
{
  // Arrange
  var controller = new PeopleController(db);
  var person = new ViewPerson
  {
    LastName = "test",
    Phone1 = "0"
  };
  controller.ModelState.AddModelError("global", "message");

  // Act
  var result = controller.Create(person) as ViewResult;

  // Assert
  var model = result.ViewData.Model as ViewPerson;
  Assert.IsNotNull(model.Companies, "Model.Companies devrait être initialisée");
}
```

```
var model = result.ViewData.Model as ViewPerson;
```

=> récupère l'objet transmis à la vue par le contrôleur.

```
Assert.IsNotNull(model.Companies, "...");
```

=> test pour vérifier que la propriété Companies n'est pas nulle (ce qui
est le cas par défaut) et que l'action Create() l'a bien initialisée avec la
liste des sociétés existantes (c'est ce que fait la ligne
`person.Companies = ListCompanies(person.Company_ID);` dans le
source de l'action).

Note : ce test créée le contrôleur en lui passant un
paramètre "db" pour définir un objet RepertoirContext spécifique au test. Il
s'agit d'un objet de type DbContext car la méthode ListCompanies() appelée par
l'action Create() passe par Entity Framework pour retrouver la liste des
sociétés existantes dans la base de données.

Conclusion : je reviendrai une autre fois sur la
méthode que j'ai choisi d'utiliser pour effectuer mes tests liés à Entity
Framework Code First.

## 3° test : Si erreur Alors je peux corriger ma saisie

Dans ce test, je vais vérifier que lorsqu'il y a une erreur, l'action
Create() retransmet bien à la vue l'objet ViewPerson qu'elle a traité, de façon
à permettre à l'utilisateur de corriger sa saisie sans avoir à tout
ressaisir.

```
[TestMethod]
public void PeopleCreate_post_doit_renvoyer_le_meme_objet_ViewPerson_a_la_vue_quand_saisie_incorrecte()
{
  // Arrange
  var controller = new PeopleController(db);
  var person = new ViewPerson
  {
      LastName = "test",
      Phone1 = "0"
  };
  controller.ModelState.AddModelError("global", "message");

  // Act
  var result = controller.Create(person) as ViewResult;

  // Assert
  var model = result.ViewData.Model as ViewPerson;
  Assert.IsNotNull(model, "Model devrait être du type ViewPerson");
  Assert.AreEqual(person.LastName, model.LastName, "Model aurait dû correspondre à la saisie");
  Assert.AreEqual(person.Phone1, model.Phone1, "Model aurait dû correspondre à la saisie");
}
```

```
Assert.IsNotNull(model, "Model devrait être du type
ViewPerson");
```

=> 1° test pour vérifier que l'action transmet bien un objet de type
`ViewPerson`.

```
Assert.AreEqual(person.LastName, model.LastName, "...");
```

```
Assert.AreEqual(person.Phone1, model.Phone1, "...");
```

=> 2° test pour vérifier que l'action retransmet bien ce qu'elle a
reçu.

Note : En fait, le "vrai" but de ce test n'est pas de
vérifier que le ViewPerson en entrée est le "même" que le ViewPerson transmis à
la vue (c'est pas mon boulot...). Ce que je teste, c'est que l'objet ViewPerson
est bien re-transmis à la vue en cas d'erreur de saisie et que dans mon code de
l'action Create() j'ai fait correctement ma part du boulot et que j'ai bien
codé :

```
return View(person);
```

et pas :

```
return View();
```

ou quelque chose comme :

```
return View(new ViewPerson());
```

Tout comme dans le test n° 1 je contrôlais en fait que je n'avais pas
codé :

```
return View("Create");
```

Conclusion : Je pense qu'avec ces 3 tests unitaires je
dois être à peu près complet pour traiter le cas où la saisie est incorrecte,
ce qui finalement se résume grosso-modo au 2 lignes de code
suivantes :

```
public ActionResult Create(ViewPerson person)
{
  person.Companies = ListCompanies(person.Company_ID);
  return View(person);
}
```

Après ça, il faudra que je teste le POST quand ça marche et que l'action
Create() enregistre la nouvelle personne (màj : c'est fait avec la
[2° partie de ce billet]({% post_url 2012-10-02-tester-partie-post-action-create-2 %})).

## Ce que je ne teste pas

Je n'ai pas fait de test unitaire pour contrôler que `public
ActionResult Create(ViewPerson person)` avec un objet ViewPerson
incorrect (avec ses propriétés obligatoires laissées vides) génère bien des
erreurs dans ModelState.

* Ce n'est pas un contrôle qui est fait par mon contrôleur et par conséquent
c'est un test unitaire qui ne me concerne pas directement : il a déjà été
fait par les personnes qui ont développé ASP.NET MVC.
* Cependant, il doit falloir que je teste que j'ai bien pensé à mettre les
attributs `[Required]` sur les propriétés obligatoires de mes
objets. Mais là ça concerne les tests unitaires de mes modèles.

Je n'ai pas non plus fait de test unitaire pour contrôler qu'un objet
`ViewPerson` correct génère un objet `Contact` correct.
Là aussi, ce n'est pas un test lié à mon contrôleur, mais c'est un test qui
concerne mon mapping ViewModel / Model.

Et pour finir, je ne teste pas que l'action Create() en mode POST soit bien
marquée par l'attribut `[ValidateAntiForgeryToken]`. Pour l'instant,
je n'ai pas cherché et donc pas trouvé comment faire...
