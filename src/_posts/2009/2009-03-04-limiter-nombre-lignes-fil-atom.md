---
date: 2009-03-04 13:50:00
layout: post
redirect_from: "post/2009/03/04/Limiter-le-nombre-de-lignes-dans-un-fil-Atom"
tags: ap, xml
title: "Limiter le nombre de lignes dans un fil Atom"
---

La boite XmlFile d'Altrr-Press permet depuis quelque temps d'afficher le
contenu d'un flux RSS, RDF ou Atom en indiquant l'url du fil de syndication et
la feuille de style XSLT à lui appliquer :

* [feed-atom.xslt]({% post_url 2006-01-16-atom-html-conversion %})
* [feed-blogmarks.xslt]({% post_url 2006-01-19-blogmarks-html-conversion %})
* [feed-rdf.xslt]({% post_url 2006-01-16-rdf-html-conversion %})
* [feed-rss.xslt]({% post_url 2006-01-16-rss-html-conversion %})

Par défaut, ces feuilles de styles XSLT affichent le titre du billet suivi
de son contenu. Mais dans Altrr-Press, il existe aussi une version qui affiche
une simple liste &lt;ul&gt; / &lt;li&gt; en présentant uniquement le titre des
billets.

Lorsque le fil d'origine contient beaucoup de billets, le résultat n'est pas
toujours heureux car cela génère un assez long pavé . C'est par exemple le cas
avec un Gandiblog (et aussi Dotclear ?) pour lequel le flux de syndication
contient 20 billets par défaut.

Il fallait donc trouver une méthode pour ne faire apparaitre que les 5
premiers billets du fil (ce qui correspond donc aux 5 derniers billets
publiés) :

* contacter l'auteur du blogue et lui demander s'il vous plait s'il peut
limiter son fil Atom à 5 billets, merci.
* se débrouiller et trouver comment gérer ça de mon côté

Avant de faire le barbare avec un style "`overflow: hidden;`"
pour cacher les billets que je ne saurais voir, j'ai fait chat et demandé à un
spécialiste XSLT s'il existerait un truc pour faire ça. Et ben oui, et pour une
fois c'est même carrément simple.

Au lieu d'appliquer bêtement le [template]({% post_url 2006-01-16-atom-html-conversion %})
aux différents items du fil Atom :

```
<ul>
        <xsl:apply-templates select="atom:entry"/>
</ul>
```

Il faut indiquer que le template ne doit s'appliquer que pour les 5
premières entrées :

```
<ul>
        <xsl:apply-templates select="atom:entry[position() <= 5]"/>
</ul>
```

L'astuce, c'est que comme le fichier XSLT est lui-même un document XML, il
faut penser à échapper le signe inférieur et écrire **&amp;lt;**
au lieu du caractère **&lt;**.
