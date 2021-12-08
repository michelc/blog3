---
date: 2013-02-11 22:30:00
layout: post
redirect_from: "post/2013/02/11/erreur-generation-controleur-sql-ce"
tags: ef, mvc, sql-server
title: "Erreur génération template contrôleur avec SQL CE"
---

J'ai encore eu un problème avec [SQL Server](/tags/sql-server/) :)

Ce coup-ci, c'est SQL CE qui me donne du soucis. J'ai commencé à faire des
tests pour utiliser [Twitter Bootstrap](http://twitter.github.com/bootstrap/) avec ASP.NET MVC. Après quelques essais de base,
j'ai lancé la génération automatique d'un contrôleur et des vues afférentes
pour avoir un peu plus de matière à travailler.

Je procède normalement :

* Clic-droit sur le dossier Controllers dans l'explorateur de solution,
* Ajouter,
* Controller...

![](/public/2013/controller-sql-ce-add.jpg)

Je clique sur le bouton [Add] et boum !

![](/public/2013/controller-sql-ce-error.jpg)

> Unable to retrieve metadata for 'Bootstrap3.Models.Events'. Access to the
> database file is not allowed. [ 1884,File name = c:\Program Files
> (x86)\Microsoft Visual Studio 10.0\Common7\IDE\Department.sdf,SeCreateFile
> ]

J'avais déjà eu ce problème sur un autre projet mais je pensais que c'était
"normal" et que j'avais dû y casser quelque chose. Mais là, un projet tout
neuf !

En fait, le problème vient du fait que j'utilise une base de données SQL
Server CE que j'ai donc configurée dans le fichier Web.config :

```
<connectionStrings>
  <add name="DepartmentContext"
       connectionString="Data Source=|DataDirectory|Department.sdf"
       providerName="System.Data.SqlServerCe.4.0" />
</connectionStrings>
```

Et apparemment, le système de template de VS 2010 ou ASP.NET MVC 3 n'aime
pas trop le `|DataDirectory|` pour figurer le sous-répertoire
"App_Data".

Le problème disparaît en indiquant le vrai chemin pour ce dossier :

```
<connectionStrings>
  <add name="DepartmentContext"
       connectionString="Data Source=C:\MVC\Bootstrap3\Bootstrap3\App_Data\Department.sdf"
       providerName="System.Data.SqlServerCe.4.0" />
</connectionStrings>
```
