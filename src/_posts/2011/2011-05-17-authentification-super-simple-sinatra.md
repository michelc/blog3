---
date: 2011-05-17 19:33:00
layout: post
redirect_from: "post/2011/05/17/authentification-super-simple-avec-sinatra"
tags: ruby, sinatra
title: "Authentification super simple avec Sinatra"
---

{:.encart}
Ceci est la traduction du tutoriel "[Really Simple Authentication in Sinatra](http://ididitmyway.herokuapp.com/past/2011/2/22/really_simple_authentication_in_sinatra/)" de Darren Jones.

Une demande répétée des lecteurs de [I Dit It My Way](http://ididitmyway.herokuapp.com/) est un
billet sur l'authentification. Il existe des tas de gems qui permettent de
faire ça, mais je préfère programmer ça par moi-même. Voici donc une méthode
vraiment simple pour construire le côté administration d'un site web avec
Sinatra.

Pour démarrer, il faut créer quelques paramètres :

```
set :username,'michel'
set :password,'topsecret'
set :token,'1truklong&complike@$e$ouven!r'
```

Puis les handlers pour les différentes routes. En commençant par l'URL
"/admin" pour pouvoir se connecter.

```
get('/admin') { haml :admin }
```

Ca ne prend qu'une ligne parce que tout ce qu'il y a à faire c'est
d'afficher la vue "admin.haml" :

```
%form(action="/login" method="post")
  %label(for="username")Code utilisateur :
  %input#username(type="text" name="username")
  %label(for="password")Mot de passe :
  %input#password(type="password" name="password")
  %input(type="submit" value="Connexion") or <a href="/">Annuler</a>
```

C'est un formulaire tout simple qui contient deux zones de texte pour saisir
le code utilisateur et le mot de passe plus un bouton pour valider. Ce
formulaire est renvoyé à l'aide d'une requête POST vers l'URL "/login" et nous
devons donc ajouter un handler pour la traiter. C'est à ce niveau que nous
allons accomplir le plus gros du travail pour authentifier l'utilisateur.

```
post '/login' do
  if params['username'] == settings.username && params['password'] == settings.password
      response.set_cookie(settings.username,settings.token) 
      redirect '/'
    else
      "Code utilisateur ou mot de passe incorrect"
    end
end
```

Ce code vérifie tout d'abord si le code utilisateur et le mot de passe saisi
via le formulaire (stockés dans le hash params<>) correspondent à
ceux définis dans le paramétrage (les valeurs settings.xxxxx). Si c'est le cas,
on crée un cookie en utilisant le code utilisateur comme clé et pour la valeur
le "token" qu'on avait configuré au tout début. On pourrait se contenter
d'utiliser "true" pour la valeur, mais le fait d'utiliser un token renforce le
niveau de sécurité (si quelqu'un sait expliquer comment ?). Lorsque
l'utilisateur n'a pas donné le bon code utilisateur ou le bon mot de passe, on
renvoie simplement un message d'avertissement.

Et maintenant, tout ce qu'il nous reste à faire c'est de donner la
possibilité de se déconnecter. Ce que nous allons faire en gérant l'URL
"/logout".

```
get('/logout') { response.set_cookie(settings.username, false) ; redirect '/' }
```

Là on modifie le cookie correspondant à l'utilisateur en lui donnant la
valeur "false" puis on le renvoie à la racine du site.

On a donc géré tout ce qui concerne l'authentification d'un utilisateur. Il
nous reste à traiter la partie autorisation pour réellement autoriser ou
interdire l'accès à certaines pages. Pour cela, on va simplement ajouter deux
fonctions helper à notre code Ruby :

```
helpers do
  def admin? ; request.cookies[settings.username] == settings.token ; end
  def protected! ; halt [ 401, 'Not Authorized' ] unless admin? ; end
end
```

Le premier helper, nommé "admin?", va nous servir pour vérifier si
l'utilisateur est connecté ou non, en contrôlant que la valeur du cookie
correspond à la valeur configurée pour le token. On pourra l'utiliser cet
helper dans le code des handlers ou des vues pour par exemple afficher un
message différent selon que l'utilisateur est connecté ou non.

Le second helper, nommé "protected!", utilise le premier helper pour
vérifier si l'utilisateur est connecté et si ce n'est pas le cas il interrompt
le code te renvoie une erreur HTTP 401 pour indiquer que l'action n'est pas
autorisée. On l'utilisera au début du handler d'une route pour indiquer que
l'utilisateur doit être connecté pour visualiser ce contenu.

Et pour finir le code source complet d'une application qui regroupe tout le
code présenté ci-dessus. Libre à vous de à l'utiliser et de faire vos propres
essais avec.

```
require 'rubygems'
require 'sinatra'

set :username,'Bond'
set :password,'007'
set :token,'osh@kerp@$@l@cuill3re'

helpers do
  def admin? ; request.cookies[settings.username] == settings.token ; end
  def protected! ; halt [ 401, 'Not Authorized' ] unless admin? ; end
end

get '/' do
  haml :index
end

get('/admin') { haml :admin }

post '/login' do
  if params['username'] == settings.username && params['password'] == settings.password
    response.set_cookie(settings.username,settings.token) 
    redirect '/'
  else
      "Code utilisateur ou mot de passe incorrect"
  end
end

get('/logout') { response.set_cookie(settings.username, false) ; redirect '/' }

get '/public' do
  'Tout le monde peut voir ça'
end

get '/private' do
  protected!
  'Rien que pour vos yeux !'
end

__END__
@@layout
!!! 5
%html
  %head
    %meta(charset="utf-8")
    %title Authentication Super Simple
  %body
    %a(href='/admin')Connexion
    %a(href='/logout')Déconnexion
    %a(href='/public')Public
    %a(href='/private')Privé
    = yield
@@admin
%form(action="/login" method="post")
  %label(for="username")Code utilisateur :
  %input#username(type="text" name="username")
  %label(for="password")Mot de passe :
  %input#password(type="password" name="password")
  %input(type="submit" value="Connexion") or <a href="/">Cancel</a>
@@index
-if admin?
  %h1 Bienvenue 007 !
-else
  %h1 Bienvenue !
```

C'est un exemple simple et sans prétention si vous souhaitez expérimenter un
système d'authentification et d'autorisations sous Sinatra. Et si vous avez des
idées pour le faire évoluer ou l'améliorer, n'hésitez pas à en faire part dans
les commentaires ci-dessous.
