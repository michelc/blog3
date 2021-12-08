---
date: 2006-04-19 09:52:00
layout: post
redirect_from: "post/2006/04/19/VS2003-Echec-de-lactualisation-du-projet"
tags: .net, code-snippets
title: "VS2003 - Echec de l'actualisation du projet"
---

Après avoir fermé toutes les session de Visual Studio, passer dans
l'explorateur de fichier et aller dans le sous-répertoire :

* - Documents and Settings
* - - "userlogin" (login de l'utilisateur)
* - - - VSWebCache
* - - - - "hostname" (nom de la machine)

Et supprimer le cache du projet qui pose problème (ou éventuellement de tous
les projets).
