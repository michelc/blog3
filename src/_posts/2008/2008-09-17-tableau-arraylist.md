---
date: 2008-09-17 19:05:00
layout: post
redirect_from: "post/2008/09/17/Tableau-d-ArrayList"
tags: code-snippets, csharp
title: "Tableau d'ArrayList"
---

Pour créer un tableau de 2 ArrayList, il ne suffit pas d'écrire :

```
ArrayList[] list = new ArrayList[2];
```

Cela ne fait que déclarer un tableau de 2 ArrayList mais qui sont nulls. Il
faut aussi initialiser chacune des ArrayList en procédant de la façon suivante
:

```
ArrayList[] list = new ArrayList[2] { new ArrayList(), new ArrayList() };
```

C'est pas plus compliqué que ça :)

Et dans le cas où on aurait besoin d'un peu plus que 2 ArrayList, il vaut
mieux passer par une boucle :

```
ArrayList[] list = new ArrayList[2];
for (int i = 0; i < list.Length; i++) {
    list[i] = new ArrayList();
}
```
