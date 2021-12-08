---
date: 2010-03-24 22:09:00
layout: post
redirect_from: "post/2010/03/24/contact-manager-avec-mongo-db-et-norm"
tags: mvc, nosql
title: "Contact Manager avec MongoDB et NoRM"
---

Maintenant que j'ai enfin expédié mon billet consacré au portage hyper
passionnant de l'application [ContactManager sous NHibernate]({% post_url 2010-03-23-porter-contact-manager-nhibernate %}), je peux enfin revenir à des
trucs beaucoup plus amusants.

Ca faisait un petit moment que j'avais envie de tester pour de bon une de
ces nouvelles bases de données NoSQL dont on nous rabat les oreilles ces
derniers temps.

Mais bon, ça demande du temps et il faut choisir quelle NoBase de données
employer et il faut qu'il y ait des pilotes pour C# et il y a [plein](http://www.asp.net/mvc/application-development/)
d'[autres](http://www.subsonicproject.com/) [trucs](http://hginit.com/) à [faire](http://msdn.microsoft.com/fr-fr/library/bb397926.aspx)... Et un soir, Rob Conery sort un billet où non seulement il
explique comment [utiliser une base de données MongoDB avec LINQ](http://blog.wekeroad.com/2010/03/04/using-mongo-with-linq) mais en plus il
présente le "provider" NoRM sur lequel il est en train de travailler avec
quelques autres.

C'est trop beau pour être vrai => je télécharge, je trifouille et
j'arrive à peu près à faire marcher ses bouts d'exemples.

C'est pas compliqué ! J'ai plus qu'à transformer Contact Manager pour
qu'il fonctionne avec MongoDB et NoRM !!!

Oulla! Ne nous emballons pas. NoRM est en cours de développement donc y'a
pas forcément tout ce qu'il faut et surtout j'ai pas encore tout assimilé en
matière de base de données documents.

C'est pas compliqué ! J'ai qu'à refaire seulement la toute première
étape !!!

Le faire, c'est bien et ça va même assez vite. Le dire, c'est mieux mais
c'est un peu plus long.

Et donc, après quelques heures d'efforts, voici mon tutorial sur le [développement d'une application de gestion de contacts avec
ASP.NET MVC, MongoDB et NoRM]({% post_url 2010-03-24-developper-application-contacts-aspnetmvc-mongo-db %}) qui reprend quasiment mot à mot la première
étape du tutoriel de Microsoft. Comme l'original, ce tutoriel présente donc
comment créer une application de gestion de contact de la façon la plus simple
qui soit. Tout au long de celui-ci, vous pourrez voir comment mettre en place
le support d'opérations CRUD classiques vers une base de données MongoDB :
création, lecture, mise à jour et suppression d'enregistrements.
