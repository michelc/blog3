---
date: 2004-10-25 12:08:00
layout: post
redirect_from: "post/2004/10/25/Wdevs-My-week-end-with-MySQL"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) My week-end with MySQL"
---

I choose to install MySQL 4.1.6 as there is a [msi
installer](http://dev.mysql.com/tech-resources/articles/4.1/installer.html). And I was affraid of cygwin that seems to come with 4.0 version.
MySQL-Front and SQLyorg are ok with it but [ByteFX Data Provider](http://www.bytefx.com/) returns an error when opening
connection : "Client does not support authentication protocol requested by
server; consider upgrading MySQL client".

So I consider upgrading to MySQL Connector/Net 1.0.0-beta available on
[mysql.com](http://dev.mysql.com/downloads/) and
`MySqlConnection.open()` is ok but `MySqlParameter()` is down. For a strange
reason, parameter name and type are necessary when instancing a new object.

Even if I don't read the 1318 pages of pdf manual, I discover some
interesting, bad and good things:

* parameters are in the form `?param1` and not `@param1`,
* no concatenation operator but a `concat()` function,
* foreign keys exists but you should use InnoDB tables instead of
MyISAM.

My biggest problem is MySQL Connector/Net. Since I can't access internet
until monday, I don't know wheter monoForge supports it or only accepts ByteFX
Data Provider.

Despite this, I create and fill my first table.

```
CREATE TABLE qc_portals (
    idPortal varchar(20) NOT NULL default '',
    title varchar(50) NOT NULL default '',
    shortTitle varchar(20) default NULL,
    PRIMARY KEY  (idPortal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO qc_portals VALUES ('default','I am testing monoForge','myPortal');
```

The purpose of this table is clear. Regarding its contents, it don't use an
autoincrement ID cause I prefer a more readeable id. And in fact, I plan to
have only one portal in a first time. The shortTitle field is a shorter title
to use with "title" tag and will be displayed in the navigator title bar.

My second table will handle each screen for a given portal. IBuySpy or DNN
have "Tabs" but I don't think it's a speaking word. As ASP.NET already have a
Page class, I use the term "screen".

```
CREATE TABLE qc_screens (
    idScreen varchar(20) NOT NULL default '',
    idPortal varchar(20) NOT NULL default '',
    title varchar(100) default NULL,
    shortTitle varchar(50) default NULL,
    order1 int(4) default NULL,
    order2 int(4) default NULL,
    order3 int(4) default NULL,
    PRIMARY KEY (idScreen),
    KEY idPortal (idPortal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE qc_screens
    ADD FOREIGN KEY (idPortal) REFERENCES qc_portals (idPortal) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO qc_screens VALUES ('home','default','Welcome','Home',1,0,0);
INSERT INTO qc_screens VALUES ('tests','default','Tests','Tests',2,0,0);
INSERT INTO qc_screens VALUES ('admin','default','Administration','Admin',3,0,0);
```

In this case too I vote for a string id. Later I could use it to maintain
clean urls. The shortTitle field will be used for tabs and menu options.
Order1, order2 and order3 define how screens are organized.

```
order1  order2  order3  screen
   1       0       0    Home
   2       0       0    Tests
   2       1       0    - Tables
   2       1       1    --- Portals
   2       1       2    --- Screens
   2       2       0    - Modules
   2       3       0    - Layout
```

The bad new is that I will have a limit of 3 levels. But at this time, I
think that should be enough. The good new is that I need only one `SELECT` with
an `ORDER BY order1, order2, order3` to read the full site map.

I already have some source code to use these two tables. It works on my PC
(ASP.NET and MySQL 4.1). This evening I'll test it on monoForge and post about
it.
