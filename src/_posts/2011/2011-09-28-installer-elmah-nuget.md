---
date: 2011-09-28 20:39:00
layout: post
redirect_from: "post/2011/09/28/installer-elmah-avec-nuget"
tags: .net
title: "Installer ELMAH avec NuGet"
---

Jusqu'à présent, j'ai un peu tendance à utiliser [NuGet](http://nuget.org/) uniquement pour mettre à jour Entity Framework, jQuery
et consorts et dans mes très grands jours pour voir ce que donne un package de
ci de là.

Après avoir terminé le chapitre de [Professional ASP.NET MVC 3](http://www.amazon.fr/gp/product/1118076583/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;tag=07arde-21&amp;linkCode=as2&amp;camp=1642&amp;creative=6746&amp;creativeASIN=1118076583) consacré à NuGet, je me lance et
j'en profite pour installer [ELMAH](http://code.google.com/p/elmah/). C'est l'exemple donné dans le livre et c'est un outil que
j'avais déjà essayé d'utiliser du temps de mes WebForms puis de MVC 1.0 mais
que j'avais chaque fois laissé tombé par manque de temps.

Je vais éviter la console pour l'instant et faire l'installation par un
clic-droit sur la branche "Références" de mon projet puis en sélectionnant
l'option "Manage NuGet Packages...".

![](/public/2011/elmah01.png)

Note : cette option est également disponible quand on
fait un clic droit sur la solution ou le nom du projet, mais dans ce cas elle
plus difficile à repérer étant donné le plus grand nombre d'options
proposées.

Il apparait alors la fenêtre "Manage NuGet Packages" qui liste par défaut
tous les packages du monde en commençant par les plus téléchargés. Une fois là,
le plus simple est d'utiliser la zone de recherche en haut à droite et d'y
taper "elmah" pour n'afficher que les packages appropriés. Malgré tout, il
reste encore une quinzaine de packages dans la liste !

![](/public/2011/elmah02.png)

En cliquant sur un package, la colonne de droite est mise à jour et affiche
tout un tas d'informations sur le package, avec entre autre sa version, sa
description et ses dépendances. Comme rien n'est précisé dans le livre,
j'installe le premier résultat obtenu (et donc le plus téléchargé), à savoir
"ELMAH" (tout court) en cliquant sur le bouton "Install" qui apparait
opportunément lorsque la souris le survole. Et c'est parti !

![](/public/2011/elmah03.png)

Note : si j'avais accédé à la fenêtre "Manage NuGet
Packages" par un clic-droit sur la solution, j'aurai eu droit à un préliminaire
me demandant d'indiquer pour quels projet je souhaitais installer le
package :

![](/public/2011/elmah04.png)

Une fois que l'installation (très rapide) est terminée, la fenêtre "Manage
NuGet Packages" est rafraichie et je peux constater par une coche verte que le
package "ELMAH" est désormais installé, ainsi que le package "ELMAH Core
Library (no config)" dont il dépend.

Je peux alors fermer NuGet en cliquant sur le bouton "Close" en bas à gauche
et constater que la librairie "Elmah" est maintenant référencée dans mon
projet.

![](/public/2011/elmah05.png)

Et ce n'est pas tout ! Le fichier Web.config a été modifié pour
incorporer tous les paramètres nécessaires au bon fonctionnement de Elmah

```
...
<configuration>
  <configSections>
    <sectionGroup name="elmah">
      <section name="security" requirePermission="false" type="Elmah.SecuritySectionHandler, Elmah" />
      <section name="errorLog" requirePermission="false" type="Elmah.ErrorLogSectionHandler, Elmah" />
      <section name="errorMail" requirePermission="false" type="Elmah.ErrorMailSectionHandler, Elmah" />
      <section name="errorFilter" requirePermission="false" type="Elmah.ErrorFilterSectionHandler, Elmah" />
    </sectionGroup>
...
    <httpModules>
      <add name="ErrorLog" type="Elmah.ErrorLogModule, Elmah" />
      <add name="ErrorMail" type="Elmah.ErrorMailModule, Elmah" />
      <add name="ErrorFilter" type="Elmah.ErrorFilterModule, Elmah" />
    </httpModules>
    <httpHandlers>
      <add verb="POST,GET,HEAD" path="elmah.axd" type="Elmah.ErrorLogPageFactory, Elmah" />
    </httpHandlers>
  </system.web>
...
  <system.webServer>
    <modules runAllManagedModulesForAllRequests="true">
      <add name="ErrorLog" type="Elmah.ErrorLogModule, Elmah" preCondition="managedHandler" />
      <add name="ErrorMail" type="Elmah.ErrorMailModule, Elmah" preCondition="managedHandler" />
      <add name="ErrorFilter" type="Elmah.ErrorFilterModule, Elmah" preCondition="managedHandler" />
    </modules>
    <handlers>
      <add name="Elmah" path="elmah.axd" verb="POST,GET,HEAD" type="Elmah.ErrorLogPageFactory, Elmah" preCondition="integratedMode" />
    </handlers>
  </system.webServer>
```

Je peux alors lancer l'application et me rendre à l'URL /elmah.axd pour
constater que tout fonctionne sans encombre :

![](/public/2011/elmah06.png)

Il ne me reste plus qu'à provoquer quelques erreurs :

* accéder à un fichier /readme.txt inexistant
* tester une route /Foo/Bar/1 qui n'existe pas

Puis retourner à l'adresse /elmah.axd pour m'assurer que ces deux erreurs
ont bien été prises en compte :

![](/public/2011/elmah07.png)

C'est déjà pas mal pour un début.

Il faut juste que je revois un peu la configuration pour que tout ça soit
géré de façon plus pérenne et ne plus avoir "`This log is provided by the
In-Memory Error Log`". Et aussi voir comment faire pour recevoir
automatiquement un mél d'Elmah quand un problème survient.
