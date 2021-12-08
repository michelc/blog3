---
date: 2005-10-10 13:46:00
layout: post
redirect_from: "post/2005/10/10/Retrouver-la-reference-a-une-autre-boite"
tags: qc
title: "Retrouver la référence à une autre boite"
---

Ajout de la méthode getBox(string idBox) à l'objet Config pour retrouver
l'objet boite correspondant à un id donné. Dans un premier temps, l'objet est
recherché dans la collection des boites de l'écran en cours (pré-chargée dans
l'ArrayList boxes) puis si nécessaire chargé à partir de la base de données si
la boite appartient à un autre écran.
