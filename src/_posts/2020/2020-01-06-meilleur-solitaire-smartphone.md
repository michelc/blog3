---
date: 2020-01-06 13:10:55+200
layout: post
tags: css, javascript
title: "5 améliorations pour un meilleur solitaire sur smartphone"
image: "/public/2020/responsive-solitaire.jpg"
excerpt: "Solitaire-Play est déjà un site responsive, mais il y a toujours à faire pour améliorer le fonctionnement sur les smartphones : désactiver le «pull-to-refresh», passer du «hover» au «ripple», agrandir les boutons, placer la pioche à droite..."
---

Les différents solitaires de mon site de jeux [Solitaire-Play](https://www.solitaire-play.com/) sont tous "responsive". Ce qui super intéressant puisque ça veut dire qu'ils fonctionnent correctement aussi bien sur un PC de bureau qu'un ordinateur portable, mais aussi sur une tablette ou un iPad et surtout sur des smartphones Android ou iPhone...

<figure>
  <img src="{{ page.image }}" alt="responsive-solitaire" />
  <figcaption>
    <a href="http://ami.responsivedesign.is/">Am I Responsive ? - Justin Avery</a>
  </figcaption>
</figure>

J'écris du code HTML suffisament valide, du code CSS assez correct et du JavaScript à peu près passe-partout. Cela me permet d'être assez tranquille et de faire pas mal de modifications sans avoir à chaque fois à tout vérifier sur différents systèmes.

Mais de temps en temps, ça n'est pas inutile de jeter un coup d'oeil pour contrôler que tout continue de fonctionner comme je le souhaite. Et donc, pendant mes congés, j'ai fait un petit tour m'assurer que tout allait bien quand mon site était utilisé depuis un téléphone portable.

Résultat : ça marche bien, mais j'ai quand même trouvé quelques points à améliorer.


## Désactiver le "pull-to-refresh"

Le "pull-to-refresh", c'est le geste qui consiste à attraper le haut de l'écran pour le faire glisser vers le bas. C'est un geste qui a été popularisé par les applications mobiles de Facebook et Twitter où cela sert à "libérer" de la place en haut l'écran pour y afficher des informations plus récentes. Et là, Google il est scié ! Quoi ? Y'a une nouvelle UX trop bien, il faut que je fasse pareil avec Chrome sur Android.

Mais ça, moi j'étais pas au courant. Et quand je jouais sur un téléphone, il arrivait de temps en temps que l'écran soit rafraîchit et que la partie en cours disparaisse. Jusqu'à il y a peu, je croyais que c'était parce que j'étais vieux et que je n'avais pas 2 pouces comme les jeunes pour taper correctement sur un téléphone :(

Puis un jour j'en ai eu marre et j'ai cherché pourquoi Google me faisait perdre alors que j'allais enfin réussir à gagner. Et de fil en Stack Overflow, je suis arrivé sur une page m'expliquant comment reprendre le contrôle de mon scroll : [Take control of your scroll: customizing pull-to-refresh and overflow effects](https://developers.google.com/web/updates/2017/11/overscroll-behavior).

Donc, pour dire non merci je ne veux plus être embêté par le pull to refresh, il suffit d'une seule ligne de CSS :

```css
body {
  overscroll-behavior-y: contain;
}
```


## Désactiver le "hover" / Activer le "ripple"

Ca c'est un problème classique avec les smartphones : comme il n'y a pas de souris, ils ne peuvent pas savoir quand on survole un truc avec le doigt et donc appliquer les styles définis pour des `:hover`. A la place, ils appliquent ces styles `:hover` dans le cas des `:focus`. Et une fois qu'on a appuyé sur un bouton, c'est lui qui prend le "focus" avec les styles qui vont avec le "hover".

Dans mon cas, je colore les boutons en bleu au survol de la souris pour bien montrer que c'est là qu'il faut cliquer. Et sur un téléphone, après avoir appuyé sur le bouton "HINT", il restait bleu pour bien montrer que j'avais besoin d'aide pour jouer à Klondike Solitaire.

Donc, la solution est simple, il suffit de ne pas styles les `:hover` dans le cas des téléphones et sans doute des tablettes. Pour savoir si c'est un téléphone, c'est facile : si c'est petit, c'est un téléphone. Pour les sans doute une tablette, c'est un peu plus coton. Perso, ma CSS ne fait pas trop de différence entre une tablette et un PC et puis il y a des tablettes qui ont des stylets. Va savoir si un stylet gère le `:hover` !

C'est là que je me suis un peu fourvoyé. Je venais de passer à [DuckDuckGo](https://duckduckgo.com/) et j'avais un peu de mal à savoir quoi lui demander pour trouver les "meilleurs" résultats. J'étais donc tombé sur l'article [How to deal with :hover on touch screen devices](https://www.prowebdesign.ro/how-to-deal-with-hover-on-touch-screen-devices/) et surtout sur [The "Hover Effect" for Mobile Buttons](https://uxmovement.com/mobile/the-hover-effect-for-mobile-buttons/).

Ce dernier explique très bien ce qu'est l'effet "ripple" et comment ça marche. Mais j'ai lu ça un peu en travers et j'ai suivi un peu trop vite le lien "[ripple effect](https://codepen.io/finnhvman/post/pure-css-ripple-with-minimal-effort)" sur CodePen et je me suis retrouvé à essayer de faire pareil sur mon site. J'étais passé de "comment supprimer le hover" à "comment faire une ondulation en CSS".

Je fais court. Sur un téléphone, il n'y a pas besoin de faire quoi que ce soit pour que les boutons aient un effet "ripple" : c'est le navigateur qui s'en charge. J'ai donc pu me contenter de supprimer les styles "hover" (le bleu dans mon cas) pour les navigateurs qui ne le supporte pas :

```css
h1 a:hover, button:hover {
  background-color: #05f;
  color: white;
  text-decoration: none;
}

@media (hover: none) {
  h1 a:hover, button:hover {
    background-color: #084;
    outline: none;
}
```

La documentation du [@media(hover)](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) sur MDN.

Sinon, j'ai aussi mis un `outline: none` (mais je sais qu'il ne faut pas faire ça : [Never remove CSS outlines](https://a11yproject.com/posts/never-remove-css-outlines/)) pour qu'après avoir appuyé sur un bouton il n'y ait pas de liséré autour pour montrer qu'il a toujours le focus.


## Agrandir un peu les boutons

Le haut de l'écran de chaque solitaire contient une barre de menu avec le nom du jeu en cours et 4 boutons qui permettent :

* "GAME" : démarrer une nouvelle partie
* "HINT" : recevoir un conseil pour jouer
* "UNDO" : annuler le dernier coup joué
* "≡" : choisir un autre jeu de solitaire

Déjà, sur les "vieux" smartphones en mode vertical, je cache le menu "GAME" et il faut cliquer sur le nom du jeu pour démarrer une nouvelle partie :

```css
@media (max-width: 22rem) {
  #game { display: none; }
}
```

En attendant de faire mieux, j'ai très légèrement agrandi les boutons présents dans ce menu :

![](/public/2020/solitaire-menu.png)


## Afficher correctement la liste des jeux

Sur les smartphones, en plus du bouton "≡" dans la barre de menu pour sélectionner un autre jeu de solitaire, il y a un bouton "≡ Select Solitaire Game..." en dessous des boutons Twitter, Facebook, Pinterest...

Le problème, c'est que quand on cliquait dessus, la liste des solitaires disponibles s'affichait en haut de la page, et donc éventuellement au-dessus du haut de ce qui était visible à l'écran :

![](/public/2020/solitaire-scroll-1.png)

J'aurais pu y penser avant, mais j'ai donc corrigé ça pour faire un `window.scrollTop()` avant d'afficher la popup, ce qui permet de voir l'intégralité des jeux existants (tant qu'il n'y en a pas trop) :

![](/public/2020/solitaire-scroll-2.png)


## Déplacer la pioche à droite

J'ai remarqué en jouant plus régulièrement que j'avais un problème dans ma façon de jouer :

* J'avance la main droite, l'index tendu, vers la pioche située à gauche de l'écran
* Je <s>clique</s> presse sur la pioche pour tirer une carte
* J'enlève ma main pour pouvoir voir le tableau et vérifier si la nouvelle carte peut aller quelque part
* Je réavance ma main droite vers la gauche de l'écran pour repiocher...

Ca serait quand même plus simple si la pioche était à droite de l'écran (ou si j'étais gaucher). Ou alors, peut-être que si je savais me servir de tous mes doigts, je n'aurais pas ce genre de problème. Cependant, quand on recherche des images pour "Klondike Solitaire Mobile", on peut remarquer que bien souvent la pioche est à droite.

Par conséquent, j'ai moi aussi transvasé la pioche du côté gauche vers le côté droit de l'écran :

![](/public/2020/solitaire-pioche.png)

Au début, j'ai fait ça de façon "compliquée" :

```css
@media (max-width: 575.98px) {
  .reverse {
    display: flex;
    flex-direction: row-reverse;
  }
}
```

Puis étant donné que mon système de grid est déjà basé sur des `float: left`, il y avait moyen de faire beaucoup plus simple :

```css
.column {
  float: left;
  width: 14.2857%;
  ...
}

@media (max-width: 575.98px) {
  .reverse .column {
    float: right;
  }
}
```


## Conclusion

C'était pas très compliqué et j'espère que ça fera plaisir aux joueurs qui utilisent Solitaire-Play depuis leur téléphone.

Pour la suite, il faudrait que je retravaille sur la transformation du site en [PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps). J'ai déjà commencé à faire quelques trucs, en particulier passer à HTTPS, utiliser les [polices systèmes](https://markdotto.com/2018/02/07/github-system-fonts/) plutôt que "Century Gothic" et mettre en place les balises pour le [protocole Open Graph](https://opengraphprotocol.org/). En théorie, il me reste "seulement" à créer un fichier [manisfest.json](https://developers.google.com/web/fundamentals/web-app-manifest) puis à coder un [Service Worker](https://developers.google.com/web/ilt/pwa/introduction-to-service-worker).

Sinon, je pourrais aussi essayer de sauvegarder l'avancement d'un jeu dans [window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) pour retrouver la partie en cours ?

{:.encart}
English version: [5 improvements for a better solitaire on smartphone]({% post_url 2020-01-07-better-solitaire-smartphone %}){:hreflang="en"}.
