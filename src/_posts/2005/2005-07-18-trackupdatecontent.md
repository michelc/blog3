---
date: 2005-07-18 13:47:00
layout: post
redirect_from: "post/2005/07/18/TrackUpdateContent()"
tags: qc
title: "TrackUpdateContent()"
---

Ajouté la procédure TrackUpdateContent() à Common.cs pour suivre tout ce qui
concerne la mise à jour du contenu. Cette procédure est à appeler par les
classes métiers lors de l'utilisation de leurs méthodes Save() ou Kill().

Cette procédure est disponible avec 2 jeux d'arguments :

* TrackContentUpdate(idBox)
* TrackContentUpdate(idFeed, idBox, idItem, title, content, link,
author)

et elle effectue les traitements suivants :

* suppression du cache lié à la boite mise à jour,
* mise à jour du champ lastUpdate pour l'écran contenant la boite mise à
jour,
* enregistrement du contenu mis à jour dans la table qc_Entries.

Concernant la table qc_Entries.cs, sa mise à jour est gérée via la classe
Engine.Entries.cs et le script permettant sa création a été ajouté au fichier
20050715_update.sql
