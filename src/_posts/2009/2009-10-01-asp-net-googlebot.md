---
date: 2009-10-01 13:48:00
layout: post
redirect_from: "post/2009/10/01/ASP.NET-et-Googlebot"
tags: ap, referencement
title: "ASP.NET 2.0 et Googlebot"
---

Suite à mes différentes petites améliorations, je commence à avoir quelques
résultats. Déjà, il n'y a plus de pages avec des titres en double et le nombre
de pages ayant la même description commence à diminuer.

Par contre, il semblerait que Google ne parvient pas à accéder aux pages du
blog et qu'il se retrouve à chaque fois avec une erreur du type "Network
unreachable".

Au début, je ne me suis pas trop méfié parce que lors de la première
installation, il y avait eu une petite erreur pour générer le sitemap. Mais
étant donné que cela continue de se produire, j'ai quand même fini par essayer
de voir d'où cela pouvait provenir.

Après quelques recherches, il semble que ce problème soit lié à
l'url-rewriting et au au changement du user agent de Googlebot (vers mars 2006
!) qui est passé de "Googlebot/2.1 (+http://www.googlebot.com/bot.html)" à
"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)". Et
apparemment cela perturbe ASP.NET (la version 2.0 seulement ?) dans sa façon de
détecter les caractéristiques du navigateur appelant, si bien qu'il finit par
faire comme s'il s'agissait un très vieux Mozilla/1 et par faire un peu
n'importe quoi...

Deux billets pour avoir des explications plus complètes :

* [ASP.NET 2.0 Mozilla Browser Detection Hole](http://www.kowitz.net/archive/2006/12/11/asp.net-2.0-mozilla-browser-detection-hole.aspx)
* [Get GoogleBot to crash your .NET 2.0 site](http://todotnet.com/post/2006/07/01/Get-GoogleBot-to-crash-your-NET-20-site.aspx)

J'ai pu vérifier ce problème par moi-même en utilisant Safari et en le
configurant pour qu'il déclare le même user agent que Googlebot. Grâce à quoi,
quand j'accédais aux pages du blog, je tombais moi aussi sur une magnifique
erreur "Cannot use a leading .. to exit above the top directory" :

```
[HttpException (0x80004005): Cannot use a leading .. to exit above the top directory.]
   System.Web.Util.UrlPath.ReduceVirtualPath(String path) +3626102
   System.Web.Util.UrlPath.Reduce(String path) +84
   System.Web.Util.UrlPath.Combine(String appPath, String basepath, String relative) +326
   System.Web.HttpResponse.ApplyAppPathModifier(String virtualPath) +209
   System.Web.UI.HtmlControls.HtmlForm.GetActionAttribute() +2036998
   System.Web.UI.HtmlControls.HtmlForm.RenderAttributes(HtmlTextWriter writer) +840
   System.Web.UI.HtmlControls.HtmlControl.RenderBeginTag(HtmlTextWriter writer) +39
   System.Web.UI.HtmlControls.HtmlForm.Render(HtmlTextWriter output) +56
   System.Web.UI.Control.RenderControlInternal(HtmlTextWriter writer, ControlAdapter adapter) +25
   System.Web.UI.Control.RenderControl(HtmlTextWriter writer, ControlAdapter adapter) +121
   System.Web.UI.HtmlControls.HtmlForm.RenderControl(HtmlTextWriter writer) +37
   System.Web.UI.Control.RenderChildrenInternal(HtmlTextWriter writer, ICollection children) +199
   System.Web.UI.Control.RenderChildren(HtmlTextWriter writer) +20
   System.Web.UI.Page.Render(HtmlTextWriter writer) +26
   ap.Engine._default.Render(HtmlTextWriter writer) +89
   System.Web.UI.Control.RenderControlInternal(HtmlTextWriter writer, ControlAdapter adapter) +25
   System.Web.UI.Control.RenderControl(HtmlTextWriter writer, ControlAdapter adapter) +121
   System.Web.UI.Control.RenderControl(HtmlTextWriter writer) +22
   System.Web.UI.Page.ProcessRequestMain(Boolean includeStagesBeforeAsyncPoint, Boolean includeStagesAfterAsyncPoint) +2558
```

J'ai donc suivi la solution proposée par Brendan qui consiste à ajouter un
fichier genericmozilla5.browser dans le répertoire App_Browsers pour détecter
correctement les navigateurs compatibles Mozilla/5 génériques. Et après ça,
tout est rentré dans l'ordre (au moins pour Safari) et les pages du blog
devraient donc être générée à nouveau correctement pour Googlebot.

Ce qui est quand même bizarre, c'est que :

* je n'ai eu ce problème de "Network unreachable" qu'avec les pages du blog
alors que je fais de l'url rewriting dans tout le site,
* je suis affecté alors que même si le site tourne en .NET 2, il est (encore)
compilée en .NET 1.1 (d'un autre côté, du moment que le répertoire spécial
App_Browsers fonctionne avec une application en .NET 1.1).

Reste plus qu'à espérer qu'avec tout ça je n'ai pas trop épuisé la patience
de Goooglebot et qu'il aura la bonté de prendre en compte les pages du blog
très très vite ! *Mise à jour : ça à marché :)*
