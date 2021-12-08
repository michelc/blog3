---
date: 2011-10-18 18:59:00
layout: post
redirect_from: "post/2011/10/18/utilisation-expressions-lambda-en-10-etapes"
tags: csharp
title: "Utilisation d’expressions lambda en 10 étapes"
---

## Point de départ : 3 fonctions avec du code répétitif ( !DRY)

### PrevisionFacturationSrv.cs

```
PrevSrv.UpdateEndOfContract(PrevFinContrat);
PrevSrv.UpdateEndOfMonth(PrevFinMois);
PrevSrv.UpdatePlacement(PrevPlacement, PonderationPlacement);
```

### PrevisionSrv.cs

```
/// <summary>
/// Màj de la prévision de facturation fin de contrat pour un ensemble de Siren / Société
/// </summary>
/// <param name="list">Liste des couples Siren / Société et des montants à traiter</param>
public void UpdateEndOfContract(IList<PrevisionFacturation> list)
{
  foreach (var pf in list)
  {
    var Prevision = this.GetBySirenAndSociety(pf.Siren, pf.Societe);

    Prevision.FinContrat = pf.Montant < 0 ? 0 : Math.Round(pf.Montant, 2);

    this.CreateOrUpdate(Prevision);
  }
}

/// <summary>
/// Màj de la prévision de facturation fin de mois pour un ensemble de Siren / Société
/// </summary>
/// <param name="list">Liste des couples Siren / Société et des montants à traiter</param>
public void UpdateEndOfMonth(IList<PrevisionFacturation> list)
{
  foreach (var pf in list)
  {
    var Prevision = this.GetBySirenAndSociety(pf.Siren, pf.Societe);

    Prevision.FinMois = pf.Montant < 0 ? 0 : Math.Round(pf.Montant, 2);
    Prevision.NbContrats = pf.Nombre;

    this.CreateOrUpdate(Prevision);
  }
}

/// <summary>
/// Màj de la prévision de facturation placement pour un ensemble de Siren / Société
/// </summary>
/// <param name="list">Liste des couples Siren / Société et des montants à traiter</param>
/// <param name="ponderation">Taux de pondération pour la prise en compte du placement</param>
public void UpdatePlacement(IList<PrevisionFacturation> list, int ponderation)
{
  foreach (var pf in list)
  {
    var Prevision = this.GetBySirenAndSociety(pf.Siren, pf.Societe);

    Prevision.Placement = pf.Montant < 0 ? 0 : Math.Round(pf.Montant * ponderation / 100, 2);

    this.CreateOrUpdate(Prevision);
  }
}
```

## Source d'inspiration (à lire !)

[Introduction au délégués en C#](http://fguillot.developpez.com/cours/dotnet/introduction-delegates-csharp/), un article en français rédigé
par Fabien Guillot pour expliquer aux débutants comment fonctionnent les
délégués en C#, quelle est leur utilité, et quelle a été leur évolution avec
les différentes versions du Framework .NET.

## Les 10 étapes

* 1° étape : Mise en commun du code (ancien style)
* 2° étape : Isolation des traitements spécifiques dans des fonctions
séparées
* 3° étape : Mise en place des délégués (enfin !)
* 4° étape : Simplification des délégués grâce à l'inférence de
type
* 5° étape : Arrivée des méthodes anonymes (avec .NET 2)
* 6° étape : Simplification des délégués anonymes grâce à l'inférence de
type
* 7° étape : Retour sur le code : `ref` ne sert à rien
(merci Nicolas)
* 8° étape : Arrivée des expressions lambdas (avec .NET 3.5)
* 9° étape : Simplification des expressions lambdas
* 10° étape : Utilisation de paramètres optionnels

Consulter éventuellement la version PDF pour voir en détail comment se sont
déroulées ces étapes : [Utilisation_Expressions_Lambda_en_10_etapes.pdf](/public/2011/Utilisation_Expressions_Lambda_en_10_etapes.pdf).

## Le résultat

### PrevisionFacturationSrv.cs

```
PrevSrv.UpdatePrevision(PrevFinContrat, (p, m, n) => { p.FinContrat = m; });
PrevSrv.UpdatePrevision(PrevFinMois, (p, m, n) => { p.FinMois = m; p.NbContrats = n; });
PrevSrv.UpdatePrevision(PrevPlacement, (p, m, n) => { p.Placement = m; }, PonderationPlacement);
```

### PrevisionSrv.cs

```
/// <summary>
/// Mise à jour de la prévision de facturation pour un ensemble de Siren / Société
/// </summary>
/// <param name="list">Liste des couples Siren / Société et des montants à traiter</param>
/// <param name="assign">Méthode pour réaliser le traitement spécifique</param>
/// <param name="ponderation">Taux de pondération pour le type de prévision</param>
public void UpdatePrevision(IList<PrevisionFacturation> list, UpdateAssign assign, int ponderation = 100)
{
  foreach (var pf in list)
  {
    pf.Montant = pf.Montant < 0 ? 0 : Math.Round(pf.Montant * ponderation / 100, 2);

    var Prevision = this.GetBySirenAndSociety(pf.Siren, pf.Societe);

    assign(Prevision, pf.Montant, pf.Nombre);

    this.CreateOrUpdate(Prevision);
  }
}

/// <summary>
/// Signature des fonctions d'affectation spécifiques
/// </summary>
/// <param name="prevision">Objet Prevision à mettre à jour</param>
/// <param name="montant">Montant de la prévision</param>
/// <param name="nombre">Nombre de contrats traités (ssi fin de mois)</param>
public delegate void UpdateAssign(Prevision prevision, decimal montant, int nombre);
```
