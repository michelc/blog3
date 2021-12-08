---
date: 2004-09-30 13:14:00
layout: post
redirect_from: "post/2004/09/30/Variable-session-utilisateur"
tags: qc
title: "Variable session utilisateur"
---

Ajouté la procédure Utils.SessionUser qui initialise un certain nombre de
variables sessions liées à l'utilisateur connecté :

* UserId : identifiant de l'utilisateur (son login)
* UserName : nom
* UserEmail : adresse mél

Ces variables sont initialisées uniquement quand :

* Context.Request.IsAuthenticated est vrai : ce qui signifie que
l'utilisateur est bien identifié,
* Session["UserId"] est différent de Context.User.Identity.Name : pour
faire l'initialisation une fois pour toute.

Lorsque Context.Request.IsAuthenticated est faux, ces variables sessions
sont supprimés.

Cette procédure est appelée automatiquement par default.aspx.cs de façon à
ce que les données soient disponibles et à jour pour toutes les briques.

Par ailleurs, cette procédure met à jour la propriété Uzer.lastLogin
permettant de connaitre la date de la dernière connection de l'utilisateur (cf
[User.Login]({% post_url 2004-09-22-users-lastlogin %})).
