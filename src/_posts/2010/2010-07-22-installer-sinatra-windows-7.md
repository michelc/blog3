---
date: 2010-07-22 13:47:00
layout: post
redirect_from: "post/2010/07/22/Installer-Sinatra-sous-Windows-7"
tags: mvc, ruby, sinatra
title: "Installer Sinatra sous Windows 7"
---

{:.encart}
Ceci est une adaptation en français du tutoriel "[Installing Sinatra](http://ididitmyway.herokuapp.com/past/2010/1/10/installing_sinatra/)" de Darren Jones.

Je suis tombé sur une super série de tutoriels pour apprendre à utiliser
Sinatra. C'est le résultat de la bonne résolution de Daz (Darren Jones) pour
l'année 2010 et ça s'appelle [I Dit It My Way ou "The Sinatra Songbook Project"](http://ididitmyway.herokuapp.com/).

C'est l'occasion pour se mettre à [Sinatra](http://www.sinatrarb.com/) et je me suis donc lancé dans l'installation des
outils nécessaires à son utilisation, en suivant un des premiers
tutoriels : [Installing Sinatra](http://ididitmyway.herokuapp.com/past/2010/1/10/installing_sinatra/).

## Installer Ruby sur Windows

il faut commencer par installer Ruby étant donné que ce n'est pas quelque
chose de déjà présent sur mon PC. C'est pas compliqué du tout. Il suffit
d'utiliser [RubyInstaller pour
Windows](http://rubyinstaller.org/) (la façon la plus simple d'installer Ruby sous Windows) qui va
s'occuper de tout.

* Cliquer sur le gros bouton rouge "Download" sur la page
d'accueil
* Sélectionner la version la plus récente de RubyInstallers (soit Ruby
1.9.1-p429 à ce jour)
* Enregistrer le fichier sur le disque dur (soit dans le répertoire C:\Temp
dans mon cas)
* Double-cliquer sur C:\Temp\rubyinstaller-1.9.1-p429.exe pour lancer
l'installation
* Le seul truc un peu important, c'est de demander à faire l'installation
dans C:\Ruby (et pas C:\Ruby191 comme le propose l'installeur) et de cocher les
choix "Add Ruby executables to your PATH" et "Associate .rb
and .rbw files with this Ruby installation".

L'installation est très rapide et au final on se retrouve avec un répertoire
"C:\Ruby" d'une cinquantaine de méga.

## Installer Sinatra sur Windows

On entre ensuite dans le vif du sujet qui consiste à installer Sinatra. Pour
cela, il faut ouvrir une "Invite de commandes" et aller dans le
répertoire "C:\Ruby" et lancer la commande suivante :

```
C:\Ruby>gem install sinatra
```

Ce qui donne presque aussitôt :

```
Successfully installed rack-1.2.1
Successfully installed sinatra-1.0
2 gems installed
Installing ri documentation for rack-1.2.1...
Installing ri documentation for sinatra-1.0...
Updating class cache with 0 classes...
Installing RDoc documentation for rack-1.2.1...
Installing RDoc documentation for sinatra-1.0...

C:\Ruby>
```

Ca y est, mon PC devrait contenir Ruby + Sinatra !

## Créer une première application Sinatra

On va alors pouvoir tester que ça marche en codant notre toute première
application Sinatra. Pour cela, il suffit d'ouvrir Notepad pour créer le
fichier C:\Ruby\test.rb avec le code suivant :

```
require 'rubygems'
require 'sinatra'
get '/hi' do
  "I Did It My Way!"
end
```

Puis on demande à Ruby d'exécuter ce programme :

```
C:\Ruby>ruby test.rb
```

Ce qui donne :

```
== Sinatra/1.0 has taken the stage on 4567 for development with backup from WEBrick
[2010-07-22 12:07:23] INFO  WEBrick 1.3.1
[2010-07-22 12:07:23] INFO  ruby 1.9.1 (2010-07-02) [i386-mingw32]
[2010-07-22 12:07:23] INFO  WEBrick::HTTPServer#start: pid=952 port=4567
```

Ca marche ! Il ne reste plus qu'à lancer un des navigateurs installé
sur le PC pour aller voir ce que donne l'adresse
« http://localhost:4567/hi ». Et là, je retrouve bien le message attendu,
à savoir "I Dit It My Way !".

C'est magnifique ! Tout fonctionne comme prévu. Il n'y a qu'à arrêter
l'exécution du programme test.rb par un simple Ctrl-C et se préparer pour la
suite des tutoriels...

```
== Sinatra has ended his set (crowd applauds)
[2010-07-22 12:10:43] INFO  going to shutdown ...
[2010-07-22 12:10:43] INFO  WEBrick::HTTPServer#start done.
```
