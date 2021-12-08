---
date: 2016-10-10 23:43:00
layout: post
redirect_from: "post/2016/10/10/installer-visual-code-node-js-typescript"
tags: javascript
title: "Installer Visual Code, Node.js et TypeScript"
---

## Installer Visual Studio Code

```
C:\Code> choco install -y visualstudiocode
```

## Installer Node.js et NPM (Node Package Manager)

```
C:\Code> choco install -y nodejs.install
```

## Installer la dernière version de TypeScript

```
C:\Code> npm install -g typescript
```

## Installer Typings

```
C:\Code> npm install -g typings
```

## Vérifier que tout est correctement installé

```
C:\Code> code -v
1.5.3 (5be4091987a98e3870d89d630eb87be6d9bafd27)

C:\Code> node -v
v6.7.0

C:\Code> npm -v
3.10.3

C:\Code> tsc -v
Version 2.0.3

C:\Code> typings -v
1.4.0
```

## Utiliser TypeScript dans Visual Studio Code

Pour utiliser la version de TypeScript installée via NPM dans Visual Studio
Code, il faut localiser où est elle a été installée :

```
C:\Code> npm list -g typescript
C:\Users\NOM.PRENOM\AppData\Roaming
pm
+-- typescript@2.0.3
`-- typings@1.4.0
  `-- typings-core@1.6.0
    `-- typescript@2.0.3
```

Puis configurer Visual Studio Code pour utiliser cette version plutôt qu'une
autre installée manuellement.

Ajouter (ou modifier) la ligne "typescript.tsdk" au fichier de configuration de
l'utilisateur (File &gt; Preferences &gt; User Settings) :

```
"typescript.tsdk": "C:/Users/NOM.PRENOM/AppData/Roaming/npm/node_modules/typescript/lib"
```
