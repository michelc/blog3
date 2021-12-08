---
date: 2021-11-26 13:12:40+200
layout: post
tags: csharp, enum
title: "Display a friendly name with Enum.ToString()"
image: "/public/2021/cute-puppies.jpg"
---

One day I needed to display a label based on the value of one `Enum`. So I did like every time and I used the `Description` attribute to define some nice labels.

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

Then I copied the rather complicated code that we always been using to read this description attribute. It's a simple extension method, which is a generic method, and which uses some reflection. As I said, a simple block of code that return the description associated to an enum value or default to `.ToString()` for values without a proper `Description` attribute:

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

Really nothing very complicated. Except to paste this method to the StringHelpers.cs file of my project.

But still, it doesn't cost anything to see if C# would have invented something even simpler or more practical lately. Except a Google Search "c# enum friendly name" + Tools + Past year.

Good news! There are people who worked on it. But unfortunately, nothing new:

* [Adding display name to Enum values](https://dejanstojanovic.net/aspnet/2021/september/adding-display-name-to-enum-values/)
* [Convert Enum to String in C#](https://www.delftstack.com/howto/csharp/csharp-enum-to-string/)
* [Methods inside enum in C#](https://newbedev.com/methods-inside-enum-in-c)

I have a little time to spare so I try some new things:

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

Ideally, I just have to code a `public override string ToString()` in order to replace underscores with spaces and I'm done!

But where the hell can I do that? 

It doesn't matter, I should be able to try it with an extension method:

```csharp
public static string ToString(this Enum value)
{
    return value.ToString().Replace("_", " ");
}
```

Well, no :( My code compiles without causing an error, but then it's like this method doesn't exist! I set a breakpoint but I don't even get through and I still get the basic `.ToString()` with underscores ???

That's not going to stop me. I could live with the underscores. Or I do it differently:

```csharp
public static string ToCaption(this Enum value)
{
    return value.ToString().Replace("_", " ");
}
```

I had to decide with `.ToFriendlyName()` which seems more popular, but `.ToCaption()` is shorter :)

So okay, that forces me to accept having accents in variable names (well, only in enum value names). But I think I'll use this method from now on, at least in my personal projects.

{:.encart}
Version en français : [Afficher un joli libellé avec Enum.ToString()]({% post_url 2021-11-25-afficher-joli-libelle-avec-enum-tostring %}){:hreflang="fr"}.
