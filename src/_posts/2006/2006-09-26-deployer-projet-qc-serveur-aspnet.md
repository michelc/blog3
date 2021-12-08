---
date: 2006-09-26 18:00:00
layout: post
redirect_from: "post/2006/09/26/Deployer-un-projet-QC-sur-un-serveur-ASPNET"
tags: qc
title: "Déployer un projet QC sur un serveur ASP.NET"
---

Créer le fichier QC_Deploy.bat sur C:\ ou D:\ selon que l'on travaille avec
C:\Portals ou D:\Portals et y insérer les lignes suivantes (en modifiant D:\ en
C:\ si nécessaire) :

```
IF "%1" == "" GOTO Finito

REM ---------- Recopie le répertoire principal

XCOPY D:\Portals\%1\*.* D:\Portals\%1_ftp\ /S /Y /EXCLUDE:D:\QC_deploy.txt
XCOPY D:\Portals\%1\*.css D:\Portals\%1_ftp\ /S /Y

:Finito
```

Créer également le fichier QC_Deploy.txt sur C:\ ou D:\ pour indiquer les
fichiers à exclure du déploiement :

```
\Engine\bin
\Engine\refs
\Classic\bin
\Framework
\BDHelper
.pdb
.cs
.resx
.csproj
.sln
.webinfo
.bak
.sql
.zip
.rar
```

Dans le cas où il s'agit de déployer une solution basée sur le framework QC, il
est nécessaire d'ajouter le sous-répertoire bin des projets contenus dans la
solution après la ligne "\Classic\bin".

```
...
\Classic\bin
\Mon_Projet_Numero_1\bin
\Mon_Projet_Numero_2\bin
\Framework
...
```

Passer ensuite sous l'invite de commandes, sur la racine C:\ ou D:\, et
taper la commande QC_Deploy qc puis appuyer sur Entrée. Cela crée un répertoire
X:\Portals\qc_ftp qui ne contiend que les fichiers à déployer sans aucun
fichier source ou autres fichiers inutiles. Il suffit alors de transférer
(généralement par ftp) ces fichiers sur le serveur de production.
