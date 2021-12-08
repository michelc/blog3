---
date: 2005-07-18 13:34:00
layout: post
redirect_from: "post/2005/07/18/ListItemCollection_Cache"
tags: qc
title: "ListItemCollection_Cache"
---

ListItemCollection_Cache n'est plus une constante de Common.cs mais une
propriété dont la valeur provient de la clé "collectionCache" du web.config.
Par défaut, cette valeur est définie à 3600 secondes si la clé n'existe
pas.
