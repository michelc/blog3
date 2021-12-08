---
date: 2005-07-12 16:18:00
layout: post
redirect_from: "post/2005/07/12/D%C3%A9finition-du-lien-Editer"
tags: qc
title: "Définition du lien Editer"
---

Ajout de la propriété editLink à BoxControl.cs pour permettre de paramétrer
le lien de mise à jour qui est automatiquement placé à gauche du titre de la
boite lorsque l'utilisateur dispose des droits d'édition.

Jusqu'à présent, l'url de ce lien était fixée à "?editBox=" + idBox. Il est
maintenant possible de modifier cette url par défaut en initialisant la
propriété editLink. Eventuellement, l'utilisation de la fonction
BoxControls.editLnkFormat() en spécifiant une url va initialiser
automatiquement la propriété editLink si elle n'avait pas été définie
auparavant.

Le fait de définir la propriété this.editLink à "" permet de ne pas faire
apparaitre le bouton Editer à gauche du titre du module.
