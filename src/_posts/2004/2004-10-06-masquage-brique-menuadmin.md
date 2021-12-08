---
date: 2004-10-06 20:56:00
layout: post
redirect_from: "post/2004/10/06/Masquage-brique-menuAdmin"
tags: qc
title: "Masquage brique menuAdmin"
---

Ajouté un bouton au menu d'administration pour pouvoir cacher toutes les
commandes d'administration et de mise à jour du site => affichage plus
lisible (moins pollué par les différentes icones).

Apparament, le fait d'affecter la propriété .ImageUrl d'un contrôle
ImageButton n'a aucun effet quand celui-ci n'est pas visible => faire un
.Visible = true avant.

Supprimé la mise en cache de tous les modules pour que ça ait immédiatement
de l'effet.

```
foreach (System.Collections.DictionaryEntry entry in Cache) {
    string entryKey = entry.Key.ToString();
    if (entryKey.StartsWith("CKey:") == true) {
        Cache.Remove(entryKey); 
    }
}
```

Note: ça ne marche qu'avec les modules chargés après le menu
d'administration :)
