---
date: 2009-10-08 10:57:00
layout: post
redirect_from: "post/2009/10/08/Tuer-du-code-pour-r%C3%A9ussir"
tags: boulot, code-killer
title: "Tuer du code pour réussir"
---

Dans les mois à venir, je vais avoir à participer à la re-écriture en
ASP.NET MVC d'une application existante développée depuis des années en ASP.NET
1.1.

Après de longues tergiversations, il a bien fallu reconnaitre qu'une simple
migration en ASP.NET 3.5 et de simples rustines n'étaient ni suffisantes ni
envisageables (*même pas en rêve mon ami !*).

Le problème avec cette application, c'est qu'elle est le résultat d'un
empilement continuel de nouvelles fonctionnalités (*une fuite en avant
perpétuelle ?*) et qu'à aucun moment il a été accepté de prendre des pauses
pour réaliser les consolidations nécessaires si on voulait que l'ensemble
puisse évoluer (voire fonctionner) sereinement.

Ce qui fait qu'aujourd'hui, on a la chance d'avoir une grosse ... avec dans
le tas des trucs certainement utiles mais aussi des trucs complètements
stupides, des trucs réalisées pour faire plaisir à des gens qui n'ont jamais
mis les pieds dans l'application, des trucs développés et toujours pas passés
en production 1 an près, des trucs pour que "ça se fait tout seul y a rien à
faire", des trucs pour contourner d'autres trucs qui ne marchent pas comme on
veut qui faudrait que ça marche, des trucs qu'on est pas sûr que ça serve mais
yaka les laisser, des trucs qui prennent une éternité pour faire 3 fois rien,
des trucs qui ont été demandés parce qu'on sait jamais ça pourrait toujours
servir un jour ou l'autre...

Pour résumer ma pensée, il est plus qu'indispensable de commencer par un
énorme travail de réflexion sur le contenu de ce ramassis avant même de penser
à démarrer un Visual Studio. Et par réfléchir j'entends supprimer ce qui ne
sert pas, supprimer ce qui ne marche pas, supprimer ce qui n'est pas
indispensable, supprimer ce qui n'est pas faisable, supprimer ce qui prendra
trop de temps à faire, etc… En bref éviter de re-développer des fonctionnalités
en pagaille et prendre le risque de re-venir à notre point de départ...

Mon souci c'est que le spectre d'une migration iso-fonctionnelle flotte
encore dans l'air : on part de tout ça et au final on veut toujours tout
ça (et un peu plus) mais en mieux. Et comme on est très conciliants, on
pourrait à la rigueur accepter de sacrifier quelques écrans à condition qu'on
retrouve leurs fonctionnalités dans d'autres écrans...

Voilà donc un de mes [stress](http://www.lexpress.fr/actualites/2/44-pourcent-des-francais-se-disent-stresses-au-travail_792842.html "44% des Français se disent stressés au travail")
du moment. Mais ce matin, qu'est-ce que je découvre dans mon Bloglines ?
Un article des créateurs de Scout qui explique qu'en [supprimant
des tonnes de code](http://blog.scoutapp.com/articles/2009/10/06/we-just-undid-three-months-of-dev-work-heres-what-we-learned "We Just Undid Three Months of Dev work. Here's What We Learned.") (y compris des fonctionnalités), ils ont amélioré leur
application tant d'un point de vue performance (jusqu'à x 10 sur les
traitements les plus couteux) que satisfaction de leurs clients. Et en plus ils
nous nous livrent les deux leçons que l'on peut en retirer :

1. Arrêter de vouloir faire simple pour l'utilisateur final au prix d'une
tarabiscotisation dans le code, mais chercher la simplicité dans la façon de
faire (et perso, je pense que si c'est simple à faire, c'est évident à
utiliser).

> It turns out that simplicity and elegance for the end user can mean some
> awfully complicated stuff behind the scenes to make it work.

2. Arrêter de perdre son temps sur l'ajout de nouvelles fonctionnalités
soi-disant incontournables qui vont cannibaliser notre temps et notre énergie
juste pour les mettre au point

> If you're running a web application and the majority of your work is spent
> delivering the service you advertised to your customers, you're probably in bad
> shape.

Ca, ça me plait !
