---
date: 2021-11-25 14:41:28+200
layout: post
tags: csharp, enum
title: "Afficher un joli libellé avec Enum.ToString()"
image: "/public/2021/cute-puppies.jpg"
---

Un jour, j'ai eu besoin d'afficher un libellé en fonction de la valeur d'un `Enum`. J'ai donc fait comme à chaque fois et j'ai utilisé l'attribut `Description` pour définir de jolis libellés.

<figure>
  <img src="{{ page.image }}" alt="cute puppies" />
  <figcaption>
    <a href="https://unsplash.com/photos/fliwkBbS7oM">Australian Shepherd babies - Jametlene Reskp</a>
  </figcaption>
</figure>

```csharp
using System.ComponentModel;

public enum NatureType
{
    Ouverture,
    Modification,
    [Description("Déblocage")]
    Deblocage,
    [Description("Alerte 3 mois")]
    Alerte3Mois,
    [Description("Alerte 6 mois")]
    Alerte6Mois
}
```

Puis ensuite, j'ai repris le code assez compliqué dont on use et abuse depuis toujours pour récupérer cette description. C'est une simple méthode d'extension, qui est générique, et qui utilise une pointe de rélexion. Comme je le disais, un truc simple qui est malgré tout capable de me renvoyer la description associée à une valeur de l'enum ou au pire de faire un `.ToString()` pour les valeurs sans attribut `Description` :

```csharp
public static string GetCaption(this Enum value)
{
    var type = value.GetType();
    var member = type.GetMember(value.ToString());
    if ((member != null && member.Length > 0))
    {
        var attributes = member[0].GetCustomAttributes(typeof(System.ComponentModel.DescriptionAttribute), false);
        if ((attributes != null && attributes.Count() > 0))
        {
            return ((System.ComponentModel.DescriptionAttribute)attributes.ElementAt(0)).Description;
        }
    }
    return value.ToString();
}
```

Vraiment rien de compliqué. A part d'ajouter cette méthode au fichier StringHelpers.cs de mon projet.

Mais quand même, ça ne me coûte rien d'essayer de voir si depuis le temps C# n'aurait rien inventé d'encore plus simple ou plus pratique. A part un Google Search "c# enum friendly name" + Tools + Past year.

Bonne nouvelle, il y a des personnes qui s'y sont attelées, mais malheureusement, rien de bien nouveau :

* [Adding display name to Enum values](https://dejanstojanovic.net/aspnet/2021/september/adding-display-name-to-enum-values/)
* [Convert Enum to String in C#](https://www.delftstack.com/howto/csharp/csharp-enum-to-string/)
* [Methods inside enum in C#](https://newbedev.com/methods-inside-enum-in-c)

J'ai un peu de temps à perdre alors je tente des trucs :

```csharp
public enum NatureType
{
    Ouverture,
    Modification,
    Déblocage,
    Alerte_3_mois,
    Alerte_6_mois
}
```

Idéalement je n'ai plus qu'à faire un `public override string ToString()` pour remplacer les soulignés par des espaces et le tour est joué !

Sauf que où diable faire ça ? 

C'est pas grave, je dois pouvoir tenter le coup via une méthode d'extension :

```csharp
public static string ToString(this Enum value)
{
    return value.ToString().Replace("_", " ");
}
```

Ben non :( Ca compile sans provoquer d'erreur, mais ensuite c'est comme si ça n'existait pas ! J'ai beau mettre un point d'arrêt, je n'y passe même pas et cela renvoie toujours le `.ToString()` de base avec les soulignés ???

C'est pas ça qui va m'arrêter. Soit je prends mon parti des soulignés. Soit je le fais quand même :

```csharp
public static string ToCaption(this Enum value)
{
    return value.ToString().Replace("_", " ");
}
```

J'ai hésité avec `.ToFriendlyName()` qui semble un peu plus tendance, mais  `.ToCaption()` a l'avantage d'être plus court :)

Alors d'accord, ça m'oblige à accepter d'avoir quelquefois des accents dans les noms de variables (enfin seulement dans les noms de valeurs d'enum). Mais je pense que désormais ça va être ma nouvelle façon de faire, au moins dans mes projets personnels.

{:.encart}
English version: [Display a friendly name with Enum.ToString()]({% post_url 2021-11-26-display-friendly-name-with-enum-tostring %}){:hreflang="en"}.
