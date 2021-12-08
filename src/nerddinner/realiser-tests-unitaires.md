---
date: 2010-02-02 14:17:00
layout: page
permalink: nerddinner/realiser-tests-unitaires/
redirect_from: "pages/NerdDinner/Realiser-des-tests-unitaires"
title: "NerdDinner(fr) : Réaliser des tests unitaires"
---

Nous allons développer une série de tests unitaires automatisés pour
vérifier les fonctionnalités de NerdDinner. A l'avenir, cela nous permettra
d'apporter des modifications et des améliorations à notre application en toute
confiance.

## Pourquoi faire des tests unitaires ?

Un matin, alors que vous allez tranquillement au boulot, vous avez un éclair
de génie : "Bon sang, mais c'est bien sûr ! Si je faisais ce petit truc dans
l'application, ça serait quelque chose !". Et ce petit truc ça peut être
n'importe quoi : refactoriser du code pour le simplifier, ajouter une nouvelle
fonctionnalité, corriger un bogue…

Puis vous arrivez devant votre PC et là vous vous dîtes : "Est-ce bien
raisonnable ?". Et si jamais cette modification avait des effets inattendus ou
qu'elle casse quelque chose ? Peut-être bien que la modification est très simple
à faire et qu'elle ne va prendre que quelques minutes, mais si jamais il faut
ensuite y passer des heures pour tester tous les cas possibles... Et si jamais
on oubliait un cas et que ça passe en production ? Ouille ! Est-ce que ça vaut
vraiment le coup de s'attaquer à cette modification ?

Les tests unitaires sont comme un filet de sécurité qui vous permet
d'améliorer continuellement votre application et qui vous évite le vertige
devant le code sur lequel vous travaillez. Le fait d'avoir des tests
automatisés pour vérifier une fonctionnalité très rapidement vous permet de
coder sans crainte et vous donne l'assurance nécessaire pour faire des
améliorations que vous auriez eu peur d'attaquer. Ils permettent aussi d'écrire
des applications qui seront plus facilement maintenables et qui dureront plus
longtemps, ce qui offre un bien meilleur retour sur investissement.

Avec le framework ASP.NET MVC, les tests unitaires des fonctionnalités d'une
application deviennent quelque chose de facile et de naturel. Avec lui, vous
avez la possibilité de suivre un cycle de développement basé sur les tests
(Test-Driven Development ou TDD en anglais) qui consiste à écrire des tests
puis à programmer en s'appuyant sur ceux-ci.

## Le projet NerdDinner.Tests

Quand nous avons créé la solution NerdDinner au tout début de ce tutoriel,
nous sommes passés par une boite de dialogue qui nous demandait si nous
voulions créer un projet de test unitaire pour notre application :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image009.png)

Nous avions conservé l'option "Yes, create a unit test project", ce qui
avait eu pour effet d'ajouter le projet "NerdDinner.Test" à notre solution :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image142.png)

Le projet NerdDinner.Test fait référence à l'assembly du projet NerdDinner,
ce qui permet d'ajouter facilement des tests automatisés pour contrôler notre
application.

## Créer des tests unitaires pour le modèle Dinner

Nous allons ajouter quelques tests au projet NerdDinner.Test pour vérifier
le fonctionnement de la classe Dinner que nous avons créée lors de la
réalisation de notre couche modèle.

Pour cela, nous commençons par ajouter un nouveau dossier "Models" dans le
projet de test pour y placer les tests qui vont concerner notre modèle de
données. Puis nous faisons un clic-droit sur ce dossier pour choisir la
commande Add-&gt;New Test, ce qui fait apparaitre la boite de dialogue "Add New
Test" qui nous permet de créer un nouveau test.

Nous pouvons alors créer un nouveau test en choisissant le template "Unit
Test" et en lui donnant le nom "DinnerTest.cs" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image143.png)

Une fois que nous cliquons sur le bouton "OK", Visual Studio va ajouter le
fichier DinnerTest.cs au projet puis ouvrir celui-ci :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image144.png)

Le contenu par défaut du template "Unit Test" de Visual Studio est un peu
trop usine à gaz à mon goût. Nous allons donc le nettoyer pour conserver
uniquement le code ci-dessous :

```
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NerdDinner.Models;

namespace NerdDinner.Tests.Models {

   [TestClass]
   public class DinnerTest {

   }
}
```

L'attribut [TestClass] au dessus de la classe DinnerTest indique qu'il
s'agit d'une classe qui contiendra des tests et éventuellement du code pour
initialiser ces tests ou nettoyer après leur exécution. Nous pourrons définir
des tests à l'intérieur de cette classe en lui ajoutant des méthodes publiques
que nous ferons précéder d'un attribut [TestMethod].

