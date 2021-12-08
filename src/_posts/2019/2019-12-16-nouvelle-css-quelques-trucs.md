---
date: 2019-12-16 12:09:42+200
layout: post
tags: css
title: "Nouvelle CSS et 5 trucs bons à savoir"
image: "/public/2019/sapin-de-noel.jpg"
excerpt: "Pour la nouvelle année à venir, j'ai un peu rafraichi la charte graphique de mon
blogue. Outre le côté 'tout nouveau, tout beau', cela m'a permis de voir 2 ou 3
trucs de CSS et de Jekyll que je ne connaissais pas."
---

Pour la nouvelle année à venir, j'ai un peu rafraichi la charte graphique de mon
blogue. Outre le côté "tout nouveau, tout beau", cela m'a permis de voir 2 ou 3
trucs de CSS et de [Jekyll](https://jekyllrb.com/) que je ne connaissais pas.

<figure>
  <img src="{{ page.image }}" alt="sapin-de-noel" />
  <figcaption>
    <a href="https://unsplash.com/photos/ySNkCkdKyTY">Sapin de Noël - Rodion Kutsaev</a>
  </figcaption>
</figure>

J'ai commencé par changer la police de caractères. Jusqu'à il y a peu de temps,
j'utilisais beaucoup la police "Century Gothic", mais depuis quelque temps, je
préfère m'en tenir aux police systèmes.

* Avant : `font-family: "Century Gothic", "Trebuchet MS", Verdana, Helvetica, Sans-Serif;`
* Après : `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;`

J'ai aussi augmenté la taille des caractères par défaut et je suis revenu à du
"vrai" noir pour améliorer la lisibilité.

* Avant : `color: #444; font-size: 14px;`
* Après : `color: #000; font-size: 16px;`

Lors de la dernière modification de la charte graphique, j'avais décidé de ne
plus afficher le contenu au centre de l'écran, mais plutôt sur la partie gauche.
Finalement (ou du moins pour l'instant), je trouve que le fait de centrer le
contenu est plus clair et que ça donne un petit côté "page" qui facilite la
lecture.

* Après : `.container { margin: 0 auto; padding: 1rem; }`

Et pour améliorer la lisibilité et le côté épuré de la page, j'ai encore
augmenté la "marge" horizontale sur les écrans de PC :

```css
@media screen and (min-width: 48rem) {
    .container {
        padding: 1rem 3rem;
    }
}
```

J'aime bien faire une distinction entre les liens internes et les liens
externes. Au fil du temps, j'ai essayé différentes techniques : ajout d'une
icône à côté des liens externes, soulignement des liens externes seulement (ou
l'inverse), utilisation d'une couleur différente pour chaque type de liens...
Pour cette fois-ci, j'ai choisi de présenter les liens externes avec un léger
gras.

* Après : `a[href*='//'] { font-weight: 600; }`

**Truc n° 1** : je parle de "léger" gras parce qu'avant (la dernière fois que
j'avais essayé), le fait d'utiliser `font-weight: 600;` ou `font-weight: 900;`
ne faisait pas de différence. Maintenant on voit très bien la différence, au
moins sur mon PC...

En ce qui concerne les titres, j'ai plus ou moins conservé ce que j'avais dans
la version précédente, en particulier au niveau des couleurs.

* h1 : bleu => nom du blogue et navigation principale
* h2 : chocolat => titre du billet
* h3 : vert => sous-titres du billet
* h4 : gris => sous-titres de niveau 2

Je me suis donc contenté des quelques modifications suivantes :

1. Le titre du blogue (h1) est en `16px` par défaut et passe en `1.5rem` sur les
écrans de PC
1. J'ai augmenté la taille des autres titres et leurs marges verticales pour
améliorer la lisibilité
1. Le titre des billets (h2) est maintenant centré, ce qui le fait beaucoup plus
ressortir sur les petits écrans
1. Ajout de `line-height: 1; ` pour éviter de trop gros interlignes lorsque les
titres prennent plusieurs lignes sur les petits écrans

Pour les blocs de code source, j'ai cherché à faire un peu comme sur [dev.to](https://dev.to/)
et à les mettre en évidence par rapport au reste du contenu. Pour cela, j'ai
utilisé :

* une couleur de fond gris "très clair" : `background-color: #f8f8f8;`
* des bordures verticales un peu plus foncé : `border-color: #eee;`

Mais surtout, j'ai "collé" ce bloc aux bords de la page, pour qu'il se découpe
mieux par rapport au reste du contenu (en particulier sur les écrans de PC).

```css
.container { padding: 1rem; }
pre { margin: 1rem -1rem; }

@media screen and (min-width: 48rem) {
    .container { padding: 1rem 3rem; }
    pre { margin: 1rem -3rem; }
}
```

Et finalement, j'ai mis en commun ce style avec celui destiné aux autres types
de "bloc", comme les citations et les `div.encart` :

```css
blockquote, pre, .encart {
    background-color: #fff;
    border-bottom: 1px solid #fff;
    border-top: 1px solid #fff;
    clear: both;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    margin: 1rem -1rem;
    padding: .5rem 1rem;
    text-align: left;
}

blockquote {
    background-color: #fbfaea; /* ocre */
    border-color: #e3d0aa;
}

pre {
    background-color: #f8f8f8; /* gris */
    border-color: #eee;
    font-size: small;
}

.encart {
    background-color: #eaf7ff; /* bleu */
    border-color: #6b90da;
}
```

**Truc n° 2** : `color-adjust: exact` permet que ces blocs aient aussi une
couleur de fond à l'impression.

Toujours pour le code source, j'ai repris mon bout de CSS qui me permet d'avoir
automatiquement des retours à la ligne à l'intérieur du code source. Cela évite
d'avoir à scroller horizontalement pour voir la totalité du code ou pire de
perdre une partie du code à l'impression :

```css
/* https://stackoverflow.com/questions/248011/how-do-i-wrap-text-in-a-pre-tag */
pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap !important;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
}
```

Après quelques essais, j'ai quand même décidé de réserver ça aux écrans de PC et
à l'impression.

En parlant d'impression, j'ai aussi fait en sorte que toute la largeur de la
page soit utilisée :

```css
@media print {
    .container {
        max-width: 100rem;
        padding: 0 !important;
    }
}
```

Mais malgré tout, il faut bien laisser un peu de marge sinon tout est collé sur
les bords de la page. Un simple `margin` ou `padding` ne suffit pas :

* cela a bien un effet sur les marges horizontales => ok
* la marge verticale haute ne fonctionne que sur la 1° page imprimée => ko
* la marge verticale basse ne fonctionne que sur la dernière page imprimée => ko

C'est là qu'intervient mon **truc n° 3** :

```css
@page {
    margin: 1.5cm 1cm; /* en cm pour IE */
}
```

Et bien entendu, pour que les impressions soient parfaites, je masque les
contenus inutiles :

```css
@media print {
    div > header, nav, .pub { display: none; }
}
```

C'est déjà pas mal. J'ai malgré tout dû faire encore 2 modifications. Tout
d'abord, j'ai un problème avec ma liste d'archives qui se génère sous la forme
de `<li><p>Titre billet</p></li>`. Cela provoque un gros interligne entre les
différents billets d'un même mois. Plutôt que de m'embêter à comprendre d'où
provient ce problème, je me suis contenté d'une bidouille en CSS :

```css
li p {
    margin: 0 auto; /* page archives génère des <li><p>...</p></li> */
}
```

Et puis ces derniers temps, j'ai quelquefois utilisé les "encarts" pour
présenter une table des matières. Par exemple :

```markdown
<div class="encart">

1. [Comment j'ai (bientôt) remplacé jQuery]({% post_url 2019-04-30-dquery-remplacer-jquery %})
2. [Une version compatible IE9 / ES5]({% post_url 2019-05-07-dquery-compatibilite-ie9-es5 %})
3. [Ma librairie pour manipuler le DOM]({% post_url 2019-05-14-dquery-librairie-js-manipulation-dom %})
4. [La délégation des évènements en JS]({% post_url 2019-05-21-dquery-delegation-evenement-javascript %})
5. [Délégation d'évènements et « event.target »]({% post_url 2019-05-28-dquery-delegation-evenement-event-target %})
6. [Délégation d'évènements et iOS]({% post_url 2019-06-04-dquery-delegation-evenement-ios %})

</div>
```

Bon, ben ça, ça ne marche pas... Le code Markdown à l'intérieur de la balise
`div` n'est pas transformé en html :( Pour les cas les plus simples avec un seul
lien, j'avais pris l'habitude de bidouiller en remplaçant la balise `div.encart`
par son équivalent en Markdown, grâce à la syntaxe `{:.encart}` :

```
{:.encart}
Version en français : [Gérer le menu hamburger de Bootstrap 4 en Vanilla JS]({% post_url 2019-12-09-menu-hamburger-bootstrap-vanilla-js %}).
```

Pour les cas plus compliqués, j'avais laissé tomber et tout écrit en HTML. Mais
à l'occasion de cette révision de ma charte graphique, j'ai poussé un peu plus
loin mes recherches et fort heureusement il existe une solution : [Embedding
Markdown in Jekyll HTML](https://stackoverflow.com/a/23384161).

**Truc n° 4** : Il suffit d'ajouter un attribut `markdown="1"` pour que le code
Markdown à l'intérieur d'une balise HTML soit lui aussi correctement transformé.

```markdown
<div class="encart" markdown="1">

...

</div>
```

Et pour insister légèrement, voici le **truc n° 5** : toujours avoir une feuille
de style qui donne un bon résultat quand on imprime la page.

{:.encart}
English version: [A new CSS and 5 tips to know]({% post_url 2019-12-17-new-css-tips-to-know %}){:hreflang="en"}.
