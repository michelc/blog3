---
date: 2005-11-22 23:55:00
layout: post
redirect_from: "post/2005/11/22/Configuration-du-site"
tags: qc
title: "Configuration du site"
---

Jusqu'à présent, le paramétrage du site se faisait directement dans la table
qc_Sites ou dans le web.config. Développement d'une nouvelle table et d'une
nouvelle boite pour que cela devienne plus "admin-friendly" :

* création de la table qc_SiteSettings pour y enregistrer la configuration du
site (smtp, proxy et ldap...) plutôt que de les avoir dans le web.config,
* ajout de la boite adminSite.ascx pour enregistrer la configuration du site
dans les tables qc_Sites et qc_SiteSettings,
* mise à jour des sources pour obtenir les paramètres à partir de la
collection siteSettings[].

Passer le script 20051122_update.sql pour mettre à jour la base de données
(boite adminSite et table qc_SiteSettings) .
