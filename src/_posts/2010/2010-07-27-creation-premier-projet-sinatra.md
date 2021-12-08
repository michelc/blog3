---
date: 2010-07-27 19:45:00
layout: post
redirect_from: "post/2010/07/27/creation-premier-projet-sinatra"
tags: mvc, ruby, sinatra
title: "Création d'un premier projet avec Sinatra"
---

{:.encart}
Ceci est la traduction du tutoriel Sinatra "[Project 1: Reverse](http://ididitmyway.herokuapp.com/past/2010/1/10/project_1_reverse/)" de Darren Jones.

Après avoir brillamment suivi pas à pas mon premier tutoriel pour installer
[Ruby](http://www.ruby-lang.org/) et [Sinatra](http://www.sinatrarb.com/) sur mon PC Windows 7, je
continue sur ma lancée avec la réalisation du deuxième tutoriel proposé par
[Darren Jones](http://dazzl.co.uk/).

Le but de ce tutoriel est de programmer une première application très très
simple qui va se contenter d'afficher un texte à l'envers, d'où son nom :
[Projet 1 : Reverse](http://ididitmyway.herokuapp.com/past/2010/1/10/project_1_reverse/). A travers cette mini-application, on
peut déjà apprendre quelques trucs sur le fonctionnement de Sinatra, voire sur
Ruby si on débute comme moi.

## C'est parti

Pour commencer, j'ai créé un répertoire C:\Ruby\projets\reverse puis un
fichier main.rb à l'intérieur :

```
require 'rubygems'
require 'sinatra'

get '/' do
  "I did it my way!"
end
```

Toutes les applications Sinatra ont besoin des deux premières lignes. Il y a
ensuite une ligne blanche pour faire plus joli puis 3 lignes de code où se
situe toute l'action :

* `get` indique quelle méthode HTTP on souhaite gérer : un
GET dans le cas présent,
* `'/'` correspond à la route à gérer, soit la racine de
l'application dans ce cas,
* `do ... end` est un bloc de code pour définir ce qui se passe
quand quelqu'un demande la racine du site.

La dernière ligne à l'intérieur du bloc `do ... end` contient
toujours (je pense) ce qui sera affiché dans la page, soit "I did it my way!"
dans ce premier exemple.

Pour tester ce code, on peut directement double-cliquer sur le fichier
main.rb dans le répertoire C:\Ruby\projets\reverse ou faire ça à la main dans
une invite de commande :

```
C:\Ruby\projets\reverse>ruby main.rb
```

Et Sinatra entre en scène :

```
== Sinatra/1.0 has taken the stage on 4567 for development with backup from WEBrick
[2010-07-27 21:44:57] INFO  WEBrick 1.3.1
[2010-07-27 21:44:57] INFO  ruby 1.9.1 (2010-07-02) [i386-mingw32]
[2010-07-27 21:44:57] INFO  WEBrick::HTTPServer#start: pid=3604 port=4567
```

On peut alors lancer un navigateur pour appeler l'URL
http://localhost:4567/ :

![](/public/2010/reverse-1.png)

Tant qu'on est là, si on essaie d'aller sur une URL qui n'existe pas, comme
http://localhost:4567/reverse, on obtient alors la page d'erreur 404 de Sinatra
pour indiquer qu'il ne connait pas ce morceau :

![](/public/2010/reverse-2.png)

Cette page d'erreur nous conseille même sur la route ajouter dans notre
fichier pour que cela fonctionne, en l'occurrence :

```
get '/reverse' do
  "Hello World"
end
```

Avec Sinatra, c'est pas plus compliqué que ça pour créer des actions
correspondant à différentes routes.

## Ajouter une vue

Pour l'instant, on va rester sur notre route `'/'` et essayer
de faire un peu mieux que de seulement renvoyer une ligne de texte. Pour cela,
il faut créer une vue en modifiant le fichier main.rb de la façon
suivante :

```
require 'rubygems'
require 'sinatra'

get '/' do
  erb :home
end

__END__

@@ home

<h1>Reverse</h1>

<p>Welcome to the home page of my very first Sinatra app.</p>
```

Ce coup-ci, au lieu d'utiliser la dernière ligne du bloc pour dire à Sinatra
ce qu'il doit afficher, nous lui avons demandé d'utiliser la vue "home" que
nous avons codé en erb (embedded ruby). Cette vue est enregistrée à la fin du
fichier, après la ligne `__END__` et elle est repéré par le code
`@@ home`.

Pour voir ce que donne cette vue, il faut revenir à l'invite de commande et
arrêter le serveur s'il est toujours en cours d'exécution. Ctrl-C => Sinatra
has ended his set (crowd applauds). Puis on relance le serveur avec `ruby
main.rb` et on réaffiche la page http://localhost:4567 :

![](/public/2010/reverse-3.png)

## Créer une vue externe

En fait, on n'est pas obligé de stocker les vues dans le même fichier. Il
est bien plus pratique de les enregistrer dans un sous-répertoire "views" de
notre projet (soit C:\Ruby\projets\reverse\views dans mon cas).

Là, il suffit de créer le fichier "home.erb" avec le code
ci-dessous :

```
<h1>Reverse</h1>

<p>Welcome to the home page of my very first Sinatra app.</p>
```

Il est alors possible de simplifier le fichier "main.rb" de la façon
suivante :

```
require 'rubygems'
require 'sinatra'

get '/' do
  erb :home
end
```

Il ne reste plus qu'à contrôler que tout est ok : Ctrl-C, ruby main.rb,
rafraichir la page et vérifier que rien n'a changé.

## Créer un layout

D'un point de vue visuel, on peut faire encore mieux en définissant un
"layout" qui servira de gabarit pour englober toutes les vues. Cela permet
d'éviter de répéter le même code dans toutes les vues de l'application.

Pour cela, on doit juste créer un fichier "layout.erb" dans le
sous-répertoire "views" et y saisir le code html ci-dessous :

```
<!DOCTYPE html>
<html lang="en">
<head>
<title>Reverse!</title>
<meta charset=utf-8 />
</head>
<body>
<h1>Reverse</h1>

<%= yield %>

<p>The first Sinatra project for I Did It My Way</p>
</body>
</html>
```

Tout ce code html sera toujours affiché à chaque fois qu'une vue sera
affichée, à part la ligne `<%= yield %>` qui sera remplacée
par le contenu spécifique de la vue.

Ainsi, si on modifie légèrement le code de la vue "home.erb" :

```
<h2>Home</h2>
<p>Welcome to the home page. This app is going to be amazing....</p>
```

Le fait de relancer le serveur et de ré-afficher l'URL http://localhost:4567
doit donner le résultat suivant :

![](/public/2010/reverse-4.png)

Comme vous pouvez le constater, le sous-titre "Home" et le message
"Welcome..." en provenance de la vue "home.erb" apparaissent entre le titre
"Reverse" et le paragraphe "The first app...", soit exactement là où se situait
la ligne `<%= yield %>` dans le fichier "layout.erb".

## ERB

La balise `<%= yield %>` est un exemple d'**embedded
ruby** (ou erb en abrégé). On peut ainsi ajouter du code ruby dans les
fichiers html en l'insérant à l'intérieur de blocs `<% ...
%>`. C'est très utile dans le cas de conditions
`if` :

```
<% if something_happens %>
<h1>Something happened</h1>
<% else %>
<h1>Nothing happend</h1>
<% end %>
```

Si le code ruby est placé dans un bloc `<%= ... %>`, alors
ce code est évalué et son résultat est affiché. Comme par exemple dans le code
suivant :

```
<% title = "Reverse" %>
<h1>
<%= title %>
</h1>
```

Le premier bloc de code `<% ... %>` défini une variable
appelée "title" et le second bloc de code `<%= ... %>` évalue
cette variable et affiche sa valeur. Même si cet exemple est ultra simple, dans
la vrai vie on peut faire des tas de chose très utile grâce à l'embedded
ruby.

## Définir une variable

Plus concrètement, nous allons utiliser embeded ruby pour définir le titre
de notre page. Dans un premier temps, on met à jour le code de
"main.rb" :

```
require 'rubygems'
require 'sinatra'

get '/' do
  @title = "Home"
  erb :home
end
```

Celui-ci initialise une variable session nommée `@title` (c'est une variable
session parce que son nom débute par un `@`). Les variables session sont
disponibles dans les autres parties du code, y compris dans les vues. On peut
donc maintenant faire référence à notre variable session `@title` dans notre vue
ou même notre layout.

Par conséquent, nous pouvons modifier "layout.erb" pour qu'il utilise notre
variable session :

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

<p>The first Sinatra project for I Did It My Way</p>
</body>
</html>
```

Puis nous pouvons alors supprimer le titre qui était en dur dans la vue
"home.erb" :

```
<p>Welcome to the home page. This app is going to be amazing....</p>
```

Par acquit de conscience, on peut redémarrer le serveur et contrôler que
rien n'a changé, ce qui signifie que notre variable session a bien été prise en
compte et que nous pouvons maintenant définir le titre de la page au niveau de
l'action.

On va vérifier cela en créant une nouvelle route dans le source
"main.rb" :

```
require 'rubygems'
require 'sinatra'

get '/' do
  @title = "Home"
  erb :home
end

get '/frank' do
  @title = "My Way"
  erb :home
end
```

Après avoir encore une fois redémarré le serveur, on peut aller à la page
http://localhost:4567/frank pour constater que le sous-titre n'est plus "Home"
mais "My Way" :

![](/public/2010/reverse-5.png)

Mais on continue à voir presque la même chose, étant donné qu'on utilise la
même vue dans les deux cas. On va donc créer une vue différente qui s'affichera
pour la route "/frank". Pour cela, on saisi le code suivant dans un fichier
"frank.erb" à créer dans le sous-répertoire "views" :

```
<p>
And now, the end is here
And so I face the final curtain
My friend, I'll say it clear
I'll state my case, of which I'm certain
I've lived a life that's full
I traveled each and ev'ry highway
And more, much more than this, I did it my way
</p>
```

Il faut aussi changer la ligne `erb:home` par
`erb:frank` dans le cas de la route "/frank" avant de redémarrer le
serveur et de ré-afficher la page http://localhost:4567/frank pour voir ce que
cela donne.

## Poster quelque chose

Jusqu'à présent on n'a pas fait grand chose d'autre que des pages statiques.
Mais quand on crée une application web, c'est quand même pour avoir un peu
d'interaction avec le visiteur. On va donc rendre les choses un peu plus
intéressante en commençant par créer un formulaire dans notre page d'accueil.
Pour cela, on remplace tout le code de "home.erb" par le code
suivant :

```
<form action="/reverse" method ="post" accept-charset="utf-8">
<input type="text" id="phrase" name="phrase" value="Write something...">
<input type="submit" value="...and reverse it!">
</form>
```

Une fois que c'est fait, on a aussi besoin d'une nouvelle action pour
prendre en compte le formulaire lorsqu'il est envoyé. Si vous observez le code
html de "home.erb", vous pouvez voir que le formulaire va être posté à l'URL
"/reverse" avec une méthode POST.

Normalement, c'est le moment où vous devriez vous rendre compte que la
syntaxe de Sinatra est bien faite. Et vous devriez même avoir une idée ce que
nous allons ajouter dans le fichier "main.erb" :

```
require 'rubygems'
require 'sinatra'

get '/' do
  @title = "Home"
  erb :home
end

post '/reverse' do
  params.inspect
end
```

L'avant-avant dernière ligne (l'antépénultième pour les érudits) défini la
nouvelle action qui va gérer la route "/reverse". Cette action est définie pour
une route de type POST, ce qui signifie qu'elle ne sera activé que pour une
requête POST (ce qui correspond à l'envoi d'un formulaire). Ca c'est bon ?
Mais par contre, c'est quoi cette ligne `params.inspect` ?
"params" est une collection qui contient toutes les informations qui ont été
envoyées en tant que paramètre (aussi bien à travers un formulaire que via
l'URL) Par conséquent, `params.inspect` affiche les paires
clé/valeur correspondantes à tous ces paramètres.

Allez. On relance le serveur, on accède à la page http://localhost:4567/, on
saisi une phrase au hasard et on clique sur le bouton [... and reverse
it] :

![](/public/2010/reverse-6.png)

Cela signifie que la clé "phrase" contient la valeur "I Did It My Way". Et
nous avons une clé "phrase" parce que le formulaire dans "home.erb" contient
une balise input dont l'attribut name est "phrase". Il est possible d'accéder à
n'importe quel paramètre stocké dans la collection "params" en employant la
syntaxe `params[:key]`. Par exemple, `params[:phrase]`
renverra "I Did It My Way".

Supposons que l'on ait le formulaire suivant :

```
<form action="/reverse" method ="post" accept-charset="utf-8">
<input type="text" name="name">
<input type="text" name="email">
<input type="text" name="password">
<input type="submit" value="submit">
</form>
```

On va pouvoir accéder aux valeurs de ce formulaire en utilisant
`params[:name]`, `params[:email]` et
`params[:password]`.

Maintenant que nous savons comment accéder aux données d'un formulaire, nous
allons pouvoir faire quelque chose du texte saisi dans notre vue. Pour cela,
nous ajoutons le code ci-dessous au fichier "main.rb" :

```
require 'rubygems'
require 'sinatra'

get '/' do
  @title = "Enter Your text here"
  erb :home
end

post '/reverse' do
  @title = "Here's Your Reversed Text:"
  params[:phrase].reverse
end
```

On re-démarre le serveur, on ré-accède à la page http://localhost:4567/, on
re-saisi une phrase au hasard et on re-clique sur le bouton [... and reverse
it]. Cette fois-ci, on doit voir la phrase saisie affichée à l'envers, de la
droite vers la gauche :

![](/public/2010/reverse-7.png)

On obtient ce résultat parce que la dernière ligne de la méthode est
`params[:phrase].reverse`. Et si vous vous souvenez bien, la
dernière ligne d'une méthode est ce qui est renvoyé pour l'URL demandée.
`params[:phrase]` correspond au texte entré dans le formulaire et le
`.reverse` à sa suite correspond à la méthode "reverse" pour les
chaines de caractères. Et cette méthode fait exactement ce que son nom laisse
supposer, soit inverser l'ordre des caractères d'une phrase. Coup de bol, c'est
aussi ce à quoi notre application était destinée !

## Faire un postback

On peut pousser le bouchon encore plus loin et utiliser la même URL pour nos
deux pages (l'affichage du formulaire et l'affichage du résultat de notre
application). C'est possible parce que pour afficher le formulaire on fait une
requête GET et que pour inverser le texte on envoie le formulaire avec une
requête POST. Par conséquent, on peut donc gérer ces deux actions avec la même
route, mais deux actions différentes.

On peut donc réécrire "main.rb" :

```
require 'rubygems'
require 'sinatra'

get '/' do
  @title = "Enter Your text here"
  erb :home
end

post '/' do
  @title = "Here's Your Reversed Text:"
  params[:phrase].reverse
end
```

Cette fois-ci, l'URL de la route est toujours la même, mais la méthode HTTP
est différente (soit un GET, soit un POST). Le fait de poster vers soit-même
s'appelle un "postback". En plus du GET et du POST, Sinatra gère les deux
autres méthodes HTTP, à savoir PUT et DELETE. Nous n'en avons pas besoin pour
cette application, mais nous aurons l'occasion d'y revenir dans un autre
projet.

Pour que le postback fonctionne, il faut aussi penser à modifier l'attribut
action du formulaire au niveau de la vue "home.erb" pour qu'il pointe vers la
même URL :

```
<form action="/" method ="post" accept-charset="utf-8">
<input type="text" id="phrase" name="phrase" value="Write something...">
 <input type="submit" value="...and reverse it!">
</form>
```

Et comme pour l'instant le résultat de notre application se présente
seulement sous la forme d'une ligne de texte, on va enjoliver ça en créant une
nouvelle vue "reverse.erb" qui va nous permettre d'afficher ce résultat de
façon un peu plus élégante :

```
<h3>Here is your reversed text......</h3>
<p><strong><%= @reversed_text %></strong></p>
```

Il suffit alors de référencer cette vue dans le fichier "main.rb", dans
lequel nous initialisons la variable session `@reversed_text` que nous avons
utilisée dans notre nouvelle vue :

```
require 'rubygems'
require 'sinatra'

get '/' do
  @title = "Enter Your text here"
  erb :home
end

post '/' do
  @title = "Here's Your Reversed Text:"
  @reversed_text = params[:phrase].reverse
  erb :reverse
end
```

Si on relance tout et que l'on fait tout bien comme il faut, on arrive sur
l'écran suivant :

![](/public/2010/reverse-8.png)

## Les paramètres nommés

On pourrait en rester là puisque l'application fait ce qui était prévu. Mais
on peut faire mieux, comme par exemple permettre à l'utilisateur d'indiquer la
phrase qu'il veut inverser directement au niveau de l'URL. OK, mais comment
faire pour retrouver le texte qui a été proposé ? Pas compliqué, il faut
juste ajouter une route avec un paramètre nommé :

```
get '/:phrase' do
```

Cela va ajouter automatiquement un paramètre "phrase" à la collection
"params". On retrouvera donc tout ce que l'utilisateur aura indiqué dans l'URL
en utilisant `params[:phrase]`. Par exemple, pour l'URL
http://localhost:4567/frank on aura `params[:phrase]` égal à "frank" et pour
l'URL http://localhost:4567/sinatra on aura `params[:phrase]` égal à "sinatra"
.

On va donc compléter notre fichier "main.rb" pour lui ajouter du code
destiné à gérer cette route :

```
require 'rubygems'
require 'sinatra'

get '/' do
  @title = "Enter Your text here"
  erb :home
end

post '/' do
  @title = "Here's Your Reversed Text:"
  @reversed_text = params[:phrase].reverse
  erb :reverse
end

get '/:phrase' do
  @title = "Here's Your Reversed Text:"
  @reversed_text = params[:phrase].reverse
  erb :reverse
end
```

Voyons voir si ça marche. Tout ce qu'il y a à faire (après avoir relancé le
serveur pour la dernière fois), c'est d'appeler l'URL http://localhost:4567/
suivi d'une phrase de votre choix et de vérifier que ce texte s'affiche bien à
l'envers, comme dans la copie d'écran ci-dessous :

![](/public/2010/reverse-9.png)

## Voilà c'est fini

Et ainsi se termine le tutoriel consacré à la première application Sinatra
proposée par Darren Jones ([@daz4126](http://twitter.com/daz4126)) dont ce billet constitue une traduction très très libre.
