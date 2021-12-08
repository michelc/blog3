---
date: 2005-07-18 13:35:00
layout: post
redirect_from: "post/2005/07/18/Configuration-base-de-donnees"
tags: qc
title: "Configuration base de données"
---

Jusqu'à présent, la sélection de l'identifiant de la base de donnée à
utiliser se faisait en dur dans le Global.asax.cs. C'est désormais paramétrable
via le web.config de la façon suivante :

* &lt;add key="URL_http://localhost/qc" value="QcLocal" /&gt;
* &lt;add key="URL_http://localhost:8088/" value="QcXSP" /&gt;
* &lt;add key="URL_http://qctest.monoforge.com/" value="QcTest" /&gt;

Ensuite, il suffit comme auparavant de configurer la chaine de connection
pour chaque identifiant :

* &lt;add key="CnxString_QcLocal"
value="Provider=Microsoft.Jet.OLEDB.4.0;Data Source=...
* &lt;add key="CnxString_QcXSP" value="{mysql};Database=quickcontent;Data
Source=...
* &lt;add key="CnxString_QcTest" value="{mysql};Database=qctest;Data
Source=...
