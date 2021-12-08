---
date: 2006-10-13 11:26:00
layout: post
redirect_from: "post/2006/10/13/Recherche-et-mots-vides"
tags: .net, ap, referencement
title: "Recherche et mots vides"
---

Hier, j'ai vu passer sur Blogmarks un lien vers un article pour [construire un moteur de recherche
avec Symfony](http://www.symfony-project.com/askeet/21). C'est l'occasion pour refaire un point sur les différentes
pistes pour intégrer un moteur de recherche dans un site en ASP.NET :

* utiliser [Lucene.Net](http://incubator.apache.org/lucene.net/), le portage de Lucene
sous .NET : voir [mojoPortal](http://www.mojoportal.com/) pour un
exemple d'utilisation et l'article [Full-Text Search for
Your Intranet or Website using 37 Lines of Code](http://www.codeproject.com/aspnet/DotLuceneSearch.asp),
* attendre de voir ce que va donner [Nutch.Net](http://sourceforge.net/projects/dotnutch), le portage de Nutch
sous .NET : mais rien de rien pour l'instant,
* [Searcharoo.NET](http://users.bigpond.com/conceptdevelopment/Search/) : déjà
testé sur PI et très simple à mettre en oeuvre mais pas vraiment efficace avec
du contenu en français,
* essayer de bidouiller quelque chose à partir des sources de [Beagle](http://beagle-project.org/Main_Page).

L'autre truc intéressant dans l'article sur Symfony, c'est les [stops words](http://en.wikipedia.org/wiki/Stop_words) (appelés [mots vides](http://fr.wikipedia.org/wiki/Mots_vides) en français), c'est à
dire les mots qui sont tellement communs qu'il est inutile de les indexer ou de
les utiliser dans une recherche. Dans PI, on en gère déjà empiriquement un
certain nombre mais apparament, il existe des listes "officielles" :

* les [French
Stopwords](http://www.ranks.nl/stopwords/french.html) sur Ranks.nl (serait la liste utilisée par les moteurs de
recherche ?),
* la [French
stop word list](http://snowball.tartarus.org/algorithms/french/stop.txt) du projet Snowball,
* une liste beaucoup plus complète des [mots vides de Jean
Veronis](http://torvald.aksis.uib.no/corpora/1999-1/0042.html).

Et maintenant, la question qui se pose : si j'utilise des mots vides pour
mon nom de domaine (ou mon titre de page, ou mon url...), est-ce que cela
aura un impact sur mon référencement ? Est-ce qu'un nom de domaine tel que
[www.qui-quand-et-comment.com](http://www.qui-quand-et-comment.com)
est viable ou est-ce que c'est une véritable hérésie ?
