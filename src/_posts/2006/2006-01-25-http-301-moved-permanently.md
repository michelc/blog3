---
date: 2006-01-25 08:28:00
layout: post
redirect_from: "post/2006/01/25/HTTP-301-Moved-Permanently"
tags: qc, referencement
title: "HTTP 301 - Moved Permanently"
---

Prise en compte des paramètres "permanentRedirectFrom" et
"permanentRedirectTo" dans le web.config pour gérer une redirection permanente.
Cela permet par exemple de changer le nom de domaine d'un site (et d'en
informer correctement les moteurs de recherche) :

* permanentRedirectFrom = http://www.monsite.info/
* permanentRedirectTo = http://www.mon-site.com/

Cela peut aussi servir à unifier les urls pour éviter d'être référencé 2
fois (et donc de "gaspiller" son pagerank) :

* permanentRedirectFrom = http://monsite.info/
* permanentRedirectTo = http://www.monsite.info/

Références :

* 
> The requested resource has been assigned a new permanent URI and any future
> references to this resource SHOULD use one of the returned URIs.

- <http://www.ietf.org/rfc/rfc2616.txt>

* Extrait du code pour gérer le [Moved
Permanently]({% post_url 2006-01-24-http-301-moved-permanently %}) en ASP.NET
