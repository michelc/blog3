---
date: 2006-05-03 09:38:00
layout: post
redirect_from: "post/2006/05/03/Boite-de-dialogue-dlgFiles"
tags: qc
title: "Boite de dialogue dlgFiles"
---

Modification des fichiers dlgFiles.aspx.cs et popupDialog.js pour rendre
l'utilisation de la boite de dialogue d'exploration de fichiers un peu plus
flexible.

* le répertoire par défaut est revenu à /data/,
* le téléchargement de fichiers se fait dans le répertoire en cours (et plus
uniquement dans /data/),
* il est désormais possible de configurer le répertoire initial dans la
fonction InputHelper.attachInputFile().

En fait, pour aller encore plus loin, il faudrait pouvoir paramétrer s'il
est possible de télécharger des fichiers, leur taille, leur type...
