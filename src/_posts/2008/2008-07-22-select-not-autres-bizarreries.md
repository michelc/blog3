---
date: 2008-07-22 16:02:00
layout: post
redirect_from: "post/2008/07/22/Select-Not-IN-et-autres-bizarreries"
tags: sql
title: "Select ... Not IN et autres bizarreries"
---

Vite fait qui ne marche pas (0 résultat (**???**), 4 secondes)
:

```
SELECT *
FROM   lux_ResourcesEntrys
WHERE  idResourcesEntry NOT IN (SELECT idEntry FROM lux_Extends)
```

Vite fait qui se traine (2874 résultats, 13 secondes) :

```
SELECT *
FROM   lux_ResourcesEntrys
MINUS
SELECT *
FROM   lux_ResourcesEntrys
WHERE  idResourcesEntry IN (SELECT idEntry FROM lux_Extends)
```

Bien fait (2874 résultats, 101 **milli**-secondes) :

```
SELECT T1.*
FROM   lux_ResourcesEntrys T1, lux_Extends T2
WHERE  T1.idResourcesEntry = T2.idEntry(+)
AND    T2.idEntry IS NULL
ORDER BY T1.idResourcesEntry DESC
```
