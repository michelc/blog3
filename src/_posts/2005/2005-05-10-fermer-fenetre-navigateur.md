---
date: 2005-05-10 16:11:00
layout: post
redirect_from: "post/2005/05/10/Fermer-la-fenetre-du-navigateur"
tags: code-snippets, javascript
title: "Fermer la fenêtre du navigateur"
---

Cette méthode fonctionne avec Internet Explorer (testé avec IE6) et Firefox
(testé avec FF 1.5)

```
<input type="button" value="Close" onclick="CloseWindow();" />
<script type='text/javascript'>
<!--
function CloseWindow() {
        ww = window.open(window.location, "_self");
        ww.close();
}
-->
</script>
```
