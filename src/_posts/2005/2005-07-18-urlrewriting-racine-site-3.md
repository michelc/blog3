---
date: 2005-07-18 13:31:00
layout: post
redirect_from: "post/2005/07/18/UrlRewriting-et-racine-du-site-3"
tags: qc
title: "UrlRewriting et racine du site #3"
---

Lorsque IIS reçoit une requête du stype http://www.example.com ou
http://www.example.com/, il redirige automatiquement sur
http://www.example.com/Default.aspx (avec un D majuscule).

Etant donné que le nouveau système d'url rewriting est case sensitive pour
être plus mono compatible, les requêtes pointant sur des répertoires ne
géraient plus l'url rewriting et on se retrouvait avec la charte graphique par
défaut.

Le Global.asax.cs a été modifié pour que l'url rewriting soit case
insensitive dans le cas de la page default.aspx.

Rappel: ASP.NET ne peut pas gérer l'url rewriting des répertoires parce que
IIS génère une erreur HTTP 404 Not found et ne lui passe pas la main.
