---
date: 2006-10-18 20:03:00
layout: post
redirect_from: "post/2006/10/18/Installer-et-compiler-les-sources-de-QC"
tags: qc
title: "Installer et compiler les sources de QC"
---

Installation des sources de QC sur un poste de développement

* Décompacter l'archive complète de la solution dans le sous-répertoire
C:\Portals\qc ou D:\Portals\qc
* Créer un répertoire virtuel "qc" qui pointe sur le sous-répertoire
X:\Portals\qc
* Donner à l'utilisateur ASPNET TOUS les droits sur le sous-répertoire
X:\Portals\qc\data
* Tester que http://localhost/qc fonctionne correctement => installation
réussie :)

Compilation des sources de QC

* Rechercher tous les fichiers *.csproj.user dans X:\Portals\qc et ses
sous-répertoires pour les supprimer
* Sous Visual Studio, le chargement de la solution X:\Portals\qc\qc.sln ne
doit pas planter (ne pas la mettre sous Source Safe)
* Recompiler toute la solution (Générer - regénérer la solution) doit donner
un message style "Régénération globale : # a réussi, 0 a échoué, 0 a été
ignoré" => compilation réussie :)
* Tout sauvegarder puis fermer la solution afin de sauvegarder les
.csproj.user de C: ou D:
* Tester que http://localhost/qc est toujours OK
