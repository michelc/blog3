---
date: 2010-09-13 18:41:00
layout: post
redirect_from: "post/2010/09/13/D%C3%A9ployer-des-applications-Sinatra-sur-Heroku"
tags: git, ruby, sinatra
title: "Déployer des applications Sinatra sur Heroku"
---

{:.encart}
Ceci est la traduction du tutoriel "[Deploying Sinatra Apps on Heroku](http://ididitmyway.herokuapp.com/past/2010/1/16/deploying_sinatra_apps_on_heroku/)" de Darren Jones.

Vous avez enfin terminé votre super application web, mais ça n'a pas
beaucoup d'intérêt si personne en peut s'en servir. Ce qu'il vous faut, c'est
lancer votre application à l'assaut d'internet !

## Heroku

[Heroku](http://heroku.com/) est de très loin la
façon la plus simple pour déployer des applications Sinatra. Il s'agit d'un
excellent service pour tous ceux qui ont besoin d'héberger des applications en
Ruby (avec des frameworks tels que Rails, Merb, Rameze et bien entendu
Sinatra). L'hébergement est gratuit pour les petits sites de base, y compris la
base de données, et s'adapte lorsque votre application devient plus populaire.
Heroku s'occupe de tous les trucs compliqués en matière d'hébergement et
convient parfaitement pour mettre en production des sites à grande échelle. le
tout accompagné d'un excellent support et d'une large documentation.

**Avant d'aller plus loin, vous devez avoir [installé Git]({% post_url 2010-07-29-guide-demarrer-git %}) étant donné qu'il est nécessaire pour faire un
déploiement sur Heroku.**

## Inscription

Pour commencer, vous devez créer un compte sur Heroku en vous enregistrant
gratuitement à l'adresse <http://heroku.com/signup>.

## Installer le gem Heroku

On part du principe que vous avez déjà [installé Ruby, Gems et Sinatra]({% post_url 2010-07-22-installer-sinatra-windows-7 %}) et par conséquent vous n'avez
plus qu'à lancer la commande suivante à partir d'une invite de
commande :

```
C:\Ruby>gem install heroku --no-rdoc --no-ri
```

ce qui donne :

```
Successfully installed mime-types-1.16
Successfully installed rest-client-1.4.2
Successfully installed rake-0.8.7
Successfully installed configuration-1.1.0
Successfully installed launchy-0.3.7
Successfully installed heroku-1.10.0
6 gems installed
```

Il s'agit d'une petite application en ligne de commande qui va vous
permettre d'interagir avec vos sites hébergés sur Heroku. Vous pouvez consulter
sa documentation à l'adresse <http://docs.heroku.com/heroku-command>.

## Envoyer votre clé SSH

Pour pouvoir communiquer avec Heroku, vous devez utiliser une clé SSH. Si
vous n'en avez pas encore, vous pouvez en générez une en tapant la commande
suivante dans une console Git Bash (et pas une simple invite de
commande) :

```
$ ssh-keygen -t rsa -C "yourname@gmail.com"
```

Vous trouverez plus d'informations pour [générer une clé SSH
sur Github](http://help.github.com/msysgit-key-setup/) (vous devriez d'ailleurs avoir déjà généré votre clé SSH lors de
votre inscription à Github).

Une fois que vous disposez d'une clé SSH, vous devez l'enregistrer dans
votre compte Heroku, en utilisant la ligne de commande :

```
C:\Ruby>heroku keys:add
```

Ce qui devrait vous renvoyer le message suivant :

```
Enter your Heroku credentials.
Email: youremail@gmail.com
Password:
```

Répondez à la question qui vous est posée et vous obtiendrez le message
ci-dessous :

```
Uploading ssh public key C:\Users
om.utilisateur/.ssh/id_rsa.pub
```

**Ce paramétrage de la clé SSH ne doit être réalisé qu'une seule fois.
A partir de maintenant, vous n'aurez plus qu'à effectuer les étapes décrites
dans la suite de ce tutoriel à chaque fois que vous souhaiterez mettre en ligne
une de vos applications Sinatra.**

