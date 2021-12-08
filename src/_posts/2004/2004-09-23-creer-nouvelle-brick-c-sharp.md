---
date: 2004-09-23 15:34:00
layout: post
redirect_from: "post/2004/09/23/Creer-nouvelle-Brick-CSharp"
tags: qc
title: "Créer une nouvelle Brick en C#"
---

Ce document explique comment créer une nouvelle Brick à l'intérieur d'une
Toolbox. Une brique est le code ASP.NET qui servira à créer des modules dans
portal. L'exemple qui suit montre de façon détaillée comment ajouter une brique
Contacts à la toolbox Exemples.

* Lancer Visual Studio 2003 et ouvrir la solution portal.
* Créer un dossier pour la brique
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le projet
"inPortal.Exemples" et choisir Ajouter - Nouveau dossier
  - cliquer sur le dossier "NewFolder1" qui vient d'être créé et le renommer en
"Contacts"
* Créer le contrôle utilisateur pour l'affichage
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Contacts" du projet "inPortal.Exemples"
  - choisir Ajouter - Ajouter un contrôle utilisateur Web
  - donner "ViewContacts.ascx" comme nom et valider
  - sélectionner le contrôle utilisateur créé et choisir Afficher le code
  - repérer la définition de la classe et remplacer "System.Web.UI.UserControl"
par "inPortal.Core.ModuleControl" de façon à obtenir la ligne de code
suivante : "public class ViewContacts :
inPortal.Core.ModuleControl"
* Créer le contrôle utilisateur pour le paramétrage
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Contacts" du projet "inPortal.Exemples"
  - choisir Ajouter - Ajouter un contrôle utilisateur Web
  - donner "EditContacts.ascx" comme nom et valider
  - sélectionner le contrôle utilisateur créé et choisir Afficher le code
  - repérer la définition de la classe et remplacer "System.Web.UI.UserControl"
par "inPortal.Core.ModuleControl" de façon à obtenir la ligne de code
suivante : "public class EditContacts :
inPortal.Core.ModuleControl"
* Créer la classe pour gérer l'objet Contacts
  - dans l'explorateur de solutions, cliquer avec le bouton droit sur le
dossier "Contacts" du projet "inPortal.Exemples"
  - choisir Ajouter - Ajouter une classe
  - donner "Contacts.cs" comme nom et valider
* Générer la solution
  - dans la barre de menu, cliquer sur Générer - Générer la solution
(Ctrl+Maj+B)
  - le résultat doit être de la forme "Génération : 9 a réussi, 0 a
échoué, 0 a été ignoré"
