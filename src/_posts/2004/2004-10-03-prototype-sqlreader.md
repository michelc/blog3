---
date: 2004-10-03 20:01:00
layout: post
redirect_from: "post/2004/10/03/Prototype-SqlReader"
tags: qc
title: "Prototype SqlReader"
---

Travaillé à une brique Integration.SqlReader dont le but est de permettre
d'afficher le résultat d'une requête SQL SELECT...

Les trucs biens

* accepte les connexions odbc (notamment fichiers CSV et XLS), oledb et
sqlserver,
* pas d'AutoBinding = true => plus souple en ce qui concerne le titre des
colonnes et leur alignement automatisé en fonction du type de champs,
* présentation essentiellement basée sur les CSS.

Les trucs moins biens

* il faut 2 DataBind (l'un au Page_Load et l'autre à l'Event_Fire) étant
donné que les colonnes sont construites par programmation,
* le ViewState est conséquent (si EnableViewState = False => pagination et
tri ne fonctionnent pas),
* basé sur DataGrid ET DataSet.
