---
date: 2005-09-09 15:55:00
layout: post
redirect_from: "post/2005/09/09/Modifications-pour-BoxControlboxTitle"
tags: qc
title: "Modifications pour BoxControl.boxTitle"
---

Ajout de la propriété ShowEditLink pour indiquer s'il faut afficher ou non
le lien de mise à jour de la boite (ins ou upd) à gauche du titre de la boite
lorsque l'utilisateur dispose des droits de mise à jour. Cela permet d'éviter
de faire doublon lorsque une autre méthode de mise à jour est disponible par
ailleurs (cas de la barre d'outils d'OTT par exemple).

Lorsque l'on est en mode mise à jour, le titre de la boite est affiché même
dans le cas où il est préfixé par une astérisque. De cette façon le formulaire
de mise à jour est toujours précédé d'un titre descriptif.
