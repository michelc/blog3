---
date: 2005-10-23 09:28:00
layout: post
redirect_from: "post/2005/10/23/Validation-XTablecs"
tags: qc
title: "Validation XTable.cs"
---

Les urls générées par la classe XTable sont désormais relatives à la page en
cours (ie à partir du point d'interrogation) ce qui réduit (un peu) la taille
du code html.

Par ailleurs, plusieurs autres modifications de façon à permettre la
validation xhtml du code généré :

* en cas d'id généré automatiquement, celui-ci est préfixé par "xt_" de façon
à ne jamais débuter par un chiffre,
* correction oubli des balises &lt;tr&gt;&lt;/tr&gt; lors de l'ajout d'une
ligne "blanche" dans le cas où la XTable est vide,
* simplification du code généré pour le pied de table.
