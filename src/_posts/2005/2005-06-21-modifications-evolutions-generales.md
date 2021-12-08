---
date: 2005-06-21 09:00:00
layout: post
redirect_from: "post/2005/06/21/Modifications-et-evolutions-generales"
tags: qc
title: "Modifications et évolutions générales"
---

* Common.cs : corrigé Literal() dans le cas où la traduction n'existe
pas,
* Literal.ascx.cs : fait simplement un appel à Common.Literal(),
* Screens.cs : remplacé la propriété parentUrl par idParent,
* Config.cs : modifié la propriété screens pour initialiser idParent au lieu
de parentUrl,
* Email.cs : préfixé les noms des modèles emails par un souligné,
* Email.cs : ajouté une version prototype de la focntion
sendNotification,
* XTable.cs : remplacé la variable grid.pageSize par xtableSize dans le
web.config.
