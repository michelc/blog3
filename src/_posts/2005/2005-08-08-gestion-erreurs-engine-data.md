---
date: 2005-08-08 16:48:00
layout: post
redirect_from: "post/2005/08/08/Gestion-erreurs-dans-Engine.Data"
tags: qc
title: "Gestion d'erreurs dans Engine.Data"
---

Modification de Engine.Data pour reconnaitre et gérer un message d'erreur
spécial pour les 4 types d'erreurs suivantes :

* pkviolation : enregistrement déjà existant,
* nullvalue : champ obligatoire non renseigné,
* fkviolation : enregistrement parent inexistant (en
insertion/màj),
* fkchildren : existence d'enregistrements enfants (en
suppression).

Prise en compte des différents codes / numéros / statuts d'erreurs pour las
base de données Access, MySQL, PostgreSQL, Oracle et SqlServer / MSDE.

Réalisation d'un script de test pour vérifier que tout est OK quelle que
soit la base :

```
/*
  -------------------- Drop tests tables
*/
DROP TABLE test_Childs;
GO;
DROP TABLE test_Parents;
GO;

/*
  -------------------- test_Parents
*/
CREATE TABLE test_Parents (
  idParent AUTOINCREMENT,
  caption TEXT(255) NOT NULL,
  etcetera TEXT(255) NOT NULL,
  CONSTRAINT PK_Parents PRIMARY KEY (idParent)
);
GO;

/*
  -------------------- test_Childs
*/
CREATE TABLE test_Childs (
  idChild AUTOINCREMENT,
  idParent INT NOT NULL,
  caption TEXT(255) NOT NULL,
  CONSTRAINT PK_Childs PRIMARY KEY (idChild)
);
GO;
ALTER TABLE test_Childs
ADD CONSTRAINT FK_Parents
FOREIGN KEY (idParent)
REFERENCES test_Parents (idParent)
ON UPDATE CASCADE; 
GO;

/*
  -------------------- test_Parents
*/
/* No error */
INSERT INTO test_Parents (caption, etcetera)
VALUES ('Un', '...');
GO;
/* No error */
INSERT INTO test_Parents (caption, etcetera)
VALUES ('Deux', '...');
GO;
/* nullvalue */
INSERT INTO test_Parents (caption)
VALUES ('Trois');
GO;
/* nullvalue */
INSERT INTO test_Parents (caption, etcetera)
VALUES ('Trois', NULL);
GO;
/* pour sql-server */
SET IDENTITY_INSERT test_Parents ON;
GO;
/* pkviolation */
INSERT INTO test_Parents (idParent, caption, etcetera)
VALUES (1, 'Premier', '...');
GO;

/*
  -------------------- test_Childs
*/
/* No error */
INSERT INTO test_Childs (idParent, caption)
VALUES (1, '1-Un');
GO;
/* No error */
INSERT INTO test_Childs (idParent, caption)
VALUES (2, '2-Deux');
GO;
/* fkchildren */
INSERT INTO test_Childs (idParent, caption)
VALUES (99, '90-Neuf');
GO;

/*
  -------------------- test_Parents
*/
/* No error */
DELETE FROM test_Parents WHERE idParent = 1;
GO;

/*
  -------------------- Drop tests tables
*/
DROP TABLE test_Childs;
GO;
DROP TABLE test_Parents;
GO;
```

Ce test doit générer les 5 erreurs suivantes :

```
* INSERT INTO test_Parents (caption) VALUES ('Trois');
=> Erreur: Un champ obligatoire de la fiche n'est pas renseigné.
* INSERT INTO test_Parents (caption, etcetera) VALUES ('Trois', NULL);
=> Erreur: Un champ obligatoire de la fiche n'est pas renseigné.
* INSERT INTO test_Parents (idParent, caption, etcetera) VALUES (1,
'Premier', '...');
=> Erreur: Cette fiche existe déjà dans la base de données.
* INSERT INTO test_Childs (idParent, caption) VALUES (99, '90-Neuf');
=> Erreur: Certains éléments liés à cette fiche n'existent pas dans la base de données.
* DELETE FROM test_Parents WHERE idParent = 1;
=> Erreur: Ces informations sont utilisées dans une autre fiche.
```

Bizarrerie : la requête `<INSERT INTO test_Parents (caption) VALUES
('Trois');>` ne provoque pas d'erreur avec MySQL (version 4.1 sous Windows tout
du moins).
