---
date: 2010-09-29 22:45:00
layout: post
redirect_from: "post/2010/09/29/des-lapins-a-la-sauce-rest"
tags: ruby, sinatra
title: "Des lapins à la sauce REST"
---

{:.encart}
Ceci est la traduction du tutoriel Sinatra "[Restful Rabbits](http://ididitmyway.herokuapp.com/past/2010/9/21/restful_rabbits/)" de Darren Jones.

Dans ce billet, je vais explorer la façon de créer une ressource en
construisant une [architecture REST](http://fr.wikipedia.org/wiki/Representational_State_Transfer) et en utilisant Sinatra et DataMapper.

## Mais pour commencer, c'est quoi ce REST ?

REST signifie Representational State Transfer et a été présenté par [Roy Fielding](http://fr.wikipedia.org/wiki/Roy_Fielding) pour
sa thèse de doctorat en 2000. De façon sommaire, c'est un style d'architecture
qui permet d'accéder à des ressources (en général des objets stockés dans une
base de données) à partir d'URLs spécifiques. REST permet également d'utiliser
des URLs pour interagir avec ces ressources (pour les mettre à jour en
particulier). Par exemple, l'URL /people/michel/edit pourrait permettre de
modifier ma fiche personnelle. Et l'URL /people/michel/delete aurait pour effet
de supprimer ma fiche de la base de données.

Au cours de ce tutoriel, les ressources que je vais chercher à gérer seront
des lapins, mais vous pouvez l'adapter sans peine pour gérer n'importe quel
autre objet que vous stockez dans votre base de données. Toutes les données
seront enregistrées en base de données grâce à DataMapper et nous passerons par
des URLs spécifiques pour effectuer les actions CRUD sur chaque objet :
Création, Lecture, Modification et Suppression.

Avec REST, on emploie habituellement 7 gestionnaires d'URLs. Dans notre cas,
nous en définirons 8 pour avoir en plus un gestionnaire qui nous permettra de
demander confirmation avant d'effectuer une suppression. Tout cela correspond
grosso-modo aux actions CRUD d'une base de données.

Voici les gestionnaires et leurs URLs associées :

* List (/lapins) - une page d'index qui affiche toutes les ressources
* Show (/lapins/1) - une page qui affiche une ressource données
* New (/lapins/new) - un formulaire pour saisir une nouvelle ressource
* Create (/lapins) - création d'une nouvelle ressource (il n'y a pas de page
web pour cela)
* Edit (/lapins/edit/1) - un formulaire pour mettre à jour une ressource
existante
* Update (/lapins/1) - modification d'une ressource (il n'y a pas de page web
pour cela)
* Delete Confirmation (/lapins/delete/1) - une page demandant si on veut
réellement supprimer une ressource
* Delete (/lapins/1) - supprime la ressource donnée (il n'y a pas de page web
pour cela)

Vous avez sans doute remarqué qu'un certain nombre d'URLs sont identiques
(celles pour Show, Update et Delete). Ceci est possible parce qu'il existe 4
verbes HTTP : GET, POST, UPDATE et DELETE. Sinatra est capable de savoir
quel type de requête a été réalisée et d'employer l'action adéquate. Ainsi,
l'URL /lapins/1 affichera le lapin dont l'identifiant est 1 quand une requête
GET est effectuée, mais elle supprimera le lapin si c'est une requête DELETE
qui a été faite.

## Le code

Pour commencer, nous devons charger les librairies nécessaires. J'utilise en
particulier Haml pour les vues, mais ce ne devrait pas être compliqué
d'utiliser Erb ou un autre système de template :

```
require 'rubygems'
require 'sinatra'
require 'data_mapper'
require 'haml'
```

Puis nous définissons la base de données. Cette ligne de code teste s'il
existe une base de données paramétrée sur Heroku et si ce n'est pas le cas
utilise une base de données SQLite locale nommée lapins.db :

