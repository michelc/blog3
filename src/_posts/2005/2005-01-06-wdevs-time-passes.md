---
date: 2005-01-06 13:00:00
layout: post
redirect_from: "post/2005/01/06/Wdevs-Time-passes"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Time passes"
---

and I don't succeed to update this weblog regularly. Concerning my portal
tests, that doesn't go either as quickly as I wish it. But let's be positive, I
made some progress and from now I have a score of boxes in my 3 toolboxes.

* Classic : which contains boxes like those in IBuySpy,
* Extra : with boxes for Flash, Svg, feedback, faq, iframes, file
exploration, Google search and ads,
* Navigation : where I group all boxes dedicated to site navigation
(menu, map, breadcrumbs, tree...).

Also I begin to work at the admin part of the site: create a new screen, a
sub-screen, admin a screen and insert or admin a box. And practically all my
boxes now have a configuration form. I left the document back-end for later and
I still look after [FreeTextBox](http://www.freetextbox.com/),
[FCKEditor](http://www.fckeditor.net/) or [Cross-Browser RTE](http://www.kevinroth.com/rte/demo.htm) although I used
[htmlArea](http://web.archive.org/web/20050205192046/http://www.htmlarea.com/)
for wysiwyg in the htmltext box. In fact, I need to add "generic" dialogs in
order to select images, internal links or files. First, I could use them in any
wysiwyg editor, and later I will add them in the configuration fomr for some
boxes (lists, Image, Flash...).

Now I have to make real tests to check that everything is ok on Mono or with
an Access database. Next I have to start the security part, with users and
roles tables and at least a login box (and a way to select roles in screen or
box admin form).

But my current problem is url rewriting. I just write a very simple
implementation directly in global.asax.cs and it doesn't handle sub-screens
with Mono ([test
site on monoForge](http://web.archive.org/web/20050205192046/http://qctest.monoforge.com/home.aspx)) whereas it's ok with IIS ([same
code on WDevs](http://web.archive.org/web/20050205192046/http://hosting.wdevs.com/michel/home.aspx)). I need to resolve this before updating my demo site.
