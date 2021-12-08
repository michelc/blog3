---
date: 2005-11-22 15:23:00
layout: post
redirect_from: "post/2005/11/22/Validitite-des-pages"
tags: qc
title: "Validitité des pages"
---

Apporté quelques modifications pour que le site de démonstration dufour34
soit entièrement validé :

* annulé la [suppression des
lignes vides]({% post_url 2005-10-23-validation-xhtml-cs %}) car cela pose problème à l'intérieur des balises
&lt;textarea&gt; (en attendant de réfléchir à tous les cas et d'améliorer
l'expression régulière),
* ajouté l'attribut columns="80" aux controles TextBox multi-lignes afin que
les balises &lt;textarea&gt; correspondantes contiennent un attribut cols
puisqu'il est obligatoire,
* modifié la prise en compte de l'attribut language="javascript" dans les
balises &lt;input&gt;,
* corrigé la génération des menus qui insérait un &lt;/li&gt; inutile lorsque
le menu est vide.
