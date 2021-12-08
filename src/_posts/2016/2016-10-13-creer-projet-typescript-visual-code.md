---
date: 2016-10-13 23:10:00
layout: post
redirect_from: "post/2016/10/13/creer-projet-typescript-visual-code"
tags: javascript
title: "Créer un projet TypeScript sous Visual Code"
---

Source : <https://code.visualstudio.com/Docs/languages/typescript>

## Créer un projet

```
C:\Code> md Test1
C:\Code> cd Test1
C:\Code\Test1> _
```

## Ouvrir ce projet

```
C:\Code\Test1> code .
```

## Créer le fichier tsconfig.json

Le fichier "tsconfig.json" sert à indiquer que le répertoire dans lequel il se
situe est un projet TypeScript.

Il permet aussi de paramétrer les options pour que le compilateur TypeScript
sache comment générer les fichiers JS à partir des fichiers TS.

```
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "sourceMap": true
  }
}
```

## Créer un fichier test.ts

```
class Startup {
  public static main(): number {
    console.log('Hello World');
    return 0;
  }
}

Startup.main();
```

Note : Shilt+Alt+P permet de reformater le code.

## Créer le fichier tasks.json

Ce fichier sert à paramétrer les tâches dans Visual Code.

* Ctrl+Shift+P => Command Palette
* Taper "Configure Task Runner" et &lt;Entrée&gt;
* Sélectionner la ligne "TypeScript - tsconfig.json : Compiles a TypeScript
  project"
* Cela crée un fichier .vscode/tasks.json

```
{
  // See http://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "0.1.0",
  "command": "tsc",
  "isShellCommand": true,
  "args": ["-p", "."],
  "showOutput": "silent",
  "problemMatcher": "$tsc"
}
```

Note : cette tâche compile un projet TypeScript, il faut donc avoir un fichier
"tsconfig.json" pour que le répertoire soit considéré comme un projet.

## Générer le fichier test.js via Visual Code

* Ctrl+Shift+B (Run Build Task) =>
  - génère le fichier test.js
  - et aussi test.js.map

```
var Startup = (function () {
  function Startup() {
  }
  Startup.main = function () {
    console.log('Hello World');
    return 0;
  };
  return Startup;
}());
Startup.main();
//# sourceMappingURL=test.js.map
```

## Générer le fichier test.js via la ligne de commande

* Ctrl+ù => ouvre le terminal intégré de Visual Code

```
c:\Code\Test1> tsc

c:\Code\Test1> _
```

=> génère le fichier test.js (et aussi test.js.map).

Note : ça marche aussi avec un terminal externe tel que l'invite de commande de
Windows.

## Générer le fichier à chaque enregistrement

Il faut modifier le fichier "tasks.json" de la façon suivante :

```
{
  // See https://go.microsoft.com/fwlink/?LinkId=733558
  // for the documentation about the tasks.json format
  "version": "0.1.0",
  "command": "tsc",
  "isShellCommand": true,
  "args": ["-w", "-p", "."],
  "showOutput": "silent",
  "isWatching": true,
  "problemMatcher": "$tsc-watch"
}
```

Puis Ctrl+Shift+B pour lancer la tâche et se mettre à observer les
modifications.

Note : pour créer directement une tâche qui compile à chaque enregistrement, il
est possible de configurer l'exécuteur de tâche en sélectionnant "TypeScript -
Watch Mode : Compiles a TypeScript project in watch mode".

## Exécuter le fichier test.js

A faire depuis le terminal :

```
c:\Code\Test1> node test.js
Hello World

c:\Code\Test1> _
```

## Débuguer le code

* Ctrl+Shift+D => ouvre la vue débugueur
* Cliquer sur l'engrenage pour sélectionner un environnement :
  - Node.js
  - VSCode Extension Development
  - .NET Core
* Choisir "Node.js" => génère un fichier ".vscode/launch.json"
* Y modifier `program` et `sourceMaps`

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch",
      "type": "node",
      "request": "launch",
 ---> "program": "${workspaceRoot}/test.js",
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
 ---> "sourceMaps": true,
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

* Ctrl+Shift+Y => affiche éventuellement la console de débugage
* F5 => lance le débugage

```
node --debug-brk=30135 --nolazy test.js
Debugger listening on [::]:30135
Hello World
```

Il est également possible de définir un point d'arrêt dans le code typescript :

* F9 sur la ligne
* Clic dans la marge gauche de la ligne

Puis F5 pour lancer le débugage puis F10 ou F11 pour tracer le code au fur et à
mesure de son exécution...
