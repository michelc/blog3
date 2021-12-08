---
date: 2005-12-14 08:29:00
layout: post
redirect_from: "post/2005/12/14/Generer-GoogleSearchServicedll-a-partir-de-GoogleSearchwsdl"
tags: .net, code-snippets
title: "Générer GoogleSearchService.dll à partir de GoogleSearch.wsdl"
---

Pour générer la source C#, taper :

```
wsdl GoogleSearch.wsdl
```

Cele crée un fichier GoogleSearchService.cs, à compiler par :

```
csc /target:library GoogleSearchService.cs
```

Ou pour Mono par :

```
mcs /target:library GoogleSearchService.cs
```

Ce qui produit l'assembly : GoogleSearchService.dll
