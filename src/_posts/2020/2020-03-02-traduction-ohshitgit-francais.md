---
date: 2020-03-02 12:16:55+200
layout: post
tags: git
title: "Traduction de «Oh Shit Git» en français"
image: "/public/2020/gaston-lagaffe.jpg"
---

Très légèrement motivé par le [#hacktoberfest](https://dev.to/michelc/selfish-hacktoberfest-2019-4g5l), je m'étais lancé il y a quelque temps dans la traduction du site [Oh Shit, Git!?!](https://ohshitgit.com/) en français. Personnellement, je m'en sers quelquefois quand je commite puis que je me rends compte que j'ai oublié juste un dernier petit truc ou bien que j'ai fait une bête faute dans mon message de commit.

<figure>
  <img src="{{ page.image }}" alt="gaston-lagaffe" />
  <figcaption>
    <a href="http://www.gastonlagaffe.com/">Gaston Lagaffe</a>
  </figcaption>
</figure>

[Katie Sylor-Miller](https://twitter.com/ksylor) vient de valider les différentes PR de traduction de son site. Il est donc maintenant possible de profiter de ses trouvailles traduites en français, même si ça démystifie un peu Git : [https://ohshitgit.com/fr/](https://ohshitgit.com/fr/).

<blockquote class="twitter-tweet tw-align-center"><p lang="fr" dir="ltr">Ca y est ! Nous aussi on peut insulter Git quand cette sale bête ne fait pas comme ce qu&#39;on voudrait : <a href="https://t.co/niQr79oBuP">https://t.co/niQr79oBuP</a>. Merci <a href="https://twitter.com/ohshitgit?ref_src=twsrc%5Etfw">@ohshitgit</a> et <a href="https://twitter.com/ksylor?ref_src=twsrc%5Etfw">@ksylor</a> :)</p>&mdash; michel (@ms_michel) <a href="https://twitter.com/ms_michel/status/1233337074364841984?ref_src=twsrc%5Etfw">February 28, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Pour la traduction de l'accroche, j'ai un peu hésité entre "Oh m...de" et "Et m...de". J'ai finalement choisi la seconde version qui me paraît un peu moins grossière et apporte un petit côté fataliste. Version confirmée par un collègue aux racines bretonnes qui m'a même trouvé l'illustration parfaite de ce qu'on ressent quand l'inexplicable vous tombe dessus :

<figure class="video">
  <iframe width="560"
          height="315"
          src="https://www.youtube.com/embed/YganM4xVTac?start=80"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
  </iframe>
  <figcaption>
    Le chavirage du MOD 70 Virbac Paprec comme si vous y étiez !
  </figcaption>
</figure>

Pour être complet, je vous conseille de suivre la présentation que Katie a réalisé pour la conférence [JAMstack_conf_sf 2019](https://jamstackconf.com/#2019). Elle y explique pourquoi et comment elle a fait évoluer son site. Au départ, il s'agissait d'un simple fichier html qu'elle a fait migrer assez facilement vers [eleventy (11ty)](https://www.11ty.io/), un générateur de site statique développé en JavaScript : [Migrating to JAMstack and OhShitGit!](https://www.youtube.com/watch?v=PqlhYVqLDm0)

{:.encart}
English version: [Translation of «Oh Shit Git» in French]({% post_url 2020-03-03-ohshitgit-french-translation %}){:hreflang="en"}.
