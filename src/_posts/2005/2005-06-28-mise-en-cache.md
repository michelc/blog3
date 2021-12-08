---
date: 2005-06-28 15:21:00
layout: post
redirect_from: "post/2005/06/28/Mise-en-cache"
tags: qc
title: "Mise en cache"
---

* ajouté BoxCache.cs
* modifié Box_Load() dans default.aspx.cs pour utiliser BoxControl ou
BoxCache selon le cas
* ajouté une méthode removeCache() à BoxControl.cs
* ajouté un appel à removeCache() en btnUpdate_Click et btnDelete_Click dans
qc_Classic

Reste à tester et aussi vider le cache quand on cache/affiche la
toolbar.
