---
date: 2009-11-20 15:41:00
layout: page
permalink: nerddinner/presentation-tutoriel/
redirect_from: "pages/NerdDinner/Presentation-tutoriel"
title: "NerdDinner(fr) : Présentation du tutoriel"
---

La meilleure méthode pour apprendre un nouveau framework c'est de s'en
servir pour développer quelque chose avec. Ce premier chapitre suivra notre
cheminement pour construire une application simple mais complète à l'aide de
ASP.NET MVC, et nous servira d'introduction aux principaux concepts de ASP.NET
MVC.

L'application que nous allons réaliser s'appellera "NerdDinner". Il s'agit
d'un site web destiné à faciliter la recherche et l'organisation de dîners :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image001.png)

NerdDinner permet aux utilisateurs enregistrés de créer, de modifier et de
supprimer des dîners. Il applique un ensemble cohérent de règles de validation
métier dans toute l'application :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image002.png)

Les visiteurs du site peuvent effectuer une recherche pour trouver les
prochains dîners qui auront lieu près de chez eux :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image003.png)

En cliquant sur un dîner ils arrivent sur une page où ils ont plus
d'information sur celui-ci :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image004.png)

S'ils souhaitent participer à ce dîner, ils peuvent alors se connecter ou
s'inscrire sur le site :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image005.png)

Il leur est alors très simple de répondre pour confirmer qu'ils assisteront
à un dîner :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image006.png)

![](http://nerddinnerbook.s3.amazonaws.com/Images/image007.png)

Nous commencerons à construire l'application NerdDinner en utilisant la
commande **File -&gt; New Project** sous Visual Studio pour créer
un nouveau projet ASP.NET MVC. Ensuite, nous lui ajouterons progressivement
différents modules et fonctionnalités.

Petit à petit, cela nous permettra d'aborder la création d'une base de
données, la construction d'un modèle avec des règles de validation métier, la
mise en œuvre d'une interface utilisateur de type liste / détail, la
réalisation de formulaires pour mettre à jour les données, le développement
d'un système de pagination efficace, la réutilisation de l'interface
utilisateur par le biais des master pages, la sécurisation de l'application à
l'aide de l'authentification et des autorisations, l'utilisation d'Ajax pour
offrir une mise à jour dynamique et gérer des plan d'accès interactifs, et la
mise en place de tests unitaires automatisés.

Vous pouvez construire votre propre version de NerdDinner en partant de zéro
et en réalisant vous-même chacune des étapes présentées dans ce chapitre. Si
vous le préférez, vous pouvez télécharger une copie terminée du code source à
l'adresse : <http://tinyurl.com/aspnetmvc>.

Vous pouvez utiliser Visual Studio 2008 ou sa version gratuite Visual Web
Developer Express 2008 pour construire l'application. Pour gérer la base de
données, vous pouvez employer SQL Server ou sa version gratuite SQL Server
Express.

Vous pouvez installer ASP.NET MVC, Visual Web Developer 2008, SQL Server
Express en utilisant le Microsoft Web Platform Installer qui est disponible à
l'adresse : <http://www.microsoft.com/web/downloads>.

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Créer
le projet ASP.NET MVC](/nerddinner/file-new-project/)
