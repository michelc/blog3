---
date: 2005-03-10 20:09:00
layout: post
redirect_from: "post/2005/03/10/Wdevs-Screens-and-boxes-authorizations"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Screens and boxes authorizations"
---

Finally, I decided to use specific [tables rather
than fields]({% post_url 2005-01-13-wdevs-roles-dilemma %}) to manage authorizations for screens and boxes. So I created
two tables:

```
CREATE TABLE qc_ScreenRoles (
    idScreen TEXT(20) NOT NULL,
    aktion TEXT(10) NOT NULL,
    idRole TEXT(20) NOT NULL
);

CREATE TABLE qc_BoxRoles (
    idBox TEXT(20) NOT NULL,
    aktion TEXT(10) NOT NULL,
    idRole TEXT(20) NOT NULL
);
```

Where aktion field is filled with constants like "view", "edit" or "admin".
I had to write "aktion" because Access don't accept "action" as a field
name.

A generic AktionRoles class handles these two tables and the qc_UserRoles
for user's roles.

The main difficulty was to find how to propose the user to set rights. I
looked for a layout that don't rely on a CheckBoxList like IBuySpy because it's
not easy as soon as you got more than 10 roles. I really like the layout
adopted in DotNetNuke 3 where actions are displayed on the first line as column
headers and with a row by role even if it's heavily rest on table tags.
Personally, I determine to write a specific UserControl that use a cleaner html
code with three properties :

```
* actionsTitles for headers ("View", "Edit" or "Admin"),
* actionsId for field constants ("view", "edit" and "admin"),
* actionsRoles for authorization assignments.
```

*(missing image)*

The last step will be to check all this authorizations when displaying
screens and boxes. Currently, I can configure rights but they are not used.
