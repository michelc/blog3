---
date: 2012-10-08 22:27:00
layout: post
redirect_from: "post/2012/10/08/base-donnees-auto-nommee-sql-server"
tags: .net, ef, sql-server
title: "Base de données auto-nommée sous SQL Server"
---

En général, je développe en local avec des bases de données SQL Server CE.
Mais de temps en temps, je regarde ce que ça donne sous SQL Server Express
2008. Pour cela, j'ai tendance à préférer les bases attachées, parce que je
trouve ça plus pratique d'avoir un fichier ".sdf" directement dans le dossier
App_Data de mon application.

Et ce week-end j'ai eu une erreur vraiment troublante avec SQL Server
Express 2008. Je faisais un essai complet avec Entity Framework et mon
application aurait dû créer la base de données (le fichier ".sdf") et les
tables qui la compose.

> An attempt to attach an auto-named database for file
> C:\MVC\Bookmaker\Bookmaker\App_Data\Bookmaker_2013.mdf failed. A database with
> the same name exists, or specified file cannot be opened, or it is located on
> UNC share.

Il existe apparemment pas mal de raisons possibles à ce message d'erreur,
mais dans mon cas c'était "A database with the same name exists".

Pour une fois, j'ai trouvé la solution sur [Code Project](http://www.codeproject.com/Questions/192140/An-attempt-to-attach-an-auto-named-database-for-fi).

Jusqu'à présent, ma chaine de connexion à la base de données
était :

```
<add name="BookmakerContext"
     connectionString="Data Source=.\SQLEXPRESS;
                       Integrated Security=SSPI;
                       AttachDBFilename=|DataDirectory|\Bookmaker_2013.mdf;
                       User Instance=true"
     providerName="System.Data.SqlClient" />
```

En fait, il faut la compléter avec le nom de la base de données pour éviter
que SQL Server auto-nomme la base de données à créer, ce qui doit poser un
problème si une base de données de ce nom existe déjà sous SQL Server (je
suppose).

Et donc, tout est rentré dans l'ordre en ajoutant
`;Database=Bookmaker_2013` après `User
Instance=true` :

```
<add name="BookmakerContext"
     connectionString="Data Source=.\SQLEXPRESS;
                       Integrated Security=SSPI;
                       AttachDBFilename=|DataDirectory|\Bookmaker_2013.mdf;
                       User Instance=true;
                       Database=Bookmaker_2013"
     providerName="System.Data.SqlClient" />
```
