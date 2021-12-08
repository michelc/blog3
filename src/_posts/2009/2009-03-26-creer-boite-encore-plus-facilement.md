---
date: 2009-03-26 19:01:00
layout: post
redirect_from: "post/2009/03/26/Creer-une-boite-encore-plus-facilement"
tags: ap
title: "Créer une boite encore plus facilement"
---

Et beaucoup plus vite ! Il y a quelque temps, j'avais déjà un peu
[simplifié la façon de créer une nouvelle boite]({% post_url 2007-10-17-creer-boite-peu-plus-facilement %}) dans Altrr-Press, en
passant de 7 à 5 étapes :

* cliquer sur le bouton ![Ajouter une boite](/public/2009/addbox.gif) pour créer une nouvelle
boite
* laisser les propriétés proposées par défaut
* valider pour créer la boite (et passer en saisie de son contenu)
* saisir le contenu de la boite
* valider la saisie pour enregistrer le contenu

Cette fois-ci, j'ai fait encore mieux ! J'ai carrément court-circuité
les 3 premières étapes qui servent à créer la nouvelle boite.

Pour cela, j'ai ajouté un bouton "Ajouter une boite Htmltext" qui crée une
boite Htmltext temporaire et passe directement en saisie de son contenu.

Une fois le contenu saisi et validé, la boite Htmltext est d'abord
réellement créée puis son contenu est enregistré dans la foulée.

Ce qui fait que maintenant, il n'y a plus que **3** étapes pour
ajouter du contenu texte (soit le plus fréquent) dans une page :

* cliquer sur le bouton ![Ajouter une boite Htmltext](/public/2009/addtext.gif) pour créer
une nouvelle boite de type Htmltext
* saisir le contenu de la boite
* valider la saisie pour créer la boite et enregistrer son contenu
