---
date: 2008-12-23 11:11:00
layout: post
redirect_from: "post/2008/12/23/Gerer-les-fichiers-d-un-depot-Subversion-%3A-ajouter"
tags: svn
title: "Gérer les fichiers d'un dépôt Subversion : ajouter"
---

Dans ce billet, je reviens sur l'ajout d'un fichier dans un dépôt Subversion
pour bien mettre en évidence les 3 étapes qui sont nécessaires pour y
parvenir.

## 1° étape : ajouter le fichier dans le projet

Dans l'explorateur de solution de Visual Studio, faire un clic-droit sur le
projet puis Ajouter / Ajouter une classe et créer la classe NouvelleClasse.cs
puis sauvegarder la solution.

Pour l'instant, seul Visual Studio est "au courant" de l'ajout de ce
fichier.

## 2° étape : ajouter le fichier dans le répertoire de travail

Il faut donc ajouter spécifiquement le nouveau fichier sous TortoiseSVN pour
qu'il fasse partie des fichiers versionnés.

Comme cela a déjà été vu, cet ajout peut se faire en faisant :

* clic-droit sur le répertoire D:\Portals\Tests et choisir l'option "SVN
Check for modification"
* clic-droit sur le fichier NouvelleClasse.cs et sélectionner "Add" pour
faire passer son statut de "non-versioned" à "added"

Ou alors, on peut faire directement ça depuis l'explorateur de fichiers de
Windows avec un clic-droit sur le nouveau fichier NouvelleClasse.cs et choisir
la commande "Add..."

![](/public/2008/01-fichier-ajouter.png)

Puis sélectionner le ou les fichiers à ajouter :

![](/public/2008/02-fichier-ajouter.png)

Et valider en cliquant sur le bouton [OK] :

![](/public/2008/03-fichier-ajouter.png)

Désormais, le fichier NouvelleClasse.cs a été ajouté au répertoire de
travail et il est donc pris en compte par TortoiseSVN côté client, mais pas
encore intégré au dépôt Subversion côté serveur.

## 3° étape : ajouter le fichier au dépôt Subversion

Si on veut que le fichier NouvelleClasse.cs apparaisse dans le dépôt
Subversion et que les autres utilisateurs du dépôt puisse enfin voir ce nouveau
fichier, il reste à réaliser un commit.

Faire un clic-droit sur le répertoire D:\Portals\Tests et choisir l'option
"SVN Commit..."

![](/public/2008/04-fichier-ajouter.png)

Là, il faut bien faire attention et vérifier que notre nouveau fichier
apparait (encore heureux), mais aussi que le fichier projet est présent dans la
liste puisqu'il a été modifié pour intégrer un nouveau fichier. Quand ce n'est
pas le cas, c'est généralement parce qu'on a oublié de sauvegarder la
solution !

Saisir un message descriptif de la modification apportée et
valider :

![](/public/2008/05-fichier-ajouter.png)

Ca y est, le dépôt Subversion contient un fichier de plus.

Note : dans la vrai vie, il aurait fallu recompiler le projet et
vérifier que tout fonctionnait avant de faire le commit !
