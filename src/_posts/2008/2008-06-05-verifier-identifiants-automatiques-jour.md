---
date: 2008-06-05 15:32:00
layout: post
redirect_from: "post/2008/06/05/Verifier-que-les-identifiants-automatiques-sont-a-jour"
tags: boulot
title: "Vérifier que les identifiants automatiques sont à jour"
---

L'objectif est de s'assurer que pour toutes les tables qui ont un
identifiant automatique, cet identifiant ne soit pas supérieur à la valeur de
la séquence utilisée pour générer cet identifiant. (Pourquoi on se retrouve
dans cette situation, c'est un autre problème).

Conventions :

* tous les noms de tables sont préfixés par LUX_
* tous les noms de clés primaires sont préfixés par PK_
* tous les noms de séquences sont préfixés par SEQ_LUX_

## Générer un script renvoyant la valeur maximum des identifiants de chaque
table

### Requête pour générer les SELECT MAX() de chaque table

```
SELECT 'UNION SELECT ''' || TABLE_NAME || ''' AS TB_NAME, '
       || 'MAX(' || COLUMN_NAME || ') AS TB_IDMAX '
       || 'FROM ' || TABLE_NAME
FROM   USER_IND_COLUMNS
WHERE  TABLE_NAME LIKE 'LUX_%'
AND    INDEX_NAME LIKE 'PK_%'
AND    COLUMN_NAME IN (SELECT COLUMN_NAME FROM COLS WHERE DATA_TYPE = 'NUMBER')
ORDER BY TABLE_NAME
```

### Compléter le script généré

Sous TOAD, faire clic droit dans le résultat de la requête et choisir SaveAs
et enregistrer dans le presse-papiers, ce qui donne :

```
UNION SELECT 'LUX_BANQUES' AS TB_NAME, MAX(IDBANQUE) AS TB_IDMAX FROM LUX_BANQUES
UNION SELECT 'LUX_CLIENTS' AS TB_NAME, MAX(IDCLIENT) AS TB_IDMAX FROM LUX_CLIENTS
UNION SELECT 'LUX_COMPTES' AS TB_NAME, MAX(IDCOMPTE) AS TB_IDMAX FROM LUX_COMPTES
UNION SELECT 'LUX_CONTACTS' AS TB_NAME, MAX(IDCONTACT) AS TB_IDMAX FROM LUX_CONTACTS
...
```

Dans Notepad, enlever le premier UNION et préfixer par un CREATE TABLE

```
CREATE TABLE TMP_IDMAXIMUMS AS
SELECT 'LUX_BANQUES' AS TB_NAME, MAX(IDBANQUE) AS TB_IDMAX FROM LUX_BANQUES
UNION SELECT 'LUX_CLIENTS' AS TB_NAME, MAX(IDCLIENT) AS TB_IDMAX FROM LUX_CLIENTS
UNION SELECT 'LUX_COMPTES' AS TB_NAME, MAX(IDCOMPTE) AS TB_IDMAX FROM LUX_COMPTES
UNION SELECT 'LUX_CONTACTS' AS TB_NAME, MAX(IDCONTACT) AS TB_IDMAX FROM LUX_CONTACTS
...
```

Puis exécuter ce script pour obtenir une première table TMP_IDMAXIMUMS qui
enregistrera la valeur maximum de l'identifiant de chaque table

## Créer une seconde table pour enregistrer la valeur maximum de chaque
séquence

```
CREATE TABLE TMP_SEQMAXIMUMS AS
SELECT SUBSTR(SEQUENCE_NAME, 5) AS TB_NAME, LAST_NUMBER AS TB_SEQMAX
FROM   USER_SEQUENCES
WHERE  SEQUENCE_NAME LIKE 'SEQ_LUX_%'
```

## Comparer le contenu des deux tables

```
SELECT T1.TB_NAME, TB_IDMAX, TB_SEQMAX
FROM   TMP_IDMAXIMUMS  T1,
       TMP_SEQMAXIMUMS T2
WHERE  T1.TB_NAME = T2.TB_NAME
AND    TB_IDMAX > TB_SEQMAX
```
