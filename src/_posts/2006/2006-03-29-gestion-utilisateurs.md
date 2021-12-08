---
date: 2006-03-29 08:38:00
layout: post
redirect_from: "post/2006/03/29/Gestion-des-utilisateurs"
tags: qc
title: "Gestion des utilisateurs"
---

Modification de la fonction BindRoles() dans editUsers.ascx.cs pour ne plus
proposer la sélection / déselection du rôle "Admins" lorsque l'utilisateur
connecté n'a pas lui même le rôle "Admins" (sauf si l"utilisateur à modifier a
déjà le rôle "Admins", auquel cas il est nécessaire de le faire apparaitre pour
ne pas perdre l'information à la validation).

D'autre part, les rôles "All users" et "Anonymous" n'apparaissent plus dans
le cas où l'on est en mode intranet, c'est à dire si la variable
"logonRedirect" est définie à True dans le Web.config. Cela permet d'alléger la
présentation étant donné qu'en mode intranet il est fréquent de définir des
rôles "métiers" et qu'il devrait être exceptionnel de donner des droits à des
utilisateurs non identifiés.
