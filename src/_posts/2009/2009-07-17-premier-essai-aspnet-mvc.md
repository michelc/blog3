---
date: 2009-07-17 11:16:00
layout: post
redirect_from: "post/2009/07/17/Premier-essai-ASPNET-MVC"
tags: mvc
title: "Premier pas avec ASP.NET MVC et NerdDinner"
---

Ce coup-ci je me lance enfin et je vais tenter de suivre pas à pas la
réalisation de l'application [NerdDinner](http://www.nerddinner.com/) telle qu'elle est expliquée dans le [tutoriel ASP.NET MVC de ScottGu](http://weblogs.asp.net/scottgu/archive/2009/03/10/free-asp-net-mvc-ebook-tutorial.aspx).

Après avoir vérifié que le .Net Framework 3.5 est déjà présent sur mon PC,
fait un rapide Windows Update puis redémarré mon ordinateur, j'ai commencé par
le début et lancé l'installation de ASP.NET MVC, Visual Web Developer 2008
Express et SQL Server 2008 Express en utilisant le [Microsoft Web Platform
Installer](http://www.microsoft.com/web/downloads). C'est un peu long mais ça se fait vraiment tout seul et le seul
truc bizarre c'est qu'il faut souvent redémarrer la machine...

Enfin je peux lancer Microsoft Visual Web Developer 2008 Express Edition (ou
VWD pour parler plus vite) et faire **File - New Project**,
sélectionner Visual C# / Web et le template ASP.NET MVC Web Application, donner
le nom NerdDinner et cliquer sur OK. Ca marche ! Mais ça ne me propose pas
la création du projet de test puisque je n'ai que la version Express et que je
n'ai pas installé d'outil de test unitaire.

C'est pas grave, je Start Debuging, je répond Yes un peu partout et
j'atterris sur ma première Home Page ASP.NET MVC. Je clique un peu partout
comme indiqué dans le tutoriel et c'est bien tout pareil :

* la Home Page
* la page About Us
* la page Log On
* la page Register

Déjà une bonne chose de faite. Avant d'aller plus loin, je quitte et
j'efface mon projet NerdDinner pour tout recommencer une fois que j'aurais
installé un framework de tests unitaires.

Après quelques recherches sur internet, il semblerait qu'il existe un
[template NUnit / MVC pour VWD](http://blogs.msdn.com/webdevtools/archive/2009/04/28/updated-nunit-templates-for-asp-net-mvc-1-0-rtm.aspx). Ca date de la version RTM de
ASP.NET MVC mais ça vaut quand même le coup d'essayer...

* Télécharger et installer NUnit à partir de <http://www.nunit.org/>
* Télécharger [NUnit Test Templates](http://blogs.msdn.com/webdevtools/archive/2009/04/28/updated-nunit-templates-for-asp-net-mvc-1-0-rtm.aspx)
* Décompacter NUnitRTM.zip
* Lancer installNUnit.cmd

Dans mon cas, tout s'est bien passé. Je peux donc recommencer la partie
"File - New Project" du tutoriel NerdDinner. Et là, après le clic sur OK pour
créer mon projet NerdDinner, j'ai bien une boite de dialogue pour m'inviter à
créer le projet de test unitaire correspondant :

![](/public/2009/nunit-create.png)

Après avoir cliqué sur le bouton OK, je lance ma seconde application ASP.NET
MVC et là c'est KO : *There where build errors* (et plus précisément
*The type or namespace name 'NUnit' could not be found*). En fait, cela
vient du fait qu'il y a un petit triangle jaune devant nunit.framework dans le
dossier References du projet NerdDinner.Tests. Ca se corrige très facilement en
supprimant la référence puis en la re-ajoutant.

Quand on relance l'exécution, il y a encore un souci parce que c'est le
projet NerdDinner.Tests qui est actif (son nom est en gras) et qu'il s'agit
d'un projet de type Class Library qui ne peut pas être démarré directement par
VWD. Il faut donc cliquer sur le projet NerdDinner et le définir en tant que
projet de démarrage et tout roule !

Par contre, pas moyen de lancer les tests unitaires depuis VWD. Il faut
passer par NUnit lui-même :

* File - Open Project...
* Aller dans le répertoire bin/Debug ou bin/Release du projet
NerdDinner.Tests
* Y ouvrir la dll NerdDinner.Tests.dll

On peut alors lancer les tests unitaires automatiquement générés avec notre
projet de base an cliquant sur le gros bouton "Run". Et comme je n'ai encore
touché à rien, tout les tests sont réussis :)

[![NUnit-Run.png](/public/2009/nunit-run.png)](/public/2009/nunit-run.png "NUnit-Run.png, juil 2009")

---
Billet suivant dans la série : [Seconds pas avec ASP.NET MVC et NerdDinner]({% post_url 2009-07-30-seconds-pas-aspnet-mvc-nerddinner %})
