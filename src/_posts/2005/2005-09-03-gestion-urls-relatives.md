---
date: 2005-09-03 14:33:00
layout: post
redirect_from: "post/2005/09/03/Gestion-des-urls-relatives"
tags: qc
title: "Gestion des urls relatives"
---

Ecriture de la fonction UntildeUrl() dans Common.cs pour transformer les
urls commençant par "~/" en fonction l'url de la racine du site. Ajout de cette
fonction à BoxControls.cs pour pouvoir l'utiliser dans les fichiers
".ascx".

Renommé la fonction relativePath() de Common.cs en TildeUrl() pour rester
homogène.

Mise à jour du projet qc.Classic pour tenir compte de ces deux nouvelles
fonctions, notamment dans listAnnouncements.ascx qui ne gérait pas correctement
les urls relatives.
