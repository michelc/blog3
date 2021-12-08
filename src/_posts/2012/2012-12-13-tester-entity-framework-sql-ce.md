---
date: 2012-12-13 00:22:00
layout: post
redirect_from: "post/2012/12/13/tester-entity-framework-avec-sql-ce"
tags: ef, unit-test
title: "Tester Entity Framework avec SQL CE"
---

## Un petit rappel

Au cours de mes recherches pour faire des [tests
unitaires avec Entity Framework]({% post_url 2012-11-05-tests-unitaires-entity-framework %}), j'étais tombé sur un article de Code
Project qui présentait deux méthodes plus ou moins complémentaires pour cela,
dont l'utilisation d'une base de données SQL Server CE créée "au vol"
spécialement pour faire tourner les tests unitaires : [Two strategies for testing Entity Framework - Effort and SQL
CE](http://www.codeproject.com/Articles/460175/Two-strategies-for-testing-Entity-Framework-Effort).

Etant donné qu'en développement j'ai déjà tendance à privilégier SQL Server
CE plutôt que SQL Server Express, ça ne pouvait pas mieux tomber...

En plus de ça, j'avais dans mes favoris un autre article de chez [Arrange Act Assert](http://www.arrangeactassert.com/) qui me
sert souvent d'inspiration pour mes tests unitaires et qui proposait le même
genre d'approche dans son billet [Code First Entity Framework Unit Test Examples](http://www.arrangeactassert.com/code-first-entity-framework-unit-test-examples/).

Alea jacta est. Vu que tout le reste n'était pas ultra convainquant, autant
essayer au plus simple !

## Un peu de code

Ce qu'il me faut donc, c'est avoir une base de données SQL CE dédiée pour
les tests unitaires. Pour cela, je commence par ajouter une chaîne de connexion
dans le fichier `App.config` de mon projet de tests :

```
<connectionStrings>
  <add name="RepertoirContext"
       connectionString="Data Source=|DataDirectory|\Repertoir_UnitTest.sdf"
       providerName="System.Data.SqlServerCe.4.0" />
</connectionStrings>
```

Ensuite, il faut que le projet de tests unitaires fasse référence à cette
base de données via un objet RepertoirContext hérité de DbContext. Dans mes
classes contrôleurs, je me contente normalement d'une ligne :

```
private RepertoirContext db = new RepertoirContext();
```

Mais là, je vais devoir faire un tout petit plus compliqué :

```
private RepertoirContext db { get; set; }

public ContactsControllerTest()
{
    Database.SetInitializer<RepertoirContext>(new DropCreateDatabaseAlways<RepertoirContext>());
    db = new RepertoirContext();
}
```

La ligne `Database.SetInitializer ...` permet de s'assurer que la
base de données est re-créée à chaque fois que la classe
`ContactsControllerTest` est instanciée (et donc à chaque fois que
les tests sont lancés).

Et là, il ne me reste plus qu'à faire passer le DbContext de ma classe de
tests au contrôleur à tester, ce qui peut se faire tout simplement au moment où
je l'instancie :

```
var controller = new PeopleController(db);
```

Puis au niveau du contrôleur j'ajoute un constructeur qui attend un
paramètre de type DbContext (ou plus précisément RepertoirContext) pour
initialiser le contexte utilisé par le contrôleur :

```
private RepertoirContext db;

public ContactsController() { db = new RepertoirContext(); }
public ContactsController(RepertoirContext context) { db = context; }
```

La ligne `public ContactsController() { db = new RepertoirContext();
}` correspond au constructeur par défaut du contrôleur qui initialise un
DbContext correspondant à la "vraie" base de données.

En pratique, j'aurai pu me passer de cette ligne de code et mettre en place
un système d'injection de dépendance. Mais pour 1 seule ligne de code...

## Un premier test

Je peux maintenant tenter un premier vrai test sur ContactsController pour
vérifier que son action `Index()` renvoie bien la vue par
défaut :

```
//
// GET: /Contacts/

public ViewResult Index()
{
  var contacts = db.Contacts.To_ContactList();
  return View(contacts);
}
```

Et le test unitaire :

```
[TestMethod]
public void ContactsIndex_doit_renvoyer_la_vue_par_defaut()
{
  // Arrange
  var controller = new ContactsController(db);

  // Act
  var result = controller.Index();

  // Assert
  Assert.IsNotNull(result);
  Assert.IsTrue(string.IsNullOrEmpty(result.ViewName));
}
```

Jusqu'ici tout va bien... Ca fonctionne en local. Mais qu'est-ce que ça va
donner quand je vais déployer vers AppHarbor ? Est-ce qu'il va me
permettre de créer une base SQL CE temporaire pendant et pour mes
tests ?

* Je commite
* Je pousse vers GitHub
* Je compte jusqu'à 3
* je vais voir ce que ça donne sur AppHarbor
* Ca a marché !!!

## Une conclusion

C'est bon, je vais pouvoir faire tout un tas de tests unitaires (71 pour
l'instant) pour vérifier que les contrôleurs font correctement ce que j'attends
d'eux.

L'avantage, c'est que même si ce n'est "que" du SQL Server CE, c'est du SQL
Server quand même et donc suffisamment proche d'un mode "production". En tout
cas, c'est bien suffisant pour moi et avec ça j'ai réglé mes problèmes de tests
unitaires liés à Entity Framework.
