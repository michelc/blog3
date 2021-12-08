---
date: 2005-07-28 09:47:00
layout: post
redirect_from: "post/2005/07/28/Ajout-de-MsnSearch"
tags: qc
title: "Ajout de MsnSearch"
---

Ajout de la boite Classic.MsnSearch pour effectuer une recherche via les
fils RSS de MSnSearch. Ce module a été inspiré par le billet [Search
Your Site Using MSN Search](http://www.aprogrammersjournal.com/article.aspx?id=63) de Jason Witty, notamment en ce qui concerne les
paramètres à utiliser dans l'url.

Par contre, le fonctionnement est différent dans la mesure où le fil RSS
obtenu est exploité à l'aide du [schéma
XSD pour RSS 2.0](http://www.kbcafe.com/iBLOGthere4iM/?guid=20031001212627) de Randy Charles Morin, ce qui permet d'avoir un
traitement similaire aux boites GoogleSearch et YahooSearch.

Et aussi corrigé GoogleSearch et YahooSearch qui ne repartaient pas de la 1°
page quand on cliquait sur le bouton <Rechercher>.