Voici les deux premiers tests que nous allons ajouter pour contrôler notre
classe Dinner. Le premier d'entre eux vérifie qu'un objet Dinner n'est pas
valide s'il est créé sans que l'ensemble de ses propriétés soit défini
correctement. Le second test vérifie qu'un objet Dinner est valide quand il est
créé en définissant toutes ses propriétés avec des valeurs correctes :

```
[TestClass]
public class DinnerTest {

   [TestMethod]
   public void Dinner_Should_Not_Be_Valid_When_Some_Properties_Incorrect() {

     //Arrange
     Dinner dinner = new Dinner() {
        Title = "Test title",
        Country = "USA",
        ContactPhone = "BOGUS"
     };

     // Act
     bool isValid = dinner.IsValid;

     //Assert
     Assert.IsFalse(isValid);
   }

   [TestMethod]
   public void Dinner_Should_Be_Valid_When_All_Properties_Correct() {

     //Arrange
     Dinner dinner = new Dinner {
        Title = "Test title",
        Description = "Some description",
        EventDate = DateTime.Now,
        HostedBy = "ScottGu",
        Address = "One Microsoft Way",
        Country = "USA",
        ContactPhone = "425-703-8072",
        Latitude = 93,
        Longitude = -92,
     };

     // Act
     bool isValid = dinner.IsValid;

     //Assert
     Assert.IsTrue(isValid);
   }

}
```

Comme vous pouvez le voir dans ce code, nos tests ont des noms très
explicites (et même un peu à rallonge).Nous avons fait cela parce qu'au final,
nous pourrions avoir des centaines voire des milliers de petits tests et que ce
sera plus facile pour comprendre en un coup d'œil à quoi sert et ce que fait
chacun d'eux (surtout quand il faut s'y retrouver dans la fenêtre qui affiche
les résultats des tests).Les noms donnés aux tests doivent toujours être
définis en fonction de la fonctionnalité qu'ils vérifient. Dans notre code,
nous avons utilisé une règle de nommage "Nom_Devrait_Verbe".

Nous avons organisé nos tests en suivant le modèle "AAA", c'est-à-dire
"Arrange, Act, Assert" :

* Arrange : préparation de l'élément à tester
* Act : réalisation du test et récupération de son résultat
* Assert : vérification du bon fonctionnement

Quand on écrit des tests unitaires, il faut éviter qu'un test individuel
fasse trop de choses. Au lieu de ça, chaque test doit porter sur un seul
élément de base (c'est beaucoup plus pratique pour découvrir d'où vient le
problème en cas d'échec de certains tests). Un bon truc pour y parvenir est de
ne faire qu'un test et de n'avoir qu'une commande "Assert" dans chaque test
unitaire. Si vous avez plus d'une commande "Assert" dans une méthode de test,
vérifiez-bien qu'elles servent toutes à tester la même chose. Et en cas de
doute, ajoutez un autre test unitaire.

## Lancer les tests

Avec Visual Studio 2008 Professional (ou une version supérieurs), il est
possible d'exécuter les projets de tests unitaires directement au sein de
l'environnement de développement. Nous pouvons utiliser la commande
"Test-&gt;Run-&gt;All Tests in Solution" (ou taper Ctrl R, A) pour lancer
l'exécution de tous nos tests unitaires. Nous pouvons aussi placer le curseur
dans une classe de test ou à l'intérieur d'une méthode de test particulière et
utiliser la commande "Test-&gt;Run-&gt;Tests in Current Context" (ou Ctrl R, T)
pour n'exécuter qu'une partie des tests unitaires.

Pour exécuter les deux tests unitaires que nous venons de définir, il suffit
donc de placer le curseur dans la classe DinnerTest puis de taper "Ctrl R, T".
Visual Studio affiche alors une fenêtre "Tests Results" dans laquelle nous
pouvons voir les résultats pour nos deux tests unitaires :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image145.png)

Note : la colonne "Class Name" ne s'affiche pas par défaut.
Pour l'ajouter, utilisez la commande "Add/Remove Columns" qui apparait grâce à
un clic-droit dans la fenêtre "Tests Results".

Nos deux tests ont seulement pris une fraction de seconde pour s'exécuter -
et comme vous pouvez le voir ils ont tous les deux réussis. Nous pouvons donc
aller plus loin et compléter ceux-ci en créant des tests supplémentaires pour
vérifier la validation de règles spécifiques et le fonctionnement des deux
méthodes d'assistance IsUserHost() et IsUserRegistered() que nous avons
ajoutées à la classe Dinner. A l'avenir, grâce à ces tests, la mise à jour des
traitements métiers ou des règles de validation va devenir plus simple et moins
risquée. Nous pourrons alors ajouter une nouvelle règle de validation puis
contrôler en quelques secondes que cela n'a pas eu d'impact sur les
fonctionnalités existantes.

