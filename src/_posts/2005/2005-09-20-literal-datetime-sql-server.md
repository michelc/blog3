---
date: 2005-09-20 20:42:00
layout: post
redirect_from: "post/2005/09/20/Literal-DateTime-pour-SQL-Server"
tags: code-snippets, sql
title: "Literal DateTime pour SQL Server"
---

```
CONVERT(DATETIME, 'yyyymmdd', 112)
```

112 -&gt; ISO date cf. CAST and CONVERT

Edit : une bien meilleure solution de Wild Richard :

```
{d 'yyyy-mm-dd'}
```
