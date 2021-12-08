---
date: 2005-07-18 13:43:00
layout: post
redirect_from: "post/2005/07/18/Champs-lastUpdate"
tags: qc
title: "Champs lastUpdate"
---

Ajout du champ lastUpdate à la table qc_Screens. Celui-ci est destiné à
stocker la date de la dernière mise à jour de l'écran. Cette information peut
être affichée sur l'écran grace à la macro "screenUpdate" de façon à informer
le visiteur de la "fraicheur" de la page. Plus tard, cette date pourra
également servir pour gérer un système de notification ou pour réaliser une box
GoogleSitemap.

* Ajouté le script 20050715_update.sql pour mettre à jour la base de données
  - ALTER TABLE qc_Screens ADD lastUpdate DATETIME;
  - UPDATE qc_Screens SET lastUpdate = #DAYDATE;
* Prise en compte de lastUpdate dans Screens.cs
* Modification de Boxes.cs pour que màj automatique de lastUpdate à chaque
administration (création, modification ou suppression) d'une box
* Ajout de siteMacro("screenUpdate") à la classe Macro.cs
