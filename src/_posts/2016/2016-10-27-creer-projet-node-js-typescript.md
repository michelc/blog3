---
date: 2016-10-27 22:04:00
layout: post
redirect_from: "post/2016/10/27/creer-projet-node-js-typescript"
tags: javascript
title: "Créer un projet Node.js en TypeScript"
---

## Créer (et ouvrir) un nouveau projet

```
C:\Code> md Test3 && cd Test3 && code .
```

Ca dépote !

## Créer le fichier tsconfig.json

```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "sourceMap": true
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

## Créer le fichier tasks.json

* Ctrl+Shift+P et "Configure Task Runner"
* Sélectionner "TypeScript - Watch Mode : Compiles a TypeScript project in watch
  mode"
* Ctrl+Shift+B pour démarrer la tâche

## Installer le fichier de définition pour Node.js

* Ctrl+ù pour ouvrir le terminal de Visual Code

```
c:\Code\Test3> typings install dt~node --global --save
```

## Créer un fichier test.ts

```
const path = require('path');

var current_dir = path.resolve('./');
console.log(current_dir);
```

## Exécuter le fichier test.js

* Ctrl+ù pour ouvrir le terminal de Visual Code

```
c:\Code\Test3> node test.js
c:\Code\Test3

c:\Code\Test3> _
```

## Améliorer l'intellisense pour Node.js

Dans certains tutoriels, on trouve une syntaxe utilisant le mot clé `var` :

```
var path = require('path');
```

Mais dans la documentation de Node.js, c'est bien la syntaxe avec le mot clé
`const` qui est utilisée :

```
const path = require('path');
```

Cependant, pour que Visual Code soit capable de reconnaitre l'objet `path`, il
faut utiliser la syntaxe d'import des modules de ES6 :

```
import * as path from 'path';
```

Ca ne change absolument rien au JS qui est généré :

```
"use strict";
const path = require('path');
var current_dir = path.resolve('./');
console.log(current_dir);
//# sourceMappingURL=test.js.map
```

Et par contre, on dispose maintenant d'une intellisense complète :

![](/public/2016/node-04-intellisense.png)

## Débuguer le code TypeScript

* Ctrl+Shift+D et sélectionner l'environnement "Node.js"
* Génère le fichier ".vscode/launch.json"

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/app.js",
      "stopOnEntry": false,
      "args": [],
      "cwd": "${workspaceRoot}",
      "preLaunchTask": null,
      "runtimeExecutable": null,
      "runtimeArgs": [
        "--nolazy"
      ],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "internalConsole",
      "sourceMaps": false,
      "outDir": null
    },
    {
      "name": "Attach",
      "type": "node",
      "request": "attach",
      "port": 5858,
      "address": "localhost",
      "restart": false,
      "sourceMaps": false,
      "outDir": null,
      "localRoot": "${workspaceRoot}",
      "remoteRoot": null
    },
    {
      "name": "Attach to Process",
      "type": "node",
      "request": "attach",
      "processId": "${command.PickProcess}",
      "port": 5858,
      "sourceMaps": false,
      "outDir": null
    }
  ]
}
```

* Modifier les 2 lignes suivantes :

```
      "program": "${workspaceRoot}/test.js",
      "sourceMaps": true,
```

* Venir sur la ligne `console.log(current_dir);` du fichier "test.ts" puis F9
  pour mettre un point d'arrêt dessus.

* F5 pour lancer le débugage

![](/public/2016/node-04-debug.png)

* F5 pour continuer l'exécution

Note : une fois le programme terminé, la barre d'outils pour le débugage est
toujours présente et il faut faire Shift+F5 pour arrêter l'exécution. Pour
éviter cela, on peut ajouter la ligne suivante à la fin du fichier "test.ts" :

```
process.exit();
```
