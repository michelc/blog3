---
date: 2009-10-09 11:55:00
layout: post
redirect_from: "post/2009/10/09/Test-Driven-Development-avec-ASP.NET-MVC-(suite)"
tags: mvc, unit-test
title: "Test-Driven Development avec ASP.NET MVC (suite)"
---

Je continue ma formation ASP.NET MVC avec la suite de la [6°
partie du tutoriel pour gérer des contacts]({% post_url 2009-10-06-test-driven-development-aspnetmvc %} "Test-Driven Development avec ASP.NET MVC (le début)") qui est consacrée à la
Programmation Pilotée par les Tests (ou Test-Driven Development en
anglais).

## Point de départ

Jusqu'ici, j'ai donc abordé les deux premières étapes sur les trois que
compte la méthode TDD :

* <s>Ecrire un test unitaire qui échoue (Rouge)</s>
* <s>Ecrire un code qui passe le test unitaire avec succès
(Vert)</s>
* Revoir l'architecture de votre code (Refactoring)

Pour résumer l'épisode précédent, il fallait modifier l'application des
gestion de contacts pour ajouter une notion de groupe de contacts. Comme point
de départ, on avait 3 scénarios utilisateur (lister les groupes, créer un
groupe et valider un groupe) et on a appliqué les 2 premières étape du
TDD :

* Etape 1 : on écrit des tests unitaires pour vérifier les
fonctionnalités attendues (et ces tests échouent car non compilables)
* Etape 2 : on écrit le minimum de code pour que les tests unitaires
réussissent

## Refactoring

J'en arrive donc à l'étape 3 : revoir l'architecture du code
(refactoriser). Aux deux premières étapes du TDD, l'objectif est de se
concentrer sur les tests unitaires destinés à vérifier que les fonctionnalités
sont biens implémentées, sans se prendre la tête sur la "bonne" façon de faire.
Ce n'est qu'à partir de cette troisième étape qu'il faut chercher à produire du
"bon" code. Et on peut toucher à notre premier jet de code l'esprit libre,
puisqu'on s'est blindé grâce à nos tests unitaires qui vont nous empêcher de
casser quoi que ce soit d'important.

Dans le cas présent, le refactoring va consister à réviser le code du
contrôleur GroupController qui mélange un peu tout pour le rendre plus conforme
au Single Responsibility Principle comme on l'avait déjà fait dans la [4° partie du tutoriel]({% post_url 2009-09-23-troisieme-etape-aspnetmvc %} "Refactoring avec ASP.NET MVC")
pour le contrôleur ContactController.

Pour cela, on va modifier le contrôleur pour qu'il utilise la couche de
service ContactManagerService que l'on avait mis en place pour le contrôleur
ContactController. C'est assez simple et il suffit de taper le code source
fourni dans le tutoriel. Il y manque quelques `using
ContactManager.Models.Validation;` et il faut bien penser à modifier
aussi les fichiers interfaces, mais c'est **OK pour la 3° étape du
TDD**.

Ca avance, mais je me pose quand même des questions.

* Est-ce que ça prendrait vraiment beaucoup plus de temps si on avait fait
"bien" dès le premier coup ?
* Et même, est-ce qu'une fois qu'on a l'habitude d'utiliser les couches
service et repository, est-ce que ce n'est pas plus long de se souvenir comment
écrire du code qui ne s'en sert pas ?
* Et surtout, il n'y a pas de 4° étape dans le TDD et pourtant je n'ai encore
rien qui gère des groupes de contacts pour de "vrai" !

## Coup d'oeil en arrière

Sinon, cette partie du tutoriel m'a fait prendre conscience d'un truc auquel
je n'avais pas fait attention lors de la partie sur le refactoring. En fait, la
classe repository et la classe service servent pour toute l'application et pas
seulement dans le cas de la table Contact. C'est d'ailleurs pour ça qu'elles
s'appellent ContactManagerRepository et ContactManagerService et pas seulement
ContactRepository et ContactService.

Ca non plus, je sais pas trop si ça me plait bien. J'ai un peu peur qu'à la
fin on risque de se retrouver avec un source énorme si notre application doit
gérer un très grand nombre de tables. Sans compter que ça devient génant dans
le cas des FakeRepository où on devra donc tout implémenter à coup de
`throw new NotImplementedException()` (et revenir dessus en
permanence dès qu'on ajoutera des signatures à l'interface).

Mais je suppose qu'il n'est pas totalement incongru d'avoir des "sous"
repository pour différents tables (ou peut-être des classes partielles ?). A
voir...

## Sous le coude

Je vais continuer avec la suite de cette 6° partie qui va enfin s'attaquer à
la réalisation des fonctionnalités pour de "vrai". Mais si j'ai un peu de
temps, j'aimerai bien essayer d'approfondir tout ça pour voir comment
implémenter les autres scénarios utilisateurs selon la méthode TDD :

* L'utilisateur peut supprimer un groupe de contacts existant
* L'utilisateur peut sélectionner un groupe lorsqu'il crée un nouveau
contact
* L'utilisateur peut sélectionner un groupe lorsqu'il édite un contact
existant
* La liste des groupes de contacts est affichée dans la vue Index
* Lorsqu'un utilisateur clique sur un groupe, la liste de contacts associée
est affichée

(Bien que pour l'instant je ne vois pas trop quel test unitaire faire pour
vérifier la suppression d'un groupe de contacts.)

Ou en attendant tout ça, deux liens assez intéressant sur les TDD :

* Une [initiation au Développement piloté par les Tests](http://www.rubyfrance.org/documentations/tdd/) sur le site de Ruby
France
* Un [compte-rendu d'une formation au TDD](http://blog.olivier-duval.info/?post/2008/09/29/TDD-integration-continue) par Olivier Duval

---
Billet suivant dans la série : [Test-Driven Development avec ASP.NET MVC (suite)]({% post_url 2009-10-20-test-driven-development-aspnetmvc-suite %})
