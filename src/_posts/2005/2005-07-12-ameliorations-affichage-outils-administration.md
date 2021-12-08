---
date: 2005-07-12 15:10:00
layout: post
redirect_from: "post/2005/07/12/Am%C3%A9liorations-affichage-des-outils-d-administration"
tags: qc
title: "Améliorations affichage des outils d'administration"
---

Modification de adminToolbar.ascx.cs pour remplacer le contrôle
btnVisibility de type ImageButton par un contrôle btnToggle de type HyperLink.
De cette façon, le basculement entre l'affichage ou non des outils
d'administration ne se fait plus via un postback (méthode POST) mais par un
simple lien (méthode GET), ce qui rendra possible les rafraichissements alors
que ce n'était pas le cas avant.

Changement de l'algorithme des propriétés Common.isConfigurable (et
Common.isEditable) dans le cas où les outils d'administration doivent être
cachés.

* Auparavant, ces 2 propriétés renvoyaient faux dès lors que la barre des
outils d'administration ne devait pas s'afficher.
* Désormais, elles ne renvoient faux qu'à condition que le fait de configurer
(ou d'éditer) soit considéré comme étant l'attribution exclusive des
administrateurs (dans la pratique quand la liste des rôles pouvant configurer
(ou éditer) est identique à la liste des rôles pouvant administrer).

Et pour finir, réécriture de la propriété Common.adminVisible
pour :

* récupérer l'état directement dans l'url lorsque elle contient
adminVisible=# => changement de visible à caché est immédiatement pris en
compte dans toutes les boites, mêmes celle chargées avant adminToolbar.
* faire persister l'état en cours dans un cookie plutôt que dans une variable
session => conserve cet état même après recompilation du projet et donc
perte de la session.
