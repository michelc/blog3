---
date: 2005-10-18 13:50:00
layout: post
redirect_from: "post/2005/10/18/Structure-dune-table-PostgreSQL-depuis-Information_Schema"
tags: code-snippets, sql
title: "Structure d'une table PostgreSQL depuis Information_Schema"
---

```
SELECT COLUMN_NAME,
       DATA_TYPE,
       CHARACTER_MAXIMUM_LENGTH,
       NUMERIC_PRECISION,
       NUMERIC_SCALE,
       IS_NULLABLE,
       SUBSTR(COALESCE(COLUMN_DEFAULT, '' ), 1, 8 ) = 'nextval(' AS IS_AUTOINCREMENT,
       COLUMN_DEFAULT
FROM   INFORMATION_SCHEMA.COLUMNS
WHERE  TABLE_NAME = 'xxxxxxxx'
ORDER BY ORDINAL_POSITION
```
