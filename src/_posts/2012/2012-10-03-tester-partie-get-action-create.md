---
date: 2012-10-03 20:39:00
layout: post
redirect_from: "post/2012/10/03/tester-partie-get-action-create"
tags: ef, mvc, unit-test
title: "Tester la partie GET d'une action Create()"
---

Pour compléter mes deux billets sur les tests unitaires concernant la partie
POST de l'action Create() dans le contrôleur PeopleController ([partie 1]({% post_url 2012-10-01-tester-partie-post-action-create %}) et [partie 2]({% post_url 2012-10-02-tester-partie-post-action-create-2 %})), je me suis dit que ça serait une bonne idée de
présenter aussi les tests unitaires qui concernent la partie GET de
l'action.

Normalement, la version GET venant avant le POST, j'aurais pu réfléchir et
présenter les tests dans le "bon" ordre, d'autant plus que certains des tests
se retrouvent dans les 2 versions. Mais bon, mieux vaut tard que jamais...

## L'action à tester

```
//
// GET: /People/Create

public ViewResult Create(int ParentID = 0)
{
  var contact = new Contact();
  if (ParentID != 0)
  {
    contact.Company_ID = ParentID;
    contact.Company = db.Contacts.Find(ParentID);
  }
  ViewPerson person = contact.To_ViewPerson();

  person.Companies = ListCompanies(person.Company_ID);
  return View(person);
}
```

Cette action renvoie la vue par défaut en lui passant un objet ViewModel de
type ViewPerson composé :

* à partir d'un objet Model de type Contact (un contact vide en
l'occurrence),
* d'une liste des sociétés existantes pour générer une liste déroulante dans
la vue et permettre de rattacher la personne à créer à une société.

Par ailleurs, lorsque le paramètre optionnel `ParentID` est
défini, l'action l'utilise pour pré-rattacher la personne qui va être créée à
une société donnée. Ca me permet de gérer un bouton "Ajouter une personne à
cette société" dans la vue société et ainsi faciliter la vie de l'utilisateur
quand il veut créer des contacts pour une société.

## 1° test : vérifier que l'action renvoie la vue par défaut

```
[TestMethod]
public void PeopleCreate_get_doit_renvoyer_la_vue_par_defaut()
{
  // Arrange
  var controller = new PeopleController(db);

  // Act
  var result = controller.Create();

  // Assert
  Assert.IsNotNull(result, "People.Create() aurait dû renvoyer un ViewResult");
  Assert.IsTrue(string.IsNullOrEmpty(result.ViewName), "People.Create() aurait dû utiliser la vue par défaut");
}
```

Je n'ai rien inventé là dedans. C'est un truc assez basique et qui reprend
quasiment tel quel ce que j'ai vu sur internet ou bien lu sur [Professional ASP.NET MVC](http://www.amazon.fr/gp/product/1118076583/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;tag=07arde-21&amp;linkCode=as2&amp;camp=1642&amp;creative=6746&amp;creativeASIN=1118076583).

Je ré-explique malgré tout ce qu'il fait pour éviter d'avoir à repasser par
les billets sur la partie POST de l'action pour les explications.

```
var controller = new PeopleController(db);
```

=> instancie un objet contrôleur en lui passant un DbContext pour que
l'action puisse utiliser Entity Framework pour générer la liste des
sociétés.

```
var result = controller.Create();
```

=> appelle l'action Create() sans argument.

Note : ce test "attaque" la version GET de l'action
car il l'appelle sans paramètre et que fort heureusement pour moi, la version
GET n'attend pas de paramètre (ou plutôt un paramètre facultatif de type int)
alors que la version POST attend un paramètre de type ViewPerson.

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

Ce test unitaire sert à vérifier que dans le code de l'action je n'ai pas
malencontreusement défini le nom de la vue à utiliser. Grâce à lui, je suis
certain de ne pas avoir codé quelque chose comme :

```
return View("Create", person);
```

ou :

```
return View("Create");
```

ou même :

```
return View("New");
```

Rappel : Je n'ai pas à tester le fait que la vue par
défaut sera bien Create.cshtml. Ca, c'est le travail de ceux qui ont développé
ASP.NET MVC.

## 2° test : vérifier que Create renvoie l'objet attendu par la vue

La vue pour créer une personne a besoin d'un objet ViewPerson. Ce test va
donc servir à contrôler que l'action Create() transmet bien cet objet à la
vue.

