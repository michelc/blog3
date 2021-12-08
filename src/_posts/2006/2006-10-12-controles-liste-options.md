---
date: 2006-10-12 11:29:00
layout: post
redirect_from: "post/2006/10/12/Controles-de-liste-doptions"
tags: qc
title: "Contrôles de liste d'options"
---

Lorsque on utilise un contrôle CheckBoxList ou un contrôle RadioButtonList,
il ne faut pas oublier d'utiliser RepeatLayout="Flow" et
RepeatDirection="Horizontal" pour éviter que le contrôle soit rendu côté client
par une table et des balises &lt;tr&gt; et &lt;td&gt;.

Si on souhaite que les différents choix apparaissent verticalement, il faut
utiliser RepeatDirection="Vertical" au lieu de RepeatDirection="Horizontal" de
façon à générer une balise &lt;br /&gt; entre les différentes options. Dans ce
cas, il faut également définir la classe par CssClass="std radiov" et pas
simplement CssClass="std" pour que les options soient correctement alignées les
unes sous les autres et pas cadrées complètement à gauche de l'écran.
