---
date: 2006-01-15 20:03:00
layout: post
redirect_from: "post/2006/01/15/Xmlfeed-et-Blogmarks"
tags: qc, xml
title: "Xmlfeed et Blogmarks"
---

Amélioration en ce qui concerne la méthode utilisée pour gérer la
transformation d'un document xml via xslt. Jusqu'à présent, c'était fait
quasi-automatiquement à l'aide des propriétés DocumentSource et TransformSource
du contrôle Xml. Après modification, la boite Xmlfeed fonctionne de la façon
suivante :

* la source est chargée dans un objet XmlDocument puis affectée à la
propriété Document du contrôle Xml,
* la fichier xsl est chargé dans un objet XslTransform qui est ensuite
affecté à la propriété Transform du contrôle XML.

Cette solution permet d'avoir une meilleure gestion des erreurs, et aussi
:

* de reconnaitre le type de fil et donc de sélectionner automatiquement la
feuille de style adéquate si besoin est,
* de “bidouiller” le fil atom de Blogmarks car la mention
"draft-ietf-atompub-format-05″ dans xlmns=”http://purl.org/atom/ns#…" (mais
sans message d'erreur pour trouver comment gérer ça plus proprement).

En configuration, les types de fils xml sont passés de 6 (atom, sommaire
atom, rss2, rss1, rdf et rss0.9) à 4 ([atom]({% post_url 2006-01-16-atom-html-conversion %}),
[rdf]({% post_url 2006-01-16-rdf-html-conversion %}),
[rss]({% post_url 2006-01-16-rss-html-conversion %}) et
automatique).

Par ailleurs, une feuille de style spéciale a été créée pour convertir le
fil atom de [Blogmarks
en html]({% post_url 2006-01-19-blogmarks-html-conversion %}), afin de gérer la miniature écran et la liste des tags.

Note : l'utilisation des propriétés Document et Transform
en lieu et place de DocumentSource et TransformSource a été également mise en
place au niveau de la boite Xmlfile.
