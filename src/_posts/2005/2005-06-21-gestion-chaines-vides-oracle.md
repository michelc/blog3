---
date: 2005-06-21 08:01:00
layout: post
redirect_from: "post/2005/06/21/Gestion-des-chaines-vides-avec-Oracle"
tags: qc
title: "Gestion des chaines vides avec Oracle"
---

Modification de Data.cs pour gérer le fait que Oracle ne fait pas la
différence entre une chaine vide ("") et une chaine nulle (null).

Modification de la méthode privée AttachParameters() pour remplacer la
propriété Value du paramètre par DBNull.Value lorsque les trois conditions
suivantes sont remplies :

* il s'agit d'une connexion de type oracle ou oracleoledb,
* le paramètre est de type DbType.String ou DbType.AnsiString,
* la valeur du paramètre correspond à une chaine nulle ou vide.

AddParameter a également été modifié pour gérer cas où le type du paramètre
est renseigné dès sa création.
