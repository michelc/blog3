---
date: 2008-12-24 15:32:00
layout: post
redirect_from: "post/2008/12/24/Gerer-les-fichiers-d-un-depot-Subversion-%3A-renommer"
tags: svn
title: "Gérer les fichiers d'un dépôt Subversion : renommer"
---

Pour ajouter un fichier ou le modifier, ce n'est pas si compliqué que
ça : on fait comme d'habitude, puis on en rajoute un peu pour que ça soit
pris en compte par Subversion.

Par contre, quand on a besoin de renommer un fichier, il ne faut surtout pas
faire comme d'habitude, mais perdre ses automatismes et faire différemment.

## 1° méthode : la mauvaise

Dans l'explorateur de solution de Visual Studio, faire clic-droit sur
NouvelleClasse.cs pour le renommer en Extract.cs. On recompile la solution puis
on la sauvegarde. Si on va dans l'explorateur de fichiers Windows, on a
maintenant :

![](/public/2008/01-fichier-ko-renommer.png)

* le fichier CheckUrls.csproj est marqué d'un point d'exclamation rouge
puisque son contenu a changé (il contenait auparavant un fichier
NouvelleClasse.cs et maintenant un fichier Extract.cs)
* le fichier Extract.cs n'a pas de marque car il n'a pas été intégré au
répertoire de travail

Il faut donc :

* ajouter le fichier Extract.cs au répertoire de travail (clic-droit,
TortoiseSVN, Add..., OK, OK)
* mais aussi supprimer le fichier NouvelleClasse.cs du répertoire de travail
(clic-droit, "SVN Check for modification", clic-droit sur NouvelleClasse.cs,
Delete)

![](/public/2008/02-fichier-ko-renommer.png)

* commiter les modifications apportées au projet D:\Portals\Tests
(clic-droit, SVN Commit...)

![](/public/2008/03-fichier-ko-renommer.png) ![](/public/2008/04-fichier-ko-renommer.png)

Le souci avec cette méthode, c'est que en ce qui concerne Subversion, la vie
du fichier Extract.cs vient juste de commencer et qu'il ne fait absolument pas
le lien avec fichier NouvelleClasse.cs qui vient d'être supprimé. Par
conséquent, il sera incapable de me donner l'historique des modifications
apportés depuis la création du fichier NouvelleClasse.cs

## 2° méthode : la bonne

C'est pourquoi il existe une autre méthode, un peu moins naturelle, mais
beaucoup plus avantageuse.

* Dans l'explorateur de solution de Visual Studio, faire un clic-droit sur le
fichier NouvelleClasse.cs et choisir de l'exclure du projet (le plus dur c'est
de perdre l'habitude de choisir Renommer)
* Dans l'explorateur de fichiers Windows, faire un clic-droit sur le fichier
NouvelleClasse.cs, choisir TortoiseSVN puis l'option Rename...

![](/public/2008/05-fichier-ok-renommer.png)

* Et indiquer Extract.cs comme nouveau nom de fichier puis valider

![](/public/2008/06-fichier-ok-renommer.png)

* Repasser dans l'explorateur de solution de Visual Studio, faire un
clic-droit sur le projet et ajouter un élément existant, en l'occurrence le
fichier Extract.cs

Une fois cela terminé sans se planter, on peut souffler un peu avant de
recompiler le projet et sauver le tout. Si on revient dans l'explorateur de
fichiers de Windows, on peut constater que les 2 fichiers CheckUrls.csproj et
Extract.cs sont repérés.

![](/public/2008/07-fichier-ok-renommer.png)

C'est mieux qu'avec la mauvaise méthode : on n'a même pas à ajouter
Extract.cs et à supprimer NouvelleClasse.cs du répertoire de travail. Comme
quoi, quand on fait les choses bien, on est toujours gagnant.

Et pour finir, il ne reste plus qu'à commiter les modifications d'un
clic-droit sur le répertoire D:\Portals\Tests suivi de "SVN
Commit..." :

![](/public/2008/08-fichier-ok-renommer.png)

Par rapport à la mauvaise méthode, on peut constater que le statut du
fichier est "added (+)" au lieu d'un simple "added".

![](/public/2008/09-fichier-ok-renommer.png)

Et ce coup-ci, si on consulte l'historique du fichier Extract.cs (clic-droit
sur le fichier puis TortoiseSVN et "Show Log", on peut vérifier que du point de
vue de Subversion, il n'y a pas eu disparition d'un fichier et apparition d'un
nouveau fichier mais que c'est toujours le même fichier NouvelleClasse.cs qui a
juste subi un changement de nom.

![](/public/2008/10-fichier-ok-renommer.png)

Note : bien entendu, vous ne devez pas essayer de faire la mauvaise
méthode chez vous.
