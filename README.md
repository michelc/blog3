# Mon blogue sous Eleventy


J'ai migré mon blogue sous [Eleventy](https://www.11ty.dev/) en décembre 2021. 

Ce fichier contient quelques éléments pour faciliter la création de nouveau billets.


## Front matter nouveau billet

```md
---
date: 
tags: [ ]
title: ""
cover:
  image: /public/2021/cute-puppies.jpg
  link: 
  text: 
excerpt: 
---
```

* date : sous la forme aaaa-mm-jj hh:mm:ss +02:00
* tags : entre crochets [ un, deux ], même s'il n'y en a qu'un !
* title : entre guillemets (par habitude ?)
* image.cover : /public/aaa/nom-fichier.jpg
* image.link : facultatif
* image.text : facultatif
* excerpt : obligatoire ! (et entre guillemets si contient un ":")

Notes :

* Penser à ajouter "lang: en-US" si le billet est en anglais
* Image en 1000 x 420 (jusqu'à présent, bien que 1200 x 600 soit la norme ?)


## Lien vers billet en français

```html
<div class="encart">

Version en français : {% goto_fr "BlaBla", "aaaa-mm-jj-blabla" %}.

</div>
```


## Lien vers billet en anglais

```html
<div class="encart">

English version: {% goto_en "BlaBla", "aaaa-mm-jj-blabla" %}.

</div>
```


## Majuscules accentuées à copier/ coller

* À : A_
* Ç : Ca_
* É : Etant_

Bonus : œ et Œ
