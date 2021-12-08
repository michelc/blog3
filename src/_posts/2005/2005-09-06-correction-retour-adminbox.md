---
date: 2005-09-06 14:34:00
layout: post
redirect_from: "post/2005/09/06/Correction-retour-adminBox"
tags: qc
title: "Correction retour adminBox"
---

Suite à l'ajout de la box ShowAction et au fait que l'url de retour soit
généralement basée sur le referrer, l'adresse de redirection en fin de
traitement ne gérait pas l'url rewriting, ce qui posait des problèmes lors des
ajouts suivants.

D'autre part, lors de la création d'une nouvelle box sous FireFox, le
referrer correspondait à la popup de sélection du type de box et pas à l'écran
d'où émanait la création de la box.
