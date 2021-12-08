---
date: 2005-11-26 23:57:00
layout: post
redirect_from: "post/2005/11/26/Configuration-ScreenInfo"
tags: qc
title: "Configuration ScreenInfo"
---

La boite de configuration de ScreenInfo ne fonctionnait plus correctement
depuis la mise en place du [multi-langue]({% post_url 2005-06-06-multi-langue %}). Cela est dû au fait qu'un
contrôle `<asp:ListItem>` ne peut pas contenir directement un contrôle
`<qc:Literal>` et qu'il faut donc initialiser son contenu en code
behind.
