---
date: 2014-05-12 13:49:00
layout: post
redirect_from: "post/2014/05/12/attention-fermeture-balises"
tags: html
title: "Attention à la fermeture des balises"
---

Soit une page HTML normalement compliquée mais qui après avoir viré toutes les
CSS et tous les Javascript pourrait se ramener à ça :

```
<!DOCTYPE html>
<html>
  <head>
    <style>
      a { background-color: yellow; border: 1px solid red; padding: 20px; }
    </style>
  </head>
  <div>
    <a href="/toto">TOTO</ a>
  </div>
  <h1>TITRE</h1>
</html>
```

Voilà ce à quoi naïvement je pense aboutir :

![](/public/2014/bug-je-veux-ca.png)

Et pour de vrai, j'ai le lien qui se répète inexpliquablement sur le titre :

![](/public/2014/bug-au-secours.png)

Afficher le code source de la page :

```
<!DOCTYPE html>
<html>
  <head>
    <style>
      a { background-color: yellow; border: 1px solid red; padding: 20px; }
    </style>
  </head>
  <div>
    <a href="/toto">TOTO</ a>
  </div>
  <h1>TITRE</h1>
</html>
```

=> Oui, c'est bien ça que j'ai dit.

Inspecter l'élément :

```
<html><head>
    <style>
      a { background-color: yellow; border: 1px solid red; padding: 20px; }
    </style>
  </head>
  <body><div>
    <a href="/toto">TOTO<!-- a-->
  </a></div><a href="/toto">
  <h1>TITRE</h1>
</a></body></html>
```

=> C'est quoi ce truc ! Chrome est bugué ?

Flûte, sous IE c'est trop quasi pareil :

![](/public/2014/bug-toi-aussi.png)

F12, outils de développement :

```
<html><head>
    <style>
      a { background-color: yellow; border: 1px solid red; padding: 20px; }
    </style>

  </head><body><div>
    <a href="/toto">TOTO
  </a></div><a href="/toto">
  <h1>TITRE</h1>
</a></body></html>
```

=> C'est un complot !

Et donc, ce n'est qu'un très et trop long moment plus tard, après avoir élagué
au maximum mon code source d'origine, que le problème m'a enfin tapé dans
l'oeil :

> On ne doit pas écrire `</ a>` mais `</a>`
> sans ESPACE. `</a >` à la rigueur, mais jamais jamais jamais
> `</ a>` ou `< /a>`.
