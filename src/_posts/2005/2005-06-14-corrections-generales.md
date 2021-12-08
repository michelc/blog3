---
date: 2005-06-14 15:01:00
layout: post
redirect_from: "post/2005/06/14/Corrections-generales"
tags: qc
title: "Corrections générales"
---

Correction d'un certain nombre de classes pour :

* passer les variables gérant les propriétés de "public" à "private",
* remplacer les paramètres DbType.Int16 par DbType.Int32,
* corriger le type de paramètre DbType.String en DbType.Int32 de id_Backup en
modification

Suppression de "using" inutiles dans listContacts.ascx.cs depuis le
remplacement du DataGrid par XTable.

Corrigé "asmin" par "admin" dans Common.actionRoles().

Supprimé le double appel à Regular.CommonVariable dans
Email.generalReplace.

Corrigé la requête sql pour mise à jour de qc_Screens qui faisait perdre le
champ description.
