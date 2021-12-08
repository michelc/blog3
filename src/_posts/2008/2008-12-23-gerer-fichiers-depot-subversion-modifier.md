---
date: 2008-12-23 12:16:00
layout: post
redirect_from: "post/2008/12/23/Gerer-les-fichiers-d-un-depot-Subversion-%3A-modifier"
tags: svn
title: "Gérer les fichiers d'un dépôt Subversion : modifier"
---

Juste pour être exhaustif dans ma série concernant la gestion des fichiers
dans Subversion, voici comment procéder quand on modifie le code d'un des
fichiers sources du projet. Par rapport à l'ajout de fichiers, il n'y a que 2
étapes.

## 1° étape : modifier le fichier localement

Supposons qu'il y ait un bug dans la classe NouvelleClasse.cs. Après en être
venu à bout dans Visual Studio et avoir vérifié que le problème est bien résolu
et que cela ne provoque pas d'autre erreur, je sauvegarde ma solution.

* les sources du projet sont à jour
* le répertoire de travail est à jour : le fichier NouvelleClasse.cs est
marqué de rouge pour indiquer que son contenu a été modifié

![](/public/2008/01-fichier-modifier.png)

## 2° étape : envoyer le fichier modifié dans le dépôt Subversion

Faire un clic-droit sur le répertoire D:\Portals\Tests et choisir l'option
"SVN Commit..."

![](/public/2008/02-fichier-modifier.png)

Puis valider pour que le fichier soit mis à jour dans le dépôt Subversion et
que les autres développeurs puissent profiter de la correction apportée.
