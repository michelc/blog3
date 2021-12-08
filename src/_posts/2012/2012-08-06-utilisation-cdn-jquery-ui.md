---
date: 2012-08-06 23:39:00
layout: post
redirect_from: "post/2012/08/06/utilisation-cdn-pour-jquery-ui"
tags: jquery, mvc
title: "Utilisation d'un CDN pour jQuery UI"
---

Pour faire suite à mon billet d'il y a [
quelques jours]({% post_url 2012-07-12-utilisation-cdn-jquery-jquery-validation %}), je me suis rendu compte que je n'avais pas mentionné la
méthode pour intégrer jQuery UI depuis un CDN (essentiellement parce que je ne
l'utilise pas encore dans mon projet).

Pour le Javascript il n'y a rien de très compliqué :

```
<script src="//ajax.aspnetcdn.com/ajax/jquery.ui/1.8.20/jquery-ui.min.js"></script>
<script>
    if (typeof jQuery.ui === "undefined") {
        document.write(unescape("%3Cscript src='@Url.Content("~/Scripts/jquery-ui-1.8.20.min.js")'%3E%3C/script%3E"));
    }
</script>
```

Par contre, là où ça devient intéressant, c'est pour la CSS. En effet, si on
y réfléchit bien, il y a une très forte probabilité que si on ne peut pas
compter sur le CDN pour obtenir la partie Javascript de jQuery UI, ça ne sera
pas mieux pour récupérer sa partie CSS.

Heureusement pour moi, [Tim James](http://timjames.me/jquery-and-jquery-ui-fallbacks)
a déjà trouvé comment faire et il explique que pour détecter si on a pu charger
jQuery UI CSS depuis le CDN, on doit commencer par charger la CSS de jQuery UI
depuis le CDN :

```
<link rel="stylesheet" href="//ajax.aspnetcdn.com/ajax/jquery.ui/1.8.20/themes/ui-lightness/jquery-ui.css">
```

Puis il faut insérer une balise `div` dans notre page web et la
masquer grâce à la classe `ui-helper-hidden` que jQuery UI a
justement prévu pour cacher des trucs :

```
<div id="ui-fallback" class="ui-helper-hidden"></div>
```

Ensuite, on met un petit morceau de script qui va tester si cette balise est
visible ou pas. Et si elle est visible, cela signifie que l'on n'a pas réussi à
charger la CSS de jQuery UI depuis le CDN et qu'il est nécessaire de la charger
depuis une copie en local :

```
<script>
  // jQuery UI CSS Fallback
  $(function () {
    if ($("#ui-fallback").is(":visible") === true) {
      $('<link rel="stylesheet" type="text/css" href="/Content/themes/ui-lightness/jquery-ui-1.8.20.custom.css" />').appendTo('head');
    }
  });
</script>
```