Comme vous pouvez le voir, le fait d'avoir utilisé des noms de test parlant
il est facile de comprendre rapidement ce que chaque test contrôle.

Vous pouvez remarquer que le fait d'avoir employé des noms de test très
parlant facilite énormément la tâche pour comprendre ce que chaque test est
sensé contrôler. Je vous recommande d'utiliser la commande "Tools-&gt;Options"
pour accéder à l'écran de configuration "Test Tools / Test Execution" et de
cocher "Double-clicking a failed or inconclusive unit test result displays the
point of failure in the test". Cela vous permettra de double-cliquer sur un
test en erreur dans la fenêtre des résultats de test et d'accéder directement
au point qui pose problème.

## Créer des tests unitaires pour DinnersController

Nous allons à présent créer quelques tests unitaires pour vérifier les
fonctionnalités du contrôleur DinnersController. Pour commencer, nous faisons
un clic-droit sur le répertoire "Controllers" du projet de tests pour choisir
la commande "Add-New Test". Puis nous demandons à créer un "Unit test" que nous
appellerons "DinnersControllerTest.cs".

Nous pouvons alors créer deux méthodes de tests qui vont nous permettre de
vérifier l'action Details() dans DinnersController. La première vérifiera que
Details() renvoie une vue lorsqu'on demande un dîner existant. La seconde
contrôlera que c'est la vue "NotFound" qui est renvoyé quand on demande un
dîner qui n'existe pas :

```
[TestClass]
public class DinnersControllerTest {

   [TestMethod]
   public void DetailsAction_Should_Return_View_For_ExistingDinner() {

     // Arrange
     var controller = new DinnersController();

     // Act
     var result = controller.Details(1) as ViewResult;

     // Assert
     Assert.IsNotNull(result, "Expected View");
   }

   [TestMethod]
   public void DetailsAction_Should_Return_NotFoundView_For_BogusDinner() {

     // Arrange
     var controller = new DinnersController();

     // Act
     var result = controller.Details(999) as ViewResult;

     // Assert
     Assert.AreEqual("NotFound", result.ViewName);
   }
}
```

Le code ci-dessus se compile sans problème. Cependant, lorsque nous lançons
l'exécution des tests, ils échouent tous les deux :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image146.png)

En consultant les messages d'erreur, on peut voir que nos deux tests ont
échoués parce que la classe DinnerRepository n'a pas pu se connecter à la base
de données. Notre application NerdDinner utilise une chaine de connexion vers
un fichier de base de données SQL Server Express local, présent dans le
répertoire \App_Data du projet NerdDinner. Etant donné que le projet
NerdDinner.Tests se compile et s'exécute dans un autre répertoire que celui du
projet NerdDinner, le chemin relatif pour accéder à la base de données n'est
pas valable.

Nous *pourrions* résoudre ce problème en copiant le fichier contenant
notre base de données SQL Server dans notre projet de test puis ajouter une
chaine de connexion vers celui-ci dans le fichier de configuration App.config
du projet. Cela nous permettrait de débloquer et de faire fonctionner nos deux
tests ci-dessus.

Malgré tout, le fait de faire des tests unitaires en utilisant une véritable
base de données provoque un certain nombre de difficultés, et en
particulier :

* Cela ralentit considérablement la vitesse d'exécution des tests unitaires.
Plus le temps d'exécution des tests est long, moins vous serez enclins à les
exécuter régulièrement. Dans l'idéal, il faudrait que vos tests unitaires
s'exécutent en quelques secondes - pour devenir quelque chose d'aussi naturel
que la compilation de votre projet.
* Cela complique les traitements d'initialisation et de nettoyage pour chaque
test. Il faut que chaque test unitaire puisse être isolé et indépendant les uns
des autres (sans effets secondaires ou interdépendances). Si vous travaillez
avec une vraie base de données, vous devez être conscient de cela et en tenir
compte.

Nous allons maintenant aborder le modèle de conception appelé "injection de
dépendance" (ou DI = Dependancy Injection) qui va nous aider à gérer ce genre
de problèmes et nous éviter d'avoir à travailler sur une vraie base de données
pour réaliser les tests.

## L'injection de dépendance

Pour l'instant, la classe DinnersController est étroitement "liée" à la
classe DinnerRepository. Cette notion de "lien" fait référence au fait qu'une
classe dépend explicitement d'une autre classe pour pouvoir fonctionner :

```
public class DinnersController : Controller {

   DinnerRepository dinnerRepository = new DinnerRepository();

   //
   // GET: /Dinners/Details/5
   public ActionResult Details(int id) {

     Dinner dinner = dinnerRepository.FindDinner(id);

     if (dinner == null)
        return View("NotFound");

     return View(dinner);
   }
```

