---
date: 2005-07-27 17:20:00
layout: post
redirect_from: "post/2005/07/27/Generer-une-chaine-aleatoire"
tags: code-snippets, csharp
title: "Générer une chaine aléatoire"
---

```
/// <summary>
/// Build a random string (for id, login, password...)
/// </summary>
public static string randomString() {
  int length = new Random().Next(6, 10);
  return randomString(length);
}

/// <summary>
/// Build a random string (for id, login, password...)
/// </summary>
public static string randomString(int length) {
  string tempString = Guid.NewGuid().ToString().ToLower();
  tempString = tempString.Replace("-", "");
  while (tempString.Length < length) {
    tempString += tempString;
  }
  tempString = tempString.Substring(0, length);
  return tempString;
}
```
