---
date: 2004-11-02 20:06:00
layout: post
redirect_from: "post/2004/11/02/Wdevs-MySQL-case-sensitivity"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) MySQL case sensitivity"
---

I rename qc_portals to qc_Portals and qc_screens to qc_Screens since my SQL
code in Portals.cs and Screens.cs differs from my SQL scripts to create
tables.

I'm not sure, but last week it seems that I have an error with "SELECT ...
FROM qc_Portals" when running on monoForge. I don't have such an error on my
local database.

I don't know where it come from:

* I made a mistake,
* It come from MySQL on a Linux platform,
* It's from MySQL Connector/Net,
* It's because I use InnoDB engine instead of MyISAM,
* MySQL on monoForge don't accept "CHARSET=utf8" in "CREATE TABLE"
* ...

Normally, I don't like languages with case-sensitivity, except when the
editor manages all that for me, as with VS.NET and C#. But in practice, I tend
to use it in my SQL command so that my code is prettier. So, it's not a problem
and for the moment I will not seek after this behavior.
