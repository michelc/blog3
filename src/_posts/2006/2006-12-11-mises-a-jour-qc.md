---
date: 2006-12-11 16:54:00
layout: post
redirect_from: "post/2006/12/11/Mises-a-jour-QC"
tags: ap, qc
title: "Mises à jour QC"
---

Pour rattraper le [retard]({% post_url 2006-09-20-trucs-a-faire %}) pris dans le suivi des mises à
jours / évolutions, la liste des quelques modifications apportées à QC depuis
septembre.

* Correction des macros websiteUrl et resourcePath
* Amélioration prise en compte d'un sql multi base de données dans
BDHelper
* Bidouillage du module discussion pour l'extranet
* Correction création du cookie à l'authentification pour utiliser le login
"normalisé" (tel qu'enregistré dans qc_Users) et pas celui saisi (à cause
maj/min...)
* Harmonisation du paramétrage pour GoogleSearch, MsnSearch et
YahooSearch
* Traduction des messages d'erreurs dans la boite de modification du mot de
passe
* Gère le cas où fichier n'existe plus lors du test de sa date mise à jour
(Common.TrackFileUpdate())
* Passage à la dernière version du namespace pour le sitemap (cf <http://www.sitemaps.org/>)
* Ajout de la propriété FieldClass au composant XTable
* tableEnhance.js ne génère plus les fonctions onmouseover() et onmouseout()
pour FireFox
* tableEnhance.js recopie les classes de colgroup/col dans les td pour
FireFox
