---
date: 2010-09-15 21:58:00
layout: post
redirect_from: "post/2010/09/15/installer-nesta-sous-windows"
tags: ruby, sinatra
title: "Installer Nesta sous Windows"
---

Mise à jour : L'installation et le fonctionnement de
Nesta ont changé depuis ce billet. Il est donc préférable de se reporter au
site <http://nestacms.com/> pour
obtenir des informations plus actualisées (mais l'installation du toolkit
DevKit pour RedCloth est toujours d'actualité).

---
Pour essayer d'approfondir mes connaissances en Ruby et Sinatra, j'ai
regardé ce qui existait comme exemples d'applications Sinatra toutes faites en
essayant plus particulièrement de trouver quelque chose de simple pour gérer
des sites internet.

J'ai finalement décidé de tester [Nesta](http://nestacms.com/) qui me parait assez facile à utiliser et devrait être assez
simple à prendre en main étant donné qu'au total il ne représente qu'une
vingtaine de kilo-octets de code Ruby.

Nesta est un CMS (système de gestion de contenu) plutôt léger, très bien
adapté pour gérer de petits blogues ou sites internet. Il est développé en Ruby
et il utilise bien entendu le framework Sinatra.

Pour pouvoir installer Nesta sur Windows, j'ai dû commencer par mettre à
jour mon [installation du Ruby]({% post_url 2010-07-22-installer-sinatra-windows-7 %}) parce que je n'avais pas [installé le toolkit DevKit](http://github.com/oneclick/rubyinstaller/wiki/development-kit). Je n'en avait pas eu besoin jusqu'à
présent, mais il s'est avéré indispensable pour terminer l'installation du gem
[RedCloth](http://redcloth.org/) qui nécessite une
compilation de je ne sais trop quoi.

Une fois ce point réglé, il faut utiliser Git à partir de Git Bash pour
récupérer une copie de Nesta sur mon poste de travail :

```
$ git clone git://github.com/gma/nesta.git
```

Arrivé là, j'ai continué à suivre le tutoriel [Quick Start](http://nestacms.com/docs/quick-start) proposé
sue le site de Nesta et j'ai installé le système de gestion de dépendances
[bundler](http://gembundler.com/) qui va ensuite se
charger du reste de l'installation :

```
$ gem install bundler
$ cd nesta
$ bundle install
```

La dernière commande `bundle install` a alors donné le résultat
suivant :

```
Fetching source index for http://rubygems.org/
Using rake (0.8.7)
Installing RedCloth (4.2.2) Temporarily enhancing PATH to include DevKit...
with native extensions
Installing builder (2.1.2)
Installing haml (3.0.12)
Using json_pure (1.4.6)
Using rubyforge (2.0.4)
Using hoe (2.6.2)
Installing hpricot (0.8.2) with native extensions
Using syntax (1.0.0)
Installing maruku (0.6.0)
Using rack (1.2.1)
Installing rack-test (0.5.3)
Installing rspec (1.3.0)
Installing rspec_hpricot_matchers (1.0)
Installing shotgun (0.8)
Using sinatra (1.0)
Installing test-unit (1.2.3)
Using bundler (1.0.0)
Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem
is installed.
```

Puis, comme indiqué sur le site de Nesta, j'ai récupéré le fichier de
configuration et quelques pages d'exemple :

```
$ cp config/config.yml.sample config/config.yml
$ bundle exec rake setup:sample_content
```

Ensuite, étant donné que ShotGun ne fonctionne pas sous Windows (lu je ne
sais plus où mais vu de mes yeux vu), je n'ai pas utilisé la commande
`bundle exec shotgun app.rb` et j'ai lancé l'application avec la
commande :

```
ruby app.rb
```

Et tada !

![](/public/2010/nesta.png)

(ok, entre temps j'ai aussi fait une ou deux traductions du contenu du site
d'exemple)

Prochaine étape : l'installer sous Heroku ?
