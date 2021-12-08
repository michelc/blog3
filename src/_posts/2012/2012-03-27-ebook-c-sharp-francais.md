---
date: 2012-03-27 23:09:00
layout: post
redirect_from: "post/2012/03/27/ebook-c-sharp-francais"
tags: csharp
title: "Ebook de 550 pages, sur C#, en français, par Microsoft"
---

Une découverte époustouflante sur le [The
Morning Brew](http://blog.cwa.me.uk/2012/03/27/the-morning-brew-1073/) du jour : [Greg Duncan](http://coolthingoftheday.blogspot.co.uk/2012/03/want-to-know-more-about-vbnetc-like.html) m'apprends que j'aurai la spécification complète
du langage C# qui repose sur mon disque dur dans le dossier "C:\Program Files
(x86)\Microsoft Visual Studio 10.0\VC#\Specifications\1036". Et en effet, j'y
découvre un fichier "CSharp Language Specification.doc" de 3354 ko.

Et le plus extraordinaire, c'est qu'elle est en français.

Et encore plus extraordinaire, c'est tout tout à fait lisible !

![](/public/2012/csharp-specification.jpg)

C# (prononcer "C sharp") est un langage de programmation simple,
moderne, orienté objet et de type sécurisé. C#, qui trouve sa source dans la
famille de langages C, sera immédiatement familier aux programmeurs en C, C++
et Java. C# est répertorié par l'organisme de normalisation ECMA International
sous la norme **ECMA-334** et par l'organisme de normalisation
ISO/IEC sous la norme **ISO/IEC 23270**. Le compilateur C# de
Microsoft pour le .NET Framework est une implémentation conforme à ces deux
normes.

Langage orienté objet, C# prend en outre en charge la programmation
**orientée composant**. Aujourd'hui, la conception de logiciels
s'appuie de plus en plus largement sur des composants logiciels qui prennent la
forme de blocs de fonctionnalités autonomes et autodescriptifs. L'intérêt
majeur de tels composants est qu'ils présentent un modèle de programmation doté
de propriétés, de méthodes et d'événements, qu'ils possèdent des attributs
capables de fournir des informations déclaratives sur le composant et qu'ils
intègrent leur propre documentation. C# offre des constructions de langage
permettant de prendre en charge directement ces concepts, ce qui en fait un
langage extrêmement naturel pour créer et utiliser des composants
logiciels.

Plusieurs fonctionnalités de C# contribuent à construire des applications
fiables et durables : le **garbage collection** libère
automatiquement la mémoire occupée par les objets inutilisés ; la
**gestion des exceptions** fournit une approche structurée et
extensible de la détection et de la récupération des erreurs ; enfin, la
conception **de type sécurisé** du langage rend impossible la
lecture à partir de variables non initialisées et empêche que des tableaux
soient indexés au-delà de leurs limites ou que des casts de type non vérifiés
soient effectués.

C# dispose d'un **système de types unifié**. Tous les types C#,
y compris les types primitifs tels qu'`int` et `double`,
héritent d'un seul type d'objet (`object`) racine. Ils partagent
donc un ensemble d'opérations courantes, et les valeurs de n'importe quel type
peuvent être stockées, transportées et exploitées de façon cohérente. En outre,
C# prend en charge à la fois les types référence et les types valeur définis
par l'utilisateur, ce qui permet de bénéficier de l'affectation dynamique
d'objets, ainsi que du stockage en ligne de structures légères.

Pour garantir l'évolutivité et la compatibilité dans le temps des programmes
et des bibliothèques C#, l'accent a été fortement placé sur le
**versioning** dans la conception de C#. C'est un point auquel peu
de langages de programmation portent une attention suffisante, ce qui explique
que les programmes écrits dans ces langages se bloquent plus souvent que la
normale au moment de l'introduction de versions plus récentes de bibliothèques
dépendantes. Certains aspects de la conception de C# sont directement inspirés
par des considérations de versioning, en particulier les modificateurs
`virtual` et `override` distincts, les règles de
résolution des surcharges de méthode et la prise en charge des déclarations de
membres d'interface explicites.

Le reste de ce chapitre décrit les principales fonctionnalités du langage
C#. Alors que les chapitres ultérieurs décrivent les règles et les exceptions
de manière très détaillée et parfois mathématique, ce chapitre s'efforce de
rester le plus clair et le plus bref possible, au détriment de l'exhaustivité.
L'objectif est d'offrir au lecteur une introduction au langage qui lui
facilitera l'écriture de ses premiers programmes ainsi que la lecture des
chapitres suivants.

// Copyright (c) Microsoft Corporation 1999-2010. Tous droits réservés.
