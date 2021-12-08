---
date: 2004-09-29 18:26:00
layout: post
redirect_from: "post/2004/09/29/Erreurs-de-mails"
tags: qc
title: "Erreurs de mails"
---

Modifié Utils.sendMail pour gérer le cas où le serveur SMTP n'est pas
configuré dans le Web.config et afficher un message plus approprié. Et idem si
jamais l'expéditeur ou le destinataire n'est pas défini.

Modifié editUsers.ascx.cs pour éviter un plantage en création d'utilisateur
quand le fichier /uploads/newaccount.txt n'existe pas. Renvoie désormais un
message d'erreur explicite.

Modifié login.ascx.cs pour ne pas afficher le lien "Mot de passe perdu"
quand le fichier /uploads/sendpassword.txt n'existe pas. Et ajouté gestion des
erreurs quand quand les paramètres mailSmtp ou mailFrom ne sont pas
définis.
