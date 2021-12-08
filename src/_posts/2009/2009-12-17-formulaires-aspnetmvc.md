---
date: 2009-12-17 11:11:00
layout: post
redirect_from: "post/2009/12/17/Formulaires-ASP-NET-MVC"
tags: mvc
title: "Les formulaires en ASP.NET MVC"
---

La mise en ligne de la traduction de la 6° partie du tutoriel NerdDinner est
enfin terminée. Cette étape est consacrée à la [programmation des différents formulaires
MVC](/nerddinner/formulaires-crud/ "Les formulaires en ASP.NET MVC") nécessaires pour pouvoir effectuer la mise à jour de la table Dinners
dans la base de données : création, modification et suppression.

Dans cette plutôt longue partie, le tutoriel présente entre autre :

* certains des helpers disponibles pour faciliter le développement de
formulaires
* l'avantage de ces helpers pour prendre en compte les erreurs de validation
du ModelState
* la façon d'organiser chaque action avec une première requête HTTP GET pour
afficher le formulaire de saisie et une seconde requête HTTP POST pour
effectuer la mise à jour correspondant à l'action
* les principales méthodes offertes par ASP.NET MVC pour récupérer les
données du formulaire via le "[Model Binding](http://msdn.microsoft.com/en-us/library/dd410405.aspx "Models and Model Binders in MVC Applications")".

Le binding consiste à utiliser les données en provenance du formulaire de
saisie (mais aussi de l'URL) pour initialiser ou mettre à jour des objets issus
du modèle de l'application.

Etant donné que cette correspondance se fait plus ou moins magiquement (ou
en tout cas de façon automatique), c'est maintenant de notre responsabilité de
bien penser à sécuriser tout ça pour éviter les effets de bords. Pour cela, il
est entre autre possible d'utiliser un attribut [Bind] pour définir la liste
des propriétés à inclure ou à exclure du binding. Cet attribut peut s'employer
au niveau d'une action donnée ou plus généralement de la classe de l'objet.

La prochaine partie du tutoriel NerdDinner va aborder les solutions pour
faire [passer des données du contrôleur
vers les vues](/nerddinner/viewdata-viewmodel/ "ViewData et ViewModel") et présentera l'utilisation du dictionnaire ViewData ou des
objets ViewModel. L'intérêt de ces derniers c'est qu'ils peuvent aussi servir
pour filtrer plus précisément quelles propriétés des objets sont exposées via
les formulaires.

Et pour commencer à aller encore un plus loin sur tout ce qui concerne
l'amélioration et la sécurisation du binding, il est possible de consulter les
deux billets suivants :

* [6 Tips for ASP.NET MVC Model Binding](http://odetocode.com/Blogs/scott/archive/2009/04/27/6-tips-for-asp-net-mvc-model-binding.aspx)
* [ASP.NET MVC - Think Before You Bind](http://www.codethinked.com/post/2009/01/08/ASPNET-MVC-Think-Before-You-Bind.aspx)
