---
date: 2005-07-27 16:40:00
layout: post
redirect_from: "post/2005/07/27/Fonction-upperCase-a-la-francaise"
tags: code-snippets
title: "Fonction upperCase à la française"
---

Fonction upperCase gérant les accents et caratères spéciaux du français
:

```
/// <summary>
/// Returns a copy of a string in uppercase, without accents
/// </summary>
/// <param name="text">Valid string expression</param>
/// <returns>String converted to uppercase</returns>
public static string upperCase (string text) {
  const string accents = "ÁÀÄÂÉÈËÊÍÌÏÎÓÒÖÔÚÙÜÛŸÇ";
  const string normaux = "AAAAEEEEIIIIOOOOUUUUYC";
  string majuscules = text.ToUpper();
  for (int i = 0; i < accents.Length; i++) {
    majuscules = majuscules.Replace(accents.Substring(i, 1), normaux.Substring(i, 1));
  }
  majuscules = majuscules.Replace("Æ", "AE");
  majuscules = majuscules.Replace("Œ", "OE");
  return majuscules;
}
```

Et la fonction lowerCase correspondante :

```
/// <summary>
/// Returns a copy of a string in lowercase, without accents
/// </summary>
/// <param name="text">Valid string expression</param>
/// <returns>String converted to lowercase</returns>
public static string lowerCase (string text) {
  return upperCase(text).ToLower();
}
```
