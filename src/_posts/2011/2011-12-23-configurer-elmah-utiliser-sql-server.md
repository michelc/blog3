---
date: 2011-12-23 13:27:00
layout: post
redirect_from: "post/2011/12/23/configurer-elmah-pour-utiliser-sql-server"
tags: .net, sql-server
title: "Configurer ELMAH pour utiliser SQL Server"
---

Pour avancer un peu plus dans mon [utilisation d'ELMAH]({% post_url 2011-09-28-installer-elmah-nuget %}), j'ai cherché à enregistrer les informations qu'il
collecte dans une base de données.

Pour cela, j'ai réalisé quelques essais pour voir comment faire et pour
comprendre comment cela fonctionnait :

* Configuration automatique de SQL Server Compact
* Configuration semi-automatique SQL Server
* Configuration manuelle de SQL Server Compact

La suite de ce billet récapitule le fonctionnement propre à chacune de ces
méthodes.

## ELMAH + Sql Server Compact en automatique

Sous NuGet, je recherche "elmah" puis choisis le package "ELMAH on MS SQL
Server Compact". Sa description indique qu'il s'agit d'une configuration pour
démarrer rapidement avec une base de données Microsoft SQL Server Compact.

Ca semble être un meilleur choix que "ELMAH on MS SQL Server (requires
manual config)" puisque à priori, l'absence de "requires manual config" devant
logiquement signifier que je n'aurai rien à faire.

Je clique sur le bouton [Install] et l'installation débute, mais impose
l'installation de Sql Server Compact 4.0.8+. Je tique un peu parce qu'il me
semblait que j'étais à jour ? Mais bon, [I accept] et le projet référence
maintenant 2 packages supplémentaires :

* ELMAH on MS SQL Server Compact
* SqlServerCompact

Il suffit alors de relancer l'application et de se rendre sur l'URL
elmah.axd pour confirmer que tout a été configuré sans que effectivement j'ai
eu quoi que ce soit à faire : `"This log is provided by the SQL
Server Compact Error Log"`. Génial !

Si je regarde dans le dossier "App_Data", je constate qu'il contient
désormais une base de données "Elmah.sdf". Un double-clic pour l'ouvrir et je
peux voir que celle-ci est constitué d'une seule table "ELMAH_Error", avec les
colonnes nécessaire pour enregistrer tout le détail des erreurs :

* ErrorId
* Application
* Host
* Type
* Source
* Message
* User
* StatusCode
* TimeUtc
* Sequence
* AllXml

Et si maintenant j'étudie ce qui a changé dans l'application, je m'aperçois
qu'en fait c'est trois fois rien dans le web.config :

Un :

```
<connectionStrings>
  ...
  <add name="elmah-sqlservercompact"
       connectionString="Data Source=|DataDirectory|\Elmah.sdf" />
</connectionStrings>
```

Deux :

```
<system.data>
  <DbProviderFactories>
    <remove invariant="System.Data.SqlServerCe.4.0" />
    <add name="Microsoft SQL Server Compact Data Provider 4.0"
         invariant="System.Data.SqlServerCe.4.0"
         description=".NET Framework Data Provider for Microsoft SQL Server Compact" type="System.Data.SqlServerCe.SqlCeProviderFactory, System.Data.SqlServerCe, Version=4.0.0.0, Culture=neutral, PublicKeyToken=89845dcd8080cc91" />
  </DbProviderFactories>
</system.data>
```

Et trois :

```
<elmah>
  <errorLog type="Elmah.SqlServerCompactErrorLog, Elmah"
            connectionStringName="elmah-sqlservercompact" />
</elmah>
```

## Rollback

Je désinstalle le package "ELMAH on MS SQL Server Compact" (mais pas les
packages dont il dépend) puis le package "SqlServerCompact".

Puis je retourne sur elmah.axd où je peux constater que je suis bien revenu
à mon point de départ : `"This log is provided by the In-Memory Error
Log."`. Parfait !

