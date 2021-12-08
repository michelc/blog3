---
date: 2009-11-25 15:23:00
layout: post
redirect_from: "post/2009/11/25/VS2008-SQL-Server-2008-Express-Windows7-64-bits"
tags: boulot, sql-server
title: "VS 2008, SQL Server 2008 Express et Windows 7 64 bits"
---

Depuis que j'ai mon nouveau portable, je galère comme pas possible pour m'y
sentir comme chez moi et laisser tomber mon ancien PC. La principale cause de
tout ces problèmes (mais pas la seule), c'est que je suis maintenant sous
Windows 7 en version 64 bits (alors que j'aurais très bien pu m'en passer vu
que je reste scotché à 4 GO de mémoire à cause d'un tranchement entre [fromage ou dessert](http://www.fromageetdessert.com/ "ça n'a rien à voir, mais c'est pas grave")).

Le dernier problème en date c'est SQL Server Express 2008 (avec Service Pack
1 s'il vous plait). J'ai commencé par passer un temps fou à installer /
désinstaller / réinstaller / combiner / décombiner / recombiner Visual Studio
2008 Professional Edition, SQL Server Express 2005 et SQL Server Express 2008
pour réussir en début d'après-midi à faire fonctionner mes quelques essais
d'applications ASP.NET MVC que j'avais créées sur mon vieux PC sous XP.

Ce matin, j'avais encore le message d'erreur suivant :

```
The database 'BLABLA.MDF' cannot be opened because it is version 655. This server supports version 612 and earlier. A downgrade path is not supported.
```

*(en fait, mon message d'erreur à moi était en français mais je l'ai
perdu, si c'est pas malheureux...)*

Je bataille tant que je peux pour désinstaller complètement SQL Server
Express 2005 puis installer SQL Server Express 2008 à partir du Web Platform
Installer et ça le fait presque : je n'ai plus d'erreur quand je lance mes
projets ContactManager et NerdDinner !!!

Mais il reste encore un problème : pas possible de créer une nouvelle
base de données. Je vais sur App_Data, je clique-droit, je fais "Ajouter", je
fais "Nouvel élément...", je choisis "Base de données SQL Server", je laisse le
nom "Database1.mdf" par défaut, je clique sur le bouton "Ajouter" et
patatras :

```
SQL Server Express 2005 doit fonctionner correctement pour permettre les connexions aux fichiers SQL Server (*.mdf). Vérifiez l'installation du composant ou téléchargez-le à partir de l'URL suivante : http://go.microsoft.com/fwlink/?LinkId=49251
```

ou en anglais pour faciliter les recherches sous Google :

```
Connections to SQL Server files (*.mdf) require SQL Server Express 2005 to function properly. Please verify the installation of the component of download from the URL: http://go.microsoft.com/fwlink/?LinkId=49251 (http://go.microsoft.com/fwlink/?LinkId=49251)
```

Et en fait c'est bigrement compliqué pour trouver la bonne réponse sous
Google, mais après des tas de liens, je réussi à tomber sur LA solution :
c'est une fonctionnalité bien connue (en tout cas depuis janvier 2009) de
Visual Studio 2008 SP1 quand on se connecte à une instance 64 bits de SQL
Server Express 2008. Y'a même un article n° 957944 tout exprès pour ça dans la
Knowledge Base de Microsoft : [FIX: Error message when you connect to
a 64-bit instance of SQL Server Express 2008 by using Visual Studio 2008
Service Pack 1 (SP1): "Connections to SQL Server files (*.mdf) require SQL
Server Express 2005 to function properly"](http://support.microsoft.com/?scid=kb;en-us;957944&amp;x=17&amp;y=13 "ça c'est du titre").

Comme je suis quelqu'un de très conciliant, je fait tout ce qu'on me demande
et j'appelle le support Microsoft. Je me retrouve je ne sais trop où (hello la
verte Erin ?) et après quelques interludes musicaux y'a un monsieur qui vérifie
une dernière fois que je j'ai bien un problème puis me demande mon adresse mél
pour m'envoyer le correctif.

J'aurais lui donner mon adresse GMail parce que ça fait une demi-heure et je
ne vois toujours rien venir...

## Mise à jour 24 heures après

Toujours pas de nouvelle de Microsoft. Et pourtant, j'ai aussi mis sur le
coup un ex-collègue qui a travaillé à Dublin dans un centre d'appel à
destination des développeurs MS. Comme j'en ai eu marre d'attendre, j'ai lancé
une recherche sur "[hotfix 957944](http://www.google.com/?q=hotfix 957944)" et j'ai eu droit à tout plein de réponses, dont une sur
[StackOverflow](http://stackoverflow.com/questions/293281/why-wont-visual-studio-2008-create-mdf-files-with-sql-server-2008-developer-ins/1582599#1582599) que je me suis empressé de consulter en
premier. Et là, ils expliquent même comment télécharger le fameux hotfix 957944
en direct...

Je fais la manipulation indiquée => ça me demande mon adresse mail. Ce
coup-ci je donne mon compte gmail et même pas 5 secondes après j'ai un nouveau
message dans mon Inbox avec un lien pour aller récupérer ce satané hotfix. Je
télécharge, j'installe, ça décompacte un VS90SP1-KB957944-x86.exe que je lance,
ça mouline et c'est fini ! Reste plus qu'à lancer VS 2008 pour vérifier
que je peux enfin créer une base de données et ça marche !!!

La meilleure façon d'obtenir quelque chose de Microsoft, c'est de demander à
Google d'aller rechercher sur StackOverflow :)
