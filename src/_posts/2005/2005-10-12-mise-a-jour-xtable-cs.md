---
date: 2005-10-12 10:28:00
layout: post
redirect_from: "post/2005/10/12/Mise-a-jour-de-XTablecs"
tags: qc
title: "Mise à jour de XTable.cs"
---

Liste des modifications apportées suites à la mise en commun :

* ajout de la propriété Style (permet de définir certains styles depuis le
code c#),
* ajout de la propriété AllowFooter (reccourci pour AllowPaging et
AllowExport),
* prise en compte de la propriété AllowSorting dans BindQuery (évite prise en
compte du tri par le mauvais tableau quand ils sont plusieurs par page),
* le pager n'est plus dans une balise div après la table mais est désormais
intégré dans celle-ci,
* insertion automatique d'une ligne "blanche" dans la cas où la table est
vide.
