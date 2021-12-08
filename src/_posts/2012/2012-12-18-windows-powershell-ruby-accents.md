---
date: 2012-12-18 21:50:00
layout: post
redirect_from: "post/2012/12/18/windows-powershell-ruby-accents"
tags: ruby
title: "Windows, PowerShell, Ruby et les accents"
---

Depuis que j'essaie de faire du Ruby, j'ai toujours eu des problèmes avec
les caractères accentués du français.

Pour [Sinatra](http://www.sinatrarb.com/), il y a
eu le jour où je ne sais plus quelle version a résolu le problème grâce à la
célèbre ligne "`# encoding: UTF-8`" en début de fichier :)

Mais pour les applications "console" ou les tests sous IRB, rien à
faire :

```
Windows PowerShell
Copyright (C) 2012 Microsoft Corporation. Tous droits réservés.

C:\Users\michel> cd C:\Ruby

C:\Ruby> irb
irb(main):001:0> str = "Réel"
=> "R\x82el"
irb(main):002:0>
```

Et ce soir je suivais les exemples de [String in Ruby](http://www.mehdi-khalili.com/string-in-ruby)
pour les développeurs C# et j'en ai eu marre de devoir me priver des
accents.

Alors j'ai cherché "Windows Ruby caractères français"... Mais bon, il faut
se rendre à l'évidence. Tout le monde s'accorde pour dire que la version 1.9.3
(1.9.x ?) de Ruby gère très bien les accents.

Bon. Ok. Le problème vient de Windows. "PowerShell caractère
français" ? De liens en liens j'arrive sur la page [$OutputEncoding to the rescue](http://blogs.msdn.com/b/powershell/archive/2006/12/11/outputencoding-to-the-rescue.aspx) (j'ai un peu perdu le fil des
liens qui m'y a conduit, mais merci à eux).

Et il est là, dans le dernier commentaire, comme une dernière
chance :

```
chcp 1250
```

Et ce 1250 me rappelle mes années [Windows-1252](http://fr.wikipedia.org/wiki/Windows-1252)
(sous ASP3 je crois).

Je lance une énième tentative :

```
C:\Ruby> chcp 1252
Page de codes active : 1252

C:\Ruby> irb
irb(main):001:0> str = "Réel"
=> "Réel"
```

Ca marche !!!

Je vérifie :

```
irb(main):002:0> str.each_char.map { |c| c }
=> ["R", "é", "e", "l"]
```

Et pour le plaisir :

```
irb(main):003:0> __ENCODING__
=> #<Encoding:Windows-1252>
```

Ruby sous Windows c'est génial !
