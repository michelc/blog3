---
date: 2004-09-22 16:33:00
layout: post
redirect_from: "post/2004/09/22/Bricks-configSource"
tags: qc
title: "Bricks.configSource"
---

Ajouté le champ configSource à la table Bricks pour définir l'url du
contrôle .ascx à utiliser pour paramétrer le module. Dans le cas du module
Documents par exemple, cela permet d'avoir à la fois un contrôle pour la
modification du contenu (ajout, modification et suppression d'un document) et
un autre pour le paramétrage (définir la liste des catégories possible, le mode
de publication par défaut...).

* /Core/Components/Bricks.cs : ajout de la propriété configSource à la
classe Brick
* /Core/Components/Bricks.cs : prise en compte du champ configSource
dans la classe BricksDB
* /Core/Pages/editBricks.ascx.  - : gestion du champ configSource
* /Core/Setup/maj_Portal.sql : modification script création table
Bricks
* /Core/Setup/maj_Temp.sql : instructions pour màj de la table
Bricks
* mise à jour manuelle du contenu de la table Bricks
