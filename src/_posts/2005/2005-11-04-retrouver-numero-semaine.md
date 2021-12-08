---
date: 2005-11-04 16:39:00
layout: post
redirect_from: "post/2005/11/04/Retrouver-un-numero-de-semaine"
tags: code-snippets, csharp
title: "Retrouver un numéro de semaine"
---

```
public static int GetWeekNumber (DateTime dt) {
  CultureInfo culture = CultureInfo.CurrentCulture;
  int intWeek = culture.Calendar.GetWeekOfYear(dt, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
  return intWeek;
}
```
