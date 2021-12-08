---
date: 2006-09-27 17:42:00
layout: post
redirect_from: "post/2006/09/27/Les-pseudo-types-de-donnees-de-QC"
tags: qc, sql
title: "Les \"pseudo-types\" de données de QC"
---

QC étant destiné à être multi base de données, il est nécessaire de prendre
un certain nombre de précautions pour tout ce qui concerne SQL, qu'il s'agisse
des requêtes ou des types de données.

Pour les requêtes on verra plus tard, pour les types de données, c'est
ici.

Pour faciliter le développement multi base de données voire simplifier la
migration d'une base de données à l'autre, QC ne gère qu'un sous-ensemble de
types de données, qui fonctionnent de façon plus ou moins identique dans la
plupart des bases de données.

La liste des "pseudo-types" de données reconnues par QC est la suivante
:

* AUTOINCREMENT
* BOOLEAN
* SMALLINT
* INT
* BIGINT
* SINGLE
* DOUBLE
* CURRENCY
* TEXT(2000)
* TEXT
* MEMO
* DATETIME
* DATE
* TIME
* BINDATA

Remarques :

* Pour le type de données TEXT, il faut impérativement définir une longueur
comprise entre 1 et 255 ou strictement égale à 2000.
* Il est conseillé d'éviter d'utiliser des données de types CURRENCY
(n'existe réellement que sous Access et Sql Server) et BINDATA.
* Le type DATE et le type TIME ne doivent pas être utilisés. Ils sont
uniquement destinés à gérer des tables déjà existantes pour lesquelles il
serait impossible de modifier le type de données.

## Transposition pour une base de données Access

* AUTOINCREMENT : INT NOT NULL IDENTITY (1, 1)
* BOOLEAN : BIT
* SMALLINT : SMALLINT
* INT : INTEGER
* BIGINT : LONG
* SINGLE : REAL
* DOUBLE : DOUBLE PRECISION
* CURRENCY : MONEY
* TEXT(2000) : MEMO
* TEXT : TEXT
* MEMO : MEMO
* DATETIME : DATETIME
* DATE : DATE
* TIME : TIME
* BINDATA : IMAGE

## Transposition pour une base de données Sql Server

* AUTOINCREMENT : INT NOT NULL IDENTITY (1, 1)
* BOOLEAN : BIT
* SMALLINT : SMALLINT
* INT : INTEGER
* BIGINT : BIGINT
* SINGLE : REAL
* DOUBLE : DOUBLE PRECISION
* CURRENCY : MONEY
* TEXT(2000) : NVARCHAR(2000)
* TEXT : NVARCHAR
* MEMO : NTEXT
* DATETIME : DATETIME
* DATE : DATETIME
* TIME : DATETIME
* BINDATA : IMAGE

## Transposition pour une base de données Oracle

* AUTOINCREMENT : INT NOT NULL
* BOOLEAN : NUMBER(1,0)
* SMALLINT : NUMBER(5,0)
* INT : NUMBER(10,0)
* BIGINT : NUMBER(20,0)
* SINGLE : FLOAT(24)
* DOUBLE : FLOAT(48)
* CURRENCY : NUMBER(19,1)
* TEXT(2000) : VARCHAR2(2000)
* TEXT : VARCHAR2
* MEMO : CLOB
* DATETIME : DATE
* DATE : DATE
* TIME : DATE
* BINDATA : BLOB

Dans le cas du pseudo-type AUTOINCREMENT, l'incrémentation automatique est
simulée à l'aide :

* d'une séquence SEQ_NomTable,
* d'un trigger before insert TRG_BI_NomTable

## Transposition pour une base de données PostgreSQL

* AUTOINCREMENT : BIGSERIAL
* BOOLEAN : NUMERIC(1)
* SMALLINT : INT2
* INT : INT4
* BIGINT : INT8
* SINGLE : FLOAT4
* DOUBLE : FLOAT8
* CURRENCY : NUMERIC(16,4)
* TEXT(2000) : VARCHAR(2000)
* TEXT : VARCHAR
* MEMO : TEXT
* DATETIME : TIMESTAMP WITHOUT TIME ZONE
* DATE : DATE
* TIME : TIME
* BINDATA : BYTEA

## Transposition pour une base de données MySQL

* AUTOINCREMENT : INT AUTO_INCREMENT
* BOOLEAN : TINYINT(1)
* SMALLINT : SMALLINT
* INT : INTEGER
* BIGINT : BIGINT
* SINGLE : FLOAT
* DOUBLE : DOUBLE PRECISION
* CURRENCY : DECIMAL(16,4)
* TEXT(2000) : TEXT
* TEXT : VARCHAR
* MEMO : MEDIUMTEXT
* DATETIME : DATETIME
* DATE : DATE
* TIME : TIME
* BINDATA : MEDIUMBLOB
