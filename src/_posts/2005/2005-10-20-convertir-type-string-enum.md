---
date: 2005-10-20 13:15:00
layout: post
redirect_from: "post/2005/10/20/Convertir-un-type-String-en-Enum"
tags: code-snippets, csharp
title: "Convertir un type String en Enum"
---

```
enum EngineType {
  unknow,
  access,
  db2,
  mysql,
  odbc,
  oledb,
  oracle,
  postgre,
  sqlserver
}
string cnxTypeString = "mysql";
EngineType cnxTypeEngine = EngineType.unknow;
if (Enum.IsDefined(typeof(EngineType), cnxTypeString)) {
  cnxTypeEngine = (EngineType) Enum.Parse(typeof(EngineType), cnxTypeString, true);
}
```
