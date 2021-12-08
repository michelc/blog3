---
date: 2005-04-11 13:07:00
layout: post
redirect_from: "post/2005/04/11/Confirmer-la-sortie-dun-formulaire"
tags: code-snippets, javascript
title: "Confirmer la sortie d’un formulaire"
---

Cette méthode fonctionne avec Internet Explorer (testé avec IE6) et Firefox
(testé avec FF 1.5)

```
window.onbeforeunload = function (evt) {
var message = 'Are you sure you want to leave?';
if (typeof evt == 'undefined') {
  evt = window.event;
}
if (evt) {
  evt.returnValue = message;
}
  return message;
}
```
