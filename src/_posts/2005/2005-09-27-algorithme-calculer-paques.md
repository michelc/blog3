---
date: 2005-09-27 19:29:00
layout: post
redirect_from: "post/2005/09/27/Algorithme-pour-calculer-Paques"
tags: code-snippets, csharp
title: "Algorithme pour calculer Pâques"
---

```
/// <summary>
/// Algorithm for calculating the date of Easter Sunday
/// (Meeus/Jones/Butcher Gregorian algorithm)
/// http://en.wikipedia.org/wiki/Computus#Meeus.2FJones.2FButcher_Gregorian_algorithm
/// </summary>
/// A valid Gregorian year
/// Easter Sunday
public static DateTime EasterDate(int year) {
    int Y = year;
    int a = Y % 19;
    int b = Y / 100;
    int c = Y % 100;
    int d = b / 4;
    int e = b % 4;
    int f = (b + 8) / 25;
    int g = (b - f + 1) / 3;
    int h = (19 * a + b - d - g + 15) % 30;
    int i = c / 4;
    int k = c % 4;
    int L = (32 + 2 * e + 2 * i - h - k) % 7;
    int m = (a + 11 * h + 22 * L) / 451;
    int month = (h + L - 7 * m + 114) / 31;
    int day = ((h + L - 7 * m + 114) % 31) + 1;
    DateTime dt = new DateTime(year, month, day);
    return dt;
}
```

* Lundi de Pâques : Easter Monday = Easter Sunday + 1
* Jeudi de l'Ascension : Ascension Day = Easter Sunday + 39
* Dimanche de Pentecôte : Pentecost Sunday = Easter Sunday + 49
* Lundi de Pentecôte : Pentecost Monday = Easter Sunday + 50
