---
date: 2006-01-14 11:13:00
layout: post
redirect_from: "post/2006/01/14/Template-au-niveau-ecran"
tags: qc
title: "Template au niveau écran"
---

Prise en compte du champ "template" de la table qc_Screens pour avoir la
possibilité de gérer un modèle de page spécifique à chaque écran (jusqu'à
présent, le champ existait dans la table mais n'était pas utilisé).

Global.asax.cs (pour l'url rewriting) et Common.cs (pour la propriété
stylePath) testent dans l'ordre :

* qc_Screens.template : modèle de page spécifique à l'écran,
* qc_Sites.template : modèle de page général pour le site,
* “skidoo” : modèle de page par défaut de Quick-Content.

Par ailleurs, lorsque le nom du modèle de page contient une barre de
division, on considère qu'il ne pointe pas seulement vers le sous-répertoire
correspondant au modèle de page, mais qu'il indique aussi le nom du fichier
représentant ce modèle de page :

* template = "azerty" => utiliser /res/_azerty/default.aspx,
* template = "azerty/autre" => utiliser /res/_azerty/autre.aspx.

Note : pour l'instant, il n'est pas encore possible de
définir la valeur du champ "template" des écrans autrement que par une mise à
jour manuelle de la base de données.
