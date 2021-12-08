---
date: 2011-11-17 19:53:00
layout: post
redirect_from: "post/2011/11/17/mvc-scaffolding-eager-loading-viewmodel"
tags: ef, mvc
title: "MVC Scaffolding, Eager loading et ViewModel"
---

Pour tenter de mettre au point une méthode simple(iste) pour construire une
application avec ASP.NET MVC, j'essaie de développer une petite application
destinées à générer une brochure de voyages . Pour cela, je dois gérer une base
de données avec une table "Voyages", une table "Tarifs" pour enregistrer les
chaque tarif du voyage et une table "Parties" qui sert à décrire les
différentes étapes du voyage.

## Eager loading pour les actions Index

Pour l'instant, j'ai plus ou moins laissé [MVC Scaffolding](http://mvcscaffolding.codeplex.com/) écrire
mon code pour la classe Voyage associée à la table Voyages. Par défaut, il a
généré le code C# suivant pour l'action Index du contrôleur VoyagesController
afin retrouver tous les voyages à afficher :

```
var voyages = voyageRepository
    .AllIncluding(voyage => voyage.Parties, voyage => voyage.Tarifs)
    .OrderBy(voyage => voyage.Position)
    .ThenBy(voyage => voyage.Title);
```

Ce qui correspond à quelque chose dans ce genre si on ne passe pas par un
Repository :

```
var voyages = context
    .Voyages
    .Include(voyage => voyage.Parties)
    .Include(voyage => voyage.Tarifs)
    .OrderBy(voyage => voyage.Position)
    .ThenBy(voyage => voyage.Title);
```

Ces deux codes C# ont tous les deux pour effet de générer une (grosse)
requête SQL qui charge à la fois le contenu de la table Voyages et par des
jointures celui des tables Parties et Tarifs :

```
SELECT
[UnionAll1].[VoyageID] AS [C1],
[UnionAll1].[VoyageID1] AS [C2],
[UnionAll1].[Position1] AS [C3],
[UnionAll1].[Title1] AS [C4],
[UnionAll1].[VoyageType] AS [C5],
[UnionAll1].[Notes] AS [C6],
[UnionAll1].[C1] AS [C7],
[UnionAll1].[PartieID] AS [C8],
[UnionAll1].[VoyageID2] AS [C9],
[UnionAll1].[Position2] AS [C10],
[UnionAll1].[PartieType] AS [C11],
[UnionAll1].[Content] AS [C12],
[UnionAll1].[C2] AS [C13],
[UnionAll1].[C3] AS [C14],
[UnionAll1].[C4] AS [C15],
[UnionAll1].[C5] AS [C16],
[UnionAll1].[C6] AS [C17],
[UnionAll1].[C7] AS [C18],
[UnionAll1].[C8] AS [C19],
[UnionAll1].[C9] AS [C20],
[UnionAll1].[C10] AS [C21],
[UnionAll1].[C11] AS [C22]
FROM  (SELECT
        CASE WHEN ([Extent2].[PartieID] IS NULL) THEN CAST(NULL AS int) ELSE 1 END AS [C1],
        [Extent1].[Position] AS [Position],
        [Extent1].[Title] AS [Title],
        [Extent1].[VoyageID] AS [VoyageID],
        [Extent1].[VoyageID] AS [VoyageID1],
        [Extent1].[Position] AS [Position1],
        [Extent1].[Title] AS [Title1],
        [Extent1].[VoyageType] AS [VoyageType],
        [Extent1].[Notes] AS [Notes],
        [Extent2].[PartieID] AS [PartieID],
        [Extent2].[VoyageID] AS [VoyageID2],
        [Extent2].[Position] AS [Position2],
        [Extent2].[PartieType] AS [PartieType],
        [Extent2].[Content] AS [Content],
        CAST(NULL AS int) AS [C2],
        CAST(NULL AS int) AS [C3],
        CAST(NULL AS nvarchar(1)) AS [C4],
        CAST(NULL AS nvarchar(1)) AS [C5],
        CAST(NULL AS real) AS [C6],
        CAST(NULL AS real) AS [C7],
        CAST(NULL AS real) AS [C8],
        CAST(NULL AS real) AS [C9],
        CAST(NULL AS real) AS [C10],
        CAST(NULL AS nvarchar(1)) AS [C11]
        FROM  [Voyages] AS [Extent1]
        LEFT OUTER JOIN [Parties] AS [Extent2] ON [Extent1].[VoyageID] = [Extent2].[VoyageID]
UNION ALL
        SELECT
        2 AS [C1],
        [Extent3].[Position] AS [Position],
        [Extent3].[Title] AS [Title],
        [Extent3].[VoyageID] AS [VoyageID],
        [Extent3].[VoyageID] AS [VoyageID1],
        [Extent3].[Position] AS [Position1],
        [Extent3].[Title] AS [Title1],
        [Extent3].[VoyageType] AS [VoyageType],
        [Extent3].[Notes] AS [Notes],
        CAST(NULL AS int) AS [C2],
        CAST(NULL AS int) AS [C3],
        CAST(NULL AS int) AS [C4],
        CAST(NULL AS int) AS [C5],
        CAST(NULL AS nvarchar(1)) AS [C6],
        [Extent4].[TarifID] AS [TarifID],
        [Extent4].[VoyageID] AS [VoyageID2],
        [Extent4].[Title] AS [Title2],
        [Extent4].[Year] AS [Year],
        [Extent4].[Prix1] AS [Prix1],
        [Extent4].[Prix2] AS [Prix2],
        [Extent4].[Prix3] AS [Prix3],
        [Extent4].[Prix4] AS [Prix4],
        [Extent4].[Prix5] AS [Prix5],
        [Extent4].[Notes] AS [Notes1]
        FROM  [Voyages] AS [Extent3]
        INNER JOIN [Tarifs] AS [Extent4] ON [Extent3].[VoyageID] = [Extent4].[VoyageID]) AS [UnionAll1]
ORDER BY [UnionAll1].[Position] ASC, [UnionAll1].[Title] ASC, [UnionAll1].[VoyageID1] ASC, [UnionAll1].[C1] ASC
```

Puis dans la vue Index.cshtml, on utilise le
`IEnumerable<Voyage>` obtenu pour afficher une liste des
voyages, avec pour chacun d'entre eux le nombre de parties qui composent sa
description détaillée et le nombre de tarifs définis pour ce voyage.

```
@foreach (var item in Model) {
  <tr>
    <td>
      @Html.ActionLink("Edit", "Edit", new { id = item.VoyageID })
    </td>
    <td>
      @item.Position
    </td>
    <td>
      @Html.ActionLink(@item.Title, "Details", new { id = item.VoyageID })
    </td>
    <td>
      @Html.DisplayTextFor(_ => item.TypeVoyage).ToString()
    </td>
    <td>
      @(item.Parties == null ? "" : item.Parties.Count.ToString())
    </td>
    <td>
      @(item.Tarifs == null ? "" : item.Tarifs.Count.ToString())
    </td>
    <td>
      @Html.ActionLink("Delete", "Delete", new { id = item.VoyageID })
    </td>
  </tr>
}
```

Ce qui est intéressant, c'est que MVC Scaffolding fait automatiquement du
"Eager Loading" pour que les instructions
`item.Parties.Count.ToString()` et
`item.Tarifs.Count.ToString()` en boucle ne provoquent pas autant
d'accès à la base de données qu'il y a de voyage à afficher.

## Lazy loading et SELECT N+1

En effet, si par défaut, MVC Scaffolding n'avait pas fait le lien avec les
parties et les tarifs et qu'il se soit contenté de générer le code C#
suivant :

```
var voyages = voyageRepository
    .All
    .OrderBy(voyage => voyage.Position)
    .ThenBy(voyage => voyage.Title);
```

Ou sans le Repository :

```
var voyages = context
    .Voyages
    .OrderBy(voyage => voyage.Position)
    .ThenBy(voyage => voyage.Title);
```

Alors la consultation de la page Index n'aurait pas généré 1 seule requête,
mais 71 !!!

Soit 1 première requête toute simple pour charger la liste des 35
voyages :

```
SELECT
[Extent1].[VoyageID] AS [VoyageID],
[Extent1].[Position] AS [Position],
[Extent1].[Title] AS [Title],
[Extent1].[VoyageType] AS [VoyageType],
[Extent1].[Notes] AS [Notes]
FROM [Voyages] AS [Extent1]
ORDER BY [Extent1].[Position] ASC, [Extent1].[Title] ASC
```

Puis 35 requêtes pour charger successivement les parties de chacun des 35
voyages :

```
SELECT
[Extent1].[PartieID] AS [PartieID],
[Extent1].[VoyageID] AS [VoyageID],
[Extent1].[Position] AS [Position],
[Extent1].[PartieType] AS [PartieType],
[Extent1].[Content] AS [Content]
FROM [Parties] AS [Extent1]
WHERE [Extent1].[VoyageID] = @EntityKeyValue1
```

Et encore 35 requêtes pour charger successivement les tarifs de chacun des
35 voyages :

```
SELECT
[Extent1].[TarifID] AS [TarifID],
[Extent1].[VoyageID] AS [VoyageID],
[Extent1].[Title] AS [Title],
[Extent1].[Year] AS [Year],
[Extent1].[Prix1] AS [Prix1],
[Extent1].[Prix2] AS [Prix2],
[Extent1].[Prix3] AS [Prix3],
[Extent1].[Prix4] AS [Prix4],
[Extent1].[Prix5] AS [Prix5],
[Extent1].[Notes] AS [Notes]
FROM [Tarifs] AS [Extent1]
WHERE [Extent1].[VoyageID] = @EntityKeyValue1
```

Par rapport à l'eager loading, ici on a fait du "lazy loading" : les
entités enfants ne sont chargées que lorsque on y accède. Des fois c'est bien.
Des fois c'est mal. Mais heureusement, MVC Scaffolding qui a pensé à tout est
est assez malin pour nous éviter l'écueil du [SELECT N+1](http://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem) quand on génère l'action Index ([merci Scott](http://blog.stevensanderson.com/2011/01/28/mvcscaffolding-one-to-many-relationships/)).

## Lazy loading et virtual

Pour être complet, c'est parce que les propriétés Parties et Tarifs de la
classe Voyage sont déclarées en tant que propriétés virtuelles, que Entity
Framework a fait du "lazy loading".

Ainsi, si au lieu d'utiliser `virtual` pour les
déclarer :

```
public virtual ICollection<Partie> Parties { get; set; }
public virtual ICollection<Tarif> Tarifs { get; set; }
```

On s'était contenté de :

```
public ICollection<Partie> Parties { get; set; }
public ICollection<Tarif> Tarifs { get; set; }
```

Alors la consultation de la page Index n'aurait plus généré qu'une seule
requête pour charger uniquement les données de la table des voyages (pas de
eager loading puisque on n'a pas d'`Include`) :

```
SELECT
[Extent1].[VoyageID] AS [VoyageID],
[Extent1].[Position] AS [Position],
[Extent1].[Title] AS [Title],
[Extent1].[VoyageType] AS [VoyageType],
[Extent1].[Notes] AS [Notes]
FROM [Voyages] AS [Extent1]
ORDER BY [Extent1].[Position] ASC, [Extent1].[Title] ASC
```

Et puis c'est tout ! Comme on n'a pas de `virtual`, Entity
Framework ne fait pas non plus de lazy loading et ne cherche donc pas à charger
les parties et les tarifs.

C'est pour cela que les colonnes nombre de parties et nombre de tarifs
restent vides puisque les instructions `item.Parties == null ?
"" : item.Xxxxxx.Count.ToString()` sont là pour gérer le fait que
les collections voyage.Parties et voyage.Tarifs sont nulles.

Par contre, même sans le `virtual`, si on demande à faire de
l'eager loading à grand coups de `Include`, on retombe bien sur la
grosse requête qui accède par jointure aux tables Voyages, Parties et
Tarifs.

## Action Index et ViewModel

A titre personnel, je trouve malgré tout que la requête SQL générée par
Entity Framework est un peu lourde pour ce qu'on en fait. Alors que le but est
simplement d'afficher le nombre de parties et de tarifs d'un voyage, on se
retrouve quand même à charger toutes les parties et tous les tarifs de tous les
voyages, ce qui revient donc à charger l'intégralité des tables Parties et
Tarifs.

Note : Si on avait une pagination par paquet de 20
voyages, ça serait un peu mieux puisque cela reviendrait "seulement" à charger
toutes les parties et tous les tarifs correspondant à 20 voyages
uniquement.

Dans l'idéal, il faudrait donc récupérer les informations de base de chaque
voyage sans ses propriétés voyage.Parties et voyage.Tarifs, plus le nombre de
ses parties et le nombre de ses tarifs. Ce qui pourrait être représenté par la
classe ViewModel suivante :

```
public class VoyageViewModel
{
    public int VoyageID { get; set; }
    public int Position { get; set; }
    public string Title { get; set; }
    public int VoyageType { get; set; }
    public int TarifsCount { get; set; }
    public int PartiesCount { get; set; }
}
```

Le fait d'utiliser un ViewModel est d'autant plus intéressant qu'une liste
n'est pas là pour afficher la totalité des propriétés d'une entité, mais
seulement quelques informations essentielles pour remplir son rôle, à savoir
permettre de retrouver d'un coup d'oeil les informations qui comptent et
éventuellement accéder au détail de la fiche pour consulter l'ensemble de ses
données.

Par exemple, si j'ai une table Contacts avec civilité, nom, prénom,
téléphone, portable, fax, email, adresse, code postal, ville, pays, format pour
les emails, date de naissance, etc... je ne veux pas d'une liste qui fassent 50
colonnes pour afficher tout ça. Je préfère sacrifier quelques détails et me
contenter d'une liste édulcorée mais lisible.

Pour résumer, je pense que dans le cas d'une liste (au moins), il est
préférable d'employer un objet ViewModel spécifique pour collecter les données
importantes puis de transmettre cet objet à la vue pour qu'elle présente ces
informations à l'utilisateur.

Cela implique donc de créer une classe ViewModel "VoyagesIndex" (nommée
d'après le nom du contrôleur (VoyagesController) et de l'action (Index) qui va
l'utiliser) :

```
public class VoyagesIndex
{
    public int VoyageID { get; set; }
    public int Position { get; set; }
    public string Title { get; set; }
    public int VoyageType { get; set; }
    public int TarifsCount { get; set; }
    public int PartiesCount { get; set; }

    public VoyageType TypeVoyage
    {
        get { return (VoyageType)VoyageType; }
        set { VoyageType = (int)value; }
    }
}
```

Note : `public VoyageType TypeVoyage` est
une bidouille qui n'a rien à voir avec le sujet et que j'essairai d'expliquer
plus tard si je persiste à passer par elle.

Il faut ensuite modifier le code de l'action Index pour qu'elle récupère une
collection de VoyagesIndex et plus une collection d'objets Voyage :

```
var voyages = voyageRepository
    .All
    .OrderBy(voyage => voyage.Position)
    .ThenBy(voyage => voyage.Title)
    .Select(voyage => new VoyagesIndex
    {
        VoyageID = voyage.VoyageID
        Position = voyage.Position,
        Title = voyage.Title,
        VoyageType = voyage.VoyageType,
        TarifsCount = voyage.Tarifs.Count(),
        PartiesCount = voyage.Parties.Count()
    }).ToList();
```

Et pour finir modifier la vue Index.cshtml pour qu'elle utilise désormais un
`IEnumerable<VoyagesIndex>` pour afficher son
contenu :

```
@foreach (var item in Model) {
  <tr>
    <td>
      @Html.ActionLink("Edit", "Edit", new { id = item.VoyageID })
    </td>
    <td>
      @item.Position
    </td>
    <td>
      @Html.ActionLink(@item.Title, "Details", new { id = item.VoyageID })
    </td>
    <td>
      @item.TypeVoyage.ToString()
    </td>
    <td>
      @item.PartiesCount
    </td>
    <td>
      @item.TarifsCount
    </td>
    <td>
      @Html.ActionLink("Delete", "Delete", new { id = item.VoyageID })
    </td>
  </tr>
}
```

Grâce à quoi la requête SQL générée quand on consulte la page Index est un
peu plus simple à lire, et normalement plus efficace puisqu'elle ne cherche pas
à charger les tables Parties et Tarifs.

```
SELECT
[Project2].[VoyageID] AS [VoyageID],
[Project2].[Position] AS [Position],
[Project2].[Title] AS [Title],
[Project2].[VoyageType] AS [VoyageType],
[Project2].[C1] AS [C1],
[Project2].[C2] AS [C2]
FROM ( SELECT
        [Project1].[VoyageID] AS [VoyageID],
        [Project1].[Position] AS [Position],
        [Project1].[Title] AS [Title],
        [Project1].[VoyageType] AS [VoyageType],
        [Project1].[C1] AS [C1],
        [SSQTAB1].[A1] AS [C2]
        FROM ( SELECT
                [Extent1].[VoyageID] AS [VoyageID],
                [Extent1].[Position] AS [Position],
                [Extent1].[Title] AS [Title],
                [Extent1].[VoyageType] AS [VoyageType],
                [SSQTAB1].[A1] AS [C1]
                FROM [Voyages] AS [Extent1]
                 OUTER APPLY
                (SELECT
                        COUNT(1) AS [A1]
                        FROM [Tarifs] AS [Extent2]
                        WHERE [Extent1].[VoyageID] = [Extent2].[VoyageID]) AS [SSQTAB1]
        )  AS [Project1]
         OUTER APPLY
        (SELECT
                COUNT(1) AS [A1]
                FROM [Parties] AS [Extent3]
                WHERE [Project1].[VoyageID] = [Extent3].[VoyageID]) AS [SSQTAB1]
)  AS [Project2]
ORDER BY [Project2].[Position] ASC, [Project2].[Title] ASC
```
