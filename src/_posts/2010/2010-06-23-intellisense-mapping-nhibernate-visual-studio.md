---
date: 2010-06-23 14:51:00
layout: post
redirect_from: "post/2010/06/23/intellisense-mapping-nhibernate-visual-studio"
tags: nhibernate
title: "Activer l'intellisense pour le mapping NHibernate dans Visual Studio"
---

Pour que Visual Studio propose l'intellisence quand on édite les fichier de
configuration ou de mapping de NHibernate, il faut définir la propriété
"Schema" pour qu'elle pointe sur le fichier "nhibernate-mapping.xsd" ou
"nhibernate-configuration.xsd".

Mais plutôt que de faire ça à la main, il est beaucoup plus simple de
référencer ces deux fichiers une bon une fois pour toute au niveau de Visual
Studio. Pour cela, il suffit de copier les fichiers "nhibernate-mapping.xsd" et
"nhibernate-configuration.xsd" dans le répertoire destiné à contenir les
schémas pour Visual Studio. Généralement (en tout cas dans mon cas), ce
répertoire est : C:\Program Files (x86)\Microsoft Visual Studio
9.0\Xml\Schemas.

Et c'est tout (à moins qu'il m'ai fallu relancer Visual Studio ?).
