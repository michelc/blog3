---
date: 2005-08-08 09:52:00
layout: post
redirect_from: "post/2005/08/08/Correction-Announcements-box"
tags: qc
title: "Correction Announcements box"
---

Modification de la méthode employée pour définir si un contenu doit être
visible ou non. Jusqu'à présent, cela utilisait une solution empruntée à
IBuySpy mais qui ne marchait pas.

```
Visible='<%# DataBinder.Eval(Container.DataItem, "summary") != String.Empty %>'
```

Ajout de la propriété IsNotEmpty(object text) à BoxControls.cs pour pouvoir
utiliser :

```
Visible='<%# IsNotEmpty(DataBinder.Eval(Container.DataItem, "summary")) %>'
```

Et ça marche !
