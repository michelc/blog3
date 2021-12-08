---
date: 2010-07-26 16:50:00
layout: post
redirect_from: "post/2010/07/26/contexte-recherche-exalead-sdk"
tags: boulot, csharp
title: "Contexte d'une recherche Exalead SDK"
---

Quoiqu'en dise la documentation, il ne faut **surtout** pas
utiliser la forme :

```
searchQuery.SearchContext = mon_contexte;
```

Mais **obligatoirement** la syntaxe :

```
searchQuery.AddParameter("C", mon_contexte);
```

En tout cas avec Exalead one:enterprise 4.6.
