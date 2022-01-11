---
date: 2022-01-10 13:36:08 +02:00
tags: [ javascript, jeux ]
title: LeMOT pour jouer à WORDLE en français
cover:
  image: /public/2022/lemot-jouer.png
  link: https://www.solitaire-play.com/lemot/
  text: LeMOT - Un jeu de mot chaque jour
excerpt: Ce week-end, j'ai mis en ligne une version française de WORDLE. J'ai développé mon propre code en Vanilla JS et en plus, j'ai trouvé un super nom "LeMOT", et même un slogan "Un Mot, un Jour" !
---

Il y a quelque temps, j'avais vu apparaitre de drôles d'images dans Twitter. Ça ressemblait un peu à la représentation des contributions de GitHub, mais sur une seule semaine ?

J'ai fini par comprendre ce que c'était et j'ai alors découvert [WORDLE](https://powerlanguage.co.uk/wordle/), un nouveau jeu de mots, sorte de croisement entre Mastermind et le Pendu, développé par Josh Wardle. Wordle / Wardle : malin !

Alors bien entendu, j'ai joué moi aussi, ou plutôt j'ai essayé de jouer... Parce que j'ai assez vite dû me rendre à l'évidence et reconnaitre que mon vocabulaire en anglais n'était pas assez fourni pour réussir à gagner régulièrement. Alors que je suis tout fier de pouvoir suivre des séries ou des films en VO avec les sous-titres en anglais ! Ou alors j'ai une grosse lacune en ce qui concerne les mots anglais de 5 lettres ?

Il y a 2 ou 3 ans, j'avais récupéré quelques listes de mots en français pour développer un programme qui me permettrait d'optimiser mon jeu au Scrabble (ou tricher si on veut). Finalement, je n'avais jamais rien programmé.

Mais ce week-end, après m'être levé aux aurores vers 10h du matin, je me suis lancé ! Et juste après minuit, j'avais déjà réussi à coder un truc pas mal du tout que j'ai pu mettre en ligne sur mon site de jeux de solitaires : [https://www.solitaire-play.com/lemot/](https://www.solitaire-play.com/lemot/). J'étais super-content parce que je ne m'étais pas contenté d'adapter le code de Josh Wardle, mais que j'avais écrit ma propre version en Vanilla JS. Et en plus, j'avais trouvé un super nom : "**LeMOT**". WORD-Le => Le-WORD => Le-MOT !

Et j'avais même eu une idée de slogan pour compléter le titre : "Un Mot, un Jour", inspiré de l'émission de télévision "Un livre, un jour".

Après je suis allé dormir et le lendemain, j'ai continué sur ma lancée et j'ai apporté tout un tas d'améliorations.

* Mise au point de la sauvegarde de la partie en cours, pour pouvoir y revenir plus tard si on sèche.
* Ajouté un filigrane "version bêta" sous le titre du jeu parce que j'ai peur des bugues :)
* Minifié les fichiers JavaScript et CSS pour optimiser le chargement.
* Affiché les messages dans une sorte de popup "flash" (utile pour dire si un mot est inconnu ou informer que le résultat en fin de partie a été copié dans le presse-papiers pour être collé dans Twitter ou WhatsApp).
* Mise à jour du contenu de la page et des balises meta et Open Graph, avec une image inspirée de celle de WORDLE.
* Modifié l'export des résultats en emoji pour y ajouter la mention "(bêta)" et un hashtag "#LeMotLeJeu".

Cela m'a occupé jusqu'en début d'après-midi. Je ne m'y suis remis que vers le soir, pour gérer correctement les indices couleurs lorsqu'il y a des lettres en double, que ce soit dans le mot à deviner ou dans les réponses saisies.

C'était très amusant à faire et aucun doute que je vais continuer à travailler dessus.

Déjà, j'ai au moins deux ou trois trucs à faire pour mettre au point mon jeu.

* Sur certains téléphones, la dernière rangée de touches du clavier nest pas complètement visible (en particulier quand il y a plusieurs onglets dans un groupe et que cela masque en partie le bas du clavier).
* Pour aller vite, j'ai utilisé des caractères Unicode pour réaliser les icones. Il faudrait les remplacer par des SVG pour que cela soit plus joli.
* Vérifier à quelle heure le mot est renouvelé. J'utilise les dates UTC et donc en France, cela devrait se passer à 1h du matin.

Puis il y a quelques trucs à ajouter pour essayer de reproduire au mieux les fonctionnalités du jeu d'origine.

* Les statistiques : pour renforcer l'attrait du jeu et inciter les joueurs à chercher à gagner pendant un maximum de jours d'affilé.
* Avoir un bouton pour demander explicitement le partage des résultats.
* Les paramètres pour gérer des jeux de couleurs adaptés pour les personnes avec des difficultés visuelles (et le "mode sombre" si à la mode)...

Un autre chantier intéressant sera de limiter la liste des mots proposés comme devinette. Dans la version originale, Josh Wardle a sélectionné seulement 20% des 12500 mots anglais de 5 lettres pour faire partie des happy few à deviner. Je ne sais pas trop pourquoi il a fait ça, ni sur quels critères. Sans doute leur fréquence d'utilisation. Et donc, comment je peux faire ça en français ?

En attendant, n'hésitez pas et allez tester votre vocabulaire français sur [LeMOT - Un jeu de mot chaque jour](https://www.solitaire-play.com/lemot/), pour voir si vous pouvez faire mieux que moi !

[![LeMOT](/public/2022/lemot2.png "Qui fait mieux ?")](https://www.solitaire-play.com/lemot/)

<div class="encart">

English version: {% goto_en "LeMOT to play WORDLE in French", "2022-01-11-le-mot-play-wordle-in-french" %}.

</div>
