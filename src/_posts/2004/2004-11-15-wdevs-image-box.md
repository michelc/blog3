---
date: 2004-11-15 17:23:00
layout: post
redirect_from: "post/2004/11/15/Wdevs-An-image-box"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) An image box"
---

Compared to IBuySpy, I use a specific table to store information about the
image rather than using the general ModuleSettings table. First, I currently
don't have build a settings table. Second, this box is more an attempt to check
what I need to do when creating a new box.

First, the sql scripts to:

* create table qc_Images, its primary key and the foreign key to link with
qc_Boxes
* add the box type in qc_BoxTypes (INSERT INTO qc_BoxTypes ...)
* add a sample screen in qc_Screens (INSERT INTO qc_Screens ...)
* add a sample box in qc_Images for the sample screen (INSERT INTO qc_Images
...)

Second, two class to handle the table:

* Image : basic properties of an Image box (url, title, link,
size...)
* ImageDB : data logic to add/query/delete within the qc_Images
table

Third, a little user web control to display the content.

In the future, I will have to add a web control to edit the content. But
currently I use SQL script to update my content.

For the css, I only set a pretty border when the [
image box](http://web.archive.org/web/20041215050806/http://michel.monoforge.com/default.aspx?idScreen=image) is displayed in the middle column. But it should be possible to
build something better with [some shadows](http://www.alistapart.com/articles/cssdropshadows/).