Etant donné que la classe DinnerRepository a besoin d'accéder à la base de
données, le fait que la classe DinnersController soit étroitement liée à cette
classe DinnerRepository nous oblige à avoir une base de données pour que les
méthodes d'action de DinnersController puissent être testées.

Il est possible d'éviter ça en employant un modèle de conception qui
s'appelle "injection de dépendance". C'est une technique dans laquelle les
dépendances (comme par exemple le fait d'avoir besoin d'initialiser un
repository pour accéder à la base de données) ne sont plus définies de façon
implicite au niveau de la classe qui en a besoin.

Au lieu de ça, les dépendances sont transmises de façon explicite à la
classe qui en a besoin en tant qu'argument pour son constructeur. Et si en plus
cette dépendance est définie sous forme d'interface, cela nous donne alors la
possibilité de faire passer une "fausse" implémentation de celle-ci dans le
cadre des tests unitaires. Cela permet ainsi de créer une implémentation
particulière pour les tests qui n'aura pas besoin d'accéder à une vraie base de
données pour fonctionner.

Pour mettre cela en pratique, nous allons d'ores et déjà ajouter cette
notion d'injection de dépendance au niveau du contrôleur DinnersController.

## Extraire l'interface IDinnerRepository

La première étape consiste à créer une interface IDinnerRepository qui
contractualise les éléments que doit fournir le repository pour que le
contrôleur puisse retrouver et mettre à jour des objets Dinners.

Nous pouvons créer cette interface nous même en faisant un clic-droit sur le
dossier \Models puis en choisissant la commande Add-&gt;New Item et ajouter une
nouvelle interface appelée IDinnerRepository.cs.

Ou alors, nous pouvons employer les outils de refactoring intégrés dans
Visual Studio Professional (ou versions supérieures) pour extraire et créer
automatiquement une interface à notre place à partir de la classe
DinnerRepository existante. Pour extraire cette interface à l'aide de Visual
Studio, il suffit de placer le curseur dans la classe DinnerRepository puis de
faire un clic droit pour choisir la commande Refactor-&gt;Extract
Interface :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image147.png)

Cela va lancer la boite de dialogue "Extraire l'interface" qui nous demande
de donner un nom à l'interface à créer. Elle nous propose par défaut le nom
IDinnerRepository et sélectionne automatiquement toutes les méthodes publiques
de la classe DinnerRepository pour les ajouter à l'interface :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image148.png)

Puis quand nous cliquons sur le bouton "OK", Visual Studio ajoute
l'interface IDinnerRepository à l'application :

```
public interface IDinnerRepository {

   IQueryable<Dinner> FindAllDinners();
   IQueryable<Dinner> FindByLocation(float latitude, float longitude);
   IQueryable<Dinner> FindUpcomingDinners();
   Dinner GetDinner(int id);

   void Add(Dinner dinner);
   void Delete(Dinner dinner);

   void Save();
}
```

Et la classe DinnerRepository existante est mise à jour pour indiquer
qu'elle implémente l'interface IDinnerRepository :

```
public class DinnerRepository : IDinnerRepository {
   ...
}
```

## Ajouter l'injection de dépendance à DinnersController

Nous pouvons maintenant passer à la phase de mise à jour de la classe
DinnersController pour qu'elle utilise désormais cette nouvelle interface.

Pour l'instant, il y a du code en "dur" dans la classe DinnersController qui
fait que le champ "dinnerRepository" est toujours une instance de la classe
DinnerRepository :

```
public class DinnersController : Controller {

   DinnerRepository dinnerRepository = new DinnerRepository();

   ...
}
```

Nous allons faire un premier changement pour que le type du champ
"dinnerRepository" soit IDinnerRepository au lieu de DinnerRepository. Puis
nous ajoutons deux constructeurs publics à la classe DinnersController. Un de
ces constructeurs attend un argument de type IDinnerRepository. L'autre
constructeur n'a pas d'argument. C'est le constructeur par défaut du contrôleur
qui utilise une instance de la classe DinnerRepository :

```
public class DinnersController : Controller {

   IDinnerRepository dinnerRepository;

   public DinnersController()
     : this(new DinnerRepository()) {
   }

   public DinnersController(IDinnerRepository repository) {
     dinnerRepository = repository;
   }

   ...
}
```

Étant donné qu'ASP.NET MVC instancie toujours les classes contrôleurs en
utilisant leur constructeur par défaut, ce code nous assure que lors de son
exécution, le contrôleur DinnersController continuera à utiliser la classe
DinnerRepository pour gérer l'accès aux données.

