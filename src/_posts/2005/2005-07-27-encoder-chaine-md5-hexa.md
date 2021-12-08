---
date: 2005-07-27 16:45:00
layout: post
redirect_from: "post/2005/07/27/Encoder-une-chaine-en-MD5-et-hexa"
tags: code-snippets, csharp
title: "Encoder une chaine en MD5 et hexa"
---

```
public static string MD5_ComputeHexaHash (string text) {
// Gets the MD5 hash for text
MD5 md5 = new MD5CryptoServiceProvider();
byte[] data = Encoding.Default.GetBytes(text);
byte[] hash = md5.ComputeHash(data);
// Transforms as hexa
string hexaHash = "";
foreach (byte b in hash) {
hexaHash += String.Format("{0:x2}", b);
}
// Returns MD5 hexa hash
return hexaHash;
}
```
