---
date: 2009-02-26 17:44:00
layout: post
redirect_from: "post/2009/02/26/IIS-et-FLV-%3A-The-page-cannot-be-found"
tags: qc
title: "IIS et FLV : The page cannot be found"
---

Pour afficher une vidéo sous [QC](/tags/qc/), c'est
un peu compliqué parce qu'il faut créer un fichier html avec la balise
&lt;object&gt; qui va bien pour visualiser la vidéo via le lecteur [FLV
Player](http://www.longtailvideo.com/players/jw-flv-player/).

Et comme en plus la vidéo est au format MOV, c'est moi qui m'y colle. Au
début, tout va vite et bien. Je commence par transformer la vidéo MOV d'origine
en FLV, je l'insère sur le site en local, je fais quelques réglages et ça
fonctionne. Mais au moment de faire la même chose sur le site de production, il
n'y a pas moyen que ça marche !

Le lecteur FLV Player affiche un laconique "loading..." puis tout semble
bloqué. Après installation de la dernière version, c'est un peu mieux puisque
j'y gagne un message "Video not found
http://www.xxxxxxx.com/data/ma-video.flv".

Je vérifie, re-vérifie et re-re-vérifie pour m'assurer que le dossier et le
nom du fichier sont bien OK et je fini par copier directement l'url de la vidéo
dans la barre d'adresse de Firefox 3 et à nouveau tout semble bloqué. La même
chose sous Internet Explorer 6 et boum : "The page cannot be found".

Après une recherche sous Google, il apparait que c'est tout à fait
"normal" : [IIS6 ne renvoie pas les types MIME qu'il ne connait pas](http://support.microsoft.com/default.aspx?scid=kb;en-us;326965).

Pour résoudre ça, il faut :

* aller dans le gestionnaire de Services Internet,
* faire un clic droit sur le site web concerné et choisir Propriétés
* cliquer sur l'onglet "En-têtes HTTP"
* cliquer sur le bouton "Types de fichiers..." dans le panneau "MIME"
* cliquer sur le bouton "Nouveau type"
* saisir "**.flv**" dans la zone "Extension associée" (avec le
point sans les guillemets)
* saisir "**video/x-flv**" pour le "Type de contenu (MIME)"
* cliquer sur le bouton "OK" pour valider

Au moins j'aurai appris quelque chose.
