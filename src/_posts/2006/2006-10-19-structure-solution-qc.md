---
date: 2006-10-19 10:55:00
layout: post
redirect_from: "post/2006/10/19/Structure-dune-solution-sous-QC"
tags: qc
title: "Structure d'une solution sous QC"
---

## Private Assemblies

Une solution basée sur QC est constituée d'au minimum 4 projets, chacun
correspondant à une DLL :

* qc.Engine : qc.Engine.dll
* qc.Framework : qc.Framework.dll
* qc.Classic : qc.Classic.dll
* BAS.Data.BDHelper : BAS.Data.BDHelper.dll

QC utilise le principe des Private Assemblies (PA) selon la méthode "
Development Framework" pour DotNetNuke 2 qui a été décrite par Bo Norgaard sur
son site (<http://www.dotnetnuke.dk/Default.aspx?tabid=59>).

## Répertoire principal

* default.aspx : charte graphique vide (nécessaire mais inutilisé),
* default.aspx.cs : code pour la classe inPortal.Default,
* global.asax.  - : ràs,
* LiteralFR.config : textes français pour les PA qc.Engine et qc.Classic
* qc.Engine.csproj : le fichier projet pour la PA
* qc.sln : le fichier de la solution QC
* web.config : ràs,
* BDHelper : sous-répertoires avec le code de la PA gérant l'accès aux bases
de données
* bin/ : répertoire avec le code compilé,
* Classic/ : sous-répertoires avec le code des boites standards de QC
* data/ : sous-répertoires où stocker les fichiers de données
* Engine/ : sous-répertoires avec le code de base de QC
* Framework/ : code de la PA servant à lier le tout,
* res/ : sous-répertoires (scripts, images, chartes graphiques...)

## Créer une nouvelle solution

Ce paragraphe explique point par point comment créer une nouvelle solution
nommée "demo" à partir de la solution QC.

* Copier le répertoire X:\Portals\qc dans X:\Portals\demo
* Créer un répertoire virtuel "demo" qui pointe sur le sous-répertoire
X:\Portals\demo
* Donner à l'utilisateur ASPNET TOUS les droits sur le sous-répertoire
X:\Portals\demo\data
* Tester que http://localhost/demo fonctionne correctement
* Renommer X:\Portals\demo\qc.sln en X:\Portals\demo\demo.sln
* Supprimer X:\Portals\demo\qc.suo
* Remplacer manuellement http://localhost/qc par http://localhost/demo dans
les fichiers suivants :
  - X:\Portals\demo\demo.sln
  - X:\Portals\demo\qc.Engine.csproj.webinfo
  - X:\Portals\demo\Classic\qc.Classic.csproj.webinfo
* Supprimer X:\Portals\qc\BDHelper\BAS.Data.BDHelper.csproj.user
* Charger la solution X:\Portals\demo\demo.sln dans Visual Studio
* Générer la solution
  - dans la barre de menu, cliquer sur Générer - Générer la solution
(Ctrl+Maj+B)
  - le résultat doit être de la forme "Génération : 4 a réussi, 0 a échoué, 0 a
été ignoré"
* Tout sauvegarder, quitter et tester que http://localhost/demo fonctionne
toujours

## Ajouter un nouveau projet

Ce paragraphe explique comment ajouter un nouveau projet sous forme de
Private Assembly à la solution "demo". Concrètement, ce projet regroupe
logiquement plusieurs "boites" dans une même Private Assembly et physiquement
les sous-répertoires relatifs à chacune de ces boites dans un même
répertoire.

* Lancer Visual Studio 2003 et ouvrir la solution "demo"
* Créér le projet correspondant à la Private Assembly
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur la
solution "demo" et choisir Ajouter - Nouveau Projet
  - dans la boite de dialogue sélectionner le type de projet "Projet Visual C#"
et le modèle "Projet Web Vide"
  - définir l'emplacement à http://localhost/demo/Exemple et valider en
cliquant sur OK
* Renommer le projet
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le projet
qui vient d'être créé (Exemple dans le cas présent) et choisir Renommer puis
indiquer "demo.Exemple"
  - cliquer à nouveau avec le bouton droit sur le projet et choisir
Propriétés
  - dans la boite de dialogue, sélectionner Propriété communes - Général
  - définir Nom de l'assembly à "demo.Exemple"
  - définir Espace de noms par défaut à "demo.Exemple"
* Ajouter des références
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Références" du projet "demo.Exemple" et choisir Ajouter une
référence
  - cliquer sur l'onglet "Projets"
  - sélectionner "qc.Engine" et valider
* Référencer le projet
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Références" du projet "qc.Framework" et choisir Ajouter une
référence
  - cliquer sur l'onglet "Projets"
  - sélectionner "demo.Exemple" et valider
* Générer la solution
  - dans la barre de menu, cliquer sur Générer - Générer la solution
(Ctrl+Maj+B)
  - le résultat doit être de la forme "Génération : 5 a réussi, 0 a échoué, 0 a
été ignoré"

## Ajouter une nouvelle boite

Dans ce paragraphe, on va voir comment ajouter une nouvelle "boite" dans le
projet demo.Exemple créé auparavant. Dans la terminologie QC, une boite
correspond à un module de code et regroupe généralement une classe métier et un
ou des contrôles utilisateurs web destinés à gérer un élément de base dans
l'application (les clients, les fournisseurs, les catégories de
clients...).

* Lancer Visual Studio 2003 et ouvrir la solution "demo"
* Créer un dossier pour la boite
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le projet
"demo.Exemple" et choisir Ajouter - Nouveau dossier
  - cliquer sur le dossier "NewFolder1" qui vient d'être créé et le renommer en
"Adresse"
* Créer le contrôle utilisateur pour l'affichage
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Adresse" du projet "demo.Exemple"
  - choisir Ajouter - Ajouter un contrôle utilisateur Web
  - donner "viewAdresse.ascx" comme nom et valider
  - sélectionner le contrôle utilisateur créé et choisir Afficher le code
  - repérer la définition de la classe et remplacer "System.Web.UI.UserControl"
par "qc.Engine.BoxControl" de façon à obtenir la ligne de code suivante :
"public class viewAdresse : qc.Engine.BoxControl"
* Créer le contrôle utilisateur pour le paramétrage
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Adresse" du projet "demo.Exemple"
  - choisir Ajouter - Ajouter un contrôle utilisateur Web
  - donner "editAdresse.ascx" comme nom et valider
  - sélectionner le contrôle utilisateur créé et choisir Afficher le code
  - repérer la définition de la classe et remplacer "System.Web.UI.UserControl"
par "qc.Engine.BoxControl" de façon à obtenir la ligne de code suivante :
"public class editAdresse : qc.Engine.BoxControl"
* Créer la classe pour gérer l'objet Adresse
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Adresse" du projet "demo.Exemple"
  - choisir Ajouter - Ajouter une classe
  - donner "Adresse.cs" comme nom et valider
* Générer la solution
  - dans la barre de menu, cliquer sur Générer - Générer la solution
(Ctrl+Maj+B)
  - le résultat doit être de la forme "Génération : 5 a réussi, 0 a échoué, 0 a
été ignoré"