## Le fichier rackup

Pour déployer une application Sinatra, vous avez besoin d'un fichier rackup.
Celui-ci doit être créé dans la racine de votre application et doit se nommer
"config.ru" pour que le serveur web puisse le retrouver facilement. Pour notre
premier essai, nous nous plaçons dans le répertoire de l'application Reverse
que nous avons développée et versionnée sous GIT au cours des tutoriels
précédents pour y créer un fichier "config.ru" avec le contenu
suivant :

```
require 'main'
run Sinatra::Application
```

Il faut ensuite penser à ajouter ce fichier au référentiel Git :

```
$ git commit -a -m "Ajout du fichier rackup pour déployer sur Heroku"
```

## Le manifeste gem

Pour définir les dépendances gems de votre application, il faut également
configurer un fichier de manifeste. Il s'agit d'un simple fichier texte nommé
".gems" à placer dans la racine de votre application et dans lequel on
enregistre les gems nécessaires à notre application. Dans le cas de
l'application Reverse, il suffit donc d'y faire apparaitre une seule ligne, à
savoir :

```
sinatra
```

Là encore, il ne faut pas oublier d'ajouter ce fichier au référentiel
Git :

```
$ git commit -a -m "Ajout du manifeste gem pour déployer sur Heroku"
```

Note : dans le cas de l'application SuperDo, le
fichier ".gems" devra contenir les 3 lignes suivantes pour que l'application
fonctionne correctement une fois déployée :

```
sinatra
data_mapper
dm-postgres-adapter
```

## Ajouter votre site sur Heroku

La dernière étape consiste à placer votre site sur Heroku. Ouvrez une invite
de commande et accédez au répertoire de votre application "Reverse". Vous devez
ensuite choisir un nom pour votre application (vous ne pouvez pas utiliser
"reverse" parce que Daz l'a déjà pris, ni "reversefr" puisque je l'ai pris !).
Pour commencer, il faut créer l'application sur Heroku en entrant la ligne de
commande suivante depuis une console Git Bash :

```
$ heroku create appname
```

Ce qui donne le résultat ci-dessous :

```
Creating appname.... done
Created http://appname.heroku.com/ | git@heroku.com:appname.git
Git remote heroku added
```

Il reste alors à pousser notre application vers Heroku à l'aide de Git en
lançant la commande :

```
$ git push heroku master
```

Ce qui donne alors quelque chose du style :

```
Counting objects: 7, done.
Delta compression using up to 2 threads.
Compressing objects: 100% (4/4), done.
Writing objects: 100% (4/4), 441 bytes, done.
Total 4 (delta 3), reused 0 (delta 0)

-----> Heroku receiving push
-----> Sinatra app detected
       Compiled slug size is 588K
-----> Launching...... done
       http://appname.heroku.com deployed to Heroku

To git@heroku.com:appname.git
   3b3ed7c..350b521  master -> master
```

Et maintenant, il est enfin possible de naviguer vers l'URL
"http://appname.heroku.com/" pour voir votre application prendre son envol sur
internet !

## Mise à jour du site

Il vous suffit d'une ligne de commande Git pour pouvoir déployer les
modifications que vous avez apportées à votre application (à condition de les
avoir commitées !). Dans le cas où vous souhaitez déployer la branche master de
votre référentiel Git, vous n'avez qu'à taper la commande suivante :

```
$ git push heroku master
```

C'est là tout l'intérêt d'utiliser Git pour déployer une application sur
Heroku. Grâce à son système de branches, on peut développer sur une branche et
utiliser une autre branche pour la version en production.

J'espère que ce billet aura réussi à vous convaincre qu'il est très facile
de déployer des applications développées avec Sinatra et que Heroku est un
service parfaitement adapté pour cela. A votre tour de mettre votre application
en ligne !
