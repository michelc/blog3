---
date: 2011-03-30 12:45:00
layout: post
redirect_from: "post/2011/03/30/vs-2010-sql-server-2008-express-windows-7-64-bits"
tags: boulot, sql-server
title: "VS 2010, SQL Server 2008 Express et Windows 7 64 bits"
---

J'ai rechuté. Après mes problèmes d'incompatibilités entre [VS 2008, SQL Server et Windows 7 64 bits]({% post_url 2009-11-25-vs2008-sql-server-2008-express-windows7-64-bits %}), j'ai encore trouvé
le moyen d'avoir un autre problème tout aussi bizarroïde.

Suite à je ne sais trop quelles mises à jour sur mon PC (peut-être .NET 4 ou
MVC3 ?) je me suis retrouvé dans l'impossibilité d'utiliser SQL Server 2008
avec Visual Studio 2010, notamment en essayant de refaire le tutoriel [MVC Music Store](http://mvcmusicstore.codeplex.com/) V2.
Alors que mes collègues n'avaient pas ce problème :(.

Dès que j'essayais d'accéder à une base de données, je tombais
immanquablement sur le message d'erreur suivant :

```
Le fournisseur de données .Net Framework demandé est introuvable. Il n'est peut-être pas installé.
```

Malgré des tas de recherches sur Google (s*perie de messages en français),
impossible de trouver quoique ce soit de valable à ce sujet. J'en étais presque
arrivé au point de vouloir tout ré-installer (parce que quand on n'installe pas
dans le bon ordre c'est déjà galère, alors j'ose même pas imaginer ce que ça
donnerait de dés-installer / ré-installer morceau par morceau...).

Jusqu'au moment où j'ai découvert fortuitement que le problème n'était pas
lié à SQL Server, mais plutôt à Entity Framework. En effet, en transformant une
solution VS 2008 sous VS 2010 je me suis rendu compte qu'elle fonctionnait
correctement alors qu'elle utilisait bel et bien une base de données SQL
Server ! La seule différence, c'est qu'elle utilisait LINQ to SQL et pas
EF.

A partir de ça j'ai réussi à trouver comment régler le problème en réparant
le client .NET Framework 4, ce qui a eu pour effet de re-créer le fichier
machine.config : [Visual Studio 2010 Add Connection dialogue not populating
databases](http://stackoverflow.com/questions/3503957/visual-studio-2010-add-connection-dialogue-not-populating-databases/4138842#4138842) :

> I managed to solve the problem by moving the machine.config file from
> "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config" and
> "C:\Windows\Microsoft.NET\Framework\v4.0.30319\Config" to another location (as
> a backup) and then ran a repair on the .NET Framework 4 Client Profile. This
> rebuilt the machine.config file and now everything works fine.

Merci StackOverflow et Zoran.

PS : Pour lancer une réparation du profil client du .NET Framework 4,
il faut passer par le panneau de configuration, programmes et fonctionnalités
et demander à désinstaller/modifier le "Microsoft .NET Framework 4 Client
Profile" et choisir "Réparer .NET Framework 4 Client Profile en le restaurant à
son état d'origine" . Attention, soit j'ai un PC qui rame, soit c'est assez
long...
