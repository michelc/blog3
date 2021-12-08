---
date: 2009-09-10 17:25:00
layout: post
redirect_from: "post/2009/09/10/Placer-un-libell%C3%A9-semi-transparent-sur-une-image"
tags: code-snippets, html
title: "Placer un libellé semi-transparent sur une image"
---

J'avais vu ça il y a pas mal de temps, alors ce coup-ci je blogue pour
essayer de ne pas oublier comment faire.

## Côté Html

```
<div class="img-desc">
        <img src="sample.jpg" alt="" />
        <cite>Salone del mobile Milano, April 2008 - Peeta</cite>
</div>
```

## Côté CSS

```
.img-desc {
        position: relative;
        display: block;
        height:335px;
        width: 575px;
}
.img-desc cite {
        background: #111;
        filter:alpha(opacity=55);
        opacity:.55;
        color: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 555px;
        padding: 10px;
        border-top: 1px solid #999;
}
```

## Sources et exemples

* [5 Ways to Spice up Your Images with CSS](http://www.sohtanaka.com/web-design/spice-up-your-images-with-css/) : c'est le dernier effet
présenté (Image with Caption)
* [Simple JQuery Image Slide Show with Semi-Transparent
Caption](http://www.queness.com/post/152/simple-jquery-image-slide-show-with-semi-transparent-caption) : la CSS contient le même genre de technique que dans le lien
précédent
* [Semi-transparent Image Captions using CSS](http://www.cssbakery.com/2009/03/captioning-image-in-blogger.html) : un tutoriel
complet pour expliquer la technique
