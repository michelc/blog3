---
date: 2012-10-02 19:51:00
layout: post
redirect_from: "post/2012/10/02/tester-partie-post-action-create-2"
tags: ef, mvc, unit-test
title: "Tester la partie POST d'une action Create() - 2/2"
---

## L'action à tester

Après avoir codé la [première partie des tests unitaires du POST sur l'action
Create()]({% post_url 2012-10-01-tester-partie-post-action-create %}) dans le cas où la saisie est incorrecte, je vais maintenant
traiter les POST vers Create() lorsque les données sont ok et qu'il est
possible de créer le nouveau contact.

Rappel du code source de l'action en mode POST :

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

Ce que je vais tester correspond donc aux quelques lignes de code situées à
l'intérieur du bloc `if (ModelState.IsValid) { ... }` qui servent
pour effectuer les traitements suivants :

```
var contact = new Contact(); ... db.SaveChanges();
```

=> enregistre le nouveau contact.

```
this.Flash(...);
```

=> défini un message pour informer que la création a réussi.

```
return RedirectToAction(...);
```

=> redirige l'utilisateur vers l'affichage du contact créé (pattern
PRG).

## 1° test : Si ok Alors on crée le nouveau contact

Ce premier test unitaire va consister à contrôler que lorsque la saisie est
correcte, le nouveau contact est bien créé dans la base de données, ce qui
correspond au code suivant dans la méthode Create() :

```
var contact = new Contact();
contact.Update_With_ViewPerson(person);
db.Contacts.Add(contact);
db.SaveChanges();
```

Juste pour info, la ligne
`contact.Update_With_ViewPerson(person);` initialise l'objet Model
de type Contact à partir de l'objet ViewModel de type ViewPerson passé en
paramètre à l'action Create().

```
[TestMethod]
public void PeopleCreate_post_doit_enregistrer_contact_quand_saisie_correcte()
{
  // Arrange
  var controller = new PeopleController(db);
  var person = new ViewPerson
  {
    LastName = "test" + System.DateTime.Now.Ticks.ToString(),
    Phone1 = "0"
  };

  // Act
  var result = controller.Create(person);

  // Assert
  var contact = db.Contacts.Where(x => x.LastName == person.LastName).FirstOrDefault();
  Assert.IsNotNull(contact, "People.Create() aurait dû enregistrer le contact");
}
```

```
var controller = new PeopleController(db);
```

=> instancie un objet contrôleur en lui passant un DbContext pour que
l'action puisse utiliser Entity Framework pour insérer dans la table des
contacts.

```
var person = new ViewPerson { ... };
```

=> initialise un objet ViewPerson valide.

```
var result = controller.Create(person)
```

=> appelle l'action People.Create() en lui passant mon objet ViewPerson,
ce qui me permet d'accéder à la version "POST" de l'action.

```
var contact = db.Contacts.Where(...).FirstOrDefault();
```

