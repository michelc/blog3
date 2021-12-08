---
date: 2005-07-18 13:41:00
layout: post
redirect_from: "post/2005/07/18/UrlRewriting-en-mode-admin-4"
tags: qc
title: "UrlRewriting en mode admin #4"
---

Modification de adminToolbar.ascx.cs et de popupDialog.js afin que le lien
généré pour administrer un écran ou une boite soit basé sur l'écran en cours
plutôt que sur /default.aspx.

Grâce à cela, le titre de l'écran (dans la barre de titre du navigateur)
correspondra à l'écran en cours et plus à l'écran principal du site, ce qui
prêtait à confusion.
