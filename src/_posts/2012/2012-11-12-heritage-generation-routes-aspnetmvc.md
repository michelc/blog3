---
date: 2012-11-12 19:04:00
layout: post
redirect_from: "post/2012/11/12/heritage-generation-routes-asp-net-mvc"
tags: mvc
title: "Héritage en génération des routes ASP.NET MVC"
---

## Quand ça marche

J'ai développé une petite application ASP.NET MVC pour gérer des "brochures"
de voyages. Chaque brochure est constitué d'un ensemble de voyages et chaque
voyage se décompose en plusieurs sections (en quelque sorte des étapes).

Habituellement, dans les exemples basiques pour ASP.NET MVC, les routes sont
sous la forme {controller}/{action}/{id} où le paramètre "id" correspond à
l'élément à traiter. On a donc :

* /brochures/edit/12 => action pour modifier la brochure n° 12
* /voyages/delete/34 => action pour suppression du voyage n° 34
* /sections/edit/56 => action pour modifier la section n° 56

Dans mon cas, j'avais besoin d'avoir en permanence l'identifiant de la
brochure dans l'URL pour pouvoir afficher facilement son titre dans l'en-tête
des pages. Ca aurait pu donner quelque chose dans ce genre :

* /brochures/edit/12
* /voyages/delete/34?brochure_id=12
* /sections/edit/56?brochure_id=12

Plutôt que de me trimbaler et de gérer cet identifiant en QueryString,
j'avais eu la super idée d'en faire un élément de la route en re-définissant la
route par défaut :

```
routes.MapRouteLowercase(
  "Default",
  "{root_id}/{controller}/{action}/{id}",
  new {
    root_id = "0",
    controller = "Home",
    action = "Index",
    id = UrlParameter.Optional
  }
);
```

De cette façon, une fois que j'avais sélectionné une brochure, mes routes
étaient de la forme :

* /12/brochures/edit/12
* /12/voyages/delete/34
* /12/sections/edit/56

Ce qui est vraiment pratique, c'est que ça n'a quasiment rien changé à mon
code. J'ai pu continuer à générer mes liens à coups de
`@Html.ActionLink()` sans avoir à y indiquer à chaque fois la valeur
pour "root_id". En effet, le système de génération des URLs de ASP.NET MVC est
suffisamment bien foutu pour gérer le cas où un élément de la route n'est pas
défini.

Dans ce cas, il regarde si cet élément existe dans l'URL de la page en cours
et si c'est le cas, `@Html.ActionLink()` ré-utilise cette valeur
pour générer la nouvelle route.

Et en fait, je viens de m'apercevoir tout récemment que c'est encore plus
sophistiqué que ça !

## Quand ça ne marche pas

Dans un autre projet, j'ai encore eu besoin de faire suivre une valeur tout
au long des différentes actions liées à une série de traitements. Dans ce cas,
il s'agissait de mémoriser d'où provenait l'utilisateur pour pouvoir l'y
reconduire à la fin de la série de traitements. Comme c'était une valeur plus
"accessoire" que le numéro de brochure, j'ai préféré la faire apparaître à la
fin de la route :

```
routes.MapRoute(
  "Sirens",
  "Sirens/{action}/{source_id}/{id}",
  new { controller = "Sirens", action = "Index", source_id = 0, id = "" }
);
```

Et à ma grande déception, mon paramètre "source_id" n'était pas repris d'URL
en URL mais initialisé à chaque fois à zéro ! Au début, j'ai opportunément
accusé l'utilisation de helpers `@Html.ActionLink()` fortement typés
au lieu de la version standard à base de "chaînes magiques". Bien tenté, mais
c'était pas ça...

Puis j'ai constaté un truc vraiment paradoxal : ça marchait dans
certains cas mais pas tous les cas (la définition du bug en quelque sorte).

Depuis la vue Details, les URLs qui pointaient vers l'action Details pour un
autre numéro de Siren fonctionnaient, mais pas celles qui pointaient vers
l'action Edit pour le numéro Siren en cours...

Par exemple, depuis la fiche du Siren 732829320 (URL
/Sirens/Details/99/732829320), j'obtenais les URLs :

* /Sirens/Details/99/123456789 : ok
* /Sirens/Details/99/111111111 : ok
* /Sirens/Edit/0/732829320 : ko

En creusant, j'ai compris d'où venait le problème. En fait, le système de
génération d'URLs ne se contente pas de recopier bêtement un élément manquant
depuis l'URL courante. Il faut que cet élément fasse en quelque sorte parti de
la "route" en cours.

Depuis la route "/ Sirens / Details / 99 / 732829320", quand on veut
afficher un autre Siren, on reste en quelque sorte dans le même chemin :
"*/ Sirens / Details / 99* **/ 111111111**" => le
paramètre "source_id" est hérité depuis l'URL courante.

Par contre, pour modifier la fiche du Siren en cours, on bifurque dès la
sortie du contrôleur : "*/ Sirens* **/ Edit ...**".
Comme on a changé d'itinéraire, le paramètre "source_id" est ré-initialisé à
zéro.

Mise à jour : j'ai trouvé l'explication de ce
comportement dans le chapitre 9 de Professional ASP.NET MVC consacré au
routing :

> The *ambient values* are the current values for those parameters
> within the `RouteData` for the current request.

Par conséquent, la solution est toute simple. Il suffit de placer le
paramètre suffisamment tôt dans la route pour qu'il n'y ait pas besoin de
sortir de la route en cours tout au long des traitements :

```
routes.MapRoute(
  "Sirens",
  "Sirens/{source_id}/{action}/{id}",
  new { controller = "Sirens", action = "Index", source_id = 0, id = "" }
);
```
