---
date: 2005-10-12 10:35:00
layout: post
redirect_from: "post/2005/10/12/Nouveau-DataHelper"
tags: qc
title: "Nouveau DataHelper"
---

Le data helper intégré au projet (qc.Engine.Data) est remplacé par un projet
indépendant : BAS.Data.BDHelper.

Outre la nécessaire correction du bug lié à l'utilisation d'une variable
statique, celui-ci apporte les modifications suivantes :

* suppression des fonctions inutilisés : ExecuteXxxxxx(sql, cnxString) et
ExecuteXxxxxx(sql, cnxObject)
* disparition des providers "obsolètes" : db2oledb, oracleoledb et
sqloledb.

En ce qui concerne la [configuration
de la base de données]({% post_url 2005-07-18-configuration-base-donnees %}) dans le web.config, le mappage d'une url sur
l'identifiant de base de donnés doit être préfixé par "CnxString_" de façon
explicite :

* avant : &lt;add key="URL_http://localhost/qc" value="QcLocal" /&gt;
* après : &lt;add key="URL_http://localhost/qc" value="CnxString_QcLocal"
/&gt;
