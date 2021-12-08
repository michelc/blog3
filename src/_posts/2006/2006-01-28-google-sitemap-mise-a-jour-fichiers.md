---
date: 2006-01-28 14:04:00
layout: post
redirect_from: "post/2006/01/28/Google-Sitemap-et-mise-a-jour-fichiers"
tags: qc, referencement
title: "Google Sitemap et mise à jour fichiers"
---

Modification des modules Aspxfile, Flashfile, Htmlfile, Image, Svgfile,
Textfile, Xmlfeed et Xmlfile pour tester la date de dernière mise à jour du
fichier (ou celle de sa création).

Lorsque celle-ci est supérieure d'une heure à la date de dernière mise à
jour de l'écran, la date de mise à jour de l'écran est actualisée puis le
fichier sitemap destiné à Google est regénéré. Cela permet d'éviter que la mise
à jour des pages dont le contenu est basé sur des fichiers "externes" ne soit
jamais signalée à Google.
