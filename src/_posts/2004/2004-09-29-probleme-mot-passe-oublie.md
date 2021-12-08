---
date: 2004-09-29 18:55:00
layout: post
redirect_from: "post/2004/09/29/Probleme-mot-de-passe-oublie"
tags: qc
title: "Problème mot de passe oublié"
---

La boite de dialogue pour faire saisir l'adresse mél dans le cas où l'on a
oublié son mot de passe ne fonctionne pas lorsque l'écran contient également un
module Feedback avec des champs obligatoires. Ceux-ci n'étant bien évidemment
pas renseignés, le clic sur le bouton Mot de passe provoque l'apparition des
messages d'erreurs de validation du module Feedback.

Solution en deux temps dans Login.ascx.\*:

* définir que le bouton btnReminder ne déclenche pas la validation
`CauseValidation="False"`,
* supprimer le test `if (Page.IsValid == true)` dans la procédure
btnReminder_Click.

Ca marche dans la mesure où le seul test de validité pour la perte de mot de
passe se fait côté serveur.
