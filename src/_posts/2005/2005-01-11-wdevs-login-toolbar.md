---
date: 2005-01-11 18:21:00
layout: post
redirect_from: "post/2005/01/11/Wdevs-Login-and-toolbar"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Login and toolbar"
---

I worked a little more on the admin part. First, I created tables to manage
users and roles and made a sql script to initialize an "Admins" role and two
users ("admin" and "guest"). After that I wrote a login box then I updated my
code according to the fact that the visitor is authenticated or not. I will
handle roles later.

*(missing image)*

Second, I set up a way to hide or show all admin and configuration buttons.
By default, once you are logged on, I display a toolbar for screen management
at the top of the screen and for each box there are an edit or configuration
button before its title and an admin button after it.

*(missing image)*

Whereas I use cute buttons, it's not practical to have all them on the
screen. So I added another icon to my toolbar, which hide all other buttons
when clicked. With this feature, you have the same look as normal visitors, but
you're still logged as site administrator.

*(missing image)*

And another click on the hide/show icon and all buttons come back.
