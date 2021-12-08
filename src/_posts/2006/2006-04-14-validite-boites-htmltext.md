---
date: 2006-04-14 13:43:00
layout: post
redirect_from: "post/2006/04/14/Validite-des-boites-Htmltext"
tags: qc
title: "Validité des boites Htmltext"
---

Avant son enregistrement en base de données, le code HTML renvoyé par
l'éditeur wysiwyg subi les vérifications suivantes :

* remplacement de l'apostrophe penchée de Word "'" par une apostrophe simple
"'",
* remplacement des trois points de suspension de Word "…" par trois vrais
points "...",
* si nécessaire, ajout de la balise fermante `</li>` aux listes
`<ul>` et `<ol>` étant donné que IE ne le fait pas.
