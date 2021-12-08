---
date: 2005-07-13 17:52:00
layout: post
redirect_from: "post/2005/07/13/Corrections-de-bugs"
tags: qc
title: "Corrections de bugs"
---

* Correction de la prise en compte de queryString dans Global.asax.cs qui
n'était pas préfixé par "?" quand il le fallait et commençait par "?" quand il
ne le fallait pas.
* Correction dans adminScreen.ascx.cs qui ne supprimait l'écran en cours mais
l'écran parent de celui-ci.
