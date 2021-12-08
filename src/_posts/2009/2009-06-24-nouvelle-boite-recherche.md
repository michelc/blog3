---
date: 2009-06-24 08:49:00
layout: post
redirect_from: "post/2009/06/24/Une-nouvelle-boite-de-recherche"
tags: ap, code-killer
title: "Une nouvelle boite de recherche"
---

Jusqu'à présent, pour gérer la recherche sur un site Altrr-Press, il était
possible de créer une boite de type Google Search. Ce type de boite employait
l'[interface
SOAP de Google Search](http://code.google.com/apis/soapsearch/) pour obtenir le résultat d'une recherche effectuée
par Google. Dans la pratique, il y a tellement peu de sites Altrr-Press qui
utilise ce type de boite qu'il aurait aussi bien pu passer à la trappe comme
cela avait été le cas pour les boites Msn Search et Yahoo Search.

Ca faisait quelque temps que je savais que Google allait mettre
définitivement fin au support de son interface SOAP à partir du 31 août, mais
étant donné le peu d'utilité que j'en avais, j'avais un peu de mal à me plonger
dans leur [API de recherche en AJAX](http://code.google.com/apis/ajaxsearch/web.html/). Heureusement pour moi, ce que Google prend
d'une main, il le redonne de l'autre et grâce aux tous nouveaux [Google Web Elements](http://google-code-updates.blogspot.com/2009/05/introducing-google-web-elements.html), je vais pouvoir faire évoluer mon CMS
sans trop me casser la tête.

Pour commencer, rendez-vous sur la page des [Google Web Elements](http://www.google.com/webelements/) ou
il suffit de cliquer sur le lien "Custom Search" pour obtenir immédiatement le
code javascript à utiliser pour insérer une boite de recherche sur son site.
Etant donné que que je cherche à disposer d'un système de recherche à
l'intérieur de mon site exclusivement, cela me convient et je peux donc
utiliser ce code tel quel :

```
<!-- Google Custom Search Element -->
<div id="cse" style="width:100%;">Loading</div>
<script src="http://www.google.com/jsapi" type="text/javascript"></script>
<script type="text/javascript">
  google.load('search', '1');
  google.setOnLoadCallback(function(){
    new google.search.CustomSearchControl().draw('cse');
  }, true);
</script>
```

Si je le souhaite, Google me propose aussi d'utiliser ma clé Google AdSense
pour valoriser les recherches effectuées sur mon site. Pour cela, il suffit de
remplacer le choix "Automatically search my site" par "Search my site and use
AdSense for Search". Le code javascript proposé est alors légèrement modifié
pour faire apparaitre ma clé Google AdSense. avec la ligne suivante :

```
<!-- Google Custom Search Element -->
<div id="cse" style="width:100%;">Loading</div>
<script src="http://www.google.com/jsapi" type="text/javascript"></script>
<script type="text/javascript">
  google.load('search', '1');
  google.setOnLoadCallback(function(){
    var cse = new google.search.CustomSearchControl();
    cse.enableAds('pub-5475403929650645');
    cse.draw('cse');
  }, true);
</script>
```

Dans la pratique, avec Altrr-Press il est tout de même préférable de
modifier la ligne de code avec la clé en dur de façon à utiliser la macro qui
renvoie la clé enregistrée globalement au niveau du site internet :

```
    cse.enableAds('[%AP.AdSenseKey%]');
```

C'est vraiment pas compliqué à faire et ça marche. Le seul petit problème,
c'est que ça ouvre les liens dans une nouvelle fenêtre !!!

Finalement je vais quand même devoir faire un détour par les [APIS AJAX de Google](http://code.google.com/apis/ajax/) et
plus particulièrement l'[API AJAX
consacrée à la recherche](http://code.google.com/apis/ajaxsearch/web.html) qui va me permettre de résoudre ce léger problème.
Et après quelques petites recherches, je tombe enfin sur ce qu'il me faut, à
savoir la méthode setLinkTarget(linkTarget).

> This method is called to set the link target used for links embedded in
> search results. The default value is google.search.Search.LINK_TARGET_BLANK
> which specifies that links will open in a new browser window. When this method
> is called, a search control wide link target setting is established. This
> effects all searchers that are currently attached to the search control as well
> as all searchers that are subsequently added to the control.

Et selon la documentation de référence de Google, linkTarget peut prendre
une des valeurs suivantes :

* google.search.Search.LINK_TARGET_BLANK - links will open in a new window,
e.g., &lt;A href=... target=_blank ...&gt;
* google.search.Search.LINK_TARGET_SELF - links will open in the same window
and frame, e.g., &lt;A href=... target=_self ...&gt;
* google.search.Search.LINK_TARGET_TOP - links will open in the topmost
frame, e.g., &lt;A href=... target=_top ...&gt;
* google.search.Search.LINK_TARGET_PARENT - links will open in either the
topmost frame, or replace the current frame, e.g., &lt;A href=...
target=_parent ...&gt;
* anything-else - links will open in the specified frame or window, e.g.,
&lt;A href=... target=anything-else ...&gt;

Après quelques essais, notamment à l'aide de l'excellent [Code
Playground](http://code.google.com/apis/ajax/playground/?exp=search) et je finis par obtenir le code javascript suivant :

```
<!-- Google Custom Search Element -->
<div id="cse" style="width:100%;">Loading</div>
<script src="http://www.google.com/jsapi" type="text/javascript"></script>
<script type="text/javascript">
  google.load('search', '1');
  google.setOnLoadCallback(function(){
    var cse = new google.search.CustomSearchControl();
    cse.enableAds('[%AP.AdSenseKey%]');
    cse.setLinkTarget(google.search.Search.LINK_TARGET_SELF);
    cse.draw('cse');
  }, true);
</script>
```

Comme je suis un peu pointilleux, il me restait encore un détail mineur à
régler : Google insère un lien libellé "Autres résultats »" juste après la
pagination des résultats. Et quand on clique dessus (en pensant dans mon cas
aller sur la page suivante des résultats), cela quitte le site et redirige sur
une page chez Google qui reprend la même recherche. Ce n'est pas bien génant,
mais j'ai quand même préféré cacher ce lien une ligne de CSS :

```
<style>.gsc-trailing-more-results {display:none !important;}</style>
```

Et donc, au jour d'aujourd'hui, pour placer une boite de recherche Google
dans un site construit avec Altrr-Press, il suffit de copier / coller le code
suivant dans une boite RawContent :

```
<!-- Google Custom Search Element -->
<div id="cse" style="width:100%;">Loading</div>
<script src="http://www.google.com/jsapi" type="text/javascript"></script>
<script type="text/javascript">
  google.load('search', '1');
  google.setOnLoadCallback(function(){
    var cse = new google.search.CustomSearchControl();
    cse.enableAds('[%AP.AdSenseKey%]');
    cse.setLinkTarget(google.search.Search.LINK_TARGET_SELF);
    cse.draw('cse');
  }, true);
</script>
<style>.gsc-trailing-more-results {display:none !important;}</style>
```

Avec en prime une démonstration en direct-live sur la nouvelle page de
recherche pour le [site de
Saint-Privat](http://saint-privat.au-quotidien.info/recherche.aspx).