## ELMAH + Sql Server en semi-automatique

Ce coup-ci je fais un essai avec l'installation du package NuGet "ELMAH on
MS SQL Server (requires manual config)".

Une fois terminé, un nouveau dossier "App_Readme" est apparu dans le projet,
avec deux fichiers : - Elmah.SqlServer.sql - Elmah.SqlServer.txt

Et le fichier Elmah.SqlServer.txt contient le texte suivant :

```
Please note that in order to complete the installation of ELMAH.SqlServer you will have to do the following:

1) Run the Elmah.SqlServer.sql script against your database
2) Edit your web.config with the correct settings in the elmah <connectionString> to connect to your database
```

Malgré tout, le fichier web.config a déjà été pas mal préparé pour
simplifier la configuration :

Un :

```
<connectionStrings>
  ...
  <add name="elmah-sqlserver"
       connectionString="Data Source=****;User ID=****;Password=****;Initial Catalog=****;"
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

Et deux :

```
<elmah>
  <errorLog type="Elmah.SqlErrorLog, Elmah"
            connectionStringName="elmah-sqlserver" />
</elmah>
```

Je sais jamais faire, mais sinon, c'est pas compliqué :

* démarrer SQL Server Management Studio (l'occasion de voir que j'ai des
tonnes de base Xxxxx.Models.XxxxxContext crées au cours de différents essais ou
tutoriels)
* créer une nouvelle base "Elmah" (et la passer en Compatibility_Level
80)
* lancer le script (qui génère pas mal de message d'avertissement)

Ouf ! C'est fait.

Puis enregistrer la chaine de connexion :

```
<add name="elmah-sqlserver"
     connectionString="Data Source=.\SQLEXPRESS;Integrated Security=SSPI;Initial Catalog=Elmah;"
     providerName="System.Data.SqlClient" />
```

Je peux alors relancer l'application, provoquer une erreur et aller que la
page elmah.axd et vérifier que `"This log is provided by the Microsoft SQL
Server Error Log."`. Bravo !

## ELMAH + Sql Server Compact en manuel

Après désinstallation du package "ELMAH on MS SQL Server (requires manual
config)", je me retrouve à nouveau avec un ELMAH tout simple qui stocke ses
erreurs en mémoire. Et au passage, le dossier App_Readme a disparu.
Magnifique !

Je peux donc tenter une modification tout ce qu'il y a de plus manuelle du
web.config pour utiliser une base de données Sql Server Compact (celui qui est
déjà installé sur mon PC).

Un :

```
<connectionStrings>
  ...
  <add name="elmah-sqlservercompact"
       connectionString="Data Source=|DataDirectory|\Elmah.sdf" />
</connectionStrings>
```

Et deux :

```
<elmah>
  <errorLog type="Elmah.SqlServerCompactErrorLog, Elmah"
            connectionStringName="elmah-sqlservercompact" />
</elmah>
```

Je relance l'application, tente d'accéder à l'URL index.html qui n'existe
pas puis direction elmah.axd et ça marche : `"This log is provided by
the SQL Server Compact Error Log"`. Magnifique !

## Conclusions

Déjà, le système des packages NuGet est bien foutu (au moins en ce qui
concerne ELMAH) :

* ça installe ce qui est nécessaire et ça fait les modifications et
configurations qui vont bien où ça va bien.
* quand on désinstalle, ça sait remettre tout comme il faut, y compris les
modifications apportées au web.config :)

Pour l'instant, je vais en rester à la configuration manuelle pour Sql
Server Compact. C'est bien suffisant pour les essais que je fais.

Mais finalement, je pense avoir compris pourquoi le package "ELMAH on MS SQL
Server Compact" en automatique installe SqlServerCompact. Au moins, lorsque on
déploie sur le serveur de production, ça permet que ELMAH soit prêt à
fonctionner sur une base de données SQL Server Compact, même si celui-ci n'est
pas installé en production. Pas bête !
