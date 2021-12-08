---
date: 2012-08-23 00:50:00
layout: post
redirect_from: "post/2012/08/23/migrer-repository-mercurial-vers-git"
tags: git, mercurial
title: "Migrer un repository de Mercurial vers Git"
---

Ca m'a demandé quand même un peu de temps pour réussir à trouver un système
qui marche et qui soit assez simple à refaire.

Grosso-modo, il existe 3 méthodes :

* soit passer par le plugin [Hg-Git](http://hg-git.github.com/) pour Mercurial,
* soit utiliser [Fast-Export](http://repo.or.cz/w/fast-export.git) pour alimenter [git-fast-import](http://www.kernel.org/pub/software/scm/git/docs/git-fast-import.html),
* soit demander à Codeplex de [faire la conversion](http://codeplex.codeplex.com/wikipage?title=CodePlex FAQ#TFStoMercurial) à ma place.

Comme j'ai pu trouver assez vite comment installer simplement Hg-Git, j'ai
donc pris cette option.

## Installation du plugin Hg-Git sous Windows 7 64 bits

Au début, ça fait un peu [peur](http://stackoverflow.com/questions/4585776/installing-hg-git-on-windows-7-64bit), mais en fait y'a quasiment [rien à faire](http://tortoisehg.bitbucket.org/manual/1.0/nonhg.html#hg-git-git).

Etant donné que j'ai la chance d'avoir déjà installé [TortoiseHg](http://tortoisehg.bitbucket.org/) sur mon PC, il
s'avère que je n'ai pas à m'embarrasser avec Python, MSysGit et
tutti-quanti.

J'ai juste à cloner le repository de Hg-Git :

```
C:\Tools> hg clone http://bitbucket.org/durin42/hg-git/ C:\Tools\hg-git
```

Puis à activer / configurer Hg-Git et bookmark dans mon fichier
Mercurial.ini :

```
[extensions]
bookmarks =
hggit = C:\Tools\hg-git\hggit
```

## Faire un push de Mercurial vers Git

Là aussi, j'ai un peu galéré. Y'avait pas moyen de faire un push de
Mercurial vers Git. J'ai cherché et essayé tout plein de trucs mais rien n'y
faisait.

Jusqu'au moment où je suis tombé sur le blogue d'un danois qui avait tout
fait comme il faut : [Converting a Mercurial repository to Git (Windows)](http://rasmuskl.dk/post/Converting-a-Mercurial-repository-to-Git-(Windows).aspx).

Le truc magique, c'est de ne pas pousser vers un repository Git, mais vers
un repository Git "bare". La différence entre les deux, c'est que le repository
Git "bare" correspond uniquement au contenu du dossier ".git" d'un repository
Git "normal" (cf [What is the difference between "git init" and "git init
--bare"?](http://stackoverflow.com/questions/7861184/what-is-the-difference-between-git-init-and-git-init-bare)).

Et là, du coup, j'ai pu pousser :

```
C:\Gits> md MongoContactsBare
C:\Gits> cd MongoContactsBare
C:\Gits\MongoContactsBare> git init --bare
```

=> `Initialized empty Git repository in
C:/MVC/MongoContactsBare/`

```
C:\Gits\MongoContacts> cd \Hgs\MongoContacts
C:\Hgs\MongoContacts> hg bookmark -r default master
C:\Hgs\MongoContacts> hg push C:/Gits/MongoContacts/Bare
```

=> `pushing to C:/MVC/MongoContactsBare`

=> `creating and sending data`

Ca y est, mon historique est dans mon repository Git "bare". Reste plus qu'à
*clone the bare repository to a working directory*.

Ca aurait été mieux s'il avait expliqué comment faire, mais j'y suis
arrivé :

```
C:\Hgs\MongoContacts> cd \Gits
C:\Gits> md MongoContacts
C:\Gits> git clone -l .\MongoContactsBare .\MongoContacts
```

=> `Cloning into .\MongoContacts...`

=> `done.`

## Finitions

Quelques dernières dernières retouches pour avoir un "vrai" repository
Git :

```
C:\Gits> copy .\Repertoir\.gitignore .\MongoContacts
C:\Gits> del .\MongoContacts\.hgignore
```

Un fichier readme.md et un petit coup de [GitHub for Windows](http://windows.github.com/) plus tard et
mon projet est archivé chez GitHub !
