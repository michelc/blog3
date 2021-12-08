---
date: 2014-03-11 14:38:00
layout: post
redirect_from: "post/2014/03/11/upload-gros-fichiers-asp-net-mvc"
tags: mvc
title: "Upload de gros fichiers avec ASP.NET MVC"
---

J'avais complètement oublié ça, mais on tombe sur une erreur "Internet Explorer
ne peut pas afficher cette page Web" ou "Page Web inaccessible" quand on essaie
d'uploader un fichier trop gros avec ASP.NET.

Le truc, c'est que les "gros" fichiers sont bloqués pour éviter que le serveur
soit victime d'une [attaque par déni de service](http://fr.wikipedia.org/wiki/Attaque_par_déni_de_service).

Dans un premier temps, j'ai résolu ça par un `<httpRuntime
maxRequestLength="10240" />` dans la partie `<system.web>` de mon Web.config.

Puis j'ai cherché s'il était possible de limiter cette liberté à certaine
parties du site.

## Utiliser un tag &lt;location&gt;

> [ASP.NET MVC and httpRuntime executionTimeout](http://stackoverflow.com/questions/492346/asp-net-mvc-and-httpruntime-executiontimeout/636609#636609)
>
> You can include the whole MVC path (controller and action) in the
> &lt;location&gt; tag's path attribute. Something like this should work:

```
<location path="Images/Upload">
    <system.web>
        <httpRuntime executionTimeout="600" />
    </system.web>
</location>
```

## Il y a aussi un maxAllowedContentLength ?

> [ASP.NET MVC are maxRequestLength and maxAllowedContentLength
> ignored in a subfolder web.config?](http://stackoverflow.com/questions/8605925/asp-net-mvc-are-maxrequestlength-and-maxallowedcontentlength-ignored-in-a-subfol#11886738)
>
> In your webconfig file, you need to declare the &lt;location&gt; tag with the
> path that way:

```
<location path="controller/action">
  <system.web>
    <!-- maxRequestLength is in kilobytes (KB)  -->
    <httpRuntime maxRequestLength="5120" /> <!-- 5MB -->
  </system.web>
  <system.webServer>
    <security>
      <requestFiltering>
        <!-- maxAllowedContentLength is in bytes (B)  -->
        <requestLimits maxAllowedContentLength="5242880"/> <!-- 5MB -->
      </requestFiltering>
    </security>
  </system.webServer>
</location>
```

## Alors quoi ?

> [Which gets priority? maxRequestLength or
> maxAllowedContentLength?](http://stackoverflow.com/questions/6327452/which-gets-priority-maxrequestlength-or-maxallowedcontentlength#6472631)
>
> maxRequestLength indicates the maximum request size supported by ASP.NET,
> whereas maxAllowedContentLength specifies the maximum length of content in a
> request supported by IIS. So you need to set both in order to upload large
> files: the smaller one "takes priority".

## En fait, ça dépend su serveur

J'ai tout compris grâce au billet [From IIS6 maxRequestLength to IIS7 -
specifying maximum file upload size](http://weblogs.asp.net/jeffwids/archive/2009/09/24/from-iis6-maxrequestlength-to-iis7-maxallowedcontentlengthfile-specifying-maximum-file-upload-size.aspx) :

Avec IIS6, si on veut des fichiers supérieurs à 4 MB :

```
<system.web>
  <!-- maxRequestLength is in kilobytes (KB)  -->
  <httpRuntime maxRequestLength="5120" /> <!-- 5MB -->
</system.web>
```

Avec IIS7, si on veut des fichiers supérieurs à 30 MB :

```
<system.web>
  <!-- maxRequestLength is in kilobytes (KB)  -->
  <httpRuntime maxRequestLength="51200" /> <!-- 50MB -->
</system.web>
<system.webServer>
  <security>
    <requestFiltering>
      <!-- maxAllowedContentLength is in bytes (B)  -->
      <requestLimits maxAllowedContentLength="52428800"/> <!-- 50MB -->
    </requestFiltering>
  </security>
</system.webServer>
```

Et comme dans mon cas j'ai besoin de 10 Mo au maximum, le `maxRequestLength` est
suffisant.
