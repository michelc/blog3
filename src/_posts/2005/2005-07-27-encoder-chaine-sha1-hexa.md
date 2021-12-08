---
date: 2005-07-27 17:18:00
layout: post
redirect_from: "post/2005/07/27/Encoder-une-chaine-en-SHA1-et-hexa"
tags: code-snippets, csharp
title: "Encoder une chaine en SHA1 et hexa"
---

```
public static string SHA1_ComputeHexaHash (string text) {
// Gets the SHA1 hash for text
SHA1 sha1 = new SHA1CryptoServiceProvider();
byte[] data = Encoding.Default.GetBytes(text);
byte[] hash = sha1.ComputeHash(data);
// Transforms as hexa
string hexaHash = "";
foreach (byte b in hash) {
hexaHash += String.Format("{0:x2}", b);
}
// Returns SHA1 hexa hash
return hexaHash;
}
```
