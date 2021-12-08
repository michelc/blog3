---
date: 2011-03-09 18:53:00
layout: post
redirect_from: "post/2011/03/09/introduction-a-haml"
tags: ruby
title: "Introduction à Haml"
---

J'aime bien les vidéos de Screencasts.org, surtout leur côté 5/10 minutes
vite fait pour aborder (ou réviser) un sujet. Après l'[introduction à Sinatra]({% post_url 2011-03-08-introduction-sinatra %}), j'ai donc décidé de suivre l'[introduction à Haml](http://screencasts.org/episodes/introduction-to-haml). [Haml](http://haml-lang.com/) (qui se prononce AMeul, comme dans meule) est un langage de
template très concis destiné à remplacer HTML dans les applications Rails ou
Sinatra.

Cette fois-ci, la vidéo est accompagnée de sa retranscription complète ce
qui rend son visionnage encore plus facile.

Après 10 secondes de publicité, on enchaine sur un rappel de la dure
condition des développeurs en quête de beauté et de simplicité dans un monde
d'IE6, SOAP et autre Dreamweaver.

On rentre ensuite dans le vif du sujet en démarrant avec un petit morceau de
code HTML (beurk beurk beurk) tel qu'on en voit souvent :

```
<div id="profile">
  <div class="left column">
    <div id="date"> 11 November 2010 </div>
    <div id="address"> 1 Infinite Loop </div>
  </div>
  <div class="right column">
    <div id="email"> steve@apple.com </div>
    <div id="bio"> Makes magical tablets </div>
  </div>
</div>
```

Puis, à partir de ce truc, on nous retrace par petites touches successives
la genèse de Haml (miam miam miam) :

```
#profile
  .left.column
    #date 11 November 2010
    #address 1 Infinite Loop
  .right.column
    #email steve@apple.com
    #bio Makes magical tablets
```

Pour bien enfoncer le clou, on fait aussi le parallèle entre le template Erb
correspondant (ouuh !) :

```
<div id="profile">
  <div class="left column">
    <div id="date"><%= print_date %></div>
    <div id="address"><%= user.address %></div>
  </div>
  <div class="right column">
    <div id="email"><%= user.email %></div>
    <div id="bio"><%= user.bio %></div>
  </div>
</div>
```

Et l'équivalent sous Haml (ouah !) :

```
#profile
  .left.column
    #date= print_date
    #address= user.address
  .right.column
    #email= user.email
    #bio= user.bio
```

Viennent ensuite quelques explications sur la syntaxe :

* !!! pour déclarer du doctype
* %element pour définir un élément (%html pour la balise &lt;html ...&gt;, %p
pour la balise &lt;p&gt;...)
* %element#id pour définir un identifiant
* %element.class pour définir une classe
* possibilité d'omettre %div qui est la balise par défaut
* ajouter des attributs sous la forme (attribut="valeur")
* importance de l'indentation pour imbriquer les balises

Le tutoriel se termine par l'installation d'Haml (`gem install
haml`), un exemple d'utilisation en ligne de commande et un lien pour
[tester Haml en
ligne](http://haml-lang.com/try.html).

Pour l'instant, je suis dubitatif et je me demande si c'est une vrai bonne
idée de masquer autant que ça HTML ?

Juste pour référence, voilà ce que l'exemple de code donnerait avec [Razor](http://haacked.com/archive/2011/01/06/razor-syntax-quick-reference.aspx) où on reste plus calqué sur le code HTML :

```
<div id="profile">
  <div class="left column">
    <div id="date">@Me.print_date()</div>
    <div id="address">@user.address</div>
  </div>
  <div class="right column">
    <div id="email">@user.email</div>
    <div id="bio">@user.bio</div>
  </div>
</div>
```

Malgré tout (pour s'entrainer en attendant de suivre l'[introduction à Sass](http://screencasts.org/episodes/introduction-to-sass)) le site [Html2Haml](http://html2haml.heroku.com/) permet de convertir du code HTML en Haml et un
[tutoriel en français sur Haml](http://thomas-brian.developpez.com/articles/haml/).
