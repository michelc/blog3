---
date: 2006-03-19 11:21:00
layout: post
redirect_from: "post/2006/03/19/Boite-Flashfile-et-parametres"
tags: qc
title: "Boite Flashfile et paramètres"
---

L'utilisation de la nouvelle méthode [Common.MapPath()]({% post_url 2006-03-14-mappath-plus-souple %})
(après lui avoir apporté une dernière petite modification) permet dorénavant de
définir une source dans laquelle il apparait des paramètres, sans que cela pose
de problème par rapport au test d'existence du fichier.

Concrètement, cela permet par exemple de placer facilement un [lecteur MP3 DewPlayer](http://www.alsacreations.fr/mp3-dewplayer.html) en
indiquant une source de la façon suivante :

```
http://www.monsite.com/data/dewplayer.swf?mp3=http://www.monsite.com/data/music.mp3
```

Ce nouveau mode de fonctionnement est également applicable aux boites
SvgFile et Image.
