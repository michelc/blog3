---
date: 2004-09-22 14:21:00
layout: post
redirect_from: "post/2004/09/22/Bricks-cacheTime"
tags: qc
title: "Bricks.cacheTime"
---

Ajouté le champ cacheTime à la table Bricks afin de paramétrer la durée du
cache (en secondes) par défaut pour une brique donné.

* /Core/Components/Bricks.cs : ajout de la propriété cacheTime à la
classe Brick
* /Core/Components/Bricks.cs : prise en compte du champs cacheTime dans
la classe BricksDB
* /Core/Pages/editBrick.ascx.  - : gestion du champ cacheTime
* /Core/Pages/editModules.ascx.cs : initialise Module.cacheTime à
Brick.cacheTime lorsque l'utilisateur n'a pas saisi de durée de cache (en
création comme en modification)
