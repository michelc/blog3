---
date: 2005-06-09 10:29:00
layout: post
redirect_from: "post/2005/06/09/Correction-qcEngineXTablecs"
tags: qc
title: "Correction qc.Engine.XTable.cs"
---

Modification de ToHtmlRow() pour ne pas générer de lien pour les colonnes de
type "email" ou "url" lorsque l'adresse mail ou l'url est vide dans
l'enregistrement en cours.

Aussi augmenté la largeur par défaut à 55px pour les colonnes de type
date.
