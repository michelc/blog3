---
date: 2008-11-06 18:17:00
layout: post
redirect_from: "post/2008/11/06/Utiliser-Subversion-en-local"
tags: svn
title: "Utiliser Subversion en local"
---

Pour compléter ma catégorie [Subversion](/tags/svn/), je vais décrire ce que je
fais habituellement quand je veux passer un de mes projets personnel en "local"
sous Subversion (au moins la prochaine fois je n'aurai pas à réfléchir pour
savoir comment faire). Dans ce cas, j'utilise uniquement TortoiseSVN, sans
avoir besoin d'installer autre chose sur le poste de travail.

Si on s'en tient à la documentation, c'est quelque chose de très
simple : il suffit de créer un dépôt Subversion, d'y importer notre
projet, de supprimer le projet d'origine puis de le ré-extraire à partir du
dépôt pour disposer d'une copie de travail versionnée.

Mais généralement, je ne vais pas forcément versionner tous les fichiers
présents dans les répertoires de mon projet et par conséquent le fait
d'enchainer une suppression et une extraction me fera perdre des
fichiers :

* Ceux qui seront re-créés par compilation : pas de problème
* Les autres : le web.config, quelques fichiers de paramètres,
éventuellement la base de données Access…

Sans compter que dans le cas d'un projet web, la suppression du répertoire
projet n'est pas toujours possible puisqu'il correspond à un répertoire virtuel
pour IIS et que même quand on y arrive, cela oblige à redonner les droits qui
vont bien sur chaque répertoire.

Par conséquent, la "bonne" solution, c'est de ne pas importer le dépôt mais
de l'extraire immédiatement après sa création sur le répertoire du projet
d'origine puis d'ajouter les fichiers du projet au dépôt.

## Etape 1 : Créer un dépôt Subversion

Pour passer un projet sous Subversion, il faut commencer par créer un
"repository" (un dépôt ou référentiel en bon français) pour y enregistrer les
données nécessaires au contrôle de version.

Pour cela, il faut créer un dossier sur le disque dur et d'un coup de
baguette magique transformer ce bête répertoire en "repository" Subversion.

On commence par se placer dans le répertoire où on souhaite enregistrer le
dépôt Subversion : pour mes projets en local, c'est toujours D:\SVN

Il faut y créer un nouveau sous-répertoire : "Tests" par exemple

Puis faire clic-droit sur le dossier nouvellement créé puis choisir
"TortoiseSVN" puis "Create repository here..."

![](/public/2008/01-create.png)

Choisir le type "Native filesystems (FSFS)" et cliquer sur OK

![](/public/2008/02-filesystem.png)

On obtient alors le message "The repository was successfully created".

![](/public/2008/03-created.png)

Si on ouvre le dossier "Tests", on constate qu'il contient maintenant un
certain nombre de fichiers et de dossiers.

![](/public/2008/04-inside.png)

Le dépôt Subversion que je viens de créer est encore totalement vide. Il est
stocké dans le répertoire D:\SVN\Tests et son url est file:///D:/SVN/Tests.

## Etape 2 : Organiser le dépôt Subversion

Avant de remplir mon dépôt Subversion, il faut d'abord organiser la façon
dont seront enregistrées les données dans le dépôt. Comme je ne cherche pas
midi à quatorze heure, je vais simplement suivre la structure la plus standard
pour un dépôt, à savoir trunk, branches et tags.

Pour cela, je fais à nouveau clic-droit sur le dossier correspondant au
dépôt que je viens de créer (D:\SVN\Tests dans mon cas) pour choisir
"TortoiseSVN" puis "Repo-browser".

![](/public/2008/05-browse.png)

Cela ouvre directement une fenêtre pour naviguer dans le dépôt, mais
celui-ci ne contient encore rien d'autre qu'un dossier D:/SVN/Tests. Faire
clic-droit sur ce dossier et choisir la commande "Create folder…"

![](/public/2008/06-folder.png)

Puis indiquer "branches" comme nouveau nom de dossier

![](/public/2008/07-branches.png)

Et accepter "Create folder remotely" comme message de log

![](/public/2008/08-remotely.png)

Répéter l'opération en créant les dossiers tags et trunk.

![](/public/2008/09-org.png)

Mon dépôt Subversion est toujours quasiment vide, mais il est désormais prêt
à l'emploi.

## Etape 3 : Obtenir une copie de travail du dépôt Subversion

