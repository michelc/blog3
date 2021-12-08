---
date: 2008-12-11 18:47:00
layout: post
redirect_from: "post/2008/12/11/Renommer-les-namespaces-de-QC-en-AP"
tags: ap
title: "Renommer les namespaces de QC en AP"
---

Comme j'ai un peu tendance à stagner dans ma [migration vers ASP.NET 2.0]({% post_url 2008-10-02-migration-altrr-press-net-1-net-2 %}), j'ai décidé de consacrer un peu de temps
pour renommer les différents éléments du projet de qc.\* en ap.\*.

Dans un premier temps (étapes 1 à 3), je vais remplacer qc.Xxxxxx par
ap.Xxxxxx dans tous les fichiers du projet, ce qui aura pour effet de modifier
tous les namespaces et les assemblys de qc.Xxxxxx en ap.Xxxxxx. Les noms des
projets en eux-même seront renommés à l'étape 3 via TortoiseSVN.

## 1° étape

* S'assurer que la solution est totalement versionnée
* Faire une sauvegarde complète du en lançant un Export All sous
Subversion

## 2° étape

Sous Visual Studio, sans ouvrir la solution, faire Edition / Rechercher et
remplacer / Remplacer dans les fichiers

* Rechercher : qc.Engine
* Remplacer par : ap.Engine
* Regarder dans : D:\Portals\pi
* Type de fichiers : \*.\*

![](/public/2008/renommer-en-ap.png)

* Cliquer sur le bouton [ Remplacer tout ]
* Confirmer que l'on veut effectuer le remplacement global

Répéter la même chose pour qc.Classic, qc.Department, qc.Devel et
qc.Framework puis une dernière fois pour renommer BAS.Data en Altrr.Data.

## 3° étape

* Supprimer le contenu du répertoire bin
* Supprimer le fichier pi.suo
* Utiliser TortoiseSVN pour renommer les fichiers qc.Xxxxxxx.csproj en
ap.Xxxxxxx.csproj => proposera de renommer également
qc.Xxxxxxx.csproj.webinfo en ap.Xxxxxxx.csproj.webinfo
* Ouvrir la solution sous Visual Studio et la regenérer totalement =>
"Régénération globale : 6 a réussi, 0 a échoué, 0 a été ignoré"
* Vérifier que le répertoire bin ne contient plus de DLL qc.Xxxxxxx.dll
* Contrôler que le site fonctionne encore :)
* Commiter le projet en indiquant "Renommé qc.Xxxxxx en ap.Xxxxxx"

## 4° étape

Une fois le gros oeuvre fait, je fignole pour qu'il ne reste presque plus de
trace de [QC](/tags/qc/).

* changements des namespaces folkloriques ("qc" et"qc.res.ae") en
"ap.Engine"
* remplacement des TagPrefix="qc" par TagPrefix="ap" => il faut aussi
remplacer :
  - `<qc:Literal>` par `<ap:Literal>`
  - `<qc:AutoComplete>` par `<ap:AutoComplete>`
  - `<qc:SelectFile>` par `<ap:SelectFile>`
  - `<qc:SelectLink>` par `<ap:SelectLink>`
  - `<qc:RoleGrid>` par `<ap:RoleGrid>`
  - `<qc:Wysiwyg>` par `<ap:Wysiwyg>`
* Ouvrir la solution sous Visual Studio et la regenérer totalement =>
"Régénération globale : 6 a réussi, 0 a échoué, 0 a été ignoré"
* Contrôler que le site fonctionne encore :)
* Commiter le projet en indiquant "Suite renommage 'qc' en 'ap' (namespace,
tagprefix, user controls ...)"

Après ça, il ne reste plus que les tables de la base de données qui sont
encore préfixées par "qc_" et pas "ap_".

## 5° étape

Le souci, c'est qu'il faut tout re-déployer puisque les namespaces ont
changés et que désormais les fichiers .ascx héritent de ap.Xxxxxx.Yyyyyy et
plus de qc.Xxxxxx.Yyyyyy. Il faut donc impérativement remplacer les ascx
actuels par les nouveaux sur tous les sites en production. Heureusement qu'il
n'y en a pas tant que ça :)

Et en plus, suite à la disparitions du namespace qc au profit de ap.Engine,
il faut impérativement penser à mettre à jour les fichiers web.config pour
corriger les 2 lignes suivantes :

```
<add verb="POST,GET" path="*MailFormHandler.ashx" type="ap.Engine.MailFormHandler, ap.Engine" />
<add verb="POST,GET" path="*InfoStatHandler.ashx" type="ap.Engine.InfoStatHandler, ap.Engine" />
```

Si tout va bien, je vais encore tester en local quelques jours et
j'attaquerai les mise à jour la semaine prochaine.
