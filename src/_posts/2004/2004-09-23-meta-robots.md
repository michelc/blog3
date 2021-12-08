---
date: 2004-09-23 10:50:00
layout: post
redirect_from: "post/2004/09/23/Meta-Robots"
tags: qc
title: "Meta Robots"
---

Modifié /Default.aspx.cs de façon à insérer automatiquement une balise
&lt;meta name="robots" content="noindex,nofollow"&gt; lorsque la page n'est pas
une page "publique".

Liste des cas où la balise n'est pas générée :

* une page de consultation pour laquelle viewRoles contient "All Users"
* une page de modification pour laquelle editRoles contient "All Users"

Ainsi, si une page "privée" est liée depuis une page "publique", elle ne
sera pas indexée dans Google.

Référence : [Ce que je préfère chez MSN par rapport à Google](http://googleguy-fr.blogspot.com/2004/09/ce-que-jaime-mieux-propos-de-msn.html)
