---
date: 2005-08-13 16:41:00
layout: post
redirect_from: "post/2005/08/13/Bug-configuration-droits"
tags: qc
title: "Bug en configuration des droits"
---

Correction du contrôle utilisateur RoleGrid.ascx qui correspond à la grille
de cases à cocher utilisée pour gérer les différents droits en fonction des
rôles. Quand on décochait un droit existant, la variable stockant les
différents droits sous forme de liste CSV était corrompue. Ce qui avait comme
effet de faire disparaitre certains des droits existants.
