---
date: 2004-09-22 01:03:00
layout: post
redirect_from: "post/2004/09/22/Users-lastLogin"
tags: qc
title: "Users.lastLogin"
---

Ajout du champ lastLogin à la table Users pour enregistrer la date de
dernière connexion de l'utilisateur. Cela facilitera le ménage dans les comptes
inutilisés.

* /Core/Components/Utils.cs : ajout de la propriété lastLogin à la
classe Uzer
* /Core/Components/Utils.cs : prise en compte du champ lastLogin dans la
classe UsersDB
* /Core/Users/listUsers.ascx.cs : ajouté l'information lastLogin à la
liste des utilisateurs
* /Core/Users/editUser.ascx.cs : initialisation de lastLogin =
01/01/2000 lors de la création d'un nouveau compte utilisateur
* /Core/Setup/maj_Portal.sql : modification script création table
Users
* /Core/Setup/maj_Temp.sql : instructions pour màj de la table
Users

Note: il reste à faire la mise à jour de lastLogin lorsque l'utilisateur se
connecte, y compris dans le cas où il avait coché "Connexion automatique"
([fait le 30 septembre]({% post_url 2004-09-30-variable-session-utilisateur %})).
