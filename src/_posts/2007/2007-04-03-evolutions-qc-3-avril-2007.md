---
date: 2007-04-03 12:02:00
layout: post
redirect_from: "post/2007/04/03/Evolutions-QC-au-3-avril-2007"
tags: qc
title: "Evolutions QC au 3 avril 2007"
---

Récapitulatif de ce qui a été fait depuis le [25 octobre
2006]({% post_url 2006-10-25-evolutions-qc-25-octobre-2006 %}) :

* _dumpdb.aspx : Utilisation de StringBuilder
* _dumpdb.aspx : Fichier dump.sql zippé et mailé en fonction de la ligne
de commande
* BDHelper.cs : Correction de la fonction #SUBSTRING() pour les
connexions ODBC
* Common.cs : Gestion erreur fichier inexistant dans la fonction
TrackFileUpdate()
* Email.cs : Gestion absence destinataire en cas de démonstration
* Log.cs : Ajout de la fonction GetLastHtml() pour afficher les logs du
dernier traitement (fusion PilOTT)
* Macros.cs : Changement du namespace de google.com en sitemaps.org
* AjaxXxxxx : Ajout possibilité d'utiliser Ajax dans QC (c'est à dire
sans le FormEnhance.js de PilOTT)
* Suppression de fichiers inutiles
