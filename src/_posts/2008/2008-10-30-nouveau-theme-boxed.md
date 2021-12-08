---
date: 2008-10-30 18:45:00
layout: post
redirect_from: "post/2008/10/30/Nouveau-theme-Boxed"
tags: blog, html
title: "Nouveau thème Boxed"
---

Ca faisait un bon moment que j'y pensais et je l'ai enfin fait : mon
blog a maintenant une nouvelle charte graphique ! Quittez donc 5 secondes
votre agrégateur et venez vous rendre compte par vous-même :)

Au début, j'étais parti comme bien souvent de la charte graphique [Skidoo Redux](http://webhost.bridgew.edu/etribou/layouts/skidoo_redux/) et
petit à petit, j'étais arrivé à faire ce que je souhaitais obtenir, à
savoir :

* une présentation sur 2 colonnes, avec les menus ou autres dans une barre
latérale sur la gauche et le contenu principal sur la partie de droite
* un source html où le contenu principal apparait avant le contenu de la
barre latérale
* une mise en évidence du contenu principal (encadré et fond blanc) par
rapport à tout le reste (fond uni qui occupe tout l'écran) et qui soit
suffisamment large pour permettre les copies d'écrans et les extraits de codes
sources

Malheureusement, l'adaptation sous Dotclear n'était pas si évidente que ça,
parce que la structure de base pour Skidoo Redux est un peu différente de celle
générée par défaut dans le cas d'un [Gandi Blog](http://www.gandi.fr/domaine/blog/).

## Squelette html pour Skidoo Redux

```
<body>
    <div id="page-container">
        <div id="masthead">
            <div class="inside">
                <ul class="rMenu"> ... </ul>
                <h1> ... </h1>
            </div>
        </div>
        <div id="outer-column-container">
            <div id="inner-column-container">
                <div id="middle-column">
                    <div class="inside">
                        ...
                    </div>
                </div>
                <div id="left-column">
                    <div class="inside">
                        ...
                    </div>
                </div>
                <div class="clear-columns"><!-- do not delete --></div>
            </div>
        </div>
        <div id="footer">
            <div class="inside">
                ...
            </div>
        </div>
    </div>
</body>
```

## Squelette html pour Gandi Blog

```
<body>
    <div id="page">
        <div id="top">
            <h1><span> ... </span></h1>
        </div>
        <p id="prelude"> ... </p>
        <div id="wrapper">
            <div id="main">
                <div id="content">
                    ...
                </div>
            </div>
            <div id="sidebar">
                <div id="blognav">
                    ...
                </div>
                <div id="blogextra">
                    ...
                </div>
            </div>
        </div>
        <div id="footer">
            ...
        </div>
    </div>
</body>
```

En fait, une bonne partie du principe de Skidoo Redux repose sur les deux
div #outer-column-container et #inner-column-container qui permettent de
définir la colonne de gauche en tant que `border-left`.

Dans le cas d'un Gandi Blog, il existe bien une div #wrapper qui peut se
substituer à la div #outer-column-container, mais rien qui puisse correspondre
à la div #inner-column-container.

Après un certain nombre d'essais d'adaptations, j'ai préféré laisser tomber
et je suis allé voir sur <dotaddict[http://dotaddict.org/> ce qu'il
existait comme thèmes avec la structure que je souhaitais. Et parmi les
différents [thèmes à 2
colonnes](http://themes.dotaddict.org/galerie-dc2/tag/2 colonnes) proposés pour Dotclear 2, j'ai récupéré le thème [Bastienne](http://themes.dotaddict.org/galerie-dc2/details/Bastienne).

[![Le thème Bastienne pour Dotclear 2](http://themes.dotaddict.org/files/public/galeries/dc2/bastienne/.bastienne_m.jpg)](http://themes.dotaddict.org/galerie-dc2/details/Bastienne)

Et me voila reparti pour un nouveau tour d'adaptations afin de reproduire ce
que j'avais déjà réussi à faire avec Skidoo Redux.

J'ai essayé d'organiser la feuille de style en m'inspirant de cette
d'origine et en gardant plus ou moins le découpage suivant :

* la structure des différents blocs
* la présentation des différents blocs
* la présentation de certains blocs particuliers (citations, codes sources,
listes...)
* la présentation de blocs spécifiques à Dotclear (tags, commentaires,
informations sur le billet...)

Par conséquent, si j'enlève toutes les parties spécifiques à Dotclear (et
pour l'instant marquées GandiBlog), je devrais obtenir une charte graphique
tout à fait acceptable pour [Altrr-Press](http://www.altrr.com/) (à
tester plus tard).

Je ne suis pas encore certain d'avoir bien pris en compte toutes les
possibilités de Dotclear, masi c'est déjà largement suffisant pour
l'utilisation que j'en fait sur ce blog. Et donc, après [quasiment 2 ans](http://quotedprintable.com/pages/scribbish) de bons et
loyaux services, je laisse tomber la charte graphique [Scribbish](http://quotedprintable.com/pages/scribbish) pour ce blog.

Pour la mise en prod, c'est assez simple. Dans le tableau de bord, je clique
sur "Apparence du blog" et je conserve mon "Custom theme" actuel, mais je
change sa configuration de :

```
@import url(/public/scribbish/application.css);
```

en :

```
@import url(/public/css/boxed/boxed.css);
@media print {
  body { margin: 0; padding: 0; }
  #page { width: 100%; }
  #prelude, #navlinks, #sidebar, #comment-form, #pings, #ping-url, #comments-feed { display: none; height: 0; width: 0; }
  #main { float: none; margin: 0; padding: 0; width: 99% important; }
  #content pre { color: #000; background: #eee; }
  #content { border: none 0; margin: 0; padding: 0; width: 99% important; }
  /* http://longren.org/2006/09/27/wrapping-text-inside-pre-tags */
  pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap !important;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }
}
```

La partie `@media print`, c'est pour la feuille de style à
l'impression. Ca fait disparaitre tout ce qui est navigation ou accessoire de
façon à n'imprimer que le contenu central, et surtout sans qu'il manque la fin
des lignes (comme c'est quelquefois le cas sur certains blogs).

Pour la suite, je vais tester sur place pendant quelque temps, peut-être
fignoler quelques trucs par ci par là et faire en sorte que la CSS soit bien
valide. J'aimerai aussi faire apparaitre un menu en haut à droite, mais je ne
saisi pas encore si je pourrait faire ça avec un simple bloc de texte
puisqu'avec les Gandi Blog il n'est pas possible de modifier le squelette html.
Et puis il faut aussi que je m'occupe du bloc #prelude avec les liens de
navigation pour l'accessibilité que j'ai laissé caché pour l'instant.
