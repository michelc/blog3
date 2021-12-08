---
date: 2009-02-26 19:50:00
layout: post
redirect_from: "post/2009/02/26/Requetes-SQL-pour-la-mise-a-jour-d-Altrr-Press"
tags: ap
title: "Requêtes SQL pour la mise à jour d'Altrr-Press"
---

En attendant d'adapter pour Altrr-Press ma documentation pour [développer des
boites]({% post_url 2006-10-19-structure-solution-qc %}) qui date de QC, je vais commencer par faire un petit récapitulatif
afin de passer en revue les scripts SQL utiles pour mettre à jour le contenu
d'une base de données Altrr-Press.

Cela concerne généralement les données de configuration qu'il n'est pas
possible de mettre à jour depuis l'interface. Mais cela peut aussi être utile
d'avoir des scripts pour créer des écrans ou des boites de façon à faciliter la
mise à jour de sites en production.

Supposons que l'on vienne de finir de développer un nouveau type de boite
TypeToto . Si on essaie de créer une nouvelle boite, le choix TypeToto
n'apparait pas encore. C'est dû au fait que le type de boite TypeToto n'existe
pas dans la table qc_BoxTypes.

Il faut donc ajouter le nouveau type TypeToto dans la table qc_BoxTypes à
l'aide de la requête suivante :

```
/* ---------- Ajoute le type de boite TypeToto
*/

INSERT INTO qc_BoxTypes (
    idBoxType, 
    title, 
    description, 
    ctrlSource, 
    cnfgSource, 
    editSource, 
    defaultCache, 
    toolbox)
VALUES (
    'typetoto', 
    'TypeToto', 
    'La boite TypeToto', 
    '~/Classic/TypeToto/viewTypeToto.ascx', 
    '', 
    '~/Classic/TypeToto/editTypeToto.ascx', 
    '600', 
    'Classic');
GO;
```

Description des colonnes de la table qc_BoxTypes :

* idBoxType = typetoto : l'identifiant du type de boite

* title = TypeToto : le nom du type de boite

* description = La boite TypeToto : description du type de boite

* ctrlSource = ~/Classic/TypeToto/viewTypeToto.ascx : le contrôle pour
afficher la boite

* cnfgSource = (vide) : le contrôle pour configurer la boite

* editSource = ~/Classic/TypeToto/editTypeToto.ascx : le contrôle pour
modifier le contenu de la boite

* defaultCache = 600 : la durée du cache pour ce type de boite (mettre
-1 pour interdire la mise en cache)

* toolbox = Classic : la boite à outils où regrouper ce type de
boite

Attention, les identifiants comme idBoxType doivent toujours être :

* en minuscules,

* sans accents,

* uniquement des lettres de "a" à "z", des chiffres de "0" à "9"

* le tiret "-" est acceptable, mais pas en 1° ou dernière position

Après avoit créé un nouveau type de boite, il est fréquent d'insérer une
boite de ce type dans un écran. Généralement, il est même nécessaire de
commencer par créer un nouvel écran destiné à contenir la nouvelle boite.

Pour créer un écran, il faut ajouter un enregistrement dans la table
qc_Screens à l'aide de la requête suivante :

```
/* ---------- Ajoute un écran PageToto
*/

INSERT INTO qc_Screens (
    idScreen, 
    idSite, 
    title, 
    shortTitle, 
    template, 
    description, 
    keywords, 
    order1, 
    order2, 
    order3, 
    isVisible, 
    lastUpdate)
VALUES (
    'page-toto', 
    'default', 
    'Ecran PageToto', 
    'PageToto', 
    '', 
    '', 
    '', 
    1, 
    2, 
    3, 
    #TRUE, 
    #DAYDATE);
GO;
```

Description des colonnes de la table qc_Screens :

* idScreen = page-toto : l'identifiant de la page

* idSite = default : le nom du site où apparait la page (toujours
default)

* title = Ecran PageToto : le nom de la page

* shortTitle = PageToto : le nom abrégé de la page

* template = (vide) : le template pour la page (toujours vide)

* description = (vide) : le contenu pour la balise meta description

* keywords = (vide) : le contenu pour la balise meta keywords

* order1 = 1 : la position de la page dans le niveau 1

* order2 = 2 : la position de la page dans le niveau 2

* order3 = 3 : la position de la page dans le niveau 3

* isVisible = #TRUE : est-ce que l'écran est visible dans le menu (ou
#FALSE)

* lastUpdate = #DAYDATE : la date de mise à jour de l'écran (toujours
#DAYDATE)

La requête précédente permet d'ajouter l'écran à la table qc_Screens en
indiquant à quel emplacement l'insérer dans l'arborescence des pages (à l'aide
des colonnes order1, order2 et order3). Par contre, cela ne suffit pas pour que
l'arrangement des pages reste correct.

