---
date: 2012-11-05 19:34:00
layout: post
redirect_from: "post/2012/11/05/tests-unitaires-entity-framework"
tags: ef, unit-test
title: "Tests unitaires pour Entity Framework"
---

J'avais longtemps repoussé l'écriture de tests unitaires pour les
contrôleurs de mon application [Répertoir](http://repertoir.apphb.com/[fr), parce qu'ils accèdent à la base
de données via Entity Framework et que je ne savais pas trop comment m'y
prendre pour tester ça.

J'ai pensé, réfléchi, exploré plus ou moins 3 pistes différentes :

* Ajouter une couche "service" entre les contrôleurs et Entity Framework
* Mocker le DbContext d'Entity Framework
* Utiliser une base de données SQLite en mémoire

## Méthode 1 : Ajouter une couche

Comme j'essaie de faire au plus simple, j'ai conservé le mode "standard" des
contrôleurs générés par VS 2010 et j'instancie un objet DbContext :

```
private RepertoirContext db = new RepertoirContext();
```

Les contrôleurs utilisent ensuite directement cet objet DbContext pour
communiquer avec la base de données, que ce soit pour faire des requêtes ou
pour la mettre à jour :

```
var contact = db.Contacts.Find(person.Contact_ID);
contact.Update_With_ViewPerson(person);
db.Entry(contact).State = EntityState.Modified;
db.SaveChanges();
```

Les "bonnes pratiques" de codage auraient tendance à considérer que cette
proximité entre le contrôleur et la base de données (la "dépendance" comme ils
disent) n'est pas très convenable.

Il serait plus de plus bon goût d'ajouter une couche "service" et de s'en
servir au niveau des contrôleurs pour éviter d'accéder directement à Entity
Framework :

```
private RepertoirContactService srv = new RepertoirContactService();
...
var contact = srv.Find(person.Contact_ID);
srv.Update(person);
```

Hourra ! Le contrôleur est devenu tellement fin et tellement élégant
("Look how thin I am. Thin and dainty.") et surtout il ne fait plus rien par
lui même ("Moisturize me! Moisturize me!").

Maintenant, c'est une vraie partie de plaisir de faire des tests unitaires
pour les contrôleurs :

* Il faut un peu "mocker" le service.
* Ajouter une pincé d'injection de dépendance au contrôleur.
* Et roule ma poule !

```
[TestMethod]
public void PeopleDetails_doit_renvoyer_le_contact_demande_a_la_vue()
{
  // Arrange
  IRepertoirContactService srv = new MockedRepertoirContactService();
  var controller = new PeopleController(srv);
  srv.FakeSource.Add(new Contact
                      {
                          Contact_ID = 1,
                          DisplayName = "test",
                          Phone1 = "0"
                      };)

  // Act
  var result = controller.Details(1);

  // Assert
  var model = result.ViewData.Model as ViewPerson;
  Assert.AreEqual("test", model.DisplayName, "Model aurait dû correspondre au contact demandé");
  Assert.AreEqual("0", model.Phone1, "Model aurait dû correspondre au contact demandé");
}
```

En "vrai", je vais devoir :

* Définir une interface.
* Implémenter la classe RepertoirContactService en faisant appel à DbContext
ou encore mieux passer par une interface IRepertoirContactRepository qui fera
appel au DbContext.
* Implémenter MockedRepertoirContactService.
* Ajouter de l'injection de dépendance au niveau du contrôleur.
* Etc...

Conclusion : C'est beaucoup de boulot pas très
zintéressant pour un projet censé m'amuzer...

## Méthode 2 : Mocker le DbContext

Certains ont pris le parti de mocker directement le DbContext, ce qui évite
d'avoir à ajouter une couche et ce qui me plait beaucoup plus.

J'ai étudié et essayé de faire ça à partir des 2 ou 3 billets
suivants :

* [How to design a unit testable domain model with Entity Framework
Code First](http://blogs.clariusconsulting.net/kzu/how-to-design-a-unit-testable-domain-model-with-entity-framework-code-first/)
* [Faking DbContext](http://odetocode.com/Blogs/scott/archive/2011/05/31/faking-dbcontext.aspx)
* [Mocking your Entity Framework data context and testing it in .NET
MVC](http://www.nogginbox.co.uk/blog/mocking-entity-framework-data-context)

Je trouve cette méthode bien "mieux", même si elle impose de créer quelques
interfaces. Et idéalement, ce serait encore mieux si les gens de Entity
Framework avaient un peu plus préparé le terrain.

Dans le même genre de truc, je suis tombé sur un article sur Code Project
qui présente [Two strategies for testing Entity Framework](http://www.codeproject.com/Articles/460175/Two-strategies-for-testing-Entity-Framework-Effort), dont [Effort](http://effort.codeplex.com/), un provider ADO.NET
pour Entity Framework qui travaille entièrement en mémoire. Ca commence à
devenir intéressant, mais comme le dit l'article, on ne travaille pas
réellement avec une "vraie" base de données et surtout tout n'est pas
géré...

Conclusion : c'est pas mal du tout et ça pourrait le
faire mais ça demande un peu plus de temps que ce que je peux veux y
consacrer.

## Méthode 3 : SQLite en mémoire

Le problème (entre autres) des tests unitaires qui attaquent la base de
données, c'est que c'est lent. Il faudrait donc avoir une base de données
capable de travailler totalement en mémoire pour que ça aille suffisament vite
et que cela ne soit pas pénalisant.

Une base de données en mémoire, je connais... C'est SQLite avec une chaîne
de connexion du style :

```
Data Source=:memory:;Version=3;New=True;
```

Malheureusement, la version actuelle du provider de SQLite ([System.Data.SQLite.dll](http://System.Data.SQLite.org/)) ne
gère pas la partie "Code First" de Entity Framework. (lien vers FAQ qui dit
ça).

Deux solutions possibles pour pallier à ces difficultés :

* Passer par le provider [dotConnect for SQLite](http://www.devart.com/dotconnect/sqlite/) de Devart qui gère complètement ça.
Mais c'est payant...
* Générer "à la main" les scripts de création et d'initialisation de la base
de données. Mais c'est lourd...

Alors bien entendu, j'aurai pu utiliser une version d'évaluation de
dotConnect for SQLite ou bien me résoudre à scripter l'unique table de ma base
de données... Mais je n'ai pas eu trop envie de "bidouiller" pour arriver à
faire un truc qui devrait être naturel.

Conclusion : c'est vraiment dommage, mais ça ne vas
pas être possible.

## La méthode retenue

J'avais donc le choix entre laisser tomber les tests unitaires de mes
contrôleurs ou tester coûte que coûte.

Et j'ai donc décidé qu'en attendant que Microsoft me facilite la vie en
proposant un SQL Server Memory Edition ou sorte un Provider For SQLite Entity
Framework Code First Ready, un tout bête SQL Server CE devrait pouvoir faire
l'affaire...

Je vais maintenant essayer de ne pas trop tarder pour faire un billet
expliquant comment je m'y suis pris. C'est enfin fait : [Tester Entity Framework avec SQL CE]({% post_url 2012-12-13-tester-entity-framework-sql-ce %}).
