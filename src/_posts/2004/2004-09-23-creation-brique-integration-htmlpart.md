---
date: 2004-09-23 17:25:00
layout: post
redirect_from: "post/2004/09/23/Creation-brique-Integration-HtmlPart"
tags: qc
title: "Création de la brique Integration.HtmlPart"
---

Permet d'incorporer un fragment de code html à partir d'un fichier placé sur
le serveur. Peut servir dans les cas suivants :

* affichage d'un code html trop compliqué pour l'éditeur wysiwyg
* affichage d'un code html généré par un programme externe et transféré par
ftp
* ...

Deux paramètres :

* source du fichier à incorporer (doit être sur le serveur web mais pas
contrôlé)
* drapeau pour cacher le module quand le fichier est vide (cas d'un bloc html
servant à afficher une alerte temporaire)

Evolutions possibles :

* utiliser la boite de dialogue "Insérer un document" de l'éditeur wysiwyg
pour définir la source du fichier
* permettre des fichiers hors du serveur web (utilisation de WebRequest)
* fonctionner avec un simple &lt;!-- #include file="filename.html"
--&gt; ?
