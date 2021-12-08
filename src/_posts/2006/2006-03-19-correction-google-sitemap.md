---
date: 2006-03-19 10:33:00
layout: post
redirect_from: "post/2006/03/19/Correction-de-Google-Sitemap"
tags: qc, referencement
title: "Correction de Google Sitemap"
---

Correction de deux problèmes qui empêchaient l'exploitation correcte du
fichier sitemap.xml par Google.

* enlevé le "/" de trop à la fin de l'url vers la page principale du
site,
* suppression de l'utilisation de UrlEncode dans l'adresse de toutes les
autres pages.

Et modification de Common.TrackFileUpdate() pour employer la nouvelle
méthode [Common.MapPath()]({% post_url 2006-03-14-mappath-plus-souple %})
en lieu et place de Server.MapPath().
