---
date: 2022-01-13 19:07:15 +02:00
tags: [ javascript, jeux ]
title: Des couleurs accessibles pour LeMOT
cover:
  image: /public/2022/lemot-couleurs.png
  link: https://www.solitaire-play.com/lemot/
  text: LeMOT - Un jeu de mot chaque jour
excerpt: Je continue à faire évoluer ma version du jeu Wordle en français, en essayant de rendre ses couleurs plus accessibles pour les daltoniens.
---

J'ai bien réfléchi et j'ai décidé de changer la couleur des indices dans ma version de [Wordle en français](https://www.solitaire-play.com/lemot/).

[Samedi]({% post_url "2022-01-10-le-mot-wordle-en-francais" %}), quand j'ai créé **LeMOT**, j'ai repris les couleurs utilisées par Josh Wardle.

![Les couleurs d'origine](/public/2022/lemot-avant.png "Les couleurs d'origine")

Dans le [Wordle original](https://powerlanguage.co.uk/wordle/), il y a aussi un "Color Blind Mode" avec des couleurs plus constratées pour les personnes qui sont [daltoniennes](https://fr.wikipedia.org/wiki/Daltonisme) (color blind en anglais).

!['Color Blind Mode' dans Wordle](/public/2022/wordle-color-blind-mode.png "'Color Blind Mode' dans Wordle")

Je ne le retrouve pas, mais j'ai vu passer il y a quelques jours un tweet disant qu'il serait plus simple d'utiliser directement des couleurs adaptées pour tout le monde, plutôt que de les proposer via un paramétrage.

Comme mon jeu est encore récent, c'est ce que j'ai fait. Et désormais ma version de Wordle en français utilise directement des couleurs accessibles pour les personnes ayant des troubles de la vue.

![Les nouvelles couleurs](/public/2022/lemot-apres.png "Les nouvelles couleurs")

Je suis parti de la palette de couleurs "IBM Design Library" trouvé dans l'article [Coloring for Colorblindness](https://davidmathlogic.com/colorblind/) de David Nichols. J'ai ensuite testé ce que ça donnait grâce aux outils d'accessibilité proposés par Firefox et j'ai pu constater que tout allait bien.


## Démonstrations

### Pas de rouge (protanopie)

![protanopie](/public/2022/protanopie.png)

### Pas de vert (deutéranopie)

![deutéranopie](/public/2022/deuteranopie.png)

### Pas de bleu (tritanopie)

![tritanopie](/public/2022/triteranopie.png)

### Aucune couleur (achromatopsie)

![achromatopsie](/public/2022/achromatopsie.png)

*Note : J'ai aussi profité de ce changement de couleurs pour augmenter la taille des caractères pour les myopes comme moi, avoir moins de nuances de gris et utiliser un noir plus foncé pour le texte des caractères.*


## Impact sur la grille de résultat

J'ai bien entendu adapté la grille de résultat inventée par [@irihapeta](https://twitter.com/irihapeta/status/1481336946190614531) pour qu'elle adopte le même jeu de couleur. Même si je sais que cela ne change rien aux problèmes que tous ces émojis génèrent pour les logiciels de lecteur d'écran.

![Grille LeMOT](/public/2022/lemot-grille.png "Ceci est un faux")


## Avantages des couleurs accessibles

En un, tout le monde peut directement jouer, sans avoir à chercher où et comment paramétrer le jeu.

En deux, c'est des couleurs aussi jolies que celles d'origine (si ce n'est plus jolies).

En trois, je n'ai pas besoin de coder un écran pour paramétrer ça, ni de sauvegarder ce réglage pour le réactiver à chaque visite.

*Note : Même si les couleurs sont désormais accessibles pour les daltoniens, d'autres éléments du jeu ne sont pas accessibles.*


## Inconvénients de changer de couleurs

La couleur des émojis dans la grille de résultat va sans doute dérouter les gens, mais je ne sais pas trop quoi faire... A part bien sûr d'en générer une plus accessible, ce qui n'est pas un truc facile et donc réalisable dans l'immédiat. Mais normalement, en voyant que la dernière ligne est peinte en orange, les gens comprendront vite qu'il s'agit de la couleur des lettres bien placées.

Ce qui est un peu plus embêtant, c'est que les joueurs commencent à être habitués à ce que VERT = lettre bien placée et ORANGE = lettre mal placée. A part quelques débutants qui hésitent encore et doivent fréquemment afficher l'aide :). Sans parler de la confusion pour ceux qui jouent à Wordle en français et en anglais.

Mais pour ça, j'ai trouvé une super solution dont je suis fier comme un bar-tabac !

Quand une lettre est bien placée, je la répète en filigrane à la ligne suivante. Avec ça, on peut jouer immédiatement sans avoir à réfléchir au code couleur et concentrer tout son temps de cerveau humain disponible à trouver le bon mot.

![A la 2ème case, la lettre E bien placée](/public/2022/lemot-info.png "A la 2ème case, la lettre 'E' bien placée")

C'est pas tout ça, il est temps d'aller [jouer à Wordle en français](https://www.solitaire-play.com/lemot/) :)

[![LeMOT](/public/2022/lemot2.png "Qui fait mieux ?")](https://www.solitaire-play.com/lemot/)

<div class="encart">

English version: {% goto_en "Accessible colors for LeMOT", "2022-01-14-accessibles-colors-lemot" %}.

</div>
