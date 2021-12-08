---
date: 2005-06-23 09:57:00
layout: post
redirect_from: "post/2005/06/23/Prise-en-compte-urlRewriting-1"
tags: qc
title: "Prise en compte urlRewriting (#1)"
---

En attendant de gérer correctement la réécriture d'url sous Mono, le code de
Config.screens a été modifié pour que les écrans sans contenu (et qui renvoient
directement sur un sous-écran) tiennent compte du paramètre urlRewriting du
Web.config.
