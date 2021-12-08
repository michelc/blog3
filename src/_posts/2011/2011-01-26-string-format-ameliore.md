---
date: 2011-01-26 14:30:00
layout: post
redirect_from: "post/2011/01/26/un-string-format-ameliore"
tags: code-snippets, csharp
title: "Un String.Format() amélioré"
---

Plutôt que se contenter de :

```
var result = string.Format("{0} messages lus sur {1}", lus, total);
```

On peut pomper la méthode d'extension .With() de [Sutekishop](http://code.google.com/p/sutekishop/) :

```
/// <summary>
/// replacement for String.Format
/// </summary>
public static string With(this string format, params object[] args)
{
    return string.Format(format, args);
}
```

Et obtenir quelque chose d'un peu plus élégant :

```
var result = "{0} messages lus sur {1}".With(lus, total);
```
