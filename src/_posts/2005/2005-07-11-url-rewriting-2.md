---
date: 2005-07-11 11:21:00
layout: post
redirect_from: "post/2005/07/11/Url-rewriting-2"
tags: qc
title: "Url rewriting #2"
---

Simplification de la gestion de l'url rewriting et "bricolages" pour
contourner les problèmes sous XSP (ou Mono 1.1.8 en général ?).

* XSP gérant tous les fichiers, ajout d'un test en début de
Application_BeginRequest pour quitter lorsque l'url demandée ne contient pas
".aspx" (devrait suffire pour l'instant).
* définition d'un query string fictif pour Context.RewritePath(defaultUrl,
pathInfo, queryString) dans le cas où le query string d'origine est une chaine
vide sans quoi cela génère une erreur sous XSP.
