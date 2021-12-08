---
date: 2004-09-23 15:01:00
layout: post
redirect_from: "post/2004/09/23/Creer-nouvelle-Toolbox-CSharp"
tags: qc
title: "Créer une nouvelle Toolbox en C#"
---

Ce document explique comment créer une nouvelle Toolbox sous forme de
Private Assembly. Une Toolbox regroupe logiquement plusieurs briques dans une
même Private Assembly et physiquement les sous-répertoires relatifs à chacune
de ces briques dans un même répertoire. L'exemple qui suit montre de façon
détaillée comment créer la Toolbox Exemples. Plus tard, nous verrons comment
ajouter des briques à l'intérieur de celle-ci.

* Lancer Visual Studio 2003 et ouvrir la solution portal.
* Créér le projet correspondant à la Private Assembly
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur la
solution "portal" et choisir Ajouter - Nouveau Projet
  - dans la boite de dialogue sélectionner le type de projet "Projet Visual C#"
et le modèle "Projet Web Vide"
  - définir l'emplacement à http://localhost/inportal/Exemples et valider en
cliquant sur OK
* Renommer le projet
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le projet
qui vient d'être créé (Animation dans le cas présent) et choisir Renommer puis
indiquer "inPortal.Exemples"
  - cliquer à nouveau avec le bouton droit sur le projet et choisir
Propriétés
  - dans la boite de dialogue, sélectionner Propriété communes - Général
  - définir Nom de l'assembly à "inPortal.Exemples"
  - définir Espace de noms par défaut à "inPortal.Exemples"
* Ajouter des références
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Références" du projet "inPortal.Exemples" et choisir Ajouter une
référence
  - cliquer sur l'onglet "Projets"
  - sélectionner "inPortal" et valider
* Référencer le projet
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Références" du projet "inPortal.Framework" et choisir Ajouter une
référence
  - cliquer sur l'onglet "Projets"
  - sélectionner "inPortal.Exemples" et valider
* Générer la solution
  - dans la barre de menu, cliquer sur Générer - Générer la solution
(Ctrl+Maj+B)
  - le résultat doit être de la forme "Génération : 9 a réussi, 0 a
échoué, 0 a été ignoré"
