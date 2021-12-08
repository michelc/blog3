---
date: 2012-12-14 00:17:00
layout: post
redirect_from: "post/2012/12/14/mise-a-jour-ruby-1-9-3-sous-windows-7"
tags: ruby
title: "Mise à jour Ruby 1.9.3 sous Windows 7"
---

Je viens enfin de mettre à jour mon installation Ruby 1.9.2 alors je note
pour le jour où Ruby 2.0 sortira.

## Etape 1 : désinstaller Ruby 1.9.2

Je procède à quelques sauvegardes personnelles avant de lancer la
désinstallation.

* C:\Ruby\root (pour archivage parce que j'y ai quelques fichiers de
notes)
* C:\Ruby\_projets (mes projets sous Sinatra)
* C:\Ruby\Rubyq (pour faire quelques essais)

Puis désinstaller Ruby 1.9.2 et supprimer le répertoire C:\Ruby.

## Etape 2 : Installer Ruby 1.9.3

Installer Ruby 1.9.3 (depuis [RubyInstaller pour Windows](http://rubyinstaller.org/))

* dans C:\Ruby
* cocher "Add Ruby executables to your PATH"
* cocher "Associate .rb and .rbw files with this Ruby installation"

Installer DevKit 4.5.2 (re-depuis [RubyInstaller pour Windows](http://rubyinstaller.org/))

* le décompacter dans C:\Ruby\DevKit
* CD C:\Ruby\DevKit
* ruby dk.rb init
* ruby dk.rb install

Ce coup-ci, je pense à créer un fichier `.gemrc` (avec
SublimeText parce que l'explorateur de fichiers n'aime pas un nom qui commence
par un point) dans mon répertoire utilisateur et j'y enregistre les deux lignes
suivantes :

```
install: --no-rdoc --no-ri
update:  --no-rdoc --no-ri
```

Source : [How to make --no-ri --no-rdoc the default for gem
install?](http://stackoverflow.com/questions/1381725/how-to-make-no-ri-no-rdoc-the-default-for-gem-install)

Mettre à jour les quelques gems installées par défaut

* gem update --system
* gem update

## Etape 3 : Installer Sinatra

Sinatra lui-même

* gem install sinatra
* gem install sinatra-reloader (pour recharger automatiquement les sources
modifiés)

SQLite et DataMapper

* Récupérer la dernière version de sqlite.dll sur [sqlite.org](http://sqlite.org/) et la copier dans
C:\Ruby\bin
* gem install sqlite3 (c'est le nouveau nom de sqlite3-ruby)
* gem install data_mapper
* gem install dm-sqlite-adapter

Les 2 gems dont je vais avoir besoin dans l'immédiat

* gem install haml
* gem install heroku (préconise toolbet qui est en fait heroku + foreman +
git)

Pour les autres gems (pony, rack-flash...), je les installerai au fur et à
mesure des besoins.
