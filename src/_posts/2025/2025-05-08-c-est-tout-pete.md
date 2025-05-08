---
date: 2025-05-08 10:11:55 +02:00
tags: [ csharp, .net ]
title: "C'est tout pété"
cover:
  image: /public/2025/cody-putman-sleepy-kitten.png
  link: https://unsplash.com/fr/photos/gros-plan-dun-chat-endormi-sur-une-couverture-aOq76lWI6As
  text: Gros plan d'un chat endormi sur une couverture (Cody Puttman)
excerpt: C'est les vacances, je me lève tôt et plus rien ne marche ?
---

# C'est tout pété

## Français

> L'erreur suivante s'est produite lors de l'exécution de l'outil dev-certs
> pour approuver le certificat de développement ASP.NET Core. Le délai
> d'attente de l'opération a expiré.

## English

> The following error running the dev-certs tool to trust the ASP.NET Core
> development certificate. The operation timeout has expired.

## Command Line

```
C:\> dotnet dev-certs https --clean
C:\> dotnet dev-certs https --trust
```
