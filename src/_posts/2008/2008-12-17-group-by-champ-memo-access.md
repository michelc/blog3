---
date: 2008-12-17 13:56:00
layout: post
redirect_from: "post/2008/12/17/Group-By-d-un-champ-Memo-sous-Access"
tags: ap, sql
title: "Group By d'un champ Mémo sous Access"
---

Hier soir j'ai enfin corrigé un bug sournois qui raccourcissait les
descriptions des films à 255 caractères. Jusqu'à présent, je n'avais pas réussi
à reproduire ce bug en local et donc à trouver ce qui pouvait le provoquer.
Mais à force d'insister et d'éliminer tout ce qui ne pouvait pas poser
problème, j'ai fini par avoir de gros doutes sur la requête qui sert à mettre à
jour la date de dernière programmation des films.

Cette requête retrouve tous les films dont la date de dernière programmation
actuellement enregistrée (dir_Movies.lastDate) est inférieure à la date de la
dernière séance correspondant à ce film (dir_Seances.progDate).

```
SELECT T1.idMovie, 
       T1.displayName, 
       T1.description, 
       T1.length, 
       T1.picture, 
       T1.lastDate, 
       MAX(T2.progDate) AS progDate 
FROM   dir_Movies  T1, 
       dir_Seances T2 
WHERE  (T2.keyFilm = T1.idMovie) 
GROUP BY 
       T1.idMovie, 
       T1.displayName, 
       T1.description, 
       T1.length, 
       T1.picture, 
       T1.lastDate 
HAVING (T1.lastDate < MAX(T2.progDate))
```

Le souci, c'est qu'en local, cette requête ne renvoyait aucune ligne. Ce qui
est "normal" dans la mesure où ma base de données locale est une simple copie
de la base de données de production, et que lorsque je récupère cette copie, la
mise à jour de la date de dernière programmation a déjà été faite.

Par conséquent, il a d'abord fallu bidouiller la table des films pour que je
puisse tester en local cette requête. Pour cela, j'ai mis toutes les dates de
dernière programmation au 1° décembre.

```
UPDATE dir_Movies SET dir_Movies.lastDate = #12/1/2008#;
```

Et là, la requête qui me semblait douteuse m'a renvoyé 52 lignes. Après
avoir agrandi la colonne "description", j'ai pu constater qu'en effet celle-ci
était bel et bien coupée et à première vue à quelque chose comme 255
caractères.

Etant donné que je n'avais pas vraiment besoin de faire un GROUP BY sur la
description, j'ai donc modifié ma requête pour faire sortir la colonne
"description" de la clause GROUP BY :

```
SELECT T1.idMovie, 
       T1.displayName, 
       T1.length, 
       T1.picture, 
       T1.lastDate, 
       MAX(T1.description) AS description, 
       MAX(T2.progDate) AS progDate 
FROM   dir_Movies  T1, 
       dir_Seances T2 
WHERE  (T2.keyFilm = T1.idMovie) 
GROUP BY 
       T1.idMovie, 
       T1.displayName, 
       T1.length, 
       T1.picture, 
       T1.lastDate 
HAVING (T1.lastDate < MAX(T2.progDate))
```

Malheureusement, Access n'a pas du tout apprécié et m'a gratifié du message
d'erreur suivant : *Impossible d'obtenir des champs Memo, OLE ou
Hyperlink Object dans l'argument d'agrégat (T1.description)*.

Heureusement, Google a été plus conciliant et après [quelques
recherches](http://allenbrowne.com/bug-18.html) j'ai fini par trouver qu'il suffisait d'utiliser la fonction
FIRST() ou LAST() pour contourner le problème.

```
SELECT T1.idMovie, 
       T1.displayName, 
       T1.length, 
       T1.picture, 
       T1.lastDate, 
       LAST(T1.description) AS description, 
       MAX(T2.progDate) AS progDate 
FROM   dir_Movies  T1, 
       dir_Seances T2 
WHERE  (T2.keyFilm = T1.idMovie) 
GROUP BY 
       T1.idMovie, 
       T1.displayName, 
       T1.length, 
       T1.picture, 
       T1.lastDate 
HAVING (T1.lastDate < MAX(T2.progDate))
```

Et ça marche : la requête passe et la colonne description n'est pas
tronquée à 255 caractères.
