---
date: 2012-10-17 22:49:00
layout: post
redirect_from: "post/2012/10/17/tests-unitaires-people-controller"
tags: ef, mvc, unit-test
title: "Tests unitaires de PeopleController"
---

Ce billet vient conclure ma série de billets sur les tests unitaires
consacrés au contrôleur PeopleController.

Il sert de récapitulatif sur les tests unitaires présentés dans les billets
précédents et présente succintement les tests unitaires réalisés pour les
actions Edit() et Delete().

## Tests unitaires action Detail()

Le code testé :

```
// GET: /People/Details/5
public ViewResult Details(int id)
{
  var contact = db.Contacts.Find(id);
  var person = contact.To_ViewPerson();

  return View(person);
}
```

Les 3 tests unitaires :

* PeopleDetails doit renvoyer la vue par defaut
* PeopleDetails doit renvoyer un objet ViewPerson a la vue
* PeopleDetails doit renvoyer le contact demande a la vue

Référence : [Tester l'action Detail()]({% post_url 2012-10-04-tester-action-details %})

## Tests unitaires action Create()

### Le code GET testé :

```
// GET: /People/Create
public ViewResult Create(int ParentID = 0)
{
  var contact = new Contact();
  if (ParentID != 0)
  {
    contact.Company_ID = ParentID;
    contact.Company = db.Contacts.Find(ParentID);
  }
  var person = contact.To_ViewPerson();

  person.Companies = ListCompanies(person.Company_ID);
  return View(person);
}
```

Les 5 tests unitaires :

* PeopleCreate get doit renvoyer la vue par defaut
* PeopleCreate get doit renvoyer un objet ViewPerson a la vue
* PeopleCreate get doit initialiser la liste des societes
* PeopleCreate get doit initialiser la societe parente si elle est
renseignee
* PeopleCreate get doit initialiser la societe parente si elle est
renseignee

Référence : [Tester la partie GET d'une action Create()]({% post_url 2012-10-03-tester-partie-get-action-create %})

### Le code POST testé :

```
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

Les 6 tests unitaires :

* PeopleCreate post doit renvoyer la vue par defaut quand saisie
incorrecte
* PeopleCreate post doit initialiser la liste des societes quand saisie
incorrecte
* PeopleCreate post doit renvoyer le meme objet ViewPerson quand saisie
incorrecte
* PeopleCreate post doit enregistrer contact quand saisie correcte
* PeopleCreate post doit definir message de succes quand saisie correcte
* PeopleCreate post doit rediriger vers details quand saisie correcte

Références :

* [Tester la partie POST d'une action Create() - 1/2]({% post_url 2012-10-01-tester-partie-post-action-create %})
* [Tester la partie POST d'une action Create() - 2/2]({% post_url 2012-10-02-tester-partie-post-action-create-2 %})

## Tests unitaires de l'action Edit()

Le code source à tester :

```
// GET: /People/Edit/5
public ViewResult Edit(int id)
{
  var contact = db.Contacts.Find(id);
  var person = contact.To_ViewPerson();

  person.Companies = ListCompanies(person.Company_ID);
  return View(person);
}

// POST: /People/Edit/5
[HttpPost, ValidateAntiForgeryToken]
public ActionResult Edit(ViewPerson person)
{
  if (ModelState.IsValid)
  {
    var contact = db.Contacts.Find(person.Contact_ID);
    contact.Update_With_ViewPerson(person);
    db.Entry(contact).State = EntityState.Modified;
    db.SaveChanges();

    this.Flash(string.Format("La fiche de {0} a été mise à jour", contact.DisplayName));
    return RedirectToAction("Details", new { id = contact.Contact_ID, slug = contact.Slug });
  }

  person.Companies = ListCompanies(person.Company_ID);
  return View(person);
}
```

Les 10 tests unitaires :

* PeopleEdit get doit renvoyer la vue par defaut
* PeopleEdit get doit renvoyer un objet ViewPerson a la vue
* PeopleEdit get doit renvoyer le contact demande a la vue
* PeopleEdit get doit initialiser la liste des societes
* PeopleEdit post doit renvoyer la vue par defaut quand saisie
incorrecte
* PeopleEdit post doit initialiser la liste des societes quand saisie
incorrecte
* PeopleEdit post doit renvoyer le meme objet ViewPerson quand saisie
incorrecte
* PeopleEdit post doit enregistrer modification quand saisie correcte
* PeopleEdit post doit definir message de succes quand saisie correcte
* PeopleEdit post doit rediriger vers details quand saisie correcte

En général, ces tests unitaires sont presque du copié / collé de ceux écrits
pour l'action Create(). Le test unitaire "PeopleEdit get doit renvoyer le
contact demande a la vue" est quant à lui réalisé dans le même style que
"PeopleDetails doit renvoyer le contact demande a la vue".

La seule "particularité" concerne le test unitaire qui sert à vérifier que
l'action a bien enregistré la modification apportée au contact :

```
[TestMethod]
public void PeopleEdit_post_doit_enregistrer_modification_quand_saisie_correcte()
{
  // Arrange
  var controller = new PeopleController(db);
  var contact = InsertPerson("test", "0");
  contact.LastName = "maj";

  // Act
  var result = controller.Edit(contact.To_ViewPerson());

  // Assert
  var updated_contact = db.Contacts.Where(x => x.LastName == contact.LastName).FirstOrDefault();
  Assert.IsNotNull(updated_contact, "People.Edit() aurait dû mettre à jour le contact");
}
```

## Tests unitaires de l'action Delete()

Le code source à tester :

```
// GET: /People/Delete/5
public ViewResult Delete(int id)
{
  var contact = db.Contacts.Find(id);
  var person = contact.To_ViewPerson();

  return View(person);
}

// POST: /People/Delete/5
[HttpPost, ValidateAntiForgeryToken, ActionName("Delete")]
public ActionResult DeleteConfirmed(int id)
{
  var contact = db.Contacts.Find(id);
  db.Contacts.Remove(contact);
  db.SaveChanges();

  this.Flash(string.Format("La fiche de {0} a été supprimée", contact.DisplayName));
  return RedirectToAction("Index", "Contacts");
}
```

Les 6 tests unitaires :

* PeopleDelete doit renvoyer la vue par defaut
* PeopleDelete doit renvoyer un objet ViewPerson a la vue
* PeopleDelete doit renvoyer le contact demande a la vue
* PeopleDeleteConfirmed doit supprimer le contact
* PeopleDeleteConfirmed doit definir message de succes
* PeopleDeleteConfirmed doit rediriger vers liste des contacts

Les 3 premiers tests unitaires sont des "standards".

"PeopleDeleteConfirmed doit supprimer le contact" : dans le style de
"PeopleCreate post doit enregistrer contact quand saisie correcte" et de
"PeopleEdit post doit enregistrer modification quand saisie correcte".

"PeopleDeleteConfirmed doit rediriger vers liste des contacts" un peu dans
le style de "PeopleCreate post doit rediriger vers details quand saisie
correcte" et de "PeopleEdit post doit rediriger vers details quand saisie
correcte", sauf que dans le cas d'une suppression l'action ne ré-affiche pas
l'élément (puisqu'on l'a supprimé) mais renvoie à la liste des contacts (qui se
trouve par ailleurs dans un autre contrôleur). Ce qui donne le test unitaire
suivant :

```
[TestMethod]
public void PeopleDeleteConfirmed_doit_rediriger_vers_liste_des_contacts()
{
  // Arrange
  var controller = new PeopleController(db);
  var person = InsertPerson("test", "0");

  // Act
  var result = controller.DeleteConfirmed(person.Contact_ID) as RedirectToRouteResult;

  // Assert
  Assert.IsNotNull(result, "People.DeleteConfirmed() aurait dû renvoyer un RedirectToRouteResult");
  Assert.AreEqual("Contacts", result.RouteValues["controller"], "People.DeleteConfirmed() aurait dû rediriger vers le contrôleur Contacts");
  Assert.AreEqual("Index", result.RouteValues["action"], "People.DeleteConfirmed() aurait dû rediriger vers l'action Index");
}
```
