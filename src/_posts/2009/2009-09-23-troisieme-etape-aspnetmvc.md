---
date: 2009-09-23 19:25:00
layout: post
redirect_from: "post/2009/09/23/Troisi%C3%A8me-%C3%A9tape-avec-ASP.NET-MVC"
tags: mvc
title: "Troisième étape avec ASP.NET MVC"
---

Ces derniers temps, j'ai eu du mal à avancer sur dans le tutoriel NerdDinner
où je patine un peu sur la partie intitulée "[Building the model](http://nerddinnerbook.s3.amazonaws.com/Part3.htm "How to build a model with business rule validations")".
Celle-ci est consacré à la partie "Model" du triptyque Model-View-Controller.
Au début, c'est plutôt simple : on utilise LINQ To SQL pour créer
automatiquement des classes de données basées sur les tables de la base de
données. Puis ça commence à se compliquer quand on fait intervenir le pattern
Repository et encore un peu plus avec le pattern de validation.

Pour essayer de bien assimiler ces techniques, j'ai retravaillé une ou deux
fois sur cette partie. Et pour mettre plus de chances de mon côté, j'ai décidé
de faire un petit détours par le tutoriel [Building a
Contact Management ASP.NET MVC Application](http://www.asp.net/learn/mvc/tutorial-26-cs.aspx). Par rapport au NerdDinner, son
avantage est qu'il en existe une version française : [Développement d'une application de gestion de contacts avec ASP.NET
MVC](http://msdn.microsoft.com/fr-fr/asp.net/dd627541.aspx). C'est quand même plus pratique pour faciliter la compréhension de
nouveaux concepts.

La fil rouge de ce tutoriel, c'est de construire une petite application pour
gérer un carnet d'adresses tout simple, avec nom, prénom, numéro de téléphone
et adresse mél.

* La [première étape](http://msdn.microsoft.com/fr-fr/asp.net/dd627564.aspx "Création de l'application") est plutôt
copieuse puisqu'elle consiste à créer une première version assez complète de
l'application qui permette la consultation, l'ajout, la modification et la
suppression de contacts. Le but de cette première partie est de nous montrer
que c'est quand même vachement rapide de faire une application avec ASP.NET
MVC. Et c'est aussi un bon support pour introduire les notions qui seront
abordées dans les 6 étapes suivantes.
* La [deuxième étape](http://msdn.microsoft.com/fr-fr/asp.net/dd632961.aspx "Rendre l'application plus attrayante")
est plus tranquille. Elle nous montre combien il est facile de modifier la
charte graphique d'une application en ASP.NET MVC, soit en utilisant une charte
graphique toute faite de la [Design Gallery](http://www.ASP.net/mvc/gallery) de Microsoft, soit en créant sa propre charte
graphique. Et c'est vrai que c'est quand même mieux foutu que pour styler le
code généré par les contrôles WebForms et sans parler de leurs satanés fichiers
skin !
* Dans la [troisième
étape](http://msdn.microsoft.com/fr-fr/asp.net/dd632974.aspx "Ajout de la validation de formulaires"), on ajoute des règles de validation aux formulaires. Là encore, c'est
quelque chose d'assez simple : on ajoute une procédure pour tester l'objet
saisi et les méthodes Html.ValidationSummary() et Html.ValidationMessage() se
chargent automatiquement du reste. Dans le tutoriel NerdDinner, comme c'est
beaucoup plus axé sur le pattern de validation, j'étais un peu passé à côté de
la la simplicité fondamentale du système.
* Et puis arrive la [quatrième étape](http://msdn.microsoft.com/fr-fr/asp.net/dd823275.aspx "Rendre l'application faiblement couplée") où cela commence
à se corser. L'objectif de cette partie est de passer d'un code écrit un peu à
la va-vite à un code qui soit plus digne d'une application professionnelle,
afin qu'elle soit plus facilement modifiable et maintenable. Et comme dans la
4° partie du NerdDinner, j'y retrouve les modèles de conception et notamment le
pattern Repository.

Le fait que ce coup-ci cela soit en français, ça aide, mais ça ne fait pas
tout. J'ai du m'accrocher pour réussir à tout ingurgiter et finir par maitriser
comment tout ça s'articule. Pour y parvenir, j'ai finalement ré-écrit toute
cette partie à ma façon.

Pour cela, j'ai essayé de plus insister sur les modifications apportées au
fur et à mesure au code de départ, pour bien faire ressortir les évolutions
apportées à la classe contrôleur :

* utilisation du pattern "Repository" pour sortir le code d'accès aux données
du contrôleur,
* création d'une couche de "Service" pour gérer la validation et interagir
avec le repository,
* mise en oeuvre de "l'injection de dépendance" pour que l'application soit
faiblement couplée,
* utilisation du pattern "Decoration" pour que la couche de service ne soit
pas liée à ASP.NET MVC.

Pour ceux que cela intéresse, voici ma version de l'étape 4 pour [rendre
l'application de Gestion de contacts faiblement couplée](/public/2009/mvc-gestion-contacts-etape4.pdf).

Il me semble avoir assez bien compris comment ça marche et les avantages que
cela peut apporter, même si je reste un peu dubitatif devant l'empilement de
couches que cela implique. Pour l'instant, je suis donc raisonnablement
convaincu mais pas encore totalement enthousiasmé.

En attendant, j'ai maintenant l'embarras du choix pour continuer mon
apprentissage d'ASP.NET MVC : soit je refait un passage par NerdDinner,
soit je poursuis avec la [cinquième étape](http://msdn.microsoft.com/fr-fr/asp.net/dd876824.aspx "Créer des tests unitaires") en français de Contact
Management...

---
Billet suivant dans la série : [ASP.NET MVC et les tests unitaires]({% post_url 2009-09-28-aspnetmvc-tests-unitaires %})
