---
date: 2011-01-13 10:42:00
layout: post
redirect_from: "post/2011/01/13/reeducation-post-subversion"
tags: git, mercurial, svn
title: "Rééducation post-Subversion"
---

> Vous voulez que je vous dise quelque chose de rigolo ? Presque toutes
> les équipes qui utilisent Subversion avec lesquelles j'ai discuté m'ont raconté
> plus ou moins la même histoire. C'est une histoire tellement courante que je
> devrais l'intituler "La complainte de Subversion". Cette histoire, je
> vais vous la conter. Il était une fois une équipe de vaillants programmeurs qui
> se mirent en tête de séparer la version en production employée par les clients
> de la version avec laquelle ils travaillaient au jour le jour. Cette équipe
> créa donc une branche dans Subversion et tout se passa très bien dans le
> meilleur des mondes possible. Quelque temps après, ils décidèrent que le jour
> était venu de fusionner ces deux versions. Jour funeste qui vira rapidement au
> désastre. Cette union qui aurait dûe être expédiée en cinq minutes entraina la
> malheureuse équipe dans la pire des mésaventures qu'elle ait jamais
> connue : six chevaliers agglutinés derrière le même ordinateur pendant
> moults semaines pour quérir chaque correction réalisée sur la version de
> production et les réappliquer une à une et à la force du clavier sur la version
> de développement.
> 
> Et chacune de ces équipes m'a dit qu'ils jurèrent au grand jamais qu'on ne
> les y reprendrait plus et ils bannirent les branches. Et depuis, voici comment
> ils font : chaque nouvelle fonctionnalité est codée à l'intérieur d'un
> gros bloc #ifdef. Ca leur permet de tous travailler dans le tronc, sans que les
> clients ne soient impactés par le nouveau code tant qu'il n'est pas débugué. Et
> franchement, c'est ni fait, ni à faire.

Extrait traduit de [HgInit:
Subversion Re-education](http://hginit.com/00.html)
