---
date: 2005-07-29 17:33:00
layout: post
redirect_from: "post/2005/07/29/Set-ValueToCompare-at-run-time"
tags: code-snippets, csharp
title: "Set ValueToCompare at run time"
---

Lorsque un contrôle CompareValidator est utilisé pour contrôler une date et
que la valeur de comparaison est définie côté code, il faut formatter cette
date au format de date courte :

```
myCompareValidator.ValueToCompare = myDateTime.ToShortDateString();
```
