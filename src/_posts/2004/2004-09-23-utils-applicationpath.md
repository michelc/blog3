---
date: 2004-09-23 01:10:00
layout: post
redirect_from: "post/2004/09/23/Utils-applicationPath"
tags: qc
title: "Utils.applicationPath"
---

Modifié la propriété applicationPath de la classe Utils de façon à gérer le
problème apparu suite au passage en mode Private Assemblies.

Utils.applicationPath d'une page aspx de portal.Toolbox renvoyait
"http://localhost/portal/Toolbox/" alors qu'auparavant, une page aspx du
répertoire "/portal/Toolbox/" renvoyait "http://localhost/portal/".

Désormais, si le fichier Utils.applicationPath/Default.aspx n'existe pas, le
dernier sous-répertoire est supprimé du chemin avant d'être renvoyé.

Par ailleurs, une fois qu'elle a été définie, la valeur de la propriété
applicationPath est conservée dans la variable Session["applicationPath"] pour
éviter de passer son temps à tester l'existence de Default.aspx.
