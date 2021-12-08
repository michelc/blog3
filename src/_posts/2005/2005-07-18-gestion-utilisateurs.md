---
date: 2005-07-18 15:56:00
layout: post
redirect_from: "post/2005/07/18/Gestion-des-utilisateurs"
tags: qc
title: "Gestion des utilisateurs"
---

Modification de Engine.Users.cs pour faire disparaitre la clause `<WHERE
idUser <> ''>` qui posait problème sous Oracle et qui ne servait qu'à
simplifier l'écriture de la clause de recherche suivante.
