---
date: 2005-06-21 08:30:00
layout: post
redirect_from: "post/2005/06/21/Mise-a-jour-de-defaultaspxcs"
tags: qc
title: "Mise à jour de default.aspx.cs"
---

Corrigé le test pour déterminer s'il faut afficher la barre d'outils
d'administration. Il ne portait pas sur l'écran en cours mais toujours sur le
premier écran du site.

Ajouté deux nouvelles macros :

* resourcePath : renvoie l'url vers le répertoire des ressources
(http://www.example.com/res/ ou http://localhost/demo/res/ par exemple),
* websiteUrl : renvoie l'url complèrte du site (http://www.example.com/ ou
http://localhost/demo/).

Macro.cs ayant été mise à jour en conséquence, la macro siteDescription a
été modifié pour ne plus lui ajouter dbConfig.
