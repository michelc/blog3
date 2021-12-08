---
date: 2006-01-28 18:59:00
layout: post
redirect_from: "post/2006/01/28/Mise-en-cache-cote-serveur"
tags: qc
title: "Mise en cache côté serveur"
---

Révision de la durée de mise en cache pour l'ensemble des boites des toolbox
Admin et Classic. Jusqu'à présent, celle-ci était généralement définie à -1
(pas de mise en cache) ou à 60 secondes. Ces valeurs ont été augmentées et
établies selon les règles suivantes :

* Xmlfeed et Blogmarks sont paramétrées par défaut à 10800 secondes (3
heures) pour éviter de trop solliciter les serveurs hébergeant les fils atom ou
rss,
* les boites de la toolbox Admin sont initialisées à -1,
* les boites contenant un formulaire sont initialisées à -1 (sinon on se fait
avoir et on a l'impression que ça ne marche pas :),
* les boites dont le contenu dépend de la page en cours (Breadcrumbs,
FileDir, ScreenInfo, SiteMenu) sont initialisées à -1,
* toutes les autres boites passent à 600 secondes (10 minutes).

Réalisation du script 20060128_update.sql pour mettre à jour les tables
qc_BoxTypes (paramétrage par défaut) et qc_Boxes (re-paramétrage des boites
déjà existantes).

```
/*
  -------------------- qc_BoxTypes : defaultCache
*/

UPDATE qc_BoxTypes SET defaultCache = 600
WHERE toolbox LIKE 'Classic%'
GO;

UPDATE qc_BoxTypes SET defaultCache = -1
WHERE toolbox = 'Admin';
GO;

UPDATE qc_BoxTypes SET defaultCache = -1
WHERE idBoxType IN ('breadcrumbs', 'filedir', 'screeninfo', 'sitemenu');
GO;

UPDATE qc_BoxTypes SET defaultCache = -1
WHERE idBoxType IN ('breadcrumbs', 'filedir', 'screeninfo', 'sitemenu');
GO;

UPDATE qc_BoxTypes SET defaultCache = -1
WHERE idBoxType IN ('autoreg', 'discussions', 'feedback', 'googlesearch', 'login', 'msnsearch', 'password', 'yahoosearch');
GO;

UPDATE qc_BoxTypes SET defaultCache = 10800 
WHERE idBoxType IN ('blogmarks', 'xmlfeed');
GO;

/*
  -------------------- qc_Boxes : cacheTime
*/

UPDATE qc_Boxes SET cacheTime = -1
WHERE idBoxType IN (SELECT idBoxType FROM qc_BoxTypes WHERE defaultCache = -1);
GO;

UPDATE qc_Boxes SET cacheTime = 600
WHERE idBoxType IN (SELECT idBoxType FROM qc_BoxTypes WHERE defaultCache = 600);
GO;

UPDATE qc_Boxes SET cacheTime = 10800
WHERE idBoxType IN (SELECT idBoxType FROM qc_BoxTypes WHERE defaultCache = 10800);
GO;
```
