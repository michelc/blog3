---
date: 2005-06-07 20:13:00
layout: post
redirect_from: "post/2005/06/07/Correction-Macroscs"
tags: qc
title: "Correction Macros.cs"
---

Modification de Macros.SiteMenu() qui n'imbriquait pas les sous-niveaux `<ul>`
dans le `<li>` en cours. Il y avait :

```
<ul>
  <li class="level1">Primo</li>
  <li class="level1 inpath">Deuxio</li>
  <ul>
    <li class="level2 inpath">Alpha</li>
    <li class="level2">Beta</li>
  </ul>
  <li class="level1">Tertio</li>
  <ul>
    <li class="level2">Utqueant</li>
    <li class="level2">Resonare</li>
  </ul>
</ul>
```

Au lieu de :

```
<ul>
  <li class="level1">Primo</li>
  <li class="level1 inpath">Deuxio
    <ul>
      <li class="level2 inpath">Alpha</li>
      <li class="level2">Beta</li>
    </ul>
  </li>
  <li class="level1">Tertio
    <ul>
      <li class="level2">Utqueant</li>
      <li class="level2">Resonare</li>
    </ul>
  </li>
</ul>
```

Ce qui avait pour conséquence de ne pas permettre de gérer les CSS telles que :

```
li.level1 ul {
  display: none;
}
li.inpath ul {
  display: block;
}
```