Nous pouvons à présent passer à la phase suivante et mettre à jour nos tests
unitaires pour qu'ils emploient constructeur qui attend un argument pour lui
faire passer une "fausse" implémentation du repository. Cette "fausse"
implémentation n'aura pas besoin d'accéder à une vraie base de données et se
contentera de travailler avec des données en mémoire.

## Créer la classe FakeDinnerRepository

Nous allons donc voir comment créer une classe FakeDinnerRepository.

Pour commencer on va créer un répertoire "Fakes" dans notre projet
NerdDinner.Tests puis on va y ajouter une nouvelle classe FakeDinnerRepository
en faisant un clic-droit sur ce dossier et en appelant la commande Add-&gt;New
Class :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image149.png)

Nous devons ensuite modifier le code de la classe FakeDinnerRepository pour
qu'elle implémente l'interface IDinnerRepository. Pour cela, il est tout
simplement possible de faire un clic-droit dessus et de choisir la commande
"Implement interface IDinnerRepository"

![](http://nerddinnerbook.s3.amazonaws.com/Images/image150.png)

Grâce à cela, Visual studio va ajouter automatiquement tous les membres de
l'interface IDinnerRepository à la classe FakeDinnerRepository avec pour chacun
d'entre eux une implémentation par défaut :

```
public class FakeDinnerRepository : IDinnerRepository {

   public IQueryable<Dinner> FindAllDinners() {
     throw new NotImplementedException();
   }

   public IQueryable<Dinner> FindByLocation(float lat, float long){
     throw new NotImplementedException();
   }

   public IQueryable<Dinner> FindUpcomingDinners() {
     throw new NotImplementedException();
   }

   public Dinner GetDinner(int id) {
     throw new NotImplementedException();
   }

   public void Add(Dinner dinner) {
     throw new NotImplementedException();
   }

   public void Delete(Dinner dinner) {
     throw new NotImplementedException();
   }

   public void Save() {
     throw new NotImplementedException();
   }
}
```

Il nous suffit alors de modifier le code de la classe FakeDinnerRepository
pour qu'il emploie une collection List&lt;Dinner&gt; qui lui sera passé en tant
qu'argument dans son constructeur :

```
public class FakeDinnerRepository : IDinnerRepository {

   private List<Dinner> dinnerList;

   public FakeDinnerRepository(List<Dinner> dinners) {
     dinnerList = dinners;
   }

   public IQueryable<Dinner> FindAllDinners() {
     return dinnerList.AsQueryable();
   }

   public IQueryable<Dinner> FindUpcomingDinners() {
     return (from dinner in dinnerList
                where dinner.EventDate > DateTime.Now
                select dinner).AsQueryable();
   }

   public IQueryable<Dinner> FindByLocation(float lat, float lon) {
     return (from dinner in dinnerList
                where dinner.Latitude == lat && dinner.Longitude == lon
                select dinner).AsQueryable();
   }

   public Dinner GetDinner(int id) {
     return dinnerList.SingleOrDefault(d => d.DinnerID == id);
   }

   public void Add(Dinner dinner) {
     dinnerList.Add(dinner);
   }

   public void Delete(Dinner dinner) {
     dinnerList.Remove(dinner);
   }

   public void Save() {
     foreach (Dinner dinner in dinnerList) {
        if (!dinner.IsValid)
           throw new ApplicationException("Rule violations");
     }
   }
}
```

Nous disposons désormais d'une implémentation de l'interface
IDinnerRepository qui n'a pas besoin d'une base de données et qui est capable
de fonctionner avec une liste d'objets Dinners en mémoire.

## Utiliser FakeDinnerRepository pour faire les tests unitaires

Nous pouvons maintenant revenir aux tests unitaires de la classe
DinnersController qui avaient échoués tout à l'heure étant donné que la base de
données n'était pas accessible. Nous allons mettre à jour le code de nos
méthodes de test pour qu'elles utilisent une instance de FakeDinnerRepository
et qu'elles la fassent passer au contrôleur DinnersController :

```
[TestClass]
public class DinnersControllerTest {

   List<Dinner> CreateTestDinners() {

     List<Dinner> dinners = new List<Dinner>();

     for (int i = 0; i < 101; i++) {

        Dinner sampleDinner = new Dinner() {
           DinnerID = i,
           Title = "Sample Dinner",
           HostedBy = "SomeUser",
           Address = "Some Address",
           Country = "USA",
           ContactPhone = "425-555-1212",
           Description = "Some description",
           EventDate = DateTime.Now.AddDays(i),
           Latitude = 99,
           Longitude = -99
        };
        dinners.Add(sampleDinner);
     }
     return dinners;
   }

   DinnersController CreateDinnersController() {
     var repository = new FakeDinnerRepository(CreateTestDinners());
     return new DinnersController(repository);
   }

   [TestMethod]
   public void DetailsAction_Should_Return_View_For_Dinner() {

     // Arrange
     var controller = CreateDinnersController();

     // Act
     var result = controller.Details(1);

     // Assert
     Assert.IsInstanceOfType(result, typeof(ViewResult));
   }

   [TestMethod]
   public void DetailsAction_Should_Return_NotFoundView_For_BogusDinner() {

     // Arrange
     var controller = CreateDinnersController();

     // Act
     var result = controller.Details(999) as ViewResult;

     // Assert
     Assert.AreEqual("NotFound", result.ViewName);
   }
}
```

Et maintenant, quand nous relançons nos tests, ils réussissent tous les
deux :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image151.png)

