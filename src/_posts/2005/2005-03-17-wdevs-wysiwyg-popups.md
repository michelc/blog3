---
date: 2005-03-17 19:26:00
layout: post
redirect_from: "post/2005/03/17/Wdevs-Wysiwyg-and-popups"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Wysiwyg and popups"
---

I made some new tests for the wysiwyg editor of the Htmltext boxes. This
time, I used [widgEditor](http://www.themaninblue.com/experiment/widgEditor/), which
suits better to my needs. Like The Man in Blue explains it, I think that other
editors are over complicated, but I didn't want to write a new one editor.

I still have to add some dialog boxes to allow users to:

* define internal links,
* create a link to download a file from the webserver,
* insert an image.

I started to program a dialog box for internal link where users can select
one of the screens of the site. I used [DestroyDrop](http://www.destroydrop.com/javascripts/tree/) to represent the
tree structure of the site, since I already employed it for my SitreTree box.
With this dialog box, administrator can quickly navigate to another the screen.
And when I would use it with widgEditor, it will allow author to create links
inside the site. I also plan to call it from Links and Redirect boxes to easily
manage the internal links and redirections from these modules.

Concerning the file dialog box, I already write a minimal one from my
FileDir box, where I can browse the server file system. I have to add an upload
functionality and later try to use thumbnails for image inserting. But it's ok
for a first attempt and it will be sufficient for this time. I preferred to
vaste my time to make modifications to call it from boxes where user can give
an url to a local file, like Image, FlashFile, SvgFile, XmlFile…

Popups are really not easy to code. I wanted modal dialog at least in
Internet Explorer and normal popup with Firefox. Except that links in a window
opened by a showModalDialog are a nightmare. Fortunately, I found an article
for an [ASP.NET Pop-up
Date Picker Control](http://www.dotpitchstudios.com/mainsite/default.aspx?pageid=7) where Mark Lubischer explains how he solved this
problem with IFrame. Et "cerise sur le gateau", thanks to him I discovered the
"modal=yes" attributes which tell to Firefox to open a modal window.
