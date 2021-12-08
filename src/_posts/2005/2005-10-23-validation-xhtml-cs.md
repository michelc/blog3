---
date: 2005-10-23 09:40:00
layout: post
redirect_from: "post/2005/10/23/Validation-XHtmlcs"
tags: qc
title: "Validation XHtml.cs"
---

Modification de la classe XHtml.cs pour améliorer la qualité du code renvoyé
au navigateur client :

* déplacement du view state en fin de page (ce qui devrait [
améliorer le référencement](http://www.hanselman.com/blog/CommentView.aspx?guid=91073711-983c-4aa5-9fa2-40cd185769a9) par Google ?),
* gère le cas où le code pour insérer le script tableEnhance.js apparait
plusieurs fois dans la page,
* supprime les lignes vides.