Et encore mieux, ils ne prennent qu'une fraction de secondes pour s'exécuter
et il n'y a pas besoin de prévoir de traitements compliqués à faire pour les
préparer et remettre au propre après leur exécution. A partir de maintenant,
nous avons la possibilité de tester tout le code des méthodes d'action de la
classe DinnersController (depuis la liste jusqu'à la pagination, la fiche
détail, la création, la modification et la suppression) sans avoir le moindre
besoin de nous connecter à une vraie base de données.

## Remarque : Les frameworks pour l'injection de dépendance

Gérer à la main l'injection de dépendance (comme nous l'avons fait
ci-dessus) marche très bien, mais ça risque de devenir de plus en plus
difficile à maintenir au fur et à mesure que le nombre de dépendances et de
composants va augmenter.

Il existe plusieurs frameworks pour gérer l'injection de dépendance en .NET
qui peuvent nous apporter une plus grande souplesse dans la façon de gérer les
dépendances entre les objets. Ces frameworks - généralement connus sous le nom
de "Inversion of Control" (IoC) - offrent des mécanismes qui autorisent un bien
meilleur niveau de configuration pour définir et transmettre les dépendances
entre objets au moment de l'exécution, le plus souvent en employant l'injection
de constructeur. Parmi les frameworks les plus populaires en .NET, on trouve :
AutoFac, NInject, Spring.NET, StructureMap et Windsor.

ASP.NET MVC fourni des API d'extensions pour permettre aux développeurs
d'intervenir lors de la résolution ou de l'instanciation des contrôleurs. Cela
permet entre autre aux frameworks d'injection de dépendance ou d'IoC de
s'intégrer de façon totalement transparente. En utilisant un framework de type
DI ou IoC, nous pourrions donc supprimer le constructeur par défaut de notre
classe DinnersController, ce qui nous libèrerait complètement du lien qui
existe entre celui-ci et la classe DinnerRepository.

Nous n'allons pas utiliser de framework d'injection de dépendance ou IoC
dans le cadre du tutoriel NerdDinner. Mais c'est quelque chose qui mériterait
vraiment d'être envisagé à l'avenir si nous venions à faire évoluer le code et
les fonctionnalités de l'application.

## Créer des tests unitaires pour l'action Edit

Nous allons maintenant créer quelques tests unitaires pour vérifier la
fonctionnalité Edit du contrôleur DinnersController. Pour commencer, nous
allons tester le côté HTTP GET de l'action Edit :

```
//
// GET: /Dinners/Edit/5
[Authorize]
public ActionResult Edit(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   if (!dinner.IsHostedBy(User.Identity.Name))
     return View("InvalidOwner");

   return View(new DinnerFormViewModel(dinner));
}
```

Nous allons réaliser un test destiné à contrôler que l'on obtient bien une
vue basée sur un objet DinnerFormViewModel quand on fait une requête pour
consulter un dîner existant :

```
[TestMethod]
public void EditAction_Should_Return_View_For_ValidDinner() {

   // Arrange
   var controller = CreateDinnersController();

   // Act
   var result = controller.Edit(1) as ViewResult;

   // Assert
   Assert.IsInstanceOfType(result.ViewData.Model,
                               typeof(DinnerFormViewModel));
}
```

Mais quand nous lançons ce test, nous pouvons voir qu'il échoue parce qu'une
exception due à une référence nulle se produit quand la méthode Edit tente
d'accéder à la propriété User.Identity.Name à travers le helper
Dinner.IsHostedBy().

L'objet User disponible au niveau de la classe contrôleur regroupe toutes
les informations relatives à l'utilisateur connecté et il est initialisé par
ASP.NET MVC au moment de la création du contrôleur. Etant donné que notre test
ne s'exécute pas à partir d'un serveur web, l'objet User n'est donc pas
initialisé par ASP.NET MVC, ce qui fait que nous nous retrouvons avec une
référence nulle.

## Simuler la propriété User.Identity.Name