En effet, s'il existait déjà un écran en position 1.2.3, il y aurait
maintenant 2 écrans au même emplacement, ce qui complique la création des menus
ou du plan du site. Par conséquent, il est impératif de penser à faire de la
place avant d'insérer un nouvel écran.

Par exemple, pour insérer un écran en position 4.0.0, il faut pousser d'un
cran tous les écrans en position 4.x.x avant d'insérer le nouvel
écran :

```
UPDATE qc_Screens
SET    order1 = order1 + 1
WHERE  (order1 >= 4);
GO;
```

Autre exemple, pour insérer un écran en position 4.3.0, il faut pousser d'un
cran tous les écrans en position 4.3.x avant d'insérer le nouvel
écran :

```
UPDATE qc_Screens
SET    order2 = order2 + 1
WHERE  (order1  = 4)
AND    (order2 >= 3);
GO;
```

Et pour insérer un écran en position 4.3.2, il faut pousser d'un cran tous
les écrans à partir de la position 4.3.2 avant d'insérer le nouvel
écran :

```
UPDATE qc_Screens
SET    order3 = order3 + 1
WHERE  (order1  = 4)
AND    (order2  = 3)
AND    (order3 >= 2);
GO;
```

Donc, pour résumer :

* on fait de la place pour le nouvel écran dans la table qc_Screens

* on insère le nouvel écran dans la table qc_Screens

Là on est presque bon. Il est cependant préférable de définir les
autorisations pour accéder à l'écran que l'on vient de créer :

* le profil 'admins' peut visualiser (view) l'écran et l'administrer
(admin)

* le profil 'all-users' peut seulement visualiser l'écran (view)

Ce que l'on réalise avec les requêtes suivantes :

```
/* ---------- Défini les droits d'accès à l'écran PageToto
*/

INSERT INTO qc_ScreenRoles (idScreen, aktion, idRole) VALUES ('page-toto', 'admin', 'admins');
GO;

INSERT INTO qc_ScreenRoles (idScreen, aktion, idRole) VALUES ('page-toto', 'view', 'admins');
GO;

INSERT INTO qc_ScreenRoles (idScreen, aktion, idRole) VALUES ('page-toto', 'view', 'all-users');
GO;
```

On progresse ! Maintenant, il reste juste à créer dans l'écran PageToto
une nouvelle boite du type TypeToto. Pour cela, on crée un nouvel
enregistrement dans la table qc_Boxes :

```
/* ---------- Ajoute une boite TestToto de type TypeToto dans l'écran PageToto
*/

INSERT INTO qc_Boxes (
    idBox, 
    idScreen, 
    idBoxType, 
    title, 
    paneName, 
    paneOrder, 
    cacheTime, 
    visibility)
VALUES (
    'test-toto', 
    'page-toto', 
    'typetoto', 
    'Boite TestToto', 
    'paneMain', 
    10, 
    600, 
    0);
GO;
```

Description des colonnes de la table qc_Boxes :

* idBox = test-toto : l'identifiant de la boite

* idScreen = page-toto : l'identifiant de la page où créer la boite

* idBoxType = typetoto : l'identifiant du type de boite à créer

* title = Boite TestToto : le nom de la nouvelle boite

* paneName = paneMain : la colonne où créer la boite (paneSide, paneMain
ou paneMore)

* paneOrder = 10 : la position de la boite dans sa colonne (libre de 10
en 10)

* cacheTime = 600 : la durée du cache pour cette boite

* visibility = 0 : niveau de visibilité de la boite (0 = dans l'écran, 1
= dans l'écran et ses sous-écrans, 2 = dans tous les écrans)

Et pour finir, il faut définir les autorisations role par role pour la boite
que l'on vient de créer :

* le profil 'admins' peut visualiser (view) la boite, l'administrer (admin)
et la modifier (edit)

* le profil 'all-users' peut seulement visualiser la boite (view)

Note: Etant donné que le type de boite TypeToto n'a pas de contrôle prévu
pour la configuration (cnfgSource laissé vide), il ne sert à rien de paramétrer
que profil peut configurer (cnfg) la boite.

Ce qui nous donne les requêtes suivantes :

```
/* ---------- Défini les droits d'accès à la boite TestToto
*/

INSERT INTO qc_BoxRoles (idBox, aktion, idRole) VALUES ('test-toto', 'admin', 'admins');
GO;

INSERT INTO qc_BoxRoles (idBox, aktion, idRole) VALUES ('test-toto', 'view', 'admins');
GO;

INSERT INTO qc_BoxRoles (idBox, aktion, idRole) VALUES ('test-toto', 'edit', 'admins');
GO;

INSERT INTO qc_BoxRoles (idBox, aktion, idRole) VALUES ('test-toto', 'view', 'all-users');
GO;
```

C'est vrai que c'est un peu plus compliqué qu'une simple mise à jour depuis
l'interface, mais c'est devenu quasiment indispensable maintenant qu'il
commence à exister plusieurs sites gérés avec Altrr-Press.
