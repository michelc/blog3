---
date: 2010-07-29 10:25:00
layout: post
redirect_from: "post/2010/07/29/guide-pour-demarrer-avec-git"
tags: git, ruby, sinatra
title: "Guide pour démarrer avec Git"
---

{:.encart}
Ceci est la traduction du tutoriel "[Git Beginners Guide](http://ididitmyway.herokuapp.com/past/2010/1/14/git_beginners_guide/)" de Darren Jones.

Dans ce nouveau tutoriel, Darren présente les bases de Git et aborde les
éléments suivants :

* Qu'est-ce que Git ?
* Installer et configurer Git
* Ajouter et Commiter avec Git
* Les Branches
* Les Tags
* Les repositories distants
* Quelques ressources sur Git

## Qu'est-ce que Git ?

Git est un système de contrôle de version qui vous de garder une trace de
toutes les modifications que l'on fait quand on travaille sur un projet. Git
permet de faire un "roll back" pour revenir sur une version précédente et aussi
de créer des "branches" dans votre code pour tester de nouvelles fonctionalités
sans toucher à la version en cours et stable de votre code. Un système de
contrôle source est essentiel quand vous travaillez en équipe, mais dans le
cadre de Sinatra, c'est aussi un outil pour déployer des applications sur le
cloud chez [Heroku](http://heroku.com/) (cela fera
l'objet d'un [autre billet](http://ididitmyway.herokuapp.com/past/2010/1/16/deploying_sinatra_apps_on_heroku/)).

Git utilise la ligne de commande pour son interface utilisateur, mais pour
ceux qui préfèrent, il existe aussi de nombreux outils visuels.

## Installer et configurer Git

Pour commencer, vous avez besoin d'installer Git.

La VO de ce tutoriel [Git Beginners Guide](http://ididitmyway.herokuapp.com/past/2010/1/14/git_beginners_guide/) explique comment installer Git pour
Linux, Mac et Windows. Par ailleurs, GitHub propose un tutoriel très complet
pour [installer Git sur Windows](http://help.github.com/win-git-installation/) et un autre qui explique comment [générer les clés SSH
pour Git](http://help.github.com/key-setup-redirect) et ajouter votre clé publique à votre compte GitHub.

Une fois l'installation terminée, il faut lancer un "Git Bash" (en faisant
un clic-droit sur un répertoire et en choisissant la commande "Git Bash here").
Cela a pour effet d'ouvrir un genre d'invite de commandes pour Git où vous
pouvez définir quelques paramètres généraux en utilisant les deux commandes
suivantes :

```
$ git config --global user.name "Votre Nom"
$ git config --global user.email "votremail@example.com"
```

Note : pour quitter Git Bash, on peut taper la commande
`exit`.

![](/public/2010/git-1.png)

Maintenant, il faut se placer dans le répertoire de notre projet. Pour nos
tests, nous allons utiliser le projet Reverse réalisé lors du tutoriel
précédent :

```
$ cd /c/Ruby/projets/reverse
```

Puis nous initialisons ce répertoire pour que Git assure le suivi des
modifications que nous apporterons au contenu de ce répertoire.

```
$ git init
```

Nous obtenons en retour le message "Initialized empty Git repository in
c:/Ruby/_projets/reverse/.git/". Si on consulte le répertoire
C:\Ruby\projets\reverse dans l'explorateur de Windows, on peut constater qu'il
contient désormais un sous-répertoire ".git" qui sert va servir à Git pour
stocker le repository.

## Ajouter et Commiter avec Git

A présent, nous allons ajouter tous les fichiers et les sous-répertoire de
notre projet Reverse dans le repository que nous venons de créer. On effectue
cela en tapant la commande suivante :

```
$ git add .
```

Ceci va ajouter tous les fichiers à l'index, puisque le "." représente tous
les fichiers. L'index est un peu comme une zone de transit dans laquelle les
fichiers attendent d'être commités dans le repository. Ce que nous allons faire
avec cette commande :

```
$ git commit -m "Version initiale du projet Reverse"
```

Cela a pour effet de commiter tous les fichiers de l'index dans le
repository. Le texte entre guillemets après le "-m" est un message que vous
devez définir à chaque commit pour expliquer ce que vous avez fait.

Et maintenant on va apporter quelques modifications à notre projet, comme
par exemple de changer légèrement la fin du fichier "layout.erb" pour y ajouter
un lien :

```
<!DOCTYPE html>
<html lang="en">
<head>
<title>Reverse!</title>
<meta charset=utf-8 />
</head>
<body>
<h1>Reverse</h1>
<h2><%= @title %></h2>

<%= yield %>

<p>The first Sinatra project for <a href="http://ididitmyway.heroku.com/">I Did It My Way</a></p>
</body>
</html>
```

Puis on saisi la commande suivante dans Git Bash pour mettre à jour
l'index :

```
$ git add views/layout.erb
```

Comme vous pouvez le voir, on peut décider de spécifier quel fichier on veut
ajouter à l'index plutôt que d'utiliser "." pour sélectionner tous les
fichiers. Et sinon, n'oubliez pas de commiter votre modification :

```
$ git commit -m "Ajout d'un lien en pied de page"
```

Le fait d'avoir à ajouter puis à commiter peut sembler un peu fastidieux.
Mais cela présente l'avantage de permettre d'ajouter plusieurs modifications
avant de réellement faire le commit. Toutefois, on peut ramener ça à une seule
étape en utilisant l'option "-a" :

```
$ git commit -a -m "un message d'explication"
```

Cela aura pour effet d'ajouter et de commiter les modifications en une seule
fois. En fait, tous les fichiers modifiés ou supprimés sont commités. Les
nouveaux fichiers ne sont pas concernés.

Si vous souhaitez supprimer des fichiers, vous ne pouvez pas vous contenter
de les supprimer directement depuis Windows. Vous devez aussi les supprimer du
repository Git en utilisant la commande "rm". Par exemple, nous n'avons plus
besoin du fichier "frank.erb" qui doit encore se trouver dans le
sous-répertoire "views". Nous pouvons donc le supprimer du repository avec la
commande suivante :

```
$ git rm views/frank.erb
```

Le fichier "frank.erb" est alors supprimé physiquement du sous-répertoire
"views". Il reste encore à commiter pour qu'il soit supprimé définitivement du
repository Git :

```
$ git commit -a -m "Suppression fichier inutile"
```

## Les Branches

En ce qui me concerne, c'est LE truc de Git. Quand vous créez une branche,
c'est en gros comme si vous faisiez une copie de votre code en cours. Vous
pouvez alors faire plein de modifications ou d'essais sans toucher au code
d'origine. Si on veut conserver ces changements, on peut alors les fusionner
avec le code d'origine ou si ces changements ne conviennent pas, on peut tout
simplement revenir au code de départ et supprimer la branche. Il est possible
de créer autant de branches que l'on souhaite et les fusionner entre elles ou
les conserver en tant que branches séparées.

Au départ, vous démarrez avec la branche par défaut qui s'appelle "master".
Pour savoir sur quelle branche vous vous trouvez actuellement, il suffit de
taper :

```
$ git branch
```

Et vous devriez alors avoir le résultat suivant :

```
* master
```

L'astérisque devant "master" indique qu'il s'agit de la branche en
cours.

Pour créer une nouvelle branche qu'on appellera "development", il faut
taper :

```
$ git branch development
```

Puis pour basculer sur cette branche vous devez saisir :

```
$ git checkout development
```

Après un message `Switched to branch 'development'`, vous pouvez
vérifier que cela a fonctionné en tapant :

```
$ git branch
```

Et cette fois, vous devez obtenir :

```
* development
  master
```

L'astérisque devant "development" vous montre que vous travaillez maintenant
sur la branche "development". Si vous faites une modification quelconque, cela
affectera uniquement la branche "development" et absolument pas la branche
"master".

Essayez par exemple de changer quelques lignes (en supprimant par exemple le
lien dans "layout.erb") puis commitez ces modifications :

```
$ git commit -a -m "Suppression du lien en pied de page"
```

Revenez alors sur la branche principale :

```
$ git checkout master
```

Vous pouvez réouvrir le fichier "layout.erb" pour constater que votre
modification n'est pas là ! Et que le lien que vous venez de supprimer est
toujours là ! On retourne dare-dare sur la branche de
développement :

```
$ git checkout development
```

On ré-ouvre derechef la fichier "layout.erb" et notre modification est bien
là !

Le plus gros intérêt des branches est de permettre de séparer la branche
principale du code de la branche de développement. Mais étant donné que c'est
si facile et si rapide, on peut aussi utiliser les branches pour tester de
nouvelles fonctionnalités. Supposons que je veuille ajouter un super
fonctionnalité Twitter dans ma branche de développement. Je commence par créer
une nouvelle branche dédiée à cette fonctionnalité :

```
$ git branch feature-twitter
```

Puis je passe sur cette branche

```
$ git checkout feature-twitter
```

On va ensuite ajouter notre super fonctionnalité Twitter et tester qu'elle
marche correctement. Pour gagner un peu de temps, pourquoi ne pas ajouter un
lien vers Twitter dans le pied de page (soit le fichier "layout.erb si vous
avez bonne mémoire). Ces modifications vont seulement concerner notre nouvelle
branche "feature-twitter". Disons que ces modifications vous donnent
satisfaction (et que le lien fonctionne) vous allez les commiter :

```
$ git commit -a -m "Ajout fonctionnalité Twitter"
```

Et ensuite vous allez vouloir avoir ces modifications dans votre branche de
développement. Et pour cela, vous allez donc devoir les fusionner. Et pour
commencer, il faut repasser sur la branche développement :

```
$ git checkout development
```

Puis y fusionner les modifications apportées dans la branche pour
Twitter :

```
$ git merge feature-twitter
```

A partir de maintenant, les modifications que vous aviez faites dans la
branche "feature-twitter" sont bel et bien incluses dans la branche
développement. Par conséquent, vous n'avez plus besoin de la branche Twitter
qui ne vous a servi que pour les tests. Vous pouvez donc la supprimer
définitivement en utilisant l'option "-d" :

```
$ git branch -d feature-twitter
```

Lorsque votre branche de développement aura été recettée et sera fin prête
pour le grand jour de la mise en production, il ne vous restera plus qu'à la
fusionner à votre branche "master". Souvenez-vous bien qu'il faut d'abord
passer sur la branche "master" puis y fusionner la branche
"development" :

```
$ git checkout master
$ git merge development
```

## Les Tags

Vous pouvez créer un tag pour un projet à n'importe quel moment, en
utilisant la commande suivante :

```
$ git tag v1.0 -m "Version 1.0 du projet Reverse"
```

Cela vous permet d'immortaliser certains moments du développement - assurez
vous d'avoir ajouté et commité tous les changements apportés avant de créer un
tag. Si vous voulez voir tous les tags que vous avez créé, vous pouvez
taper :

```
$ git tag
```

Et si vous souhaitez revenir à une version précédente, alors vous créez une
nouvelle branche pour celle-ci. Supposons qu'à l'avenir vous ayez à revenir sur
cette version (pour corriger un bug dessus par exemple), vous aurez à saisir la
commande ci-dessous :

```
$ git checkout v1.0 -b version1
```

Cela va automatiquement créer une nouvelle branche nommée "version1" qui
sera la copie exacte de ce qu'était le projet lorsque vous aviez créé le tag
"v1.0", sans que cela vous fasse perdre quoique ce soit de votre code
actuel.

## Les repositories distants

[Github](http://github.com/) est un service
extraordinaire qui vous permet de conserver votre code dans un repository
distant qui est hébergé sur leurs serveurs. Pour pouvoir démarrer, vous n'avez
qu'à vous inscrire pour disposer d'un compte gratuit, définir un nouveau projet
puis suivre leurs instructions pour créer un nouveau repository distant.

Une fois que votre repository distant est créé, tout ce qu'il vous reste à
faire c'est d'entrer la commande ci-dessous :

```
$ git push origin master
```

Cela aura pour effet d'envoyer tout le code de votre branche "master" vers
votre repository chez GitHub. C'est très pratique pour disposer d'une
sauvegarde externe de votre repository dans le cloud mais aussi pour partager
votre travail avec les autres (l'idéal pour tous les projets open source !).
Par contre, si vous voulez que votre repository reste privé alors vous aurez
besoin de prendre un compte payant sur GitHub.

Vous pouvez aussi vous mettre à utiliser le code d'autres personnes sur
GitHub en clonant leur repositories et en utilisant la commande
`pull` pour récupérer toutes les modifications qu'ils ont
effectuées. Quant à eux, ils ont aussi la possibilité d'utiliser la commande
`pull` pour récupérer les changement que vous avez apporté. Tout
cela fait de Git un outil particulièrement puissant dès qu'il s'agit de
collaborer sur un même projet, dans la mesure où il permet aux gens de corriger
des bugs dans votre code, d'améliorer votre code ou de développer un projet
totalement nouveau.

## Quelques ressources sur Git

Daren a collecté un certain nombre de ressources consacrées à Git que vous
pouvez retrouver sur le [tutoriel d'origine](http://ididitmyway.herokuapp.com/past/2010/1/14/git_beginners_guide/).

Git est une application super puissante qui va révolutionner la façon dont
vous gérez vos projets. Et il est extrêmement précieux quand il s'agit de gérer
et de déployer des applications Sinatra sur la plateforme [Heroku](http://heroku.com/), ce dont je parlerai dans un
[prochain billet]({% post_url 2010-09-13-deployer-applications-sinatra-heroku %}).
