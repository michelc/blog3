---
date: 2005-09-14 20:24:00
layout: post
redirect_from: "post/2005/09/14/Detection-langue-utilisateur"
tags: qc
title: "Détection langue utilisateur"
---

Modification de franchouillardise() dans default.aspx.cs pour gérer le cas
où la collection Request.UserLanguages n'est pas définie. Cela provoquait une
erreur objet non défini, notamment avec le [validateur du W3C](http://validator.w3.org/) et le site [browserhots.org](http://browsershots.org/).

TODO: finir le multi-langue pour se débarraser de cette
fonction
