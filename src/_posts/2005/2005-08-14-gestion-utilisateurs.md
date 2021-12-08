---
date: 2005-08-14 16:43:00
layout: post
redirect_from: "post/2005/08/14/Gestion-utilisateurs"
tags: qc
title: "Gestion des utilisateurs"
---

La liste des rôles que l'on pouvait cocher pour filtrer la liste des
utilisateurs contenait "Anonymous" mais pas "Authenticated". Le fichier
listUsers.ascx.cs et la méthode UserDB.GetAll(roles, lastLogin) ont donc été
modifiés afin de faire apparaitre "Authenticated" plutôt que "Anonymous", ce
qui semble plus logique.

Éventuellement, modifier tout ça pour adopter la même méthode que dans
ShowActions.
