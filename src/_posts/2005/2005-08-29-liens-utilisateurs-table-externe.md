---
date: 2005-08-29 16:44:00
layout: post
redirect_from: "post/2005/08/29/Liens-utilisateurs-table-externe"
tags: qc
title: "Liens utilisateurs / table externe"
---

Transformation de la gestion des utilisateurs pour gérer automatiquement un
lien entre la table des utilisateurs et une autre table spécifique. Dans le cas
où Quick-Content sert de framework pour développer une application, cela
permettra par exemple de rattacher un utilisateur à une société, une agence, un
département, un service...

Pour que cela fonctionne, il faut définir la table rattachée dans le
web.config :

* key="userJoins_JoinedTo" : libellé à faire apparaitre en gestion des
utilisateurs,
* key="userJoins_Multiple" : "false" ou "true" selon que l'utilisateur
peut être rattaché à un ou plusieurs enregistrements,
* key="userJoins_SqlView" : requête SQL permettant de sélectionner les
données de la table liée.

Le 1° champ de la requête SQL doit correspondre à l'identifiant de la table
liée et le second champ au libellé de l'enregistrement lié.

Les liens entre les utilisateurs (champ idUser) et la table liée (champ
idJoin) sont enregistrés dans la table qc_UserJoins.

Dans l'idéal, il est nécessaire de définir une contrainte d'intégrité entre
la table liée et la table qc_UserJoins, de façon à ce que la suppression d'un
enregistrement dans la table liée soit au choix :

* interdit s'il existe des utilisateurs rattachés à cet enregistrement,
* répercuté dans la table qc_UserJoins.