Les frameworks de mocking facilitent les tests car ils permettant de créer
dynamiquement de faux objets nécessaires pour réussir les tests. On peut par
exemple utiliser un framework de mocking au niveau du test de l'action Edit
pour simuler un objet User que la classe DinnersController va pouvoir utiliser
pour retrouver le nom de l'utilisateur. Cela évitera qu'une exception soit
levée à cause d'une référence nulle quand nous ferons notre test.

Il existe de nombreux frameworks de mocking utilisable avec ASP.NET MVC.
Vous trouverez une liste de certains d'entre eux sur le site <http://www.mockframeworks.com/>. Pour les tests dans notre application
NerdDinner, nous allons utiliser un framework open source appelé "Moq" que vous
pouvez télécharger gratuitement depuis l'adresse <http://www.mockframeworks.com/moq>.

Une fois celui-ci téléchargé, nous pouvons référencer la librairie Moq.dll
dans notre projet NerdDinner.Tests :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image152.png)

Puis nous ajoutons une méthode helper surchargée
"CreateDinnersControllerAs(username)" à notre classe de test qui va prendre un
nom d'utilisateur comme argument et qui va "simuler" la propriété
User.Identity.Name dans l'instance DinnersController créée pour nos tests.

```
DinnersController CreateDinnersControllerAs(string userName) {

   var mock = new Mock<ControllerContext>();
   mock.SetupGet(p => p.HttpContext.User.Identity.Name).Returns(userName);
   mock.SetupGet(p => p.HttpContext.Request.IsAuthenticated).Returns(true);

   var controller = CreateDinnersController();
   controller.ControllerContext = mock.Object;

   return controller;
}
```

Dans le code ci-dessus, nous avons utilisé le framework Moq pour créer un
objet de type Mock qui simule l'objet ControllerContext que ASP.NET MVC
transmet aux classes contrôleurs pour exposer des objets tels que User,
Request, Response ou Session. Nous employons la méthode "SetupGet" de cet objet
mock pour indiquer que nous souhaitons que la propriété
HttpContext.User.Identity.Name de l'objet ControllerContext renvoie la variable
chaîne username que nous avons fait passer à notre méthode
"CreateDinnersControllerAs".

Nous pouvons simuler autant de propriétés et de méthodes de l'objet
ControllerContext que nous le souhaitons. Pour illustrer cela, j'ai aussi fait
un appel à SetupGet() pour simuler la propriété Request.IsAuthenticated. Elle
n'est pas réellement nécessaire pour les tests que nous faisons, mais cela me
permet de présenter la façon dont vous pouvez simuler les propriétés de l'objet
Request. Une fois que nous avons simulé tout ce dont nous avions besoin, nous
n'avons qu'à assigner l'instance de l'objet ControllerContext simulé que nous
venons de créer à l'objet DinnersController qui est renvoyé par notre méthode
helper.

Et nous pouvons alors écrire des tests unitaires qui utilisent cette
nouvelle méthode helper pour réaliser différents scénarios de test autour de
notre action Edit :

```
[TestMethod]
public void EditAction_Should_Return_EditView_When_ValidOwner() {

   // Arrange
   var controller = CreateControllerAs("SomeUser");

   // Act
   var result = controller.Edit(1) as ViewResult;

   // Assert
   Assert.IsInstanceOfType(result.ViewData.Model,
                               typeof(DinnerFormViewModel));
}

[TestMethod]
public void EditAction_Should_Return_InvalidOwnerView_When_InvalidOwner() {

   // Arrange
   var controller = CreateControllerAs("NotOwnerUser");

   // Act
   var result = controller.Edit(1) as ViewResult;

   // Assert
   Assert.AreEqual(result.ViewName, "InvalidOwner");
}
```

Et ce coup-ci, nos tests passent avec succès quand nous les lançons :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image153.png)

## Tester le scénario UpdateModel()

Pour l'instant, nous avons donc testé le côté HTTP GET de l'action Edit.
Nous allons maintenant créer quelques tests pour contrôler le côté HTTP POST de
cette action :

```
//
// POST: /Dinners/Edit/5
[AcceptVerbs(HttpVerbs.Post), Authorize]
public ActionResult Edit (int id, FormCollection collection) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   if (!dinner.IsHostedBy(User.Identity.Name))
     return View("InvalidOwner");

   try {
     UpdateModel(dinner);

     dinnerRepository.Save();

     return RedirectToAction("Details", new { id=dinner.DinnerID });
   }
   catch {
     ModelState.AddModelErrors(dinner.GetRuleViolations());

     return View(new DinnerFormViewModel(dinner));
   }
}
```

La nouveauté intéressante pour nous dans le scénario de test de cette partie
POST c'est qu'elle fait appel à la méthode helper UpdateModel() qui est fournie
par la classe Controller. Nous allons devoir utiliser cette méthode pour binder
des valeurs postées en tant que formulaire avec l'instance de notre objet
Dinner.