Dans cette étape, je vais faire en sorte de "relier" le répertoire de mon
projet au dépôt Subversion, de façon à ce que Subversion le considère comme un
répertoire de travail de mon dépôt.

Pour cela, je quitte le répertoire D:\SVN où est stocké le dépôt pour aller
dans le répertoire où est enregistrée la solution que je veux passer sous
Subversion. En fait, je vais plutôt dans le répertoire contenant le répertoire
où est placé le projet.

Faire clic-droit sur le répertoire de la solution, D:\Portals\Tests dans le
cas présent et choisir la commande "SVN Checkout...".

![](/public/2008/10-co-menu.png)

Il apparaît alors la boite de dialogue suivante :

![](/public/2008/11-co-dlg.png)

Bien vérifier que l'url du dépôt (URL of repository) et le répertoire de
travail (Checkout directory) sont corrects puis valider. Etant donné que le
répertoire choisi contient déjà les sources de mon projet, cela provoque
l'apparition du message d'erreur suivant :

![](/public/2008/12-co-alert.png)

<s>Croiser les doigts</s> Confirmer en cliquant sur le bouton "Yes". Et
là on obtient un message indiquant que l'extraction est terminée.

![](/public/2008/13-co-end.png)

Le répertoire D:\Portals\Tests est désormais considéré par Subversion comme
étant le répertoire de travail lié au dépôt Subversion. Par contre, les
fichiers sources qui y sont enregistrés ne sont toujours pas intégrés au dépôt
et par conséquent, le dépôt Subversion est toujours aussi vide qu'à la fin de
l'étape précédente.

## Etape 4 : Ajouter mes fichiers sources au dépôt Subversion

Cette dernière étape va consister à ajouter les fichiers de mon projet dans
le dépôt Subversion.

Pour cela, il faut revenir dans le répertoire D:\Portals et faire un clic
droit sur le sous-répertoire Tests et choisir "SVN Check for modification"

![](/public/2008/14-check.png)

Il apparait un écran listant tous les fichiers enregistrés dans le
répertoire D:\Portals\Tests (à l'exception de ceux ignorés par
TortoiseSVN).

Sélectionner tous ces fichiers en faisant Ctrl+A puis clic-droit et choisir
la commande "Add".

![](/public/2008/15-working.png)

Après quelques secondes, la liste des fichiers est mise à jour et le contenu
de la colonne "Text status" est passé de "non-versionned" à "added". Cela
signifie que les fichiers sources de la solution ont bien été ajoutés au
répertoire de travail.

![](/public/2008/16-added.png)

Cependant, si je consulte le contenu de mon dépôt, il est toujours vide.
Mais c'est normal. En effet, le répertoire D:\Portals\Tests n'est qu'une copie
de travail du dépôt Subversion. Tout ce qui est fait dans ce répertoire n'est
pas automatiquement "répercuté" dans le dépôt, mais seulement lorsque je le
demanderai.

Il me reste donc à mettre à jour le dépôt à partir du répertoire de travail.
Si besoin, refaire clic-droit, "SVN Check for modification", re-sélectionner
tous les fichiers puis clic-droit "Commit".

![](/public/2008/17-commit.png)

Après encore quelques secondes, il apparaît un nouvel écran pour saisir un
message et au-dessous la liste de tous les fichiers cochés

Taper "Importation du projet d'origine" puis valider.

![](/public/2008/18-message.png)

Quelques dernières secondes d'attentes agrémentées par un défilement où l'on
a le temps de reconnaître les différents fichiers de la solution

![](/public/2008/19-commited.png)

A ce point, j'ai créé un dépôt Subversion stocké dans D:\SVN\Tests et
celui-ci contient les fichiers sources versionnés de mon projet. Par ailleurs,
le répertoire D:\Portals\Tests n'est plus un simple répertoire de mon disque
dur, mais il est devenu une copie de travail de mon dépôt Subversion :

* de cette façon il y a de jolies icones qui indiquent l'état de chaque
fichier source,
* je peux valider mes modifications (SVN Commit…) ou annuler mes bêtises
(TortoiseSVN puis Revert…).

En gros, je fais enfin du contrôle des sources pour mon projet Tests.

## Donc, pour résumer :

* Créer un répertoire et le transformer en dépôt Subversion
* Organiser le contenu du dépôt Subversion
* Extraire une copie de travail dans le répertoire du projet
* Y ajouter les sources du projet et commiter
