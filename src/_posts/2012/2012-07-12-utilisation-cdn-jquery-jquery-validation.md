---
date: 2012-07-12 23:02:00
layout: post
redirect_from: "post/2012/07/12/utilisation-cdn-pour-jquery-et-jquery-validation"
tags: jquery, mvc
title: "Utilisation d'un CDN pour jQuery et jQuery Validation"
---

J'ai un petit projet de [gestion de contacts](http://repertoir.apphb.com/) pour tester différents trucs avec ASP.NET MVC 3 et
bien qu'étant convaincu depuis longtemps de l'[intérêt des CDN](http://encosia.com/3-reasons-why-you-should-let-google-host-jquery-for-you/), je n'avais pas encore pris le temps de
chercher une solution "élegante" pour en utiliser un avec mes scripts
jQuery.

Après quelques recherches sur le grand internet, j'ai abouti au résultat
suivant pour à la fois utiliser le CDN de Microsoft et avoir une solution de
repli (fallback) au cas improbable où il serait en panne :

```
<script src="@Url.Content("~/Scripts/modernizr-2.5.3.js")"></script>

<script src="//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.min.js"></script>
<script>
    if (typeof jQuery === "undefined") {
        document.write(unescape("%3Cscript src='@Url.Content("~/Scripts/jquery-1.7.2.min.js")'%3E%3C/script%3E"));
    }
</script>

<script src="//ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js"></script>
<script>
    if (typeof jQuery.fn.validate === "undefined") {
        document.write(unescape("%3Cscript src='@Url.Content("~/Scripts/jquery.validate.min.js")'%3E%3C/script%3E"));
    }
</script>

<script src="//ajax.aspnetcdn.com/ajax/mvc/3.0/jquery.validate.unobtrusive.min.js"></script>
<script>
    if (typeof jQuery.validator.unobtrusive === "undefined") {
        document.write(unescape("%3Cscript src='@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")'%3E%3C/script%3E"));
    }
</script>
```

Quelques explications :

* J'utilise le CDN de Microsoft car il propose aussi jQuery Validation et
qu'il n'y a [pas d'avantages à utiliser plusieurs CDN](http://stackoverflow.com/questions/11451350/is-it-better-to-use-one-or-two-cdn)
* Pour modernizr-2.5.3.js, il est déconseillé d'utiliser un CDN :
[Modernizr
and CDNs](http://modernizr.com/news/modernizr-and-cdns)
* J'ai supprimé le `type="text/javascript"` tel qu'on le voit dans
beaucoup d'exemples parce que c'est inutile avec HTML5
* Le `src="//url..."` est une [astuce](http://encosia.com/3-reasons-why-you-should-let-google-host-jquery-for-you/#protocolless) pour s'adapter si le site est en HTTP ou en HTTPS

Et je n'ai pas vu l'intérêt de faire un helper parce que c'est un truc que
je n'utilise qu'une fois dans toute mon application :

* dans /Views/Shared/_Layout.cshtml pour jQuery lui-même
* dans /Views/Shared/_FormScripts.cshtml pour jQuery Validation

Pour compléter, au cours de mes recherche j'étais aussi tombé sur [cdnjs](http://cdnjs.com/) qui héberge pas mal de librairies
et de plugins jQuery qu'on ne trouve pas chez Google ou Microsoft.

Et voir aussi : [Utilisation d'un CDN pour jQuery UI]({% post_url 2012-08-06-utilisation-cdn-jquery-ui %}).
