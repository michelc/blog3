---
date: 2010-03-18 10:03:00
layout: post
redirect_from: "post/2010/03/18/localhost-lent-firefox-safari-chrome"
tags: html, mvc
title: "Localhost lent avec Firefox, Safari et Chrome"
---

Ces derniers temps, je travaille sur une charte graphique pour ASP.NET MVC.
Je teste au fur et à mesure sous Internet Explorer 8 (parce que c'est la cible
de l'application) et sous Firefox 3.5 (pour être sûr de faire du code à peu
près correct).

J'avais l'impression que tout allait bien, mais ces derniers temps je me
suis rendu compte que l'affichage était vraiment lent. Et pourtant, je fais mes
essais avec le projet ASP.NET MVC quasi vide créé par défaut par Visual Studio
2008. En particulier, l'image de fond mettait une bonne seconde avant de
s'afficher. Alors que c'est un bête PNG de 350 octets ! Ca y est, mon
disque dur SSD est devenu lent :(

Au début, je me suis dit que je verrai ça plus tard jusqu'à ce que je
remarque que ce phénomène de lenteur était beaucoup plus sensible avec Firefox
et quasiment inexistant avec Internet Explorer. (Ah! Ah! Microsoft qui est
meilleur que Mozilla :). Et là ça a fait tilt. Je me suis souvenu que j'avais
déjà vu ce genre de problème signalé quelque part : une application
ASP.NET MVC qui devient lente quand on utilise Firefox.

Y'avait plus qu'à aller sur Google pour voir comment régler ça. Et en deux
temps trois mouvements j'ai eu la réponse à mon problème : un bête
problème d'IPv6 avec localhost (pas d'inquiétude, moi non plus je sais pas ce
que ça veut dire).

D'abord, une bidouille spéciale pour Firefox ([Fixing Firefox Slowness with localhost on Vista (or XP with
IPv6)](http://weblogs.asp.net/dwahlin/archive/2007/06/17/fixing-firefox-slowness-with-localhost-on-vista.aspx) qui consiste à modifier la configuration avancée de
Firefox :

* taper `about:config` dans la barre d'adresse
* promettre de bien faire attention
* filtrer sur le paramètre `network.dns.disableIPv6`
* double-cliquer sur la ligne obtenue pour passer de "false" (valeur par
défaut) à "true" (valeur définie par l'utilisateur)
* quitter et redémarre Firefox pour faire bonne mesure (pas sûr que cela soit
vraiment nécessaire)

C'est déjà pas mal, mais en y regardant de plus près, j'ai vu que cette
lenteur concernait aussi Chrome et Safari ([Slow IIS on Vista with Firefox, Chrome or Safari](http://codepolice.net/2009/02/19/slow-iis-on-vista-with-firefox-chrome-or-safari/)). Si jamais
il me reprend l'envie d'installer Safari ou Chrome (ou Opera ?) un jour ou
l'autre, je suis bien obligé de faire les choses correctement.

Et étant donné que le contenu de mon fichier hosts ne ressemblait pas tout à
fait à ce qui était indiqué, j'ai continué à chercher et je suis finalement
tombé sur un truc un peu plus explicite sur StackOverflow : [My Local Host goes so slow now that I am on windows 7 and Asp.net
MVC](http://stackoverflow.com/questions/1416128/my-local-host-goes-so-slow-now-that-i-am-on-windows-7-and-asp-net-mvc).

Avec ça, je peux faire ma modification, si ce n'est que mon fidèle Notepad
ne veut pas me laisser enregistrer le fichier et attend de moi que je lui donne
un autre nom ou que je le sauvegarde dans "Mes Documents". Qu'à cela ne tienne,
je quitte puis j'exécute Notepad en tant qu'administrateur et ce coup-ci plus
de problème.

Mon fichier C:\Windows\System32\drivers\etc\hosts d'origine :

```
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
#       127.0.0.1       localhost
#       ::1             localhost
```

Le même fichier hosts après avoir dé-commenté la ligne `127.0.0.1
localhost` :

```
# Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
127.0.0.1       localhost
#       ::1             localhost
```

Et même après avoir remis le paramètre `network.dns.disableIPv6`
de Firefox à "false", je peux débuguer ma charte graphique sous Firefox sans
attendre <s>des heures</s> une seconde à chaque fois que je rafraichis la
page.