=> recherche dans la table des contacts la personne qui a été passée en
paramètre (via à son nom qui doit être unique grace à l'utilisation de la
propriété `Ticks` pour l'initialiser).

```
Assert.IsNotNull(contact, "...");
```

=> test pour vérifier qu'on a bien trouvé le contact dans la base de
données, ce qui signifie donc que l'action l'a correctement inséré dans la
table des contacts et par conséquent que le test est réussi.

## 2° test : Si ok Alors on initialise un message de réussite

Ce deuxième test unitaire va vérifier que l'action Create() défini un
message "flash" lorsque la saisie est correcte.

```
this.Flash(string.Format("La fiche de {0} a été insérée", contact.DisplayName));
```

Ce message servira ensuite (et ailleurs) pour signaler à l'utilisateur que
sa saisie est correcte et qu'elle a bien permis d'enregistrer un nouveau
contact dans la base de données.

```
[TestMethod]
public void PeopleCreate_post_doit_definir_message_de_succes_quand_saisie_correcte()
{
  // Arrange
  var controller = new PeopleController(db);
  var person = new ViewPerson
  {
    LastName = "test",
    Phone1 = "0"
  };
  var context = new ViewContext
  {
      TempData = controller.TempData
  };
  var helper = new HtmlHelper(context, Repertoir.Tests.Helpers.Moq.GetViewDataContainer());

  // Act
  var result = controller.Create(person);

  // Assert
  var flash = helper.Flash();
  Assert.IsNotNull(flash, "People.Create() aurait dû définir un message flash");
  Assert.IsTrue(flash.ToString().Contains("La fiche de test a été insérée"), "People.Create() aurait dû initialiser le bon message");
}
```

```
var context = new ViewContext ... var helper ...
```

=> instancie un HtmlHelper pour pouvoir accéder à la méthode d'extension
Flash.

```
var flash = helper.Flash();
```

=> récupère le message "flash" en cours.

```
Assert.IsNotNull(flash, "...");
```

=> test pour vérifier qu'un message "flash" a bien été défini.

```
Assert.IsTrue(flash.ToString().Contains("..."), "...");
```

=> test pour vérifier que le message contient le texte prévu.

Note : J'essaierai de faire un autre billet pour
présenter comment je gère les messages "flash" et éventuellement comment je
créée des objets mock pour tester ce qui se rapporte au contexte HTTP.

## 3° test : Si ok Alors on redirige vers la fiche créée

Ce dernier test unitaire va servir à contrôler que lorsque la saisie est
correcte, l'utilisateur est bien redirigé vers la fiche du contact qui vient
d'être créé.

```
return RedirectToAction("Details", new { id = contact.Contact_ID, slug = contact.Slug });
```

L'action Create() ayant été atteinte en mode POST, le fait de rediriger
ensuite l'utilisateur vers une autre action (Details() en l'occurence) qui est
en mode GET correspond au [pattern
Post-Redirect-Get](http://fr.wikipedia.org/wiki/Post-Redirect-Get) qui résoud pas mal de problèmes liés à la soumission d'un
formulaire web.

```
[TestMethod]
public void PeopleCreate_post_doit_rediriger_vers_details_quand_saisie_correcte()
{
  // Arrange
  var controller = new PeopleController(db);
  var person = new ViewPerson
  {
    LastName = "test",
    Phone1 = "0"
  };

  // Act
  var result = controller.Create(person) as RedirectToRouteResult;

  // Assert
  Assert.IsNotNull(result, "People.Create() aurait dû renvoyer un RedirectToRouteResult");
  Assert.IsNull(result.RouteValues["controller"], "People.Create() aurait dû rediriger vers le contrôleur en cours");
  Assert.AreEqual("Details", result.RouteValues["action"], "People.Create() aurait dû rediriger vers l'action Details");
  Assert.IsNotNull(result.RouteValues["id"], "People.Create() aurait dû définir 'id'");
  Assert.IsNotNull(result.RouteValues["slug"], "People.Create() aurait dû définir 'slug'");
}
```

```
Assert.IsNotNull(result, "...");
```

=> test pour vérifier que l'action répond bien par un `return
RedirectToAction` et pas par un `return View`.

```
Assert.IsNull(result.RouteValues["controller"], "...");
```

=> test pour vérifier que la redirection se fait vers le contrôleur en
cours.

```
Assert.AreEqual("Details", result.RouteValues["action"],
"...");
```

=> test pour vérifier que la redirection se fait vers l'action
Details().

```
Assert.IsNotNull(result.RouteValues["id"], "...");
```

`Assert.IsNotNull(result.RouteValues["slug"], "...");`

=> tests pour vérifier que la redirection défini les paramètres attendus
par l'action Details().

## Conclusion

Je dispose désormais de 6 tests unitaires pour contrôler que le code de la
partie POST de mon action Create() fonctionne correctement. Si j'y fait des
modifications, ces tests me permettrons de voir si j'ai cassé quelque chose ou
tout au moins fait évoluer mes "spécifications".

L'autre truc intéressant, c'est effectivement que ces tests unitaires
décrivent ce que doit faire l'action Create() du contrôleur People dans sa
version POST :

*
PeopleCreate_post_doit_renvoyer_la_vue_par_defaut_quand_saisie_incorrecte
*
PeopleCreate_post_doit_initialiser_la_liste_des_societes_quand_saisie_incorrecte
*
PeopleCreate_post_doit_renvoyer_le_meme_objet_ViewPerson_a_la_vue_quand_saisie_incorrecte
* PeopleCreate_post_doit_enregistrer_contact_quand_saisie_correcte
* PeopleCreate_post_doit_definir_message_de_succes_quand_saisie_correcte
* PeopleCreate_post_doit_rediriger_vers_details_quand_saisie_correcte
