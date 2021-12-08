---
date: 2005-08-05 14:16:00
layout: post
redirect_from: "post/2005/08/05/Gestion-du-RedirectFromLoginPage"
tags: qc
title: "Gestion du RedirectFromLoginPage"
---

Modification de Global.asax.cs pour intégrer le paramètre ReturnUrl lorsque
l'utilisateur est redirigé automatiquement vers l'écran de connexion. Cela
permet de gérer le cas où la session étant terminée, le clic sur un lien
renvoyait vers l'écran de login.

Avec cette solution, l'utilisateur sera dirigé vers l'écran demandé après un
passage par l'écran de connexion (attention car toutes les variables session
auront disparues).
