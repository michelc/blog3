---
date: 2004-10-26 14:52:00
layout: post
redirect_from: "post/2004/10/26/Wdevs-Dura-Linux-sed-Linux"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Dura Linux, sed Linux"
---

My first attempt on linux wasn't a success. I get an HTTP 500 error message
because MySql.Data.dll is not found, although I uploaded it on /htdocs/bin.

So I connect to my local MySQL 4.1 Server and do a "SET PASSWORD FOR
root_at_localhost = OLD_PASSWORD('newpwd');" to solve the "Client does not
support authentication protocol..." problem. Then I update my source to use
ByteFX Data Provider instead of the new MySQL Connector/Net. Now
MySqlConnection.open() is ok but I get a new error (something like "Unespected
byte flux..." but I don't note it). It's like if ByteFX don't handle MySQL
version 4.1.6. So no sample yesterday.

I put a message in [monoforge
forum](http://www.monoforge.com/forum/) and Gianluca will install MySQL Connector/Net. During this time, I
rewrite my code to remove all db acces and build [a very simple test](http://michel.monoforge.com/default.aspx). It seems to
work one time, and now I always get a parser error.

To be continued...
