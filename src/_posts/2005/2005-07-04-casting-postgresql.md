---
date: 2005-07-04 11:32:00
layout: post
redirect_from: "post/2005/07/04/Casting-et-PostgreSQL"
tags: qc
title: "Casting et PostgreSQL"
---

Contacts.NewId provoquait un message "invalid cast" avec PostgreSQL =>
modifié toutes les méthodes NewId dans la toolbox Classic pour remplacer les
casts (int) par des Convert.ToInt32().
