---
date: 2009-01-06 12:54:00
layout: post
redirect_from: "post/2009/01/06/Gerer-les-fichiers-d-un-depot-Subversion-%3A-supprimer"
tags: svn
title: "Gérer les fichiers d'un dépôt Subversion : supprimer"
---

Ce qui est important pour supprimer un fichier, c'est de ne pas faire ça
directement dans Visual Studio mais de passer par TortoiseSVN pour que la
suppression du fichier soit correctement prise en compte par Subversion.

## 1° étape : supprimer le fichier du projet

Dans l'explorateur de solution de Visual Studio, faire un clic-droit sur le
fichier Extract.cs puis choisir la commande Exclure du projet (et surtout pas
Supprimer).

Suite à cela, recompiler le projet puis le sauvegarder => Visual Studio
aura bien compris que le fichier Extract.cs ne fait plus partie du projet, même
s'il existe encore physiquement sur le disque dur.

## 2° étape : supprimer le fichier du répertoire de travail

Il faut maintenant expliquer à TortoiseSVN que le fichier Extract.cs n'a
plus de raison d'exister et qu'il doit donc disparaitre des fichiers
versionnés.

Pour cela, il faut aller dans l'explorateur de fichiers de Windows, dans le
répertoire D:\Portals\Tests pour faire un clic-droit sur le fichier Extract.cs
pour choisir la commande TortoiseSVN puis la sous-commande Delete :

![](/public/2009/01-fichier-supprimer.png)

Le fichier Extract.cs est alors immédiatement supprimé du répertoire de
travail D:\Portals\Tests et il n'est plus géré par TortoiseSVN côté client. Par
contre il existe toujours dans le dépôt Subversion côté serveur.

## 3° étape : supprimer le fichier du dépôt Subversion

Si on veut que le fichier Extract.cs disparaisse du dépôt Subversion
(notamment pour que les autres utilisateurs du dépôt sachent qu'il a été
supprimé), il reste à effectuer un commit.

Faire un clic-droit sur le répertoire D:\Portals\Tests et choisir l'option
"SVN Commit..."

![](/public/2009/02-fichier-supprimer.png)

Comme dans le cas de l'ajout d'un fichier dans le dépôt Subversion, il est
important de bien vérifier que le fichier supprimé est mentionné mais aussi que
le fichier projet apparait dans la liste puisqu'il a été modifié suite à
l'exclusion du fichier Extract.cs.

Saisir un message expliquant la modification apportée au projet et
valider :

![](/public/2009/03-fichier-supprimer.png)

Ca y est, le fichier Extract.cs a été définitivement supprimé du dépôt
Subversion commen en témoigne l'action "Deleting
D:\Portals\Tests\Extracts.cs".
