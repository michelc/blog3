---
date: 2005-10-12 12:11:00
layout: post
redirect_from: "post/2005/10/12/Lien-consultation-/-maj-boite"
tags: qc
title: "Lien consultation / màj boite"
---

Ajout de la méthode formLnkFormat() à BoxControl.cs afin de renvoyer
editLnkFormat() ou viewLnkFormat() en fonction des droits de l'utilisateur.
Cela permet de simplifier la création d'un lien consultation/mise à jour au
niveau des écrans ou des listes.
