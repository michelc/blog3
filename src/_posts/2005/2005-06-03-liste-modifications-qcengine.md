---
date: 2005-06-03 08:35:00
layout: post
redirect_from: "post/2005/06/03/Liste-des-modifications-de-qcEngine"
tags: qc
title: "Liste des modifications de qc.Engine"
---

* Common : ajout de la procédure SessionUser() pour gérer les informations
sur l'utilisateur connecté
* Screens : ajout de la propriété screen.originalUrl
* Config : modifications pour initialiser la propriété screen.originalUrl
(permet d'accéder directement au sous-écran quand un écran est vide)
* Screens : ajout de la propriété screen.template (mais pas utilisée pour
l'instant)
* Macros : prise en compte de la propriété screen.isVisible dans la méthode
SiteMenu()
* Controls.Wysiwyg : agrandi le contrôle widgEditot à 390 pixels de haut
* Admin.admScreen et Admin.admBox : initialisation automatique des
autorisations par défaut en fonction de logonRedirect (true => mode intranet
et false => site internet)
