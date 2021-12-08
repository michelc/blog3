---
date: 2012-10-04 21:27:00
layout: post
redirect_from: "post/2012/10/04/tester-action-details"
tags: ef, mvc, unit-test
title: "Tester l'action Details()"
---

Avant d'attaquer le codage des derniers tests pour le contrôleur
PeopleController, je remet au propre les 3 tests unitaires que j'ai déjà codés
pour valider le fonctionnement de l'action Details() et surtout j'en profite
pour décrire ce que j'ai voulu faire.

## L'action à tester

```
//
// GET: /People/Details/5

public ViewResult Details(int id)
{
  var contact = db.Contacts.Find(id);
  var person = contact.To_ViewPerson();

  return View(person);
}
```

Il s'agit de l'action standard en ASP.NET MVC pour afficher une fiche
particulière. Ca correspondrait à l'action "show" dans un contrôleur Ruby on
Rails.

Cette action reçoit en paramètre (`int id`) l'identifiant de la
fiche contact à afficher.

Elle commence par faire appel à un objet DbContext d'Entity Framework pour
retrouver le contact correspondant à cet identifiant dans la base de
données.

L'objet `contact` récupéré est ensuite transformé en objet
ViewModel à l'aide de la méthode d'extension `To_ViewPerson()`.

Puis l'action fait passer cet objet ViewModel à la vue et renvoie le
résultat : `return View(person);`.

Par conséquent, les trucs à tester sont assez simples :

* un premier test quasi obligatoire pour vérifier que l'action renvoie bien
la vue par défaut.
* un deuxième test pour contrôler que l'action fait bien passer un objet
ViewPerson à la vue, puisque c'est ce qu'elle attend.
* un dernier test pour s'assurer que l'action renvoie bien le contact que
l'on souhaite afficher.

## 1° test : l'action renvoie la vue par défaut

C'est un test un peu répétitif comme test puisqu'on le retrouve à chaque
action. Mais l'avantage, c'est que ça permet d'avoir un point de départ et de
se lancer dans l'écriture des tests unitaires sans buter sur le syndrome de la
page blanche.

```
[TestMethod]
public void PeopleDetails_doit_renvoyer_la_vue_par_defaut()
{
  // Arrange
  var controller = new PeopleController(db);
  var contact = new Contact
  {
    DisplayName = "test",
    Phone1 = "0"
  };
  db.Contacts.Add(contact);
  db.SaveChanges();

  // Act
  var result = controller.Details(contact.Contact_ID);

  // Assert
  Assert.IsNotNull(result, "People.Details() aurait dû renvoyer un ViewResult");
  Assert.IsTrue(string.IsNullOrEmpty(result.ViewName), "People.Details() aurait dû utiliser la vue par défaut");
}
```

Je copie/colle plus ou moins les explications des billets précédents...

```
var controller = new PeopleController(db);
```

=> instancie un objet contrôleur en lui passant un DbContext pour que
l'action puisse utiliser Entity Framework pour rechercher la fiche contact.

```
var contact = new Contact(); ... db.SaveChanges();
```

=> enregistre un contact pour en avoir un à rechercher.

```
var result = controller.Details(contact.Contact_ID);
```

=> appelle l'action Details() en demandant le contact qui a été créé à
l'étape précédente.

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
défaut.

## 2° test : l'action transmet à la vue l'objet qu'elle attend

Là aussi, on retrouve ce genre de test dans les autres actions. Au moins, on
ne peut pas dire que ça soit compliqué d'écrire des tests unitaires.

```
[TestMethod]
public void PeopleDetails_doit_renvoyer_un_objet_ViewPerson_a_la_vue()
{
  // Arrange
  var controller = new PeopleController(db);
  var contact = new Contact
  {
    DisplayName = "test",
    Phone1 = "0"
  };
  db.Contacts.Add(contact);
  db.SaveChanges();

  // Act
  var result = controller.Details(contact.Contact_ID);

  // Assert
  var model = result.ViewData.Model as ViewPerson;
  Assert.IsNotNull(model, "Model devrait être du type ViewPerson");
}
```

```
var model = result.ViewData.Model as ViewPerson;
```

=> récupère l'objet transmis à la vue par le contrôleur.

```
Assert.IsNotNull(model, "Model devrait être du type
ViewPerson");
```

=> vérifie que l'action a bien transmis un objet de type
`ViewPerson`.

## 3° test : l'action renvoie le contact demandé à la vue

Ce test unitaire est un peu nouveau par rapport au 2 premiers tests, mais
rien de bien compliqué quand même.

```
[TestMethod]
public void PeopleDetails_doit_renvoyer_le_contact_demande_a_la_vue()
{
  // Arrange
  var controller = new PeopleController(db);
  var contact1 = new Contact { DisplayName = "test1", Phone1 = "1" };
  db.Contacts.Add(contact1);
  var contact2 = new Contact { DisplayName = "test2", Phone1 = "2" };
  db.Contacts.Add(contact2);
  db.SaveChanges();

  // Act
  var result = controller.Details(contact1.Contact_ID);

  // Assert
  var model = result.ViewData.Model as ViewPerson;
  Assert.AreEqual(contact1.DisplayName, model.DisplayName, "Model aurait dû correspondre au contact demandé");
  Assert.AreEqual(contact1.Phone1, model.Phone1, "Model aurait dû correspondre au contact demandé");
}
```

```
var contact1 = new Contact ...
```

```
var contact2 = new Contact ...
```

=> enregistrement de 2 contacts pour corser un peu.

```
var result = controller.Details(contact1.Contact_ID);
```

=> appelle l'action Details() en demandant un des 2 contacts créé à
l'étape précédente.

```
Assert.AreEqual(contact1.DisplayName, model.DisplayName,
"...");
```

```
Assert.AreEqual(contact1.Phone1, model.Phone1, "...");
```

=> teste que le contact transmis à la vue correspond bien à celui qui a
été demandé et pas à un autre de la table des contacts.

## Remarque en passant

Je ne teste pas ce que ferait l'action Details() dans le cas où le contact
demandé n'existerait pas. C'est parce que j'ai décidé que (pour l'instant) je
ne voulais pas gérer ce genre de truc.

Et donc, comme cela ne fait pas partie de mes "spécifications", cela n'a pas
à être testé.

Même si bien sûr c'est une fonctionnalité qu'il est tout à fait raisonnable
de gérer.

## Conclusion

Ca, c'est fait. Il faut maintenant que je teste les autres actions du
contrôleur : Edit() en versions GET et POST, Delete() en mode GET,
DeleteConfirmed() en mode POST() et si possible accompagner ça d'un nouveau
billet ([c'est fait !]({% post_url 2012-10-17-tests-unitaires-people-controller %})).

Puis il faudra reporter ces tests au niveau du contrôleur
CompaniesController qui gère les contacts de type sociétés.

Et pour finir, essayer de me motiver suffisamment pour faire un billet qui
explique comment j'ai décidé de gérer les tests unitaires pour ce qui touche à
Entity Framework (c'est [presque]({% post_url 2012-11-05-tests-unitaires-entity-framework %}) fait).
