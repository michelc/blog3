---
date: 2009-07-30 16:24:00
layout: post
redirect_from: "post/2009/07/30/Seconds-pas-avec-ASPNET-MVC-et-NerdDinner"
tags: mvc
title: "Seconds pas avec ASP.NET MVC et NerdDinner"
---

La fois d'avant, j'avais seulement fait la toute [première étape du
tutoriel NerdDinner]({% post_url 2009-07-17-premier-essai-aspnet-mvc %}) de Scott Guthrie, à savoir :

* créer le projet NerdDinner,
* vérifier qu'il fonctionnait bien comme prévu,
* exécuter les tests unitaires avec NUnit.

Ce coup-ci, je me suis attaqué aux deux parties suivantes qui concernent la
base de données :

* Creating the Database
* Building the Model

La création de la base de données s'est très bien passée. Le seul truc à
noter c'est que la fenêtre "Server Explorer" s'appelle en fait "Database
Explorer" sous VWD. Pour la création des tables, pas de problème non plus, si
ce n'est que c'est un peu fastidieux. Je me demande si écrire un bête script
SQL ne serait pas tout aussi pratique... En tout cas, pour l'ajout des données,
ils auraient quand même pu donner un script tout prêt pour éviter d'avoir à
tout ressaisir !

En ce qui concerne la réalisation du modèle, pas de problème non plus :
bien que je sois sous VWD, tout se passe exactement comme décrit dans le
tutoriel. Pour essayer de refaire les premiers essais d'intellisense tels
qu'ils apparaissent dans le tutoriel, le plus simple est de se placer dans le
source HomeController.cs après lui avoir ajouté la ligne "`using
NerdDinner.Models;`" .

Pour le reste de la partie "Building the Model", je suis allé jusqu'au bout
et j'ai tapé moi-même tout le code source proposé (à part les expressions
régulières). Pour l'instant, je n'ai pas forcément tout assimilé en ce qui
concerne LINQ to SQL et le pattern "Repository", mais c'est déjà ça de
pris...

Et pour finir, j'ai décidé d'installer "SQL Server Management Studio". Après
bien des péripéties, ça a enfin (et assez inexplicablement) réussi. Ca m'a
permis de générer le script pour créer les deux tables Dinners et RSVP et pour
initialiser leur contenu avec quelques données de tests.

---
Billet suivant dans la série : [Troisième étape avec ASP.NET MVC]({% post_url 2009-09-23-troisieme-etape-aspnetmvc %})