Les deux tests unitaires ci-dessous montrent comment nous pouvons procéder
pour fournir des données postées en tant que formulaire à la méthode
UpdateModel() pour qu'elle puisse les utiliser. Pour cela, nous devons créer et
initialiser un objet FormCollection puis assigner celui-ci à la propriété
"ValueProvider" du contrôleur.

Le premier test vérifie que lorsque l'enregistrement est réussi, le
navigateur est redirigé vers l'action Details. Le second test s'assure que
quand on poste des données incorrectes, l'action Edit réaffiche la vue Edit et
la complète avec un message d'erreur.

```
public void EditAction_Should_Redirect_When_Update_Successful() {

   // Arrange
   var controller = CreateDinnersControllerAs("SomeUser");

   var formValues = new FormCollection() {
     { "Title", "Another value" },
     { "Description", "Another description" }
   };

   controller.ValueProvider = formValues.ToValueProvider();

   // Act
   var result = controller.Edit(1, formValues) as RedirectToRouteResult;

   // Assert
   Assert.AreEqual("Details", result.RouteValues["Action"]);
}

[TestMethod]
public void EditAction_Should_Redisplay_With_Errors_When_Update_Fails() {

   // Arrange
   var controller = CreateDinnersControllerAs("SomeUser");

   var formValues = new FormCollection() {
     { "EventDate", "Bogus date value!!!"}
   };

   controller.ValueProvider = formValues.ToValueProvider();

   // Act
   var result = controller.Edit(1, formValues) as ViewResult;

   // Assert
   Assert.IsNotNull(result, "Expected redisplay of view");
   Assert.IsTrue(result.ViewData.ModelState.Count > 0, "Expected errors");
}
```

## Conclusion sur les tests unitaires

Nous avons abordé les concepts de base en ce qui concerne les tests
unitaires qui s'appliquent aux classes contrôleurs. Nous pouvons maintenant
utiliser ces techniques pour créer très facilement des centaines de tests très
simples afin de contrôler le fonctionnement de notre application.

Etant donné que ces tests n'ont pas besoin de se connecter à une vraie base
de données, ils sont ultra-rapides et super-faciles à exécuter. Il nous serait
donc possible de réaliser des centaines de tests en quelques secondes et
d'obtenir immédiatement un retour pour savoir si telle ou telle modification a
cassé quelque chose qui fonctionnait bien jusqu'à présent. C'est quelque chose
de très important qui va nous apporter l'assurance nécessaire pour continuer à
améliorer et à enrichir notre application.

Si nous avons abordé les tests unitaires à la fin de ce tutoriel, ce n'est
absolument pas parce que c'est un truc qu'il ne faut faire qu'au tout dernier
moment quand on développe ! Bien au contraire ! En fait, il faudrait écrire vos
tests unitaires le plus tôt possible au cours du développement. En procédant
ainsi, cela vous permet d'avoir un retour immédiat au fur et à mesure que vous
codez votre application. Cela vous aide à avoir une vision d'ensemble des
différents cas d'utilisation de votre application et cela vous aiguille pour la
concevoir de façon structurée et pour éviter les risques
d'interdépendances.

Dans un autre chapitre du livre "Professional ASP.NET MVC 1.0", nous
discuterons du développement piloté par les tests (ou TDD = Test Driven
Development) et nous verrons comment appliquer cette technique avec ASP.NET
MVC. Le développement piloté par les tests est basé sur une approche itérative
dans laquelle vous écrivez d'abord les tests que votre code devra ensuite
réussir. Si vous faites du TDD, vous abordez chaque fonctionnalité de votre
application en créant un test pour contrôler à priori la fonctionnalité que
vous allez développer. Le fait de commencer par écrire un test unitaire vous
permet d'être certain d'avoir bien compris ce que doit faire cette fonction et
comment elle est censée opérer. Ce n'est qu'une fois que vous avez fini
d'écrire le test (et après avoir vérifié que tel quel il échoue lamentablement)
que vous allez pouvoir commencer à coder réellement la fonctionnalité qui est
contrôlée par ce test. Et étant donné que vous avez déjà passé pas mal de temps
à réfléchir sur ce que fait la fonction et comment elle est supposée le faire,
vous avez une bien meilleure compréhension du besoin et de la façon la plus
adaptée pour y répondre. Puis quand vous avez terminé de programmer la
fonctionnalité attendue, vous n'avez plus qu'à relancer le test unitaire pour
savoir immédiatement si votre code fait correctement ce qu'on attend de lui.
Allez, plus que 8 chapitres à lire avant d'en arriver au chapitre 10 consacré
au développement piloté par les tests…

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Conclusion
du tutoriel NerdDinner](/nerddinner/conclusion/)
