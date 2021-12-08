---
date: 2007-07-11 14:57:00
layout: post
redirect_from: "post/2007/07/11/Faire-un-Join-sur-un-ArrayList"
tags: code-snippets, csharp
title: "Faire un Join sur un ArrayList"
---

```
string texts = string.Join(",", (string[]) myArrayList.ToArray(typeof(string)));;
```
