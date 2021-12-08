---
date: 2004-09-22 18:39:00
layout: post
redirect_from: "post/2004/09/22/Modules-configRoles"
tags: qc
title: "Modules.configRoles"
---

Ajouté le champ configRoles à la table Modules pour gérer les droits
concernant le paramétrage du module suite à la mise en œuvre de [configSource]({% post_url 2004-09-22-bricks-configsource %}).

* /Core/Components/Modules.cs : ajout de la propriété configRoles à la
classe Module
* /Core/Components/Modules.cs : prise en compte du champ configRoles
dans la classe ModulesDB
* /Core/Pages/editModules.ascx.  - : gestion du champ configRoles
* /Core/Setup/maj_Portal.sql : modification script création table
Modules
* /Core/Setup/maj_Temp.sql : instructions pour màj de la table
Modules
* mise à jour manuelle du contenu de la table Modules
