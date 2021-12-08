---
date: 2006-04-11 18:47:00
layout: post
redirect_from: "post/2006/04/11/Validation-XHTML"
tags: qc
title: "Validation XHTML"
---

Deux nouvelles modifications pour améliorer encore un peu plus la validité
du code html des sites QC :

* Le code généré par les boites FlashFile est désormais valide W3C (cf le
[générateur de code HTML du
Dewplayer](http://www.alsacreations.fr/dewplayer))
* Modification de la fonction SiteMenu() dans Macros.cs pour ne plus générer
d'attribut id sur les balises &lt;li&gt; lors de la génération du plan du site.
Cela permet d'éviter la répétition d'id dans le cas où une boite menu existe
dans la même page.

Et ajout d'un paramétrage à la boite FlashFile pour permettre de générer du
code passe partout (mais invalide) en cas d'extrême besoin.
