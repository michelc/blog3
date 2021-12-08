---
date: 2005-07-01 10:23:00
layout: post
redirect_from: "post/2005/07/01/Mise-%C3%A0-jour-XTable"
tags: qc
title: "Mise à jour XTable"
---

Ajout de la propriété statique IsGetBack à la classe XTable de façon à
pouvoir tester dans l'évènement Page_Load s'il s'agit d'un chargement dû à une
action liée à XTable (changement de page, tri...). A utiliser en complément de
Page.IsPostBack.
