---
date: 2010-04-16 14:44:00
layout: post
redirect_from: "post/2010/04/16/gmail-notifier-hs"
tags: boulot
title: "GMail Notifier HS"
---

Depuis que j'ai mon nouveau portable et que je suis donc passé à Windows 7
64 bits, le notifieur officiel de GMail ne fonctionne plus (enfin c'est ce que
je croyais jusqu'à cette après-midi).

D'un côté, je suis beaucoup moins importuné par les mails tout au long de la
journée. De l'autre, c'est toujours au moment de rentrer chez moi que je
découvre un mail qui attend une réponse urgente que je dois remettre au
lendemain...

Et là, en suivant je ne sais plus trop quels liens (sur AutoMapper je
pense...), je tombe sur [GMail 7](http://www.michaelckennedy.net/blog/2009/07/11/GmailNewMailNotificationsForWindows7.aspx), un nouveau Gmail Notifier pour Windows 7 développé
par Michael C. Kennedy. Et dans les commentaires quelqu'un donne la véritable
explication sur le non fonctionnement du GMail Notifier de Google : c'est
bêtement dû au fait que j'aurai sélectionné "[Always use https](http://mail.google.com/support/bin/answer.py?hl=en&amp;answer=9429)". Heureusement pour nous, à défaut de nouvelle
version les braves gens de Google ont daigné sortir un patch.

Pas grave, je ré-installe GMail Notifier que j'avais viré puisqu'il ne
servait à rien puis je récupère le patch (un bête fichier reg) et non seulement
ça marche, mais en plus j'ai même un mail (et un marrant en plus).

Ce qui est dingue, ce n'est pas que Google ne soit pas foutu de mettre à
jour GMail Notifier pour gérer ça ou au minimum me signaler d'où vient le
problème (tous ses développeurs bossent sur Chrome ?). Non, ce qui fait pitié
c'est qu'il est tellement compliqué de trouver l'information sur leur site
qu'on ne peut qu'y tomber dessus par hasard...
