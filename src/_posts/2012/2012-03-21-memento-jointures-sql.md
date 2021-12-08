---
date: 2012-03-21 19:57:00
layout: post
redirect_from: "post/2012/03/21/memento-jointures-sql"
tags: sql
title: "Mémento des jointures en SQL"
image: "/public/2020/sql-join.jpg"
excerpt: "J'essaie encore une fois de comprendre comment faire des jointures SQL sans passer par un bête «WHERE Table1.Foreign_ID = Table2.ID»..."
---

Dernièrement, j'ai eu besoin de faire une comparaison assez compliquée entre deux tables, pour faire ressortir toutes les <s>anomalies</s> différences entre les deux, y compris les données qui n'apparaissent que dans une des deux tables. Etant donné mon niveau en jointures, impossible de me souvenir comment faire de mémoire.

<figure>
  <img src="{{ page.image }}" alt="sql-join" />
  <figcaption>
    <a href="https://blog.jooq.org/2016/07/05/say-no-to-venn-diagrams-when-explaining-joins/">Say NO to Venn Diagrams When Explaining JOINs</a>
  </figcaption>
</figure>

Heureusement, un passage par la page [Join (SQL)](https://en.wikipedia.org/wiki/Join_(SQL)) sur Wikipedia m'a fait (re?)découvrir les FULL OUTER JOIN, ce que j'ai complété par le billet [A Visual Explanation of SQL Joins](http://www.codinghorror.com/blog/2007/10/a-visual-explanation-of-sql-joins.html) de Jeff Atwood.

J'ai donc profité de cette occasion pour réviser les différents types de jointures, faire le point sur les deux types de syntaxes possibles (explicite et implicite) et aussi découvrir quelques trucs que je ne connaissais absolument pas :

* le natural join : convention over configuration
* le cross join : je ne savais pas qu'il existait un mot clé dédié pour faire ça de son plein gré

## Création de 2 tables pour les essais (sous Oracle)

### 1° table

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

### 2° table

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

On ne prend que ce qui existe des 2 côtés.

### Syntaxe explicite

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
INNER JOIN Table2 T2 ON T1.ID = T2.ID
```

### Syntaxe implicite

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
WHERE  T2.ID = T1.ID
```

### Syntaxe "naturelle"

```
SELECT ID, T1.Libelle, T2.Caption
FROM   Table1 T1
NATURAL JOIN Table2 T2
```

### Résultat

```
ID  Libelle  Caption
--  -------  -------
1   Un       One
2   Deux     Two
```

## CROSS JOIN

On prend tout des 2 côtés sans faire de correspondance <=> produit cartésien.

### Syntaxe explicite

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
CROSS JOIN Table2 T2
```

### Syntaxe implicite

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
```

### Résultat

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

On prend tout ce qui est à gauche (ie la 1° table) et l'autre suit.

### Syntaxe explicite

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
LEFT OUTER JOIN Table2 T2 ON T1.ID = T2.ID
```

### Syntaxe implicite

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
WHERE  T2.ID(+) = T1.ID
```

### Résultat

```
ID  Libelle  Caption
--  -------  -------
1   Un       One
2   Deux     Two
3   Trois
```

## RIGHT OUTER JOIN

On prend tout ce qui est à droite (ie la 2° table) et l'autre suit.

### Syntaxe explicite

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
RIGHT OUTER JOIN Table2 T2 ON T1.ID = T2.ID
```

### Syntaxe implicite

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1,
       Table2 T2
WHERE  T2.ID = T1.ID(+)
```

### Résultat

```
ID  Libelle  Caption
--  -------  -------
1   Un       One
2   Deux     Two
             Four
```

## FULL OUTER JOIN

On prend ce qui existe des 2 côtés.

### Syntaxe explicite

```
SELECT T1.ID, T1.Libelle, T2.Caption
FROM   Table1 T1
FULL OUTER JOIN Table2 T2 ON T1.ID = T2.ID
```

### Syntaxe implicite (ou comment faire sans)

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

### Résultat

```
ID  Libelle  Caption
--  -------  -------
1   Un       One
2   Deux     Two
             Four
3   Trois
```

### Version améliorée pour avoir l'ID

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

{:.encart}
English version: [SQL Join Memento]({% post_url 2020-01-21-sql-join-memento %}){:hreflang="en"}.
