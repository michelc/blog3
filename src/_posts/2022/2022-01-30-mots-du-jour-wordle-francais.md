---
date: 2022-01-30 22:57:39 +02:00
tags: [ javascript, jeux ]
title: Les mots du jour de Wordle en français
cover:
  image: /public/2022/lemot-wordle-fr.png
  link: https://www.solitaire-play.com/lemot/
  text: LeMOT - Un jeu de mot chaque jour
excerpt: Comment ont été choisis les mots du jour dans LeMOT et comment EPALE a réussi à s'y faufiler...
---

Suite à l'apparition de "ÉPALE" hier comme mot à découvrir, voici quelques explications sur la façon dont les mots du jour sont choisis dans LeMOT, mon [Wordle en français](https://www.solitaire-play.com/lemot/). J'ai essayé d'expliquer ça sans faire trop technique et pour faire court, c'est le fruit d'un savant mélange de hasard, d'un peu de choix personnel et de pas de chance...


## Wiktionnaire

![Mesurer la capacité d'un récipient, quoi](/public/2022/lemot-21-epaler.jpg "Mesurer la capacité d'un récipient, quoi")


## Samedi 8 janvier

Quand j'ai commencé à développer LeMOT, j'ai regardé les sources de Wordle et j'ai vu que Josh Wardle avait 2 listes de mots. Une contenant une sélection de mots qu'il utilise pour faire deviner et une seconde avec tous les autres mots anglais de 5 lettres.

J'ai donc fait plus ou moins pareil, avec d'un côté une petite liste de mots à deviner et de l'autre une liste de mots valides contenant les 6812 mots de 5 lettres d'un dictionnaire que j'avais récupéré il y a 2 ou 3 ans.

Pendant mes tests, la liste des mots à deviner ne contenait d'ailleurs que le mot "ABRIS". Puis j'ai ajouté à la main une dizaine de mots pour vérifier que le code JavaScript qui choisissait un mot au hasard en fonction du jour fonctionnait correctement.

Peu après minuit, j'ai mis en ligne une première version du jeu en ajoutant une vingtaine de mots pour pouvoir tenir un mois avant d'avoir à en trouver d'autres. Ces premiers mots du jour ont été choisis plus ou moins au hasard. Pour cela, je suis parti de ma liste de 6000 et quelques mots, avec un mot par ligne, et j'y suis allé à grand coups de Page bas, Page haut, Flèche bas, Flèche haut pour arriver sur une ligne "au hasard". Puis à partir de là, je prenais éventuellement un mot aux alentours de cette ligne qui me plaisait...


## Dimanche 9

Au début, j'avais une fonction qui tirait au sort un nombre entre 1 et 33 et qui prenait le mot correspondant dans la liste des mots "gagnants". La fonction JavaScript pour choisir un nombre au hasard était "initialisée" en fonction de la date du jour pour être certain que pour un jour donné, tous les joueurs auraient le même mot.

Mais avec une si petite liste, il y avait un risque assez important qu'un mot déjà proposé ressorte un autre jour... Alors dès le dimanche soir, j'ai complété vite fait ma liste des mots du jour en les piochant au hasard selon la même méthode mais en prenant le plus souvent ce qui me tombait sous la main. A la fin, je suis arrivé à une liste de 177 mots, dont certains de mon cru (ISARD entre autres, mais je suis à peu près certain d'avoir fait pencher la balance pour MUSAI ou IDEAL aussi). Mais dans le tas et la précipitation, certains mots comme EPALE sont passés au travers et se sont retrouvés dans la liste des mots à deviner sans que je m'en rende compte...


## Mardi 11

Ce jour-là, j'ai mis à jour ma liste de mots pour les transformer tous en majuscule sans accents. La liste des mots valides est alors passée de 6812 à 5891, puisque des mots comme "place" et "placé" donnent le même "PLACE" en majuscule.


## Samedi 15

Le samedi suivant, j'ai simplifié la façon de choisir un mot au hasard. Au lieu de tirer un nombre au hasard entre 1 et 177 puis de prendre le mot correspondant dans la liste des mots du jour, j'ai pris le nième mot correspondant au nombre de jours entre la création de LeMOT et la date du jour.

Avantages :

* Le code est beaucoup plus simple (et c'est aussi ce que fait Josh Wardle).
* En tirant un nombre au hasard, on peut éventuellement tomber sur un nombre déjà sorti un autre jour.

Ainsi, au lieu de me compliquer la vie à tirer un nombre au hasard tous les jours, j'ai laissé le hasard mélanger cette liste une fois pour toute et je peux maintenant prendre les mots au fur et à mesure sans risque de doublon.

Pour que cela fonctionne correctement, il fallait faire en sorte que ma liste des mots du jour soit totalement dans le désordre. Pour cela, j'ai dû :

* Enlever de cette liste des mots gagnants les 8 mots déjà utilisés jusque là, à savoir ABRIS, ULTRA, GENIE, HERBE, VEXEZ, ALIZE, PLOUF et CAMUS.
* Mélanger les 169 restant dans la liste.
* Remettre les 8 premiers mots proposés au début de la liste.

Et tout ça les yeux fermés pour pouvoir moi aussi profiter du jeu :)


## Février, Mars, Avril...

Maintenant, je suis "tranquille" jusqu'à mi-juillet avant que ma liste des mots du jour soit épuisée. D'ici là, il faudra surtout que je me décide pour savoir par quoi je remplace la liste des mots valides de LeMOT parce qu'elle est un peu dépassée : elle ne contient ni TACLE, ni SALTO, ni APERO ! Et puis comme on s'en est aperçu hier, elle contient au moins un mot inconnu.

C'est quelque chose d'assez urgent à faire, parce que c'est un de mes critères pour faire sortir LeMOT de la phase bêta. A ce moment là, j'en profiterai pour compléter la liste des mots du jour pour que le jeu puisse continuer après juillet. Et en même temps, je la relirai afin de m'assurer qu'elle ne contient pas d'autres mots trop improbables...


## Epilogue

C'est évidemment ennuyeux qu'un mot que personne ne connait se soit retrouvé dans la liste des mots du jour. Mais ce n'est pas grave ! Pour moi, LeMOT (comme Wordle) sont des jeux. Le but c'est uniquement de s'amuser et de profiter d'un petit moment de détente. Le fait de gagner ou de perdre n'a pas vraiment d'importance.

Je profite de ce billet pour dire merci à toutes celles et ceux qui me font le plaisir de jouer à ma version de Wordle en français. En tout cas, moi hier j'ai passé une journée amusante, comme tous les autres jours. Merci à tous pour votre bonne humeur !

![Ma soeur, qui s'est pété le tendon en ski](/public/2022/lemot-21-epale.jpg "Ma soeur, qui s'est pété le tendon en ski")