```
DataMapper.setup(:default, ENV['DATABASE_URL'] || "sqlite3://#{Dir.pwd}/lapins.db")
```

Nous devons ensuite créer la classe Lapin (ou tout autre classe
correspondant aux objets que vous souhaitez gérer). Le premier champ "id" est
très important : grâce à lui votre ressource a un identifiant numérique
auto-incrémenté qui permet de la référencer. Cela signifie que la base de
données va automatiquement se charger d'affecter un identifiant unique à chaque
ressource. Les autres propriétés de la classe Lapin sont "nom", "description",
"age" et "couleur". Et il y a également deux autres champs "created_at" et
"updated_at" que le plugin datamapper-timestamps va automatiquement mettre à
jour lorsque la ressource sera créée ou modifiée. DataMapper a également un
autre plugin très utile : datamapper-validations. Celui-ci contrôle
automatiquement si le nom est renseigné (parce qu'il est marqué "required") et
si l'âge est bien une valeur de type integer. Si cette validation échoue, la
ressource ne sera pas créée ou mise à jour et les erreurs seront signalées
(plus de détails dans la suite du tutoriel).

```
class Lapin
  include DataMapper::Resource
  property :id,           Serial
  property :nom,          String, :required => true
  property :description,  Text
  property :age,          Integer
  property :couleur,      String
  property :created_at,   DateTime
  property :updated_at,   DateTime
end
```

Nous allons maintenant créer les différents gestionnaires, en commençant par
celui pour la liste :

```
# List : affiche la liste des lapins
get '/lapins' do
  @lapins = Lapin.all
  haml :index
end
```

Le gestionnaire List correspond à l'URL "/lapins". Il commence par retrouver
toutes les ressources enregistrées dans la base de données pour les stocker
dans un tableau d'instance nommé @lapins. Ce tableau pourra ensuite être
utilisé dans la vue "index".

Nous créons ensuite le gestionnaire New :

```
# New : affiche le formulaire de création d'un lapin
get '/lapins/new' do
  @lapin = Lapin.new
  haml :new
end
```

Celui-ci correspond à l'URL "/lapins/new". Il crée un nouvel objet Lapin et
le stocke dans une variable d'instance @lapin dont le formulaire de saisie a
besoin. Puis il affiche le formulaire de saisie contenu dans la vue "new".

Le gestionnaire qui suit est Create. Outre le fait qu'il est un tout petit
plus compliqué, il n'existe pas non plus de vue associée à celui-ci :

```
# Create : création d'un nouveau lapin
post '/lapins' do
  @lapin = Lapin.new(params[:lapin])
  if @lapin.save
    status 201
    redirect '/lapins/' + @lapin.id.to_s
  else
    status 400
    haml :new
  end
end
```

La première chose à noter, c'est qu'il utilise la même URL que l'action
List, à savoir "/lapins". Ce qui fait la différence entre les deux, c'est que
ce gestionnaire est seulement invoqué lorsque la requête HTTP est de type POST,
ce qui est fort heureusement le cas lorsqu'un formulaire HTML est envoyé vers
le serveur.

La première chose que fait le gestionnaire Create, c'est de créer un nouvel
objet Lapin en utilisant les informations envoyées par le formulaire, celles-ci
étant conservées dans le hash params:lapin. Puis il vérifie si les valeurs
saisies sont correctes en tentant d'enregistrer l'objet @lapin. Si cela réussi,
il renvoie alors le statut HTTP 201 (qui signifie Created) et redirige le
navigateur vers le gestionnaire Show pour qu'il affiche la ressource qui vient
d'être créée. Quand il ne réussi pas à enregistrer l'objet @lapin, il renvoie
le statut 400 (Bad Request) et réaffiche la vue "new" pour que l'utilisateur
puisse corriger sa saisie et la re-soumettre.

Le gestionnaire suivant est Edit. L'URL associée à celui-ci est
"/lapins/edit/:id" où ":id" est une valeur entière qui fait référence à
l'identifiant d'un objet Lapin particulier. Cet identifiant est disponible dans
le hash params:id et on l'emploie dans la première ligne de code pour retrouver
le lapin correspondant dans la base de données puis stocker l'objet obtenu dans
la variable d'instance @lapin qui pourra ensuite être utilisée par la vue
"edit".

```
# Edit : affiche le formulaire de modification d'un lapin
get '/lapins/edit/:id' do
  @lapin = Lapin.get(params[:id])
  haml :edit
end
```

Lorsque l'utilisateur va valider sa saisie, les informations du formulaire
"edit" seront envoyées vers le gestionnaire Update présenté
ci-dessous :

```
# Update : modification d'un lapin existant
put '/lapins/:id' do
  @lapin = Lapin.get(params[:id])
  if @lapin.update(params[:lapin])
    status 201
    redirect '/lapins/' + params[:id]
  else
    status 400
    haml :edit
  end
end
```

Le code pour gérer la modification ressemble d'assez près à celui du
gestionnaire Create et là aussi il n'y a pas besoin d'avoir une vue associée.
La première chose qui est faite, c'est de retrouver le lapin dont l'identifiant
est passé avec l'URL pour le stocker dans la variable d'instance @lapin. Puis
on modifie (et on sauvegarde) cet objet en utilisant les informations du
formulaire. Si cela réussi, le navigateur est redirigé vers l'URL du
gestionnaire Show pour permettre à l'utilisateur de constater que la mise à
jour s'est correctement déroulée. Lorsque la mise à jour a échouée, la vue
"edit" est réaffichée pour lui permettre de corriger sa saisie.

Le gestionnaire suivant est celui destiné à confirmer la suppression d'une
ressource. Il va servir à afficher une page web dans laquelle on demande à
l'utilisateur s'il veut réellement supprimer le lapin ou pas.

```
# Confirm : confirmation de la suppression d'un lapin
get '/lapins/delete/:id' do
  @lapin = Lapin.get(params[:id])
  haml :delete
end
```

Dans le cas où l'utilisateur clique sur le bouton "Delete" depuis cette page
de confirmation, cela appelle le gestionnaire Delete :

```
# Delete : suppression d'un lapin
delete '/lapins/:id' do
  Lapin.get(params[:id]).destroy
  redirect '/lapins'
end
```

Vous pouvez voir que l'URL "/lapins/:id" associée au gestionnaire Delete est
la même que pour le gestionnaire Update. Mais dans ce cas , le formulaire de
confirmation de la suppression aura fait en sorte d'envoyer une requête de type
DELETE.

Le gestionnaire DELETE a besoin d'une seule ligne de code pour retrouver le
lapin dans la base de données (la partie `Lapin.get(params[:id])`)
et l'y supprimer (la partie `.destroy`). Puis il redirige le
navigateur vers le gestionnaire List grâce auquel l'utilisateur pourra
constater que le lapin a bien été supprimé.

Le gestionnaire Show est le dernier qui nous reste à prendre en compte et il
est lui aussi associé à l'URL "/lapins/:id". Il est impératif de le faire
apparaitre en dernier dans le code parce que Sinatra examine les routes dans
l'ordre où elles apparaissent dans le code source. Par conséquent, si le
gestionnaire Show avait été codé avant le gestionnaire Create dont l'URL est
"/lapin/new", Sinatra aurait considéré que "new" correspondait au paramètre
":id" et il aurait invoqué le gestionnaire Show qui aurait essayé de rechercher
dans la base de données un lapin dont l'identifiant serait "new", ce qui
n'existe bien évidemment pas.

```
# Show : affichage d'un lapin
get '/lapins/:id' do
  @lapin = Lapin.get(params[:id])
  haml :show
end
```

C'est un gestionnaire plutôt simple. Il retrouve le lapin avec le bon
identifiant et le stocke dans une variable d'instance @lapin qui pourra alors
âtre manipulée dans la vue "show" associée.

Et pour finir, juste avant la fin du source Ruby, il y a une ligne de code
destinée à DataMapper qui a pour effet de répercuter les modifications
apportées à votre base de données (comme par exemple l'ajout d'une propriété)
sans supprimer les données que celle-ci contient (on peut pas faire plus simple
comme système de migration de données).

```
DataMapper.auto_upgrade!

__END__
```

La ligne `__END__` indique qu'il s'agit de la fin du fichier, ou
plus précisément de la fin du code Ruby. Elle sera suivie par les vues
correspondant aux différents gestionnaires que nous avons codés auparavant.

Le template "layout" servira de squelette général pour toutes les vues et il
contient le code nécessaire pour afficher une page HTML 5. Toutes les autres
vues seront intégrées à l'endroit où apparait la ligne `=
yield` :

```
@@layout
!!! 5
%html
  %head
    %meta(charset="utf-8")
    %title Lapins
  %body
    = yield
```

La première vue est la page d'index qui nous sert à afficher tous les lapins
qui existent dans la base de données. Ceux-ci ont été stockés dans le tableau
d'instance @lapins par le gestionnaire List. Nous parcourons donc ce tableau
dans la vue pour générer une ligne pour chaque lapin, avec des liens pour
afficher, modifier ou supprimer celui-ci. Et nous avons aussi prévu un lien en
haut de la liste pour permettre d'ajouter un nouveau lapin :

```
@@index
%h3 Lapins
%a(href="/lapins/new")Créer un nouveau lapin
- unless @lapins.empty?
  %ul#lapins
  - @lapins.each do |lapin|
    %li{:id => "lapin-#{lapin.id}"}
      %a(href="/lapins/#{lapin.id}")= lapin.nom
      %a(href="/lapins/edit/#{lapin.id}") Modifier
      %a(href="/lapins/delete/#{lapin.id}") Supprimer
- else
  %p Pas de lapins !
```

La vue suivante sert pour afficher le détail d'un lapin donné, à partir de
la variable d'instance @lapin initialisée par le gestionnaire Show. Chaque
ligne de cette vue présente une des propriété de l'objet Lapin. Et pour finir,
nous avons un lien qui permet de modifier le lapin, un autre pour le supprimer
et un pour revenir à la liste des lapins :

```
@@show
%h3= @lapin.nom
%p Couleur : #{@lapin.couleur}
%p Age : #{@lapin.age}
%p Description : #{@lapin.description}
%p Crée le : #{@lapin.created_at}
%p Mis à jour le : #{@lapin.updated_at}
%a(href="/lapins/edit/#{@lapin.id}") Modifier
%a(href="/lapins/delete/#{@lapin.id}") Supprimer
%a(href='/lapins') Retour à l'index
```

Les deux vues suivantes sont très similaires. La première correspond à la
page qui est renvoyée pour ajouter un nouveau lapin et la seconde celle qui
sert pour modifier un lapin existant.

Ces deux pages commencent par afficher une vue partielle "errors" qui sert
dans le cas où des erreurs se seraient produites suite à un premier envoi du
formulaire avec des données incorrectes.

Le formulaire dans la vue "new" utilise une méthode HTTP POST et celui de la
vue "edit" une méthode HTTP PUT afin d'utiliser le verbe HTTP adéquat pour
viser le bon gestionnaire. Etant donné que les navigateurs ne savent pas
envoyer une requête PUT, on triche en envoyant une requête POST (ce que savent
faire les navigateurs) accompagnée d'un champ caché nommé "_method" ayant la
valeur "PUT". Sinatra est alors assez conciliant pour considérer cela comme une
vraie requête PUT.

Après le type de requête, ces deux vues affichent la vue partielle "form"
qui va contenir le code complet du formulaire servant à saisir la fiche d'un
lapin. Il est plus pratique de gérer ça dans une vue partielle à part plutôt
que de répéter le même code dans les deux vues "new" et "edit", notamment dans
le cas où le formulaire devrait évoluer.

```
@@new
= haml :errors, :layout => false
%form(action="/lapins" method="POST")
  %fieldset
    %legend Créer un nouveau lapin
    = haml :form, :layout => false
  %p
    %input(type="submit" value="Créer")
    ou <a href='/lapins'>Annuler</a>

@@edit
= haml :errors, :layout => false
%form(action="/lapins/#{@lapin.id}" method="POST")
  %input(type="hidden" name="_method" value="PUT")
  %fieldset
    %legend Modifier ce lapin
    = haml :form, :layout => false
  %p
    %input(type="submit" value="Modifier")
    ou <a href='/lapins'>Annuler</a>
```

Voici maintenant le code pour le formulaire "form". Il contient les champs
de saisie nécessaire pour chaque propriété de l'objet Lapin. Et comme il est
affiché depuis les vues "new" et "edit", toute modification que l'on y ferait
serait alors visibles dans ces deux vues :

```
@@form
%label(for="nom")Nom :
%input#nom(type="text" name="lapin[nom]"value="#{@lapin.nom}")

%p
%label(for="couleur")Couleur :
%select#quantity(name="lapin[couleur]")
  - %w[noir blanc gris marron].each do |couleur|
    %option{:value => couleur, :selected => (true if couleur == @lapin.couleur)}= couleur

%p
%label(for="description") Description :
%textarea#description(name="lapin[description]")
  =@lapin.description

%p
%label(for="quantity") Age :
%input#age(type="text" name="lapin[age]" value="#{@lapin.age}")
```

Après cela nous avons la vue "errors" qui sera affichée seulement dans le
cas où DataMapper renvoie des erreurs de validation (par exemple si l'âge saisi
n'est pas un entier). Son rôle est d'afficher la liste des erreurs rencontrées
afin de guider l'utilisateur pour qu'il puisse corriger sa saisie :

```
@@errors
-if @lapin.errors.any?
  %ul#errors
  -@lapin.errors.each do |error|
    %li= error
```

La dernière vue affiche la page pour confirmer la suppression d'un lapin.
Elle affiche seulement le nom du lapin et demande à l'utilisateur s'il est
certain de vouloir réellement supprimer ce lapin. Si c'est le cas, on utilise
un formulaire pour atteindre le gestionnaire Delete. Comme dans le cas du PUT
destiné au gestionnaire Update, on utilise le champ caché "_method" avec une
valeur "DELETE" pour simuler une requête HTTP DELETE qu'aucun navigateur ne
sait gérer de façon native.

```
@@delete
%h3 Souhaitez-vous réellement supprimer #{@lapin.nom} ?
%form(action="/lapins/#{@lapin.id}" method="post")
  %input(type="hidden" name="_method" value="DELETE")
  %input(type="submit" value="Supprimer")
  ou <a href='/lapins'>Annuler</a>
```

## Conclusion

Ca y est, c'est fait. Vous avez maintenant un parfait exemple de la façon de
gérer des ressources à la sauce REST et vous pouvez voir ce que donne la
version originale développée par Darren (<http://rabbits.herokuapp.com/rabbits>) ou ma version francisée
(<http://lapins.herokuapp.com/lapins>).

Etant donné que ce coup-ci j'ai également complètement traduit l'application
développée, j'ai aussi cherché si le plugin datamapper-validations pouvait
renvoyer des messages d'erreurs en français. Mais comme je n'ai pas trouvé
comment faire, je suis passé par des messages d'erreurs
personnalisés :

```
class Lapin
  include DataMapper::Resource
  property :id,           Serial
  property :nom,          String, :required => true, :messages => { :presence => "Le nom est obligatoire" }
  property :description,  Text
  property :age,          Integer, :message => "L'age doit etre un nombre sans virgule"
  property :couleur,      String
  property :created_at,   DateTime
  property :updated_at,   DateTime
end
```

Je ne suis pas certains que ce soit la bonne solution mais ça marche, même
si je n'ai pas réussi à mettre les circonflexes dans le second message sans
provoquer d'erreur.
