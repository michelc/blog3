---
date: 2025-12-18 11:40:38 +02:00
tags: [ git, windows ]
title: "Mettre à jour Git for Windows"
cover:
  image: /public/2025/patiences.png
  link: https://www.carrementfleurs.com/astucesetconseils/la-patience-la-fleur-avec-une-belle-floraison-n140
  text: Un tapis de patiences aux fleurs violettes et aux coeurs jaunes, en pleine floraison
excerpt: C'est bientôt les vacances, je procastine en attendant vendredi...
---

J'ai [Git for Windows](https://gitforwindows.org/) installé sur mon portable,
je ne sais plus trop pourquoi, mais je sais que j'utilise
[gitk.exe](https://git-scm.com/docs/gitk) de temps en temps...

Par contre la version installée est légèrement passée de date :

```
C:\> git --version
git version 2.36.1.windows.1
```

Alors bonne nouvelle, il existe une commande ultra simple pour installer une
mise à jour de Git for Windows : `git update-git-for-windows` !

Et en quelques minutes, je devient l'heureux propriétaire d'une version flambant
neuve :

```
C:\> git --version
git version 2.52.0.windows.1
```

PS1 : J'ai trouvé ça à l'ancienne, directement sur Stack Overflow
[How to upgrade Git on Windows to the latest version](https://stackoverflow.com/questions/13790592/how-to-upgrade-git-on-windows-to-the-latest-version)
sans passer par Chat GPT :)

PS2 : Je savais pas quoi mettre alors j'ai demandé à Chat GPT de m'inspirer pour
la description de l'image en bannière :(
