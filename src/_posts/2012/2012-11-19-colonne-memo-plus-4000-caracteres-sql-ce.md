---
date: 2012-11-19 22:01:00
layout: post
redirect_from: "post/2012/11/19/colonne-memo-plus-4000-caracteres-sql-ce"
tags: ef, sql-server
title: "Mémo de plus de 4000 caractères sous SQL CE"
---

Je fais une petite application pour migrer une "vieille" base de données
Access vers SQL Server CE et je suis tombé sur une erreur d'un autre âge
lorsque j'essaie de transférer le contenu d'une colonne "mémo" :

> &gt; The field Content must be a string or array type with a maximum length
> of '4000'.

Pourtant, j'avais bien expliqué à Entity Framework que ma colonne devait
être de type "ntext" :

```
[Column(TypeName = "ntext")]
[DataType(DataType.MultilineText)]
public string Content { get; set; }
```

Ce qui devrait m'affranchir de cette barrière des 4000 octets :
[SQL Server Compact Data Types](http://msdn.microsoft.com/en-us/library/ms172424(SQL.110).aspx)

Une première recherche de "The field * must be a string or array type with a
maximum length of '4000'." m'envoie sur une solution à première vue un peu
brutale : [Error storing Image in SQL CE 4.0 with ASP.NET MVC 3 and Entity
Framework 4.1 Code First](http://stackoverflow.com/questions/5737733/error-storing-image-in-sql-ce-4-0-with-asp-net-mvc-3-and-entity-framework-4-1-co).

Le truc, c'est donc de carrément désactiver la validation (?!?!) de l'entité
au moment de la persister dans la base de données :
`DbContext.Configuration.ValidateOnSaveEnabled = false`. Je ne suis
pas très certain de trouver ça bien...

Mais ça a le mérite de fonctionner.

Heureusement, en y regardant de plus près, cette solution propose aussi un
lien vers le billet [Saving images and long strings to SQL Server Compact with Entity
Framework 4.1 Code First](http://erikej.blogspot.fr/2011/04/saving-images-to-sql-server-compact.html) qui m'a permi de découvrir une bien meilleure
solution.

Dans le cas des colonnes "mémo", il suffit d'ajouter un attribut
`[MaxLength]` à la colonne pour forcer Entity Framework :

* à créer une colonne de type "ntext" (l'équivalent de l'attribut
`[Column(TypeName = "ntext")]`) que j'utilisais jusqu'ici)
* et surtout à bien comprendre qu'il ne s'agit pas d'une simple colonne texte
limitée à 4000 caractères.

Et donc, avec :

```
[MaxLength]
[DataType(DataType.MultilineText)]
public string Content { get; set; }
```

Ca marche !
