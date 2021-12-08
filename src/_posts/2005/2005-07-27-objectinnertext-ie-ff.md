---
date: 2005-07-27 16:21:00
layout: post
redirect_from: "post/2005/07/27/objectinnerText-for-IE-and-FF"
tags: code-snippets, javascript
title: "object.innerText for IE and FF"
---

Un système pour émuler la propriété innerText sous Firefox :

```
function getInnerText(elt) {
var _innerText = elt.innerText;
if (_innerText == undefined) {
  _innerText = elt.innerHTML.replace(/<[^>]+>/g,"");
}
return _innerText;
}
```

Il suffit ensuite de remplacer :

```
var text = elt.innerText;
```

par :

```
var text = getInnerText(elt);
```

En pratique, la propriété [textContent](http://developer.mozilla.org/en/docs/DOM:element.textContent)
a le même effet que innerText pour Firefox.
