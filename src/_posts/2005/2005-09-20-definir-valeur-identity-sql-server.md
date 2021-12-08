---
date: 2005-09-20 21:12:00
layout: post
redirect_from: "post/2005/09/20/Definir-une-valeur-Identity-sous-Sql-Server"
tags: code-snippets, sql
title: "Définir une valeur Identity sous Sql Server"
---

```
SET IDENTITY_INSERT MyTable ON;
INSERT INTO MyTable
    (MyIdentityField, MyFirstField, MySecondField)
VALUES
    (12345, 'ABCDE', 'etc...');
SET IDENTITY_INSERT MyTable OFF;
```