```
[TestMethod]
public void PeopleCreate_get_doit_renvoyer_un_objet_ViewPerson_a_la_vue()
{
  // Arrange
  var controller = new PeopleController(db);

  // Act
  var result = controller.Create();

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

Ce test unitaire me permet de contrôler que dans le code de l'action j'ai
bien pris les mesures nécessaires pour transmettre à la vue l'objet de type
ViewPerson dont elle a besoin.

Grâce à lui, je suis certain de ne pas avoir codé quelque chose
comme :

```
return View();
```

ou :

```
return View(42);
```

## 3° test : vérifier que Create rempli la liste des sociétés

La vue s'attend à ce que la propriété Companies de l'objet ViewPerson
qu'elle reçoit du contrôleur lui permette de générer une liste déroulante
(dropdownlist) pour que l'utilisateur puisse sélectionner à quelle société il
veut rattacher la personne qu'il est en train de saisir.

```
[TestMethod]
public void PeopleCreate_get_doit_initialiser_la_liste_des_societes()
{
  // Arrange
  var controller = new PeopleController(db);

  // Act
  var result = controller.Create();

  // Assert
  var model = result.ViewData.Model as ViewPerson;
  Assert.IsNotNull(model.Companies, "Model.Companies devrait être initialisée");
}
```

```
Assert.IsNotNull(model.Companies, "...");
```

=> test pour vérifier que la propriété Companies n'est pas nulle (ce qui
est le cas par défaut) et que l'action Create() l'a bien initialisée avec la
liste des sociétés existantes.

Grâce à ce test unitaire, je suis certain de ne pas voir oublié la ligne
suivante dans le code de l'action Create() :

```
person.Companies = ListCompanies(person.Company_ID);
```

Note : en rédigeant ce billet, je me demande si c'est
"bon". Parce que j'aurais très bien pu coder :

```
person.Companies = new SelectList("".ToArray()); // TODO
```

## 3° test bis : vérifier que Create rempli la liste des sociétés

```
[TestMethod]
public void PeopleCreate_get_doit_initialiser_la_liste_des_societes()
{
  // Arrange
  var controller = new PeopleController(db);
  var company = new ViewCompany
  {
    CompanyName = "soc",
    Phone1 = "9"
  };
  var contact = new Contact().Update_With_ViewCompany(company);
  db.Contacts.Add(contact);
  db.SaveChanges();

  // Act
  var result = controller.Create();

  // Assert
  var model = result.ViewData.Model as ViewPerson;
  Assert.IsNotNull(model.Companies, "Model.Companies devrait être initialisée");
  var count = model.Companies.Count();
  Assert.IsTrue(count > 0, "Model.Companies devrait contenir des sociétés");
  var check = model.Companies.Where(x => x.Text == "soc").Count();
  Assert.IsTrue(check > 0, "Model.Companies devrait contenir 'soc'");
}
```

```
var company = new ViewCompany ... / db.SaveChanges();
```

=> création et enregistrement d'une société pour que la base de données
en contienne au moins une, de façon à ce que la liste des sociétés ne soit pas
vide.

```
var count = ... / Assert.IsTrue(count > 0, "...");
```

=> vérifie que la liste n'est pas vide.

```
var check = ... / Assert.IsTrue(check > 0, "...");
```

=> vérifie que la liste contient la société qui vient d'être créée.

"A ce coup", je suis certain que j'ai bien rempli ma liste avec les sociétés
présentes en base de données. Mais je me demande aussi si ça fait pas un tout
petit peu trop ?

## 4° test : vérifier que Create gère une société parente

Lorsque l'action Create() reçoit un paramètre ParentID, il faut qu'elle le
gère pour que côté vue, la société correspondante soit pré-sélectionnée dans la
liste déroulante des sociétés.

```
[TestMethod]
public void PeopleCreate_get_doit_initialiser_la_societe_parente_si_elle_est_renseignee()
{
  // Arrange
  var controller = new PeopleController(db);
  var company = new ViewCompany
  {
      CompanyName = "soc",
      Phone1 = "9"
  };
  var contact = new Contact().Update_With_ViewCompany(company);
  db.Contacts.Add(contact);
  db.SaveChanges();

  // Act
  var result = controller.Create(contact.Contact_ID);

  // Assert
  var model = result.ViewData.Model as ViewPerson;
  Assert.AreEqual(contact.Contact_ID, model.Company_ID, "Model.Company_ID aurait dû correspondre à la société en paramètre");
}
```

```
var company = new ViewCompany ... / db.SaveChanges();
```

=> création et enregistrement d'une société pour que la base de données
en contienne au moins une.

```
var result = controller.Create(societe.Contact_ID);
```

=> appelle l'action Create() en lui passant l'ID d'une société existant
en base de données (c'est un argument de type int => "attaque" la version
GET de l'action).

```
Assert.AreEqual(societe.Contact_ID, model.Company_ID,
"...");
```

=> teste que l'ID de la société transmise à la vue correspond à l'ID qui
avait été passée à l'action du contrôleur.

Note : En fait, je ne teste pas que la société passée
en paramètre soit bien sélectionnée dans la SelectList model.Companies puisque
ce n'est pas l'action Create() qui s'occupe de ça. Par contre, il faut que je
prévoie de faire des tests unitaires pour ma fonction ListCompanies() dont
c'est le boulot.

## Conclusion

Je suis assez satisfait car j'ai l'impression de faire des
progrès :

* J'arrive à faire des tests unitaires quand je m'y mets (il faudrait que je
me décide à les faire avant de démarrer le codage).
* Je commence à bien voir ce qui fait parti de la méthode à tester et ce qui
est en dehors de son périmètre.

J'ai encore besoin de m'améliorer pour "doser" le bon niveau de détail. Mais
je pense que c'est un défaut de débutant et qu'avec l'habitude je saurai de
mieux en mieux aller à l'essentiel.
