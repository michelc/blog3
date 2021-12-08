---
date: 2013-01-21 22:57:00
layout: post
redirect_from: "post/2013/01/21/creer-vue-access"
tags: sql
title: "Créer une vue sous Access"
---

## Mon problème

Pour simplifier un vieux traitement, j'ai eu besoin de créer une vue
légèrement compliquée sous Access.

Après avoir mis au point cette vue directement dans Access, j'ai voulu faire
un script SQL pour la créer sur la base de données de production. Ce qui a
donné un code tout simple :

```
CREATE VIEW dir_TagsByPlaces
AS
SELECT T5.Place_ID, T5.KeyPlace, T3.Tag_ID, T3.Caption
     , COUNT(T1.Link_ID) AS LinkCount
FROM   dir_Links      AS T1
     , dir_TagLinks   AS T2
     , dir_Tags       AS T3
     , dir_PlaceLinks AS T4
     , dir_Places     AS T5
WHERE  (T2.Link_ID  = T1.Link_ID)
AND    (T3.Tag_ID   = T2.Tag_ID)
AND    (T4.Link_ID  = T1.Link_ID)
AND    (T5.Place_ID = T4.Place_ID)
GROUP BY T5.Place_ID, T5.KeyPlace, T3.Tag_ID, T3.Caption
ORDER BY 2, 5 DESC
```

Mais quand j'ai voulu vérifier que ce script fonctionnait correctement, j'ai
obtenu l'erreur `Seules les requêtes SELECT simples sont autorisées dans
VIEWS. (3766)` !

Et même en enlevant le `COUNT()` et le `GROUP BY` ça
restait trop compliqué...

Finalement, j'ai réussi à trouver le truc pour que ça marche. Je ne sais pas
trop à quoi servent les vues sous Access, mais c'est pas ça qu'il faut utiliser
quand on veut l'équivalent d'une vue dans les autres bases de données.

La solution, c'est de créer une procédure :

```
CREATE PROCEDURE dir_TagsByPlaces
AS
SELECT T5.Place_ID, T5.KeyPlace, T3.Tag_ID, T3.Caption
     , COUNT(T1.Link_ID) AS LinkCount
FROM   dir_Links      AS T1
     , dir_TagLinks   AS T2
     , dir_Tags       AS T3
     , dir_PlaceLinks AS T4
     , dir_Places     AS T5
WHERE  (T2.Link_ID  = T1.Link_ID)
AND    (T3.Tag_ID   = T2.Tag_ID)
AND    (T4.Link_ID  = T1.Link_ID)
AND    (T5.Place_ID = T4.Place_ID)
GROUP BY T5.Place_ID, T5.KeyPlace, T3.Tag_ID, T3.Caption
ORDER BY 2, 5 DESC
```

Et là, ça passe comme une lettre à la poste et si je regarde la liste des
requêtes dans Access, j'y trouve bien ma "vue"
`dir_TagsByPlaces`.

## La documentation Access

### CREATE PROCEDURE, instruction

Crée une procédure stockée.

### Syntaxe

```
CREATE PROCEDURE procédure (typedonnées param1[, typedonnées param2][, ...]) AS instructionsql
```

L'instruction `CREATE PROCEDURE` se compose des éléments
suivants :

* `procédure` : Nom donné à la procédure.

* `param1, param2` : De un à 255 noms de champ ou paramètres
(paramètre : valeur qui est attribuée à une variable au début d'une
opération ou avant qu'une expression soit évaluée par un programme. Un
paramètre peut être du texte, un nombre ou un nom d'argument affecté à une
autre valeur.).

* `typedonnées` : Un des types de données SQL Microsoft
Access primaires ou un de leurs synonymes.

* `instructionsql` : Instruction SQL telle que SELECT,
UPDATE, DELETE, INSERT, CREATE TABLE, DROP TABLE, etc.

### Exemple

```
CREATE PROCEDURE Sales_By_CountryRegion ([Beginning Date] DateTime, [Ending Date] DateTime)
AS
SELECT Customer, [Ship Address]
WHERE [Shipped Date] Between [Beginning Date] And [Ending Date]
```

### Notes

Une procédure SQL se compose d'une clause PROCEDURE (qui spécifie le nom de
la procédure), d'une liste facultative de définitions de paramètres et d'une
unique instruction SQL (instruction/chaîne SQL : expression qui définit
une commande SQL, telles que SELECT, UPDATE ou DELETE, et qui inclut des
clauses telles que WHERE et ORDER BY. Les instructions/chaînes SQL sont
généralement utilisées dans des requêtes et dans des fonctions de
regroupement.).

Le nom d'une procédure ne peut être identique à celui d'une table
existante
