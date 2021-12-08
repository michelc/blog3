---
date: 2005-10-18 13:45:00
layout: post
redirect_from: "post/2005/10/18/Structure-dune-table-SQL-Server-depuis-Information_Schema"
tags: code-snippets, sql
title: "Structure d'une table SQL Server depuis Information_Schema"
---

```
SELECT COLUMN_NAME,
       DATA_TYPE,
       CHARACTER_MAXIMUM_LENGTH,
       NUMERIC_PRECISION,
       NUMERIC_SCALE,
       IS_NULLABLE,
       COLUMNPROPERTY(OBJECT_ID(TABLE_NAME), COLUMN_NAME, 'IsIdentity') AS IS_AUTOINCREMENT,
       COLUMN_DEFAULT
FROM   INFORMATION_SCHEMA.COLUMNS
WHERE  TABLE_NAME = 'xxxxxxxx'
ORDER BY ORDINAL_POSITION
```

Edit : Voir aussi "system_function_schema.fn_datadictionary", une fonction qui renvoie le
dictionnaire de données pour n'importe quelle base Sql Server.
