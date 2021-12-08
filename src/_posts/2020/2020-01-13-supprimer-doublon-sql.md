---
date: 2020-01-13 18:52:45+200
layout: post
tags: sql
title: "Supprimer des doublons en SQL"
image: "/public/2020/rita-hayworth.jpg"
excerpt: "J'ai eu un peu peur, mais finalement c'est pas si compliqué que ça de supprimer des lignes en doubles dans une table SQL Server."
---

La semaine dernière j'ai fait une petite erreur de mise à jour sur une application et je me suis retrouvé avec des données enregistrées deux fois dans une table. Bien entendu, ça ne serait pas arrivé si j'avais créé une clé unique, mais comme je teste avant d'insérer, je pensais être à l'abri.

<figure>
  <img src="{{ page.image }}" alt="la-dame-de-shangai" />
  <figcaption>
    <a href="https://fr.wikipedia.org/wiki/La_Dame_de_Shanghai">La Dame de Shanghai - Rita Hayworth</a>
  </figcaption>
</figure>

Et malheureusement, comme je ne pouvais pas tout supprimer et simplement relancer la mise à jour des données, j'ai dû chercher comment dédoublonner.

Pour commencer, une requête simple pour voir l'étendue des dégats :

```sql
SELECT Place_ID, Event_ID, StartDate, COUNT(*)
FROM   Showings
GROUP BY Place_ID, Event_ID, StartDate
HAVING COUNT(*) > 1
```

Bon déjà, bonne nouvelle, il n'y a pas de triplons :)

Moins bonne nouvelle, il me reste plus d'un millier de lignes à supprimer. Donc pas moyen de faire ça une requête après l'autre...

Heureusement, comme ma table dispose d'une clé primaire, j'ai moyen d'identifier les données en double :

```sql
SELECT Place_ID, Event_ID, StartDate, MAX(Showing_ID) AS ID
FROM   Showings
GROUP BY Place_ID, Event_ID, StartDate
HAVING COUNT(*) > 1
```

De cette façon, je retrouve les ID de toutes les lignes ajoutées alors qu'il existait déjà un enregistrement avec les mêmes caractéristiques (Place_ID, Event_ID et StartDate). Je n'ai plus qu'à supprimer ces lignes inutiles (puisque les autres étaient là avant) :

```sql
DELETE
FROM   Showings
WHERE  Showing_ID IN (
                       SELECT MAX(Showing_ID)
                       FROM   Showings
                       GROUP BY Place_ID, Event_ID, StartDate
                       HAVING COUNT(*) > 1
                      )
```

Des fois, l'informatique c'est pas plus compliqué que ça.

{:.encart}
English version: [Remove duplicates rows with SQL]({% post_url 2020-01-14-remove-duplicate-rows-sql %}){:hreflang="en"}.
