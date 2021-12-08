---
date: 2008-11-12 19:17:00
layout: post
redirect_from: "post/2008/11/12/Ajout-de-fichiers-au-depot-Subversion"
tags: svn
title: "Ajout de fichiers au dépôt Subversion"
---

Je continue ma série "je débute petit pas par petit pas avec [Subversion](/tags/svn/)" (destiné principalement à
[Gérald](http://blog.traverseer.com/) qui connait déjà SourceSafe et
qui doit impérativement mettre en place Subversion sur son site internet
d'[échange d'appartement à la
montagne](http://traverseer.com/)).

Sur le projet Tests, si je décide par exemple de sortir la fonction de
récupération des pages html du fichier source principal, je vais sous Visual
Studio :

* ajouter une classe Utils.cs
* copier quelques lignesde code de Start.cs dans Utils.cs
* compiler et vérifier que tout marche

Puis ensuite, je vais mettre à jour le dépôt Subversion à l'aide de
TortoiseSVN :

* clic-droit sur le répertoire D:\Portals\Tests
* option "SVN Check for modification"

![](/public/2008/01-check.png)

Le fichier CheckUrls.csproj a été modifié. Normal : le fichier source
Utils.cs a été ajouté au projet

Le fichier Start.cs a été modifié. Normal : une partie du code de la
procédure GetUrl() a été déplacée dans Utils.cs

Le fichier Utils.cs est marqué comme "non-versionné". Normal : celui-ci
a bien été ajouté au projet par Visual Studio, mais TortoiseSVN ne le sait
pas.

Il faut donc commencer par ajouter "manuellement" ce fichier au contrôle de
source :

* clic-droit sur le fichier Utils.cs depuis TortoiseSVN
* option "Add"

![](/public/2008/02-add.png)

Le fichier Utils.cs est désormais marqué comme "added".

![](/public/2008/03-added.png)

Maintenant, il ne reste plus qu'à valider les modifications effectuées pour
mettre à jour le dépôt Subversion. En effet, pour l'instant ces différentes
modifications n'existent qu'au niveau du répertoire de travail. Donc, toujours
sous TortoiseSVN, il faut :

* sélectionner les 3 fichiers CheckUrls.csproj, Start.cs et Utils.cs
* clic-droit puis choisir l'option "Commit"

![](/public/2008/04-commit.png)

Puis saisir un message décrivant les modifications apportées :

![](/public/2008/05-message.png)

Et enfin valider => on obtient le récapitulatif des opérations
commitées :

![](/public/2008/06-finished.png)

Ce qui signifie :

* j'ai modifié 2 fichiers (CheckUrls.csproj et Start.cs)
* j'ai ajouté 1 fichier (Utils.cs)
* 3 fichiers ont été envoyés du répertoire de travail vers le dépôt
Subversion (CheckUrls.csproj, Start.cs et Utils.cs)
* le tout constituant la révision n° 5 du dépôt file:///D:/SVN/Tests
