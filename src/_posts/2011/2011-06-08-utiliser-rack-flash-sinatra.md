---
date: 2011-06-08 19:50:00
layout: post
redirect_from: "post/2011/06/08/utiliser-rack-flash-avec-sinatra"
tags: ruby, sinatra
title: "Utiliser Rack Flash avec Sinatra"
---

{:.encart}
Ceci est la traduction du tutoriel Sinatra "[Rack Flash](http://ididitmyway.herokuapp.com/past/2011/3/15/rack_flash_/)" de Darren Jones.

![The Flash](/public/2011/the-flash.jpg)

Flash est un tableau hash bien pratique que l'on trouve dans Rails. Il ne
s'agit pas du super héros qui se déplace à la vitesse de l'éclair mais d'une
astuce pour stocker temporairement des informations entre deux requêtes HTTP.
Si par exemple votre application enregistre une nouvelle fiche puis redirige
l'utilisateur vers une autre page, vous pouvez utiliser cette mémoire flash
pour stocker un message indiquant que la fiche a bien été enregistrée. Ce
message sera ensuite affiché sur la nouvelle page (après le redirect).

On peut avoir la même fonctionnalité avec Sinatra en s'appuyant sur [Rack Flash](http://nakajima.github.com/rack-flash/).

Tout ce qu'il y a à faire, c'est d'installer le gem :

```
C:\Ruby>gem install rack-flash
```

Puis ajouter les quelques lignes suivantes dans notre application
Sinatra :

```
require 'rack-flash'
use Rack::Flash
enable :sessions
```

(Rack Flash a besoin des sessions pour stocker le tableau hash et par défaut
elles sont désactivées dans Sinatra)

Pour utiliser le hash "flash", il suffit par exemple de définir le message
dans le handler de départ :

```
post '/notes/save' do
  flash[:notice] = "Votre fiche a été enregistrée"
  redirect '/'
end
```

Puis il faut afficher ce message dans la vue correspondant au handler pour
l'URL "/" :

```
<div id='flash' class='notice'>
  <%= flash[:notice] %>
</div>
```

Et maintenant, quand quelqu'un enregistre une note, il verra le message
"Votre fiche a été enregistrée" après avoir été redirigé sur la page index
"/".

Vous pouvez associer une clé au message flash pour faire la distinction
entre différents types de message, comme par exemple :

```
flash[:notice]
flash[:warning]
flash[:error]
```

Si vous souhaitez afficher le flash dans la requête en cours, vous devez
utiliser flash.now :

```
get '/' do flash.now:notice = "Pas de message" unless flash:notice end
```

Cela affichera un message indiquant qu'il n'y a pas de message stocké dans
le hash flash par la requête précédente.

Les messages restent dans le tableau hash tant qu'ils ne sont pas affichés,
comme vous pouvez le voir dans le code ci-dessous :

```
get '/un' do
  flash[:notice] = "Coucou !"
  flash[:error] = "erreur de type 1"
  flash[:warning] =  "Attention au chien"
  redirect '/deux' 
end

get '/deux' do
  flash[:error] = "erreur de type 2"
  redirect '/trois' 
end

get '/trois' do
  flash[:notice] = "Salut !"
  redirect '/' 
end

get '/' do
  erb :index
end
```

Lorsque nous atteindrons enfin l'URL "/" et que la vue "index" sera
affichée, on aura flash[:error] = "erreur de type 2", flash[:notice] = "Salut
!" et flash[:warning] sera toujours "Attention au chien".

Si vous ne voulez pas que les messages s'éternisent dans le hash flash
jusqu'à ce qu'ils soient utilisé, vous pouvez vous en débarrasser en utilisant
l'option "sweep" :

```
use Rack::Flash, :sweep => true
```

Grace à elle, le hash flash est nettoyé après chaque requête, que les
messages aient été affichés ou non. Dans l'exemple précédent, le seul élément
qui restera dans le hash sera flash[:notice] = "Salut !".

Et pour finir, un bout de code Erb prêt à insérer dans votre layout pour
afficher un message flash lorsqu'il en existe, en définissant une classe CSS
qui dépend du type de message :

```
<% flash.each do |key,msg| %>
  <div id='flash' class='<%= key %>'>
    <%= msg %>
  </div>
<% end %>
```

Ou si vous préférez le Haml :

```
- flash.each do |key,msg|
  #message{:class => key}= msg
```

Cela a pour effet de créer une balise &lt;div&gt; pour chaque message stocké
dans le hash flash, en utilisant sa clé comme nom de classe CSS.

En espérant que ça puisse vous servir : la plupart des applications
utilise cette technique, alors n'hésitez pas à l'essayer dans vos applications
Sinatra.
