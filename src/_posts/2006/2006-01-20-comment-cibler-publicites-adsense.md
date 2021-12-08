---
date: 2006-01-20 15:10:00
layout: post
redirect_from: "post/2006/01/20/Comment-cibler-les-publicites-AdSense"
tags: adsense, html, referencement
title: "Comment cibler les publicités AdSense"
---

Il est possible d'indiquer à Google quelle sont les parties de la page dont
on souhaite mettre le contenu en avant. Cela permet de cibler les annonces
affichées sur le site en fonction de ce contenu.

Pour cela, il suffit d'encadrer le contenu "intéressant" par :

```
<!-- google_ad_section_start -->
    ....
<!-- google_ad_section_end -->
```

Il est aussi possible de "masquer" du contenu pour éviter d'avoir des
annonces relatives à celui-ci :

```
<!-- google_ad_section_start(weight=ignore) -->

    ....
<!-- google_ad_section_end -->
```

Via "[What
is section targeting and how do I implement it?](https://www.google.com/support/adsense/bin/answer.py?answer=23168&amp;sourceid=ASO&amp;subid=en_asblog&amp;medium=link)"
