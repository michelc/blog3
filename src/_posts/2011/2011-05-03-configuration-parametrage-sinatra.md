---
date: 2011-05-03 19:37:00
layout: post
redirect_from: "post/2011/05/03/configuration-et-parametrage-avec-sinatra"
tags: ruby, sinatra
title: "Configuration et paramétrage avec Sinatra"
---

{:.encart}
Ceci est la traduction du tutoriel "[Sinatra Settings and Configuration](http://ididitmyway.herokuapp.com/past/2010/11/9/sinatra_settings_and_configuration/)" de Darren Jones.

## Définir des paramètres

Pour définir des variables session d'application qui seront accessible
partout dans une application, on peut utiliser la commande `set` en
respectant la syntaxe suivante :

```
set :name, 'MonSite'
set :author, 'Michel'
```

Ces variables sont ensuite utilisables dans notre code Ruby sous la forme
`settings.name` et `settings.author` :

```
get '/hello' do
  "Cette page a été rédigée par " + settings.author
end
```

Puis en se connectant à l'URL "/hello" on obtient alors :

```
Cette page a été rédigée par Michel.
```

On peut également utiliser la commande `set` pour modifier les
paramètres de certains gems, comme par exemple :

```
set :haml, { :format => :html5 }
```

Grâce à quoi Haml génèrera du code HTML5 avec le doctype correct, pas de
barre fermante pour la balise image, etc...

Il est même possible de modifier les paramètres par défaut de Sinatra. C'est
ce qui permet par exemple de redéfinir le répertoire "public" :

```
set :public, Proc.new { root }
```

De cette façon, le répertoire "public" sera identique au répertoire racine
du site.

Et pour modifier le répertoire où sont enregistrées les vues :

```
set :views, Proc.new { File.join(root, "templates") }
```

Après cela, Sinatra recherchera dans le dossier "templates" pour tous les
fichiers de vues de notre application (en lieu et place du répertoire "views"
utilisé par défaut).

Quand le paramètre correspond à un booléen, il est possible d'utiliser les
commandes `enable` et `disable` plutôt que la commande
`set` :

```
enable :sessions
disable :twitter
```

Ce qui est exactement identique à :

```
set :sessions, true
set :twitter, false
```

La [documentation officielle de Sinatra](http://www.sinatrarb.com/configuration.html) fourni d'autres explications et
des exemple, entre autre la liste des paramètres internes de Sinatra.

## Les blocs de configuration

Sinatra permet de regrouper un ensemble de paramètres dans un bloc de
configuration :

```
configure do
  set :name, 'michel'
  set :haml, { :format => :html5 }
end
```

Cela va initialiser tous les paramètres ainsi que tout ce qui est nécessaire
au démarrage.

Et cerise sur le gâteau, on peut définir un bloc de configuration pour
chaque environnement :

```
configure :development do
  set :db, File.join("sqlite3://",settings.root, "development.db"
end

configure :test do
  set :db, File.join("sqlite3://",settings.root, "test.db"
end

configure :production do
  File.join("sqlite3://",settings.root, "production.db"
  set :sass, { :style => :compressed }
end
```

Comme vous pouvez le voir, j'ai configuré Sass pour que sa sortie soit
compressée en production et que le fichier généré soit le plus petit possible.
Il existe tout un tas d'autres options pour [Sass](http://sass-lang.com/docs/yardoc/file.SASS_REFERENCE.html#options) et [Haml](http://haml-lang.com/docs/yardoc/file.HAML_REFERENCE.html#options) qui peuvent être initialisées de cette façon.

## Gérer des paramètres d'environnement sur Heroku

Pour finir, on a la possibilité de définir des variables d'environnement
directement sur Heroku, ce qui nous évite d'avoir à rendre la valeur de
certains paramètres publics. Supposons que nous ayons le code
ci-dessous :

```
set :password, 't0psecret'
```

Le hic c'est que si on compte partager notre code, les autres personnes
auront accès à notre mot de passe top secret ! La solution dans ce cas là
c'est de définir une variable d'environnement appelée "PASSWORD", chose de très
simple à faire depuis une console bash. Il suffit de se placer dans le
répertoire de l'application et d'entrer le code ci-dessous :

```
$ heroku config:add PASSWORD=t0psecret
```

Ce qui doit renvoyer le message suivant :

```
Adding config vars:
  PASSWORD    => t0psecret
Restarting app...done.
```

Il faut utiliser la commande `config` seule pour lister toutes
les variables d'environnement existantes sur Heroku :

```
$ heroku config
```

Comme on peut le voir suite à cette commande, Heroku défini déjà par
lui-même un certain nombre de variables d'environnement de façon automatique
dans le but de nous faciliter la vie :

```
PASSWORD => t0psecret
DATABASE_URL => postgres://ibzju...s.com/ibzjubamts
RACK_ENV     => production
URL          => http://bloggl.heroku.com
```

Si on a besoin de se débarrasser de toutes les variables de configuration,
on peut employer la commande suivante :

```
$ heroku config:clear
```

Ce que Heroku confirmera avant de redémarrer l'application :

```
Clearing all config vars and restarting app...done.
```

Après avoir créé nos variables d'environnement sur Heroku, il ne nous reste
plus qu'à modifier notre code source pour en tirer parti :

```
set :password, ENV['PASSWORD'] || 'secret'
```

Ce code va utiliser la variable d'environnement enregistrée dans
ENV['PASSWORD'] si elle est définie ou sinon se contenter du simple mot de
passe "secret" défini en dur dans le code. Grâce à cette méthode vous ne
risquez pas de divulguer quoique ce soit d'important ou de personnel dans votre
code source Ruby.

Pour être complet, le Dev Center d'Heroku présente d'autres informations
concernant l'[utilisation des variables de configuration sur Heroku](http://devcenter.heroku.com/articles/config-vars).
