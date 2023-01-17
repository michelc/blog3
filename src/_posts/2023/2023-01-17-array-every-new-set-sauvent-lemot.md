---
date: 2023-01-17 18:55:17 +02:00
tags: [ javascript, jeux ]
title: "Array.every() et new Set() sauvent LeMOT"
cover:
  image: /public/2023/fleur-monoi.png
  text: Fleurs de Tiaré tahiti, littéralement « fleur tahitienne »
excerpt: Hier j'ai eu un petit problème dans mon jeu de Wordle en français. La solution à trouver n'existait pas dans la liste des mots acceptés et il y a eu quelques parties qui se sont perdues injustement...
---

## Y'a comme un bug ?

Hier j'ai eu un petit problème dans mon jeu de Wordle en français. Comme dans le Wordle d'origine, j'utilise 2 listes de mots :

* la première avec tous les mots de 5 lettres acceptés par mon jeu : "jouables"
* la seconde avec les mots à trouver : "gagnants"

Contrairement à Josh Wardle, je n'ai pas préparé cette liste une fois pour toute lorsque j'ai créé le jeu. Dans la pratique, je la complète tous les 2 ou 3 mois, en ajoutant entre 50 et 100 mots à chaque fois. Je prends des mots au hasard dans la liste principale et je fais quelques ajustements pour éviter les mots trop compliqués ou pas très heureux...

Une fois ces nouveaux mots trouvés, je vérifie qu'ils n'ont pas déjà été proposés (pas de doublons) et aussi qu'ils existent bien dans la liste des mots acceptés (pas de mots introuvables). Je fais ça parce qu'il m'arrive de faire une faute de frappe quand je fais mes derniers petits ajustements.

Malheureusement c'est quelque chose que je fais manuellement et la dernière fois, j'ai dû rater une étape. Lundi, le mot à trouver était "MONOI" ("monoï" avec la bonne orthographe), mais bizarrement ce mot ne faisait pas parti de la liste des mots jouables reconnus par l'application !

Et donc rien à faire, même en jouant bien on ne pouvait que perdre puis s'entendre dire que la solution était "MONOI" alors que ça nous avait été refusé juste avant ! 😠😡

<figure>
  <img src="/public/2023/lemot-monoi.png" alt="" />
  <figcaption>Le bug en action...</figcaption>
</figure>


## Prudence est mère de sûreté...

Aussi pour éviter que cela ne se reproduise, j'ai désormais automatisé ça directement dans le code. Cela affiche un message lorsque il y a des mots "gagnants" qui n'existent pas dans la liste des mots "jouables" (donc des mots inconnus qui ne seront pas trouvables). Et un autre message si la liste des mots "gagnants" contient des doublons (en cas de mots déjà proposés).

```javascript

// Vérifie que tous les mots gagnants existent dans les mots jouables
if (gagnants.every(elem => jouables.includes(elem)) === false)
  console.log("gagnants inconnus !");

// Vérifie qu'il n'y a pas de doublon dans les mots gagnants
if (gagnants.length !== [...new Set(gagnants)].length)
  console.log("gagnants doublons !");

```


## Les zexplications de ChatGPT :

```javascript
// Vérifie que tous les mots gagnants existent dans les mots jouables
if (gagnants.every(elem => jouables.includes(elem)) === false)
  console.log("gagnants inconnus !");
```

> Ce code vérifie si tous les éléments de l'array "gagnants" apparaissent dans l'array "jouables". Si ce n'est pas le cas, le message "gagnants inconnus !" est affiché dans la console. La méthode "every()" parcourt chaque élément de l'array "gagnants" et vérifie si cet élément existe dans l'array "jouables" en utilisant la méthode "includes()". Si tous les éléments de "gagnants" existent dans "jouables", la fonction "every()" renvoie "true" et le code dans la condition if ne sera pas exécuté, sinon elle renvoie "false" et le code dans la condition if sera exécuté.

```javascript
// Vérifie qu'il n'y a pas de doublon dans les mots gagnants
if (gagnants.length !== [...new Set(gagnants)].length)
  console.log("gagnants doublons !");
```

> Cette ligne de code vérifie s'il y a des doublons dans l'array "gagnants". Elle utilise le "!==" pour vérifier si la longueur de l'array "gagnants" est différente de celle de l'array créé par la combinaison de "new Set()" et de l'opérateur de décomposition "[...]". La méthode "Set()" crée un nouvel objet Set qui contient les éléments uniques de l'array passé en paramètre, l'opérateur de décomposition "[...]" permet de convertir ce nouvel objet en array.
Si la longueur de l'array "gagnants" est égale à celle de l'array créé par la combinaison de "new Set()" et de l'opérateur de décomposition "[...]", cela signifie qu'il n'y a pas de doublons dans "gagnants" et la condition if ne sera pas exécuté. Sinon, il y a des doublons dans "gagnants" et le message "gagnants doublons !" sera affiché dans la console.


## Que le jeux continue !

Heureusement, c'est arrivé une seule fois en un peu plus d'un an de jeu.

Mais au moins, maintenant, si on perd ça ne sera plus que la faute à pas de chance : [https://www.solitaire-play.com/lemot/](https://www.solitaire-play.com/lemot/) :)
