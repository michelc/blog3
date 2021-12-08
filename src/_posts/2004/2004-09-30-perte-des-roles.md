---
date: 2004-09-30 10:43:00
layout: post
redirect_from: "post/2004/09/30/Perte-des-roles"
tags: qc
title: "Perte des rôles"
---

Modification de Uzer.Save() de façon à ne pas sauvegarder les rôles de
l'utilisateur quand ils n'ont pas été modifié ou lus.

Auparavant, le fait de redemander son mot de passe faisait disparaitre la
liste des rôles auxquel l'utilisateur appartenait car Uzer.Save() les
ré-enregistrait alors qu'il n'avait pas été lus.
