---
date: 2005-11-30 14:24:00
layout: post
redirect_from: "post/2005/11/30/Authentification-SMTP"
tags: .net, qc
title: "Authentification SMTP"
---

Pour certains serveurs SMTP il est nécessaire de faire une connexion POP
avant de pouvoir envoyer un mél ([“POP
before SMTP” Authentication](http://www.corephp.co.uk/archives/18-POP-before-SMTP-Authentication-for-PHPMailer.html)). Apparement, cela inscrit l'adresse IP de la
machine effectuant la connexion dans une table de façon à ensuite autoriser les
connexions SMTP (au coup par coup, temporairement ou à vie ?).

Etant donné qu'il n'existe pas de classe System.Pop en ASP.NET 1.1, il reste
à trouver une classe POP qui fasse l'affaire. Voir éventuellement l'article
“[How to POP3 in C#](http://www.developerfusion.co.uk/show/4071/)”
de Randy Charles Morin.
