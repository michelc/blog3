---
date: 2005-11-28 15:21:00
layout: post
redirect_from: "post/2005/11/28/Fonction-BoolParse"
tags: qc
title: "Fonction BoolParse()"
---

Ajout d'une fonction BoolParse() à Common.cs pour mutualiser les quelques
lignes de code servant habituellement à transformer une valeur chaine en
booléen :

```
string tempYesOrNo = box.boxSettings["boxYesOrNo"];
if (tempYesOrNo == "") {
   tempYesOrNo = bool.FalseString;
}
bool boxYesOrNo = bool.Parse(tempYesOrNo);
```

Puis mise en place de cette fonction dans tous les sources du projets
qc.Classics.
