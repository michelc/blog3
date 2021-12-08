---
date: 2005-06-06 10:35:00
layout: post
redirect_from: "post/2005/06/06/Ameliorations-des-boites-de-dialogue"
tags: qc
title: "Améliorations des boites de dialogue"
---

* homogénéisation du code de dlgFiles, dlgScreens et dlgBoxTypes par mise en
commun de dlgPopup.css et dlgPopup.js.
* révision présentation CSS des boites de dialogue (pour plus tard, gérer
plus élégamment la soupe générée pas `<asp:pane>`)
* clic sur une branche ne renvoit plus directement l'élément cliqué mais le
sélectionne juste. Il faut ensuite cliquer sur [OK] pour le renvoyer (=> ajout
d'une propriété clic à ddtree.js)
* ajout de l'upload à dlgFiles (pour plus tard, voir comment sélectionner
automatiquement le fichier quand l'upload est terminé)
