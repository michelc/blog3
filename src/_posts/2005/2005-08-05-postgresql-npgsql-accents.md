---
date: 2005-08-05 10:08:00
layout: post
redirect_from: "post/2008/08/05/PostgreSQL-Npgsql-accents"
tags: qc
title: "PostgreSQL, Npgsql et les accents"
---

Pour que les chaines qui comprennent des caractères accentués soient
correctement enregistrés, il ne suffit pas que la base de données soit créée en
Unicode. Il faut également que la chaine de connexion contienne
"Encoding=unicode". Cela permet de résoudre l'erreur "ERROR: 22021: invalid
byte sequence for encoding \"UNICODE\": 0xe76120".

Mais il reste un problème sous Mono/XSP. En fait le souci est lié à
Server.HtmlDecode() qui ne sait pas restituer les accents => ouverture du
bug n°[75578](http://bugzilla.ximian.com/show_bug.cgi?id=75578) sur Monozilla. Pour l'instant, j'ai contourné le problème en
créant la fonction Common.HtmlEncode() qui n'échappe que inférieur, supérieur
et éperluette et laisse les accents tranquilles, à la différence de
Server.HtmlEncode() qui donne "èéêë" pour "éèêë".
