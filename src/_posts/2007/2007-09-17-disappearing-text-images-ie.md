---
date: 2007-09-17 11:24:00
layout: post
redirect_from: "post/2007/09/17/Disappearing-Text-or-Images-in-IE"
lang: en-US
tags: html
title: "Disappearing Text or Images in IE?"
---

> IE exhibits a very strange bug whereby text or background images sometimes
> disappear from sight. These items are still actually present and, if you
> highlight everything on screen or hit refresh, they'll often re-appear. Kind of
> strange, huh?
>
> This problem mostly occurs on background images and on text positioned next
> to a floated element. To remedy the problem, **simply insert position:
> relative** into the CSS command for the disappearing element, and for
> some bizarre reason, that'll usually fix the problem. If this doesn't work (and
> sometimes, it doesn't), **assign a width** to the offending
> element in the CSS -- that should fix the problem.

[My Top Ten CSS
Tricks](http://www.sitepoint.com/article/top-ten-css-tricks)
