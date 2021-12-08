---
date: 2004-10-15 13:08:00
layout: post
redirect_from: "post/2004/10/15/D%C3%A9ployer-un-portail-sans-les-sources"
tags: qc
title: "Déployer un portail sans les sources"
---

Pour disposer d'un répertoire ne contenant que la version exécutable du
portail (dlls, *.ascx et autres ressources), il faut procéder de la façon
suivante:

* Copier dans un répertoire "clean" la racine du répertoire "inPortal" et ses
sous-répertoires _charte, Basics, bin, Core, data, ftb et uploads (plus les
sous-répertoires correspondants aux autres Toolbox),
* Rechercher dans le répertoire "clean" tous les fichiers *.cs; *.resx et
*.scc et les supprimer,
* Eventuellement ne laisser que Default.aspx, Global.asax et Web.config dans
la racine de "clean".
