---
date: 2020-01-14 12:16:21+200
layout: post
lang: en-US
tags: sql
title: "Remove duplicates rows with SQL"
image: "/public/2020/rita-hayworth.jpg"
excerpt: "I was a bit worried, but it's not that complicated to delete duplicate rows from a table in SQL Server."
---

Last week I made a small update error on my application and I ended up with duplicates values in a table. Of course, this would not have happened if I had a unique key, but as I check before inserting, I thought I was safe.

<figure>
  <img src="{{ page.image }}" alt="the-lady-from-shangai" />
  <figcaption>
    <a href="https://en.wikipedia.org/wiki/The_Lady_from_Shanghai">The Lady from Shanghai - Rita Hayworth</a>
  </figcaption>
</figure>

Unfortunately, as I couldn't delete everything and just start updating data again, I had to figure out how to delete duplicates rows.

As a first step, I run a simple query to find out how much I was in trouble.

```sql
SELECT Place_ID, Event_ID, StartDate, COUNT(*)
FROM   Showings
GROUP BY Place_ID, Event_ID, StartDate
HAVING COUNT(*) > 1
```

Good news first: there are no triplets :)

Less good news: I have more than a thousand rows to delete. So no way to do this by running one request after the other...

Good thing: since my table has a primary key, I can identify duplicate data:

```sql
SELECT Place_ID, Event_ID, StartDate, MAX(Showing_ID) AS ID
FROM   Showings
GROUP BY Place_ID, Event_ID, StartDate
HAVING COUNT(*) > 1
```

This way, I find the IDs of all the rows added when there was already a record with the same data (Place_ID, Event_ID and StartDate). I only have to delete these useless values (since the others were there first) :

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

Sometimes, IT is not that complicated.

{:.encart}
Version en français : [Supprimer des doublons en SQL]({% post_url 2020-01-13-supprimer-doublon-sql %}){:hreflang="fr"}.
