---
date: 2020-01-21 12:28:02
layout: post
lang: en-US
tags: sql
title: "SQL Join Memento"
image: "/public/2020/sql-join.jpg"
excerpt: "I'm still learning how to write SQL joins, without getting stuck with a basic «WHERE Table1.Foreign_ID = Table2.ID»..."
---

{:.encart}
As I'm a bit slow on JavaScript and also I need to revive my SQL knowledge, I take this opportunity to revisit and translate some of my old posts: [Mémento des jointures en SQL]({% post_url 2012-03-21-memento-jointures-sql %}){:hreflang="fr"}.

Recently (i.e. March 2012), I needed to make a rather complicated comparison between two tables, to highlight all the <s>errors</s> differences between them, including data that only appear in one of the two tables. Given my level in SQL joins, it's impossible to remember how to do this from memory.

<figure>
  <img src="{{ page.image }}" alt="sql-join" />
  <figcaption>
    <a href="https://blog.jooq.org/2016/07/05/say-no-to-venn-diagrams-when-explaining-joins/">Say NO to Venn Diagrams When Explaining JOINs</a>
  </figcaption>
</figure>

Fortunately, a visit to the [Join (SQL)](https://en.wikipedia.org/wiki/Join_(SQL)) page on Wikipedia made me (re?)discover the FULL OUTER JOIN, which I completed with Jeff Atwood's post [A Visual Explanation of SQL Joins](http://www.codinghorror.com/blog/2007/10/a-visual-explanation-of-sql-joins.html).

So I took this opportunity to review the different types of joints, to learn the two types of syntax (explicit and implicit) and also to discover some tricks that I didn't know at all:

* the natural join: convention over configuration
* the cross join: I didn't know there was a dedicated keyword to do that willingly


## Creation of 2 tables to test (for Oracle)

### 1st table

```
CREATE TABLE Table1 AS
SELECT 1 AS ID, 'Un' AS Libelle FROM DUAL
UNION
SELECT 2 AS ID, 'Deux' AS Libelle FROM DUAL
UNION
SELECT 3 AS ID, 'Trois' AS Libelle FROM DUAL

SELECT * FROM Table1
=>
ID  Libelle
--  -------
1   Un
2   Deux
3   Trois
```

### 2nd table

```
CREATE TABLE Table2 AS
SELECT 1 AS ID, 'One' AS Caption FROM DUAL
UNION
SELECT 2 AS ID, 'Two' AS Caption FROM DUAL
UNION
SELECT 4 AS ID, 'Four' AS Caption FROM DUAL

SELECT * FROM Table2
=>
id  caption
--  -------
1   One
2   Two
4   Four
```


## INNER JOIN

We only take what exists on both sides.

### Explicit syntax

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
INNER JOIN Table2 T2 ON T1.ID = T2.ID
```

### Implicit syntax

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
WHERE  T2.ID = T1.ID
```

### "Natural" syntax

```
SELECT ID, T1.Libelle, T2.Caption
FROM   Table1 T1
NATURAL JOIN Table2 T2
```

### Result

```
ID  Libelle  Caption
--  -------  -------
1   Un       One
2   Deux     Two
```


## CROSS JOIN

We take everything from both sides without making a match <=> Cartesian product.


### Explicit syntax

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
CROSS JOIN Table2 T2
```

### Implicit syntax

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
```

### Result

```
ID  Libelle  Caption
--  -------  -------
1   Un       One
1   Un       Two
1   Un       Four
2   Deux     One
2   Deux     Two
2   Deux     Four
3   Trois    One
3   Trois    Two
3   Trois    Four
```


## LEFT OUTER JOIN

We take everything on the left (i.e. the first table) and the other one follows.

### Explicit syntax

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
LEFT OUTER JOIN Table2 T2 ON T1.ID = T2.ID
```

### Implicit syntax

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
WHERE  T2.ID(+) = T1.ID
```

### Result

```
ID  Libelle  Caption
--  -------  -------
1   Un       One
2   Deux     Two
3   Trois
```


## RIGHT OUTER JOIN

We take everything on the right (i.e. the second table) and the other one follows.

### Explicit syntax

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
RIGHT OUTER JOIN Table2 T2 ON T1.ID = T2.ID
```

### Implicit syntax

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
WHERE  T2.ID = T1.ID(+)
```

### Result

```
ID  Libelle  Caption
--  -------  -------
1   Un       One
2   Deux     Two
             Four
```


## FULL OUTER JOIN

We take what exists on both sides.

### Explicit syntax

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
FULL OUTER JOIN Table2 T2 ON T1.ID = T2.ID
```

### Implicit syntax (or how to do without knowledge)

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
WHERE  T2.ID(+) = T1.ID
UNION
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
WHERE  T2.ID = T1.ID(+)
```

### Result

```
ID  Libelle  Caption
--  -------  -------
1   Un       One
2   Deux     Two
             Four
3   Trois
```

### Improved version to get ID

```
SELECT NVL(T1.ID, T2.ID) AS ID, T1.Libelle, T2.Caption
FROM   Table1 T1
FULL OUTER JOIN Table2 T2 ON T1.ID = T2.ID

=>

ID  Libelle  Caption
--  -------  -------
1   Un       One
2   Deux     Two
4            Four
3   Trois
```
