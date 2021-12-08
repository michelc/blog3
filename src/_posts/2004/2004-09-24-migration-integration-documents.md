---
date: 2004-09-24 10:00:00
layout: post
redirect_from: "post/2004/09/24/Migration-Integration-Documents"
tags: qc
title: "Migration de Integration.Documents"
---

Terminé le passage de Basics.Documents vers Integration.Documents et ajout
du module pour paramétrer la gestion des documents.

1° paramètre : possibilité de saisir une liste de valeurs séparées par
un point-virgule

2° paramètre : mode de publication

* Uploader sur le serveur web
* Partager via le réseau local
* Uniquement uploader
* Uniquement partager

Et donc modification de /Integration/Documents/editDocuments.ascx.\* pour
tenir compte du fait que le champ catégorie peut être une zone de texte ou une
liste déroulante.
