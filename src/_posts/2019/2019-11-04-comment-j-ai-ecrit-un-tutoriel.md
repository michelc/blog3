---
date: 2019-11-04 12:26:04+200
layout: post
tags: javascript, tutoriel
title: "Comment j'ai écrit un tutoriel Node JS"
image: "/public/2019/ididitmyself.jpg"
---

Il y a quelques semaines, je me suis lancé dans la rédaction d'un tutoriel sur
le développement d'une application Node JS avec Express pour gérer une base de
données SQlite. Je l'ai publié sur mon blogue sous le titre [Application CRUD
avec Express et SQlite en 10 étapes]({% post_url 2019-09-11-crud-avec-express-sqlite-10-etapes %})
et j'ai fait un peu de publicité dessus en espérant que ça puisse servir à
d'autres que moi.

<figure>
  <img src="{{ page.image }}" alt="#ididitmyself" />
  <figcaption>
    <a href="https://commons.wikimedia.org/wiki/File:Dirty_dishes.jpg">C'est moi qui l'ait fait !</a>
  </figcaption>
</figure>

Mais de toute façon, j'ai écrit ce tutoriel avant tout pour mon propre compte.
J'essaie de m'améliorer petit à petit en JavaScript (et donc Node) et mon
objectif est de parvenir à réaliser quelques programmes console ou de petites
applications web.

Il existe pas mal de trucs très-très bien sur internet et ça aide beaucoup pour
apprendre à son propre rythme. Ce qui est particulièrement intéressant, c'est
que c'est très varié. Si on bloque quelque part, on découvre toujours d'autres
articles qui conviennent mieux et permettent de s'en sortir. Et quand on en a
marre d'un sujet, on peut là aussi trouver d'autres trucs à faire pour se
changer les idées et retrouver la motivation.

Mais quelquefois c'est quand même difficile d'arriver à démarrer "vraiment". Par
exemple, pour la partie web, même si on trouve facilement des tas de tutoriels,
ce n'est pas toujours évident. Ils sont presque toujours en anglais -- ça peut
aller. Ils ne sont pas toujours très récents -- le web va tellement vite. Mais
mon plus gros problème, c'est que soit ils sont trop basiques, soit que je m'y
perds en route parce qu'ils essaient aussi de m'expliquer tout un tas d'autres
trucs : MongoDB, WebPack, TypeScript, React, Vue, Docker...

Ça faisait donc un bout de temps que j'essayais de développer une petite
application web avec Node. Ce qui impliquait d'utiliser Express puisque c'est
le framework le plus populaire sur le marché. Je n'ai pas trop de temps à y
consacrer, donc pas la peine de m'égarer avec Koa, Hapi, Polka et consorts...

Le rêve, ça aurait été de trouver un truc qui fasse tilt, comme lorsque j'avais
découvert Sinatra avec "[I did it my way]({% post_url 2010-07-22-installer-sinatra-windows-7 %})".
Mais bon, [Darren Jones](https://twitter.com/daz4126) ne semble pas décidé à
refaire le coup avec Node :)

Un beau jour (je venais de finir une application vite faite avec ASP.NET MVC 5
et Bootstrap 4 que j'aurais pu faire en Node si j'avais su comment), je me suis
dit qu'à part du temps, il ne me manquait pas grand-chose pour arriver à
franchir le cap :

* Un exemple simple d'application ExpressJS, sans tomber directement dans sa
partie générateur
* Le b.a.-ba de l'utilisation d'une base SQL avec Node JS

Personnellement, je connais déjà :

* JavaScript (j'y travaille)
* Node (je m'y remets régulièrement)
* HTML (d'où les vues EJS sans problème)
* SQL (tant qu'il n'y a pas d'INNER JOIN)
* ASP.NET MVC et Sinatra (donc l'organisation d'une application web)
* Bootstrap (au moins le côté copier / coller)

J'avais en théorie tout ce qui était nécessaire pour essayer de développer une
première application par mes propres moyens. C'est ce que j'ai fait et à bien y
regarder, plutôt assez rapidement en fait. Puis je l'ai réécrite une deuxième
fois pour mettre un peu tout ça au propre et virer tous les bouts de code qui
partaient dans tous les sens. Puis plus ou moins une troisième fois en notant
comment je faisais pour rédiger un billet de blogue afin de ne rien oublier.

Et c'est comme ça que finalement je me suis retrouvé avec un "gros" tutoriel. Un
petit week-end, quelques vérifications, une dizaine de copies d'écrans et le
résultat était prêt à être publié !

L'avantage c'est que c'est assez exactement le tutoriel que j'aurais aimé
trouvé. Cela m'aurait fait gagner du temps, mais par contre, cela n'aurait pas
été aussi concret et je n'aurais sans doute pas aussi bien assimilé ce que je
faisais en suivant le tutoriel d'un autre. Ça semble toujours évident quand on
fait un tutoriel et on se laisse facilement aller à quelques copier / coller, à
des "je vois" sans trop chercher à comprendre...

L'autre avantage, c'est qu'à partir de cette application de départ, j'ai pu
prolonger mes expérimentations et voir comment :

* Accéder à une base de données PostgreSQL
* Utiliser plus ou moins le même code pour SQlite et PostgreSQL
* Remplacer les callbacks par des async / await
* Valider le formulaire de saisie
* Etc...

{:.encart}
English version: [How I wrote a Node JS tutorial]({% post_url 2019-11-05-how-i-wrote-a-tutorial %}){:hreflang="en"}.
