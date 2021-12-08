---
date: 2006-03-03 08:45:00
layout: post
redirect_from: "post/2006/03/03/TreeView-et-guillemets"
tags: qc
title: "TreeView et guillemets"
---

Mise à jour de la classe TreeView.cs qui génère le code javascript attendu
par le script [dTree](http://www.destroydrop.com/javascripts/tree/)
et employé pour présenter les listes arborescentes comme celle des écrans ou
celle des boites.

Il y avait un problème lorsque le nom de l'écran contenait un guillemet, ce
qui faussait le code javascript généré.

```
tv.add(4, 2, "Croisière "Le Rhin Romantique"", "#", "GoTo(this, '/sejours/le-rhin-romantique.aspx');", "le-rhin-romantique");
```

Pour que tout rentre dans l'ordre, il suffit de préfixer les guillemets du
javascript par un "\", mais étant donné que le javascript est généré depuis du
C# il ne faut pas s'emmeler les pinceaux :

```
sbScript.Append("\"" + this.name.Replace("\"", "\\\"") + "\", ");
```

Grace à quoi il est enfin possible d'avoir des titres d'écrans avec des
guillemets :

```
tv.add(4, 2, "Croisière \"Le Rhin Romantique\"", "#", "GoTo(this, '/sejours/le-rhin-romantique.aspx');", "le-rhin-romantique");
```
