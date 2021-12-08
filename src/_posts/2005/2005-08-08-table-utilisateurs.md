---
date: 2005-08-08 09:53:00
layout: post
redirect_from: "post/2005/08/08/Table-des-utilisateurs"
tags: qc
title: "Table des utilisateurs"
---

Ajout du champs HostAddress pour enregistrer l'adresse IP de l'utilisateur
dans la table qc_Users, ce qui implique les modifications suivantes :

* modification de Engine.Users pour en tenir compte
* mise à jour de cette valeur dans Common.SessionUser()
* mise à jour de la base de données via le script 20050807_update.sql
