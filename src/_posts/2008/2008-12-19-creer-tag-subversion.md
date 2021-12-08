---
date: 2008-12-19 13:47:00
layout: post
redirect_from: "post/2008/12/19/Creer-un-tag-dans-Subversion"
tags: svn
title: "Créer un tag dans Subversion"
---

Pour archiver et graver dans le marbre une version sous Subversion, on doit
créer un nouveau tag qui permettra plus tard de retrouver les sources du projet
dans l'état où ils étaient lorsqu'on a créé le tag.

Pour cela, on va créer une nouvelle étiquette dans la partie "tags" de notre
dépôt et lui donner le nom de notre version :

* faire un clic-droit sur le répertoire de travail D:\Portals\Tests
* choisir le menu TortoiseSVN puis le sous-menu Branch/tag...

![](/public/2008/01-tag.png)

Il apparait alors la boite de dialogue permettant de créer une branche
(branch) ou une étiquette (tag). Dans le champ "To URL :", remplacer le chemin
"file:///D:/SVN/Tests/trunk" de la façon suivante :

* supprimer "trunk"
* saisir "tags"
* puis "/version 1.0.1"

Ce qui donne : "file:///D:/SVN/Tests/tags/**version
1.0.1**"

![](/public/2008/02-tag.png)

Dans la zone "Log Message", saisir le message "Création d'un tag pour la
**version 1.0.1** de Tests du **19 décembre
2008**".

Pour finir, cliquer sur le bouton [OK] pour valider le nouveau
tag :

![](/public/2008/03-tag.png)

C'était vraiment pas compliqué.
