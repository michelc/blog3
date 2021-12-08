---
date: 2005-06-14 14:50:00
layout: post
redirect_from: "post/2005/06/14/Boite-Discussions"
tags: qc
title: "Boite Discussions"
---

Ajouté un module Discussions qui permet de gérer de mini-forums sans notion
de messages imbriqués. Fonctionnalités essentielles:

* ne permet de poster qu'à condition d'être authentifié,
* zone sujet et message pour lancer une nouvelle discussion,
* zone message pour participer à une discussion
* affichage entièrement basé sur XTable

Evolutions envisageables :

* ajouter un module pour lister les dernières discussions (quelle que soit la
boite => plutôt un fil rss),
* configurer le(s) rôle(s) autorisé(s) à publier directement,
* configurer le(s) rôle(s) autorisé(s) à publier après modération,
* configurer email(s) du/des adminsitrateur(s),
* gérer l'incrémentation du compteur de lecture,
* gérer l'approbation des messages,
* stocker l'adresse IP de l'utilisateur dans qc_Users...
