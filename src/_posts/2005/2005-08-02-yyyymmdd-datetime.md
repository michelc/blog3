---
date: 2005-08-02 16:56:00
layout: post
redirect_from: "post/2005/08/02/yyyymmdd-to-DateTime"
tags: code-snippets, csharp
title: "yyyymmdd to DateTime"
---

```
DateTime myDate;
myDate = System.DateTime.ParseExact("20050802",
                                    "yyyyMMdd",
                                    System.Globalization.CultureInfo.InvariantCulture);
```
