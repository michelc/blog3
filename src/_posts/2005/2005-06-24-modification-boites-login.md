---
date: 2005-06-24 08:09:00
layout: post
redirect_from: "post/2005/06/24/Modification-boites-login"
tags: qc
title: "Modification boites login"
---

Modification de viewLogin.ascx dans la toolbox Classic pour renvoyer sur
/_logon.aspx?Reminder lorsque l'utilisateur a oublié son mot de passe.

Ajout d'une fonction Common.AllowPasswordReset qui renvoie true lorsqu'il
est possible de renvoyer un mot de passe à l'utilisateur :

* l'authentification ne se fait pas sur LDAP,
* il y a un serveur SMTP de configuré,
* l'adresse email du webmaster est définie,
* le fichier "reminder.txt" existe.

Et mise à jour de Classic.viewLogin.ascx et de Logon/Login.ascx pour en
tenir compte et afficher le lien "Mot de passe oublié" à bon escient.

Modification de Logon/Reminder.ascx pour n'enregistrer le nouveau mot de
passe qu'à condition que l'envoi du mail à l'utilisateur se soit bien
passé.
