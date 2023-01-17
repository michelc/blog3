---
date: 2022-02-01 12:28:57 +02:00
tags: [ javascript, jeux ]
title: Mode sombre pour Wordle en français
cover:
  image: /public/2022/lemot-wordle-fr.png
  link: https://www.solitaire-play.com/lemot/
  text: Fleurs de Tiaré tahiti, littéralement « fleur tahitienne »
excerpt: J'ai ajouté un mode sombre sur LeMOT, l'occasion pour moi de voir ce que cela implique comme modifications pour faire ça sans trop se comliquer la vie.
---

Dimanche dernier, j'ai ajouté un thème sombre (dark mode en anglais) sur LeMOT, mon [Wordle en français](https://www.solitaire-play.com/lemot/). Certains joueurs semblaient y tenir et c'était l'occasion pour moi de voir comment faire ça sans trop me compliquer la vie.


## Couleurs en mode clair (light mode)

Pour commencer, j'ai recherché quelles étaient les couleurs utilisées dans mon fichier CSS et j'en ai trouvé une dizaine. Mais en pratique, cela correspond aux 12 cas d'utilisation suivants :

* `#fff` pour le fond blanc général
* `#333` pour le texte général en quasi noir
* `#888` pour le texte un peu plus clair en italique
* `#ddd` pour le texte en filigrane
* `#ccc` du gris clair pour pour le fond des touches du clavier inutilisées
* `#fff` du blanc pour afficher les lettres une fois jouées dans les cases
* `#ffb000` le célèbre orange pour le fond des lettres bien placées :)
* `#648fff` le bleu pour le fond des lettres mal placées
* `#ddd` un gris un peu plus clair pour pour le fond des lettres absentes du mot à deviner
* `#bbb` du gris pas très clair pour les icones
* `#dc267f` un fond mauve pour le message "mot inconnu"
* `#fff` le blanc du texte pour le message "mot inconnu"

Ca c'est fait !


## Couleurs en mode sombre (dark mode)

J'ai ensuite recherché quelles couleurs utiliser quand on est en mode sombre. Ca n'a pas été trop compliqué, puisqu'il suffit de regarder du côté du [Wordle](https://powerlanguage.co.uk/wordle/) d'origine pour l'inspiration... Après quelques essais, je suis arrivé à ces couleurs :

* `#222` pour un fond général très noir
* `#333` pour un texte général très blanc
* `#888` pour un texte italique moins blanc
* `#444` pour le texte des filigranes en gris / noir
* `#888` du gris "moyen" pour pour le fond des touches du clavier inutilisées
* `#fff` du blanc pour afficher les lettres une fois jouées dans les cases
* `#ffb000` le célèbre orange pour le fond des lettres bien placées :)
* `#648fff` le bleu pour le fond des lettres mal placées
* `#444` un gris / noir pour pour le fond des lettres absentes du mot à deviner
* `#888` du gris "moyen" pour les icones
* `#dc267f` un fond mauve pour le message "mot inconnu"
* `#fff` le blanc du texte pour le message "mot inconnu"

Comme jusqu'à présent j'affichais les liens en bleu pétant (`#00f`), j'ai dû en trouver un autre qui rendrait bien dans les deux modes sombres et clair. J'ai repris le bleu `#2962ff` d'un de mes autres sites, mais sans doute à améliorer parce que je n'en suis pas super satisfait...

Les couleurs sombres, c'est fait !


## Paramétrage du thème clair ou sombre

Là, ou bien j'attaquais enfin l'écran de paramétrage de LeMOT, ou bien je trichais en me basant sur la directive média `prefers-color-scheme`. Celle-ci permet de détecter le choix de l'utilisateur quant à ses préférences en ce qui concerne le thème à utiliser (sombre ou clair).

J'ai bien entendu fait le plus facile des 2. Mais aussi le plus normal selon moi : pourquoi obliger les gens à devoir redire dans mon jeu ce qu'ils ont déjà paramétré sur leur téléphone ou leur navigateur !

Et donc désormais, mon fichier CSS commence par une palanquée de variables CSS.

```css
/* Thèmes
   ========================================================================== */

:root {
  --fond-general: #fff;      /* Fond blanc général */
  --texte-normal: #333;      /* Texte quasi noir */
  --texte-clair: #888;       /* Texte plus clair pour notes */
  --texte-jouee: #fff;       /* Texte blanc une fois la lettre jouée */
  --filigrane: #ddd;         /* Couleur du texte en filigrane */
  --message-fond: #dc267f;   /* Fond mauve pour les messages */
  --message-texte: #fff;     /* Texte blanc pour les messages */
  --touche-fond: #ccc;       /* Fond gris clair pour touche inutilisée */
  --touche-texte: #333;      /* Texte quasi noir pour touche en général */
  --fond-correct: #ffb000;   /* Orange pour les lettres bien placées */
  --fond-present: #648fff;   /* Bleu pour les lettres mal placées */
  --fond-absent: #ddd;       /* Gris clair pour les lettres absentes */
  --couleur-icone: #bbb;     /* Gris pas très clair pour icones */
  --texte-lien: #2962ff;     /* Bleu pour les liens */
}

@media (prefers-color-scheme: dark) { :root {
  --fond-general: #222;      /* Fond très noir général */
  --texte-normal: #eee;      /* Texte très blanc */
  --texte-jouee: #fff;       /* Texte blanc une fois la lettre jouée */
  --texte-clair: #888;       /* Texte moins blanc pour notes */
  --filigrane: #444;         /* Couleur du texte en filigrane */
  --message-fond: #dc267f;   /* Fond mauve pour les messages */
  --message-texte: #fff;     /* Texte blanc pour les messages */
  --touche-fond: #888;       /* Fond gris moyen pour touche inutilisée */
  --touche-texte: #fff;      /* Texte blanc pour touche en général */
  --fond-correct: #ffb000;   /* Orange pour les lettres bien placées */
  --fond-present: #648fff;   /* Bleu pour les lettres mal placées */
  --fond-absent: #444;       /* Gris-noir pour les lettres absentes */
  --couleur-icone: #888;     /* Gris moyen pour icones */
  --texte-lien: #2962ff;     /* Bleu pour les liens */
}}
```

Une bonne chose de faite !


## Un petit dernier pour la route...

J'utilise une antiquité pour compresser les CSS ([Microsoft Ajax Minifier](https://github.com/Microsoft/ajaxmin)) et elle n'a pas tenu le coup face aux variables CSS :( Alors pour l'instant, je suis passé au premier venu, à savoir [CSSO](https://github.com/css/csso), via sa version [csso-cli](https://github.com/css/csso-cli) pour faire le boulot.

Je me demande quand même s'il ne lui serait pas possible de compresser le nom des variables CSS, pour que `--fond-general` soit raccourci en `--a`, `--texte-normal` devienne `--b`, etc...

De toute façon, c'est un truc que je devrai revoir un jour ou l'autre pour décider de façon éclairée de ce que je vais utiliser désormais...


## Conclusion

Quoiqu'il en soit, encore un week-end bien employé, puisqu'il est enfin possible d'apprécier **LeMOT** à sa juste valeur, même si vous préférez utiliser un mode sombre !

Et pour jouer, c'est toujours par là : [https://www.solitaire-play.com/lemot/](https://www.solitaire-play.com/lemot/) :)

![Le thème sombre de LeMOT](/public/2022/wordle-fr-dark-mode.png "Pas mal du tout, je trouve :)")


<div class="encart">

English version: {% goto_en "Dark mode for French Wordle", "2022-02-02-dark-mode-french-wordle" %}.

</div>
