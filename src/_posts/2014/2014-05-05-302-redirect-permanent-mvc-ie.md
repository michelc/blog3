---
date: 2014-05-05 13:40:00
layout: post
redirect_from: "post/2014/05/05/302-redirect-permanent-mvc-ie"
tags: mvc
title: "302 Redirect Permanent, MVC et IE"
---

Pour faire une redirection sous ASP.NET MVC, on fait :

```
return RedirectToAction("Index", "Liens", new { id = lien.Slug });
```

Cela a pour effet d'envoyer un code HTTP 302 - Moved Temporarily.

Si on a besoin d'une redirection "permanente" (en fait un code HTTP 301 - Moved
Permanently), c'est tout aussi simple :

```
return RedirectToActionPermanent("Index", "Liens", new { id = lien.Slug });
```

Et il existe aussi les helpers `RedirectPermanent()` et
`RedirectToRoutePermanent()`.

Et si comme moi on teste bêtement ça avec le premier lien venu, il n'y a pas de
"undo" des redirections permanentes sous IE ou de cache à vider pour que ça
reparte comme avant...

Heureusement, il y a un <s>bug</s> truc :

> I found solution for IE9's permanent cached in redirection issue:
>
> - Open IE9 and press Ctrl+Shift+P for private browsing
>
> - Navigate to the problem URL
>
> - Then go back to normal browsing and all should be fine again
>
> Source : <http://www.sadev.co.za/comment/2234#comment-2234>
