---
date: 2011-05-04 19:06:00
layout: post
redirect_from: "post/2011/05/04/erreurs-404-et-autres-avec-sinatra"
tags: ruby, sinatra
title: "Erreurs 404 et autres avec Sinatra"
---

{:.encart}
Ceci est la traduction du tutoriel "[404 and other Errors in Sinatra](http://ididitmyway.herokuapp.com/past/2010/11/16/404_and_other_errors_in_sinatra/)" de Darren Jones.

Un truc super bien quand on débute avec Sinatra c'est sa page
d'erreur :

![Erreur 404](/public/2011/reverse-2.png)

Les applications web ont toutes besoin d'afficher des pages d'erreurs et
c'est quelque chose de très simple à faire avec Sinatra.

## Les erreurs 404

Elles se produisent lorsque l'URL appelée ne peut pas être trouvée. On peut
gérer cette erreur à l'aide du code Ruby suivant :

```
not_found do
  "Votre page n'a pas pu être trouvée"
end
```

Cela affichera tout simplement le message "Votre page n'a pas pu être
trouvée". On peut tout de même avoir quelque chose d'un peu plus sophistiqué et
employer une vue "not_found.erb" qui aura l'avantage d'être rendue avec le
"layout.erb" habituel.

```
not_found do
  erb :not_found
end
```

On peut même faire tenir ça sur une seule ligne :

```
not_found { erb :not_found }
```

Si vous préférez appeler votre fichier "404.erb" au lieu de "not_found.erb",
vous devrez simplement le mettre entre apostrophe étant donné que les symboles
ne peuvent pas commencer par un chiffre :

```
not_found do
  erb :'404'
end
```

## Les erreurs 500

Ces erreurs surviennent en cas d'erreur interne du serveur, généralement
lorsque quelque chose a planté dans l'application. Le code suivant sert pour
gérer ce genre d'erreur :

```
error do
  @error = request.env['sinatra_error']
  haml :'500'
end
```

Ce code initialise une variable d'instance nommée `@error` qu'il
sera possible d'utiliser dans la vue pour détailler l'erreur à l'aide des
méthodes `@error.name` et `@error.message`.

Il est aussi possible de créer des erreurs personnalisées en utilisant le
code suivant :

```
error BigError do
   "BOUM ! Il y a eu un gros souci ! " + request.env['sinatra.error'].message
end
```

On peut alors renvoyer cette erreur avec un message adéquat :

```
get '/' do
  raise BigError, 'Est-ce que vous aviez convenablement fermé toutes vos accolades ?'
end
```

L'accès à l'URL "/" provoquera alors l'affichage du message
suivant :

```
BOUM ! Il y a eu un gros souci ! Est-ce que vous aviez convenablement fermé toutes vos accolades ?
```

Selon moi, il est important de gérer les erreurs dès le tout début du
projet. Pour cela, je colle généralement les deux lignes suivantes au début de
mon fichier :

```
not_found { haml :'404' }
error { @error = request.env['sinatra_error'] ; haml :'500' }
```
