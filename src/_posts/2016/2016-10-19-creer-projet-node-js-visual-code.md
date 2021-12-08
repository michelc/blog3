---
date: 2016-10-19 23:51:00
layout: post
redirect_from: "post/2016/10/19/creer-projet-node-js-visual-code"
tags: javascript
title: "Créer un projet Node.js sous Visual Code"
---

Source : <https://code.visualstudio.com/docs/runtimes/nodejs>

## Créer un projet

```
C:\Code> md Test2
C:\Code> cd Test2
C:\Code\Test2> _
```

## Ouvrir ce projet

```
C:\Code\Test2> code .
```

## Créer un fichier test.js

```
var msg = 'Hello World';
console.log(msg);
```

## Exécuter le fichier test.js

A faire depuis le terminal intégré de Visual Studio Code (Ctrl+ù) ou depuis
l'invite de commande de Windows :

```
c:\Code\Test2> node test.js
Hello World

c:\Code\Test2> _
```

Il est possible de débuguer ce code de la même façon que pour le projet Test1.

## Créer le fichier jsconfig.json

Le fichier "jsconfig.json" sert à indiquer que le répertoire dans lequel il se
situe est un projet JavaScript.

Il permet aussi de paramétrer les options pour ce projet.

Tant qu'il n'existe pas de fichier "jsconfig.json", il y a une petite lampe
verte en bas à droite de la barre d'état. En cliquant dessus, cela crée un
fichier "jsconfig.json" par défaut :

```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "allowSyntheticDefaultImports": true
  },
  "exclude": [
    "node_modules",
    "bower_components",
    "jspm_packages",
    "tmp",
    "temp"
  ]
}
```

## Installer le fichier de définition pour Node.js

Par défaut, l'intellisense de Visual Studio Code reconnait le code JavaScript
mais pas le code spécifique à Node.js.

Pour cela, il faut installer le fichier de définition spécifique à Node.js :

```
C:\Code\Test2> typings install dt~node --global --save
```

Cela a pour effet de créer :

* Un répertoire "typings" avec tout ce qui va bien pour gérer l'intellisense
  spécifique à Node.js

* Un fichier "typings.json" pour configurer tout ça
