---
date: 2005-08-08 09:54:00
layout: post
redirect_from: "post/2005/08/08/Notion-visibilite-boites"
tags: qc
title: "Notion de visibilité des boites"
---

Dans la table qc_Boxes, remplacement du champ booléen alwaysVisible par un
champ entier visibility qui peut prendre une des trois valeurs
suivantes :

* 0 : la boite est visible dans l'écran où elle est placée (équivalent
de alwaysVisible = false)
* 1 : la boite est visible dans tous les sous-écrans de celui où elle
est placée (et y compris dans celui-ci)
* 2: la boite est visible dans tous les écrans (équivalent de alwaysVisible =
true)

Modifications apportées pour que cela fonctionne :

* Engine.Boxes et Engine.Admin.adminBox pour gérer le champ visibility au
lieu du champ alwaysVisible
* Config.cs pour tester sur la propriété visibility plutôt que
alwaysVisible
* mise à jour de la base de données via le script 20050807_update.sql
