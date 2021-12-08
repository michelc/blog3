---
date: 2009-09-28 19:33:00
layout: post
redirect_from: "post/2009/09/28/ASP.NET-MVC-et-les-tests-unitaires"
tags: mvc, unit-test
title: "ASP.NET MVC et les tests unitaires"
---

La [cinquième étape](http://msdn.microsoft.com/fr-fr/asp.net/dd876824.aspx "Créer des tests unitaires") du tutoriel pour
développer une application de gestion de contacts avec ASP.NET MVC concerne les
tests unitaires : à quoi cela sert, comment les utiliser et les créer...
puis aborde la réalisation d'un premier jeu de tests unitaires pour contrôler
le bon fonctionnement de la couche de service et un autre pour vérifier le
fonctionnement du contrôleur.

## Rendre NUnit compatible avec Visual Studio Unit Test

Pour commencer, comme je fais mes essais avec Visual Web Developer et pas
Visual Studio 2008, je ne peux pas utiliser Visual Studio Unit Test, le
framework de test par défaut. A sa place, j'utilise NUnit et pour l'instant je
n'ai pas rencontré trop de problème (mais il est vrai que je n'ai pas encore
fait grand chose...).

Ce coup-ci, cela devient un peu plus sérieux et il s'agit dans un premier
temps de saisir une ou deux pages de tests unitaires pour tester le service
ContactManagerService. J'ai carrément triché et fait du copié / collé pour
d'avoir tout à saisir moi-même, mais le plus embêtant, c'est que le code
proposé par le tutoriel ne fonctionne pas avec NUnit :(

Premier truc pas si compliqué à trouver : il faut supprimer la
référence au framework Visual Studio Unit Test

```
using Microsoft.VisualStudio.TestTools.UnitTesting;
```

et la remplacer par une référence à NUnit :

```
using NUnit.Framework;
```

C'était malin, mais pas suffisant... Le couple VWD + NUnit n'aime pas du
tout les attributs [TestClass], [TestInitialize] et [TestMethod] et me le fait
savoir :

* The type or namespace name 'TestClassAttribute' could not be found
* The type or namespace name 'TestClass' could not be found
* The type or namespace name 'TestInitializeAttribute' could not be
found
* The type or namespace name 'TestInitialize' could not be found
* The type or namespace name 'TestMethodAttribute' could not be found
* The type or namespace name 'TestMethod' could not be found

Après quelques recherches, j'ai finalement trouvé la solution chez static
void ([NUnit/MSTest Dual Testing](http://www.martinwilley.com/net/code/nunitmstest.html)). Il suffit d'ajouter quelques "usings" au
début du source pour que NUnit accepte les mêmes attributs que VS Unit
Test :

```
using TestClass = NUnit.Framework.TestFixtureAttribute;
using TestMethod = NUnit.Framework.TestAttribute;
using TestInitialize = NUnit.Framework.SetUpAttribute;
using TestCleanup = NUnit.Framework.TearDownAttribute;
using TestContext = System.Object;
```

Encore deux petites remarques :

* VWD ne proposant pas l'option "Add / New Test / Unit Test", il faut choisir
"Add / New Item / Class"
* La méthode .Expect() de Moq a été remplacée par .Setup()

## Sur quoi faire porter les tests unitaires

Sinon, l'étude de cette cinquième partie m'en a un peu plus appris sur
l'intérêt des tests unitaires, notamment sur quoi les faire porter (la couche
métier) ou plus exactement sur quoi "éviter" de les faire poster (la
présentation et l'accès aux données). L'idée, c'est que les tests unitaires
doivent s'exécuter très très très rapidement, sinon on risque de les laisser
tomber, sauf si on est très joueur...

[![](/public/2009/unit-testing.png)](http://xkcd.com/303/ "Image bidouillée de XKCD")

Il ne faut donc pas faire de tests unitaires sur l'interface utilisateur,
parce que puisque on est en ASP.NET, cela exige le lancement d'un serveur Web
ce qui ralentira la réalisation des tests. C'est une des raisons qui fait que
MVC est "mieux" que les WebForms. Dans MVC, la View qui est la partie interface
utilisateur n'est pas faite pour contenir du code (ce qui fait qu'on a pas à le
tester !). Dans le cas des WebForms, où tout est plus ou moins mélangé, il est
plus difficile d'isoler le code de la présentation.

Il ne faut pas non plus faire de tests sur l'accès aux bases de données. Si
on doit en passer par une vraie base de données, le temps d'exécution des tests
unitaires va devenir beaucoup trop long. Et c'est là que l'empilement des
couches évoqué dans la [partie
précédente]({% post_url 2009-09-23-troisieme-etape-aspnetmvc %} "Vers du code ASP.NET MVC plus facile à maintenir et à modifier") dévoile tout son intérêt. On va "émuler" l'accès à la base de
données grâce à des classes Mock qui simulent l'implémentation de l'interface
IRepository vue précédemment, sans réellement interagir avec la base de
données. Par conséquent, la réalisation de cette interface IRepository ne doit
pas être ressentie comme un niveau de complexité supplémentaire et inutile mais
comme une étape clé pour faciliter la mise en place de tests unitaires.

## Sous le coude

La sixième étape du tutoriel va consister à ajouter une fonctionnalité à la
gestion des contacts. Cela promet d'être très intéressant car on va pour cela
bouleverser l'application en introduisant la notion de groupe de contacts. Et
ce coup-ci on va d'abord créer les tests unitaires à priori, dans le but
d'encadrer la programmation des modifications.

Et à lire pour plus tard, un article d'une quinzaine de pages en français
sur [les tests unitaires en pratique](http://www.dotnetguru.org/articles/dossiers/testunitaires/UnitTest.htm) par Patrick Smacchia. Dans un
premier temps, il présente comment réaliser des tests unitaires et les
bénéfices que l'on peut en retirer. La seconde partie est consacrés aux
problèmes de mise en oeuvre que l'on peut rencontrer (il aborde un peu plus en
détail les problématiques liées à l'accès à la base de données) et comment les
résoudre.

---
Billet suivant dans la série : [Test-Driven Development avec ASP.NET MVC]({% post_url 2009-10-06-test-driven-development-aspnetmvc %})
