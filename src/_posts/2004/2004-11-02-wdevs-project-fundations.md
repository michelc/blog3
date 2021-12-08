---
date: 2004-11-02 11:34:00
layout: post
redirect_from: "post/2004/11/02/Wdevs-Project-fundations"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Project fundations"
---

I directly start with a Private Assembly architecture. For that, I followed
Bo Nørgaard's [guide to
setup an environment for DotNetNuke 2.x Module](http://www.dotnetnuke.dk/Default.aspx?tabid=59) (private assembly)
development. And if I make no mistake, I create a solution with currently 2
projects :

* qc.dll : a pseudo project to reference all other PA (Bo call it
DnnFramework)
* qc.Core.dll : this project manages the portal components (portal,
screens, modules...)

I need a third project to handle users, roles, identification,
autorisations... and I will have a "full" engine ready to accept content.

Then I could start to add PA that will provide real content for my
system : Contacts, Documents, Events, Htmltext, Image, Links...

For the core project, I begin with the DbHelper that I'm using for some
times. I update it to handle MySQL too and I take time to clean and comment its
source. Then I write 2 classes to handles my 2 tables and I finished with 5
class and a default.aspx webform:

* Portals.cs : handles the qc_Portals table
* Screens.cs : for qc_Screens table
* Config.cs : encapsulates current portal and its screens
* Data.cs : my own DbHelper
* Common.cs : a general class for global functions.

Some quick notes about the code:

* the main menu is render as a list (`<ul>` and `<li>` tags) and can be [styled with css](http://css.maxdesign.com.au/listamatic/),
* my sql code is very basic and not specialised (I don't test but it should
work with Access or MSDE),
* nothing is fixed and I can make any change.

[Et voila!](http://michel.monoforge.com/default1.aspx)

Actually, I don't use temporarily the Private Assembly construction. I will
start again when I would be more advanced and that I would better know the
behavior with mono and MySQL.
