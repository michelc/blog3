---
date: 2004-10-04 11:33:00
layout: post
redirect_from: "post/2004/10/04/Macro-ClassScreen"
tags: qc
title: "Macro ClassScreen()"
---

Ajouté la macro ClassScreen() qui renvoie une chaine en fonction du nombre
de colonnes réellement présentes dans l'écran en cours.

* layout3 : les 3 colonnes sont utilisées,
* layout2L : la colonne de gauche est utilisée mais pas celle de
droite,
* layout2R : la colonne de droite est utilisée mais pas celle de
gauche,
* layout1 : les colonnes de gauche et de droite ne sont pas
utilisées.

Cette macro peut s'utiliser par exemple dans `<body id="<%= IdScreen() %>">`
pour paramétrer les styles CSS en fonction du nombre de colonnes utiles.
Pourrait aussi s'employer pour référencer un fichier CSS spécifique :
`<link rel="stylesheet" href="<%= ClassScreen() %>.css" type="text/css"
media="screen" />`.

Voir aussi: [&lt;body&gt; Styling]({% post_url 2004-09-22-body-styling %})
