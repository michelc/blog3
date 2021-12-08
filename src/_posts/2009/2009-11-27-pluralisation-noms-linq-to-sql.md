---
date: 2009-11-27 10:06:00
layout: post
redirect_from: "post/2009/11/27/Pluralisation-noms-LINQ-to-SQL"
tags: linq, mvc, sql
title: "Pluralisation des noms avec LINQ to SQL"
---

J'avais [commencé le tutoriel NerdDinner]({% post_url 2009-07-17-premier-essai-aspnet-mvc %}) sur mon ancien PC, en utilisant Web
Developer 2008 Express en anglais. Depuis mon changement de machine, je suis
passé à Visual Studio 2008 Professional mais en français.

Etant donné que j'avais dû utiliser NUnit et pas MSTest et qu'en plus ça
faisait un bon moment que je n'avais rien fait dessus, j'ai préféré tout
recommencer à zéro sous VS 2008 Professional. Avec comme avantage
supplémentaire de m'encourager à travailler sur la traduction du tutoriel.

Ca avançait plutôt bien jusqu'au moment d'arriver à la [quatrième étape](/nerddinner/construire-modele/) et d'avoir à utiliser LINQ to SQL pour créer le modèle
de données basé sur la base de données NerdDinner.mdf. Une fois que j'avais
glissé-déposé les tables Dinners et RSVP dans le concepteur LINQ to SQL, je ne
me retrouvais pas avec les classes Dinner et RSVP comme prévu.

Du coté de la classe RSVP, pas de problème. Par contre, pour générer le nom
de la classe correspondant à la table Dinners, LINQ to SQL avait conservé le
nom exact de la table, soit "Dinner**s**" (avec un "s" à la fin)
alors que le tutoriel insistait bien sur le fait qu'il était censé mettre ce
nom au singulier, à savoir "Dinner" (sans "s" à la fin).

J'ai fini par trouver d'où venait le problème. C'est tout simplement parce
que les Visual Studio en anglais sont configurés par défaut pour gérer la
"pluralisation" lors du mapping relationnel alors que les Visual Studio
exotiques sont configurés pour ne pas l'employer.

Il faut donc d'activer manuellement la pluralisation des noms nous même pour
que tout fonctionne comme expliqué dans le tutoriel. Pour cela il suffit de
sélectionner les options suivantes :

* Outils
* Options
* Outils de base de données
* O/R Designer
* El là mettre l'option "Activé" à true

Ce qui donne en image :

[![pluralisation.png](/public/2009/pluralisation.png)](/public/2009/pluralisation.png "pluralisation.png, nov. 2009")
