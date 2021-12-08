---
date: 2006-05-10 12:36:00
layout: post
redirect_from: "post/2006/05/10/Debuguer-un-formulaire-personnalise"
tags: qc
title: "Débuguer un formulaire personnalisé"
---

Il est possible d'ajouter un champ caché pour mettre au point le formulaire
personnalisé :

```
<input type="hidden" name="_debug" value="true" />
```

A partir du moment où ce champ est présent dans le formulaire (et quelle que
soit sa valeur), le destinataire, le sujet et contenu du mél sont affichés
ainsi que le message d'erreur éventuel.
