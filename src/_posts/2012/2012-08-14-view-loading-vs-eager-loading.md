---
date: 2012-08-14 18:33:00
layout: post
redirect_from: "post/2012/08/14/view-loading-vs-eager-loading"
tags: ef, linq, mvc, sql
title: "View Loading vs Eager loading"
---

Je travaille sur un projet personnel où j'ai le modèle suivant :

```
public class Travel
{
    // dentifiant automatique du voyage
    [Key]
    public int TravelID { get; set; }

    // Titre du voyage
    [Required]
    [Display(Name = "Titre")]
    [StringLength(100)]
    public string Title { get; set; }

    // Type du voyage : journée ou séjour
    [Required]
    [Display(Name = "Type de voyage")]
    public TravelType TypeTravel
    {
        get { return (TravelType)TravelType; }
        set { TravelType = (int)value; }
    }
    public int TravelType { get; set; }

    // Commentaire sur ce voyage
    [Display(Name = "Remarques")]
    [Column(TypeName = "ntext")]
    [DataType(DataType.MultilineText)]
    public string Notes { get; set; }

    // Tarifs du voyage
    public virtual ICollection<Price> Prices { get; set; }
}

public class Price
{
    // Identifiant automatique du tarif
    [Key]
    public int PriceID { get; set; }

    // Référence du voyage auquel correspond le tarif
    [Display(Name = "Voyage")]
    public int TravelID { get; set; }
    public virtual Travel Travel { get; set; }

    // Année du tarif
    [Required]
    [Display(Name = "Année")]
    [StringLength(20)]
    public string Year { get; set; }

    // Libellé pour décrire le tarif
    [Required]
    [Display(Name = "Titre")]
    [StringLength(50)]
    public string Title { get; set; }

    // Prix du voyage pour un groupe de 40 à 44 personnes
    [Display(Name = "Tarif 40 à 44 personnes")]
    public float Price1 { get; set; }

    // Prix du voyage pour un groupe de 45 à 49 personnes
    [Display(Name = "Tarif 45 à 49 personnes")]
    public float Price2 { get; set; }

    // Prix du voyage pour un groupe de 50 à 55 personnes
    [Display(Name = "Tarif 50 à 55 personnes")]
    public float Price3 { get; set; }

    // Commentaire sur ce tarif
    [Display(Name = "Remarques")]
    [Column(TypeName = "ntext")]
    [DataType(DataType.MultilineText)]
    public string Notes { get; set; }
}
```

Jusqu'à présent, j'utilisais le code suivant pour afficher le détail du prix
d'un voyage :

```
var price = db.Prices.Find(id);
```

Cela a pour effet d'exécuter la requête SQL suivante :

```
SELECT
[Limit1].[PriceID] AS [PriceID],
[Limit1].[TravelID] AS [TravelID],
[Limit1].[Year] AS [Year],
[Limit1].[Title] AS [Title],
[Limit1].[Price1] AS [Price1],
[Limit1].[Price2] AS [Price2],
[Limit1].[Price3] AS [Price3],
[Limit1].[Notes] AS [Notes]
FROM ( SELECT TOP (2)
        [Extent1].[PriceID] AS [PriceID],
        [Extent1].[TravelID] AS [TravelID],
        [Extent1].[Year] AS [Year],
        [Extent1].[Title] AS [Title],
        [Extent1].[Price1] AS [Price1],
        [Extent1].[Price2] AS [Price2],
        [Extent1].[Price3] AS [Price3],
        [Extent1].[Notes] AS [Notes]
        FROM [Prices] AS [Extent1]
        WHERE [Extent1].[PriceID] = @p0)  AS [Limit1]
```

Note : il y a un article sur StackOverflow qui
explique [Why
does the Entity Framework's DbContext.Find() generate a query with select top
2?](http://stackoverflow.com/a/7823952/17316)

Puis je passais mon objet Travel à la vue chargée d'afficher les
informations sur le prix du voyage :

```
return View(price);
```

Pour que le contenu de cette vue soit plus clair, elle affiche également le
nom du voyage via la propriété price.Travel.Title, ce qui a pour effet
d'exécuter une requête SQL supplémentaire pour charger le voyage :

```
SELECT
[Extent1].[TravelID] AS [TravelID],
[Extent1].[Position] AS [Position],
[Extent1].[Title] AS [Title],
[Extent1].[TravelType] AS [TravelType],
[Extent1].[Notes] AS [Notes]
FROM [Travels] AS [Extent1]
WHERE [Extent1].[TravelID] = @EntityKeyValue1
```

Le "problème", c'est que cette requête se fait au niveau de la vue et que
c'est un peu moyen d'accéder à la base de données depuis une vue (enfin je
crois). J'ai donc cherché un moyen pour l'éviter.

Un truc facile, c'est de charger explicitement le voyage :

```
var price = db.Prices.Find(id);
price.Travel = db.Travels.Find(price.TravelID);
```

On peut aussi faire de l'eager loading, mais c'est un peu surdimensionné par
rapport au problème et ça risque aussi de rendre le code un peu plus compliqué
à comprendre dès qu'on a plusieurs jointures :

```
var price = db.Prices.Include(t => t.Travel).Single(t => t.PriceID == id);
```

> If your model has multiple relations, they will all be eager loaded for the
> grid. However, we don't eager load for the other actions (Edit, Create, etc.)
> because there's no scale problem with those - you're only loading a single
> entity, and the code is easier to understand if we use normal lazy loading in
> those cases.
> 
> [Eager Loading and SELECT N+1](http://blog.stevensanderson.com/2011/01/28/mvcscaffolding-one-to-many-relationships/)

Au final, la bonne solution serait sans doute de passer par un objet
ViewModel pour ne pas courrir le risque d'accéder à la base de données depuis
la vue.

```
public class PriceViewModel
{
    public int PriceID { get; set; }
    public string TravelTitle { get; set; }
    public string Year { get; set; }
    public string Title { get; set; }
    public float Price1 { get; set; }
    public float Price2 { get; set; }
    public float Price3 { get; set; }
    public string Notes { get; set; }
}
```
