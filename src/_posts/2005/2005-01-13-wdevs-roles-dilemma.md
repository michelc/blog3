---
date: 2005-01-13 09:06:00
layout: post
redirect_from: "post/2005/01/13/Wdevs-Roles-dilemma"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Roles dilemma"
---

With IBuySpy, roles that are allowed to view or edit a module are stored in
one string field AuthorizedEditRoles as a semicolon separated list. It's very
straightforward to do but not especially relational. When I will delete a role,
it won't be removed from the AuthorizedEditRoles by a cascading delete.

At this time, DotNetNuke 3 makes use of a permissions table with one record
for each couple module/role. Although it's a little harder to program, it also
becomes easier to maintain data integrity. And in this case, I can retrieve all
roles allowed to edit a given module or all modules updatable by a role.

Therefore, I need to decide which method I will exploit:

* keep the easy way of IBuySpy with a semicolon separated list,
* build a more relational model by adding BoxRoles and ScreenRoles
tables.

In addition, if I choose to stay with a semicolon separated list, why not
generalize this concept and replace the UserRoles table by a simple
AffectedRoles in the Users table?
