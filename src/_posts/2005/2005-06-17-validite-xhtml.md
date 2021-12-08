---
date: 2005-06-17 10:25:00
layout: post
redirect_from: "post/2005/06/17/Validite-XHtml"
tags: qc
title: "Validité XHtml"
---

Mise à jour de Xhtml.cs pour :

* supprimer l'attribut name à la balise `<form>`
* encadrer le viewstate dans une `<div>`
* remplacer `language="javascript"` par `type="text/javascript"`

Plus correction indentation et `</li>` surnuméraire dans Macro.SiteMenu() de
façon à ce que le code html des pages puisse valider. Et c'est OK sur la page
d'accueil !
