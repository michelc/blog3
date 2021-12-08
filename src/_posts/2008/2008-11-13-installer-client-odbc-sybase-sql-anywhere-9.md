---
date: 2008-11-13 18:40:00
layout: post
redirect_from: "post/2008/11/13/Installer-le-client-ODBC-pour-Sybase-SQL-Anywhere-9"
tags: boulot, sql
title: "Installer le client ODBC pour Sybase SQL Anywhere 9"
---

Pour mon super état des marges ultra prioritaire, je dois intégrer des
données en provenance de la paye. Le problème c'est que le logiciel de paie
utilise une base de données SQL Anywhere 9 et qu'il faut donc que je trouve
comment m'y connecter. Et ben c'est pas si évident que ça pour trouver de
l'information sur comment faire et encore moins pour arriver à récupérer un
client pour Sql Anywhere 9 qui fasse l'affaire. Ou alors il faut être prêt à se
tartiner des kilomètres de documentation et installer à tire larigot jusqu'à
tomber sur le truc qui va bien.

Mais quand on a autant de temps que moi et qu'on ne veut pas encombrer son
PC de tout un tas de trucs inutiles, il faut savoir se débrouiller (et aussi se
contenter d'ODBC).

Pour commencer, il faut aller dans le dossier C:\Program Files\Sybase\SQL
Anywhere 9\win32 d'une machine où SQL Anywhere 9 est déjà installé.

Une fois là, récupérer les 3 fichiers suivants :

* dbodbc9.dll
* dblgen9.dll
* dbcon9.dll

Eventuellement, on peut aussi prendre les 2 fichiers suivants :

* dblgfr9.dll : dblgen9.dll en français
* dbcoen9.chm : fichier d'aide

Créer un dossier "C:\SQL Anywhere 9" et y copier les fichiers.

On dispose maintenant d'un répertoire contenant tous les fichiers
nécessaires pour le bon fonctionnement du pilote ODBC de Sybase SQL Anywhere 9.
Il reste simplement à configurer la base de registre pour qu'il soit possible
de se connecter à Sybase via le pilote ODBC.

On continue et on lance regedit.exe pour ouvrir la base de registre

Aller dans HKEY_LOCAL_MACHINE \ SOFTWARE \ ODBC \ ODBCINST.INI. Là il faut
se placer sur la clé "ODBC Drivers" et demander à y créer une nouvelle valeur
chaine que l'on appellera "SQL Anywhere 9". Une fois cette valeur créée,
double-cliquer dessus pour y enregistrer la valeur "Installed".

Rester dans HKEY_LOCAL_MACHINE \ SOFTWARE \ ODBC \ ODBCINST.INI et y créer
une nouvelle clé "SQL Anywhere 9" (le même nom que la chaine créée auparavant).
Se placer ensuite sur la clé que l'on vient de créer et ajouter les 2 valeurs
chaines suivantes :

* Driver
* Setup

Puis pour chacune de ces deux chaines, enregistrer la valeur "C:\SQL
Anywhere 9\dbodbc9.dll".

Ca y est, c'est quasiment fini.

On peut maintenant lancer l'administrateur de sources de données ODBC,
cliquer sur le bouton "Ajouter" dans l'onglet "Sources de données système" et
choisir le pilote "SQL Anywhere 9" pour obtenir la boite de dialogue permettant
de configurer la connexion ODBC au serveur SQL Anywhere 9 :

![](/public/2008/odbc-sql-anywhere-9.png)

A partir de là, il suffit de renseigner les différents informations qui vont
bien, soit dans mon cas à peu près :

* Onglet ODBC - Nom de source de données : BasePayeProd
* Onglet ODBC - Description : Base de données Sybase de production pour
la paie
* Onglet Connexion - ID utilisateur : XXXXXX
* Onglet Connexion - Mot de passe : XXXXXXXXX
* Onglet Base de données - Nom du serveur : BasePayeProd
* Onglet Réseau - TCP/IP : coché

Puis revenir sur l'onglet ODBC pour vérifier que tout est OK en cliquant sur
le bouton "Tester la connexion".

Et quand on a comme moi on a la chance d'avoir un ODBCTST.EXE from Oracle,
on peut immédiatement se connecter à la base de données pour vérifier que ça
marche pour de vrai.

Ensuite, sous Visual Studio, on peut enfin se connecter à la base de donnée
Sybase avec la commande suivante :

```
OdbcConnection db = new OdbcConnection("DSN=BasePayeProd");
```
