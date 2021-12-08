---
date: 2005-09-22 08:20:00
layout: post
redirect_from: "post/2005/09/22/Ameliorations-de-Datacs"
tags: qc
title: "Améliorations de Data.cs"
---

Suite aux essais réalisés avec d'autre base de données, mise au point de la
gestion des dates dans le DataHelper :

* nullDateTime : passe du 18/03/1582 au 31/12/1799 (cf. [
DATE: Supported Ranges](http://www.analysisandsolutions.com/presentations/portability/slides/date-range.htm))
* minDateTime : passe du 01/01/1900 au 01/01/1800
* ajout de la fonction #COALESCE(fieldName, valueIfNull) (cf. [Replace a NULL with
a specific value](http://sqlzoo.net/howto/source/z.dir/tip267913/sqlserver))
* utilisation de la forme ansi {d 'yyyy-mm-dd'} pour les dates litérales sous
SqlServer (cf. [Literal
DateTime for SqlServer]({% post_url 2005-09-20-literal-datetime-sql-server %}))
