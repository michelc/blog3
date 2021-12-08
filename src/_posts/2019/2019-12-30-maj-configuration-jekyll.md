---
date: 2019-12-30 13:16:12+200
layout: post
tags: jekyll
lang: fr-FR
title: "Mise à jour de la configuration de Jekyll"
image: "/public/2019/source-code.jpg"
excerpt: "Après avoir un peu rafraîchi la charte graphique de mon blogue, je me suis lancé dans sa mise à jour. Depuis que j'étais passé de GandiBlog à Jekyll il restait toujours quelques bricoles à faire. Comme je me suis remis à bloguer, ça vaut le coup de m'y attaquer."
---

Après avoir un peu rafraîchi la charte graphique de mon blogue, je me suis lancé dans sa mise à jour. En fait, depuis que j'étais passé de GandiBlog à Jekyll il y a près de 3 ans, il restait toujours quelques bricoles à faire pour finaliser la migration. Et comme cette année je me suis remis à bloguer, ça vaut le coup de m'y attaquer.

<figure>
  <img src="{{ page.image }}" alt="source-code" />
  <figcaption>
    <a href="https://unsplash.com/photos/5Ntkpxqt54Y">Source code on a screen - Sai Kiran Anagani</a>
  </figcaption>
</figure>


## Correction du fil Atom

Pour commencer, un bug monstrueux : le fil Atom ne fonctionnait pas à cause d'un truc vraiment trop bête. La balise `<link rel="alternate" type="application/atom+xml">` pointait vers `/atom.xml` et alors que le fichier "\_config.yaml" déclarait `path: feed/atom`.

=> correction de l'attribut `path` dans "\_config.yaml" :

```yaml
plugins:
  - jekyll-feed

feed:
  path: atom.xml
```

Grâce à ça, je vois enfin apparaître mes billets dans [FeedDemon](http://www.feeddemon.com/) :)


## Ajout d'images sur les billets

Ces derniers temps, j'essaie de mettre des images à chaque fois que je publie un nouveau billet. J'avais commencé avant de republier sur [dev.to](https://dev.to/), mais c'est vrai que le fait d'avoir à chercher une illustration pour eux m'encourage fortement à continuer sur [blog.pagesd.info](https://blog.pagesd.info/). Pour faire apparaître l'image sur ce blog, j'insère le code HTML suivant vers le début de mon billet :

```html
<figure>
  <img src="/public/2019/sapin-de-noel.jpg" alt="sapin-de-noel" />
  <figcaption>
    <a href="https://unsplash.com/photos/ySNkCkdKyTY">Sapin de Noël - Rodion Kutsaev</a>
  </figcaption>
</figure>
```

Pour l'instant, l'image sur mon blog est dimensionnée en 640 x 480 pixels alors que celle destinée à dev.to est en 1000 x 420 pixels. En attendant d'avoir une seule image pour les 2 publications, je peux déjà enregistrer l'image au niveau du Front Matter YAML pour qu'elle soit automatiquement réutilisée dans le fil Atom :

```markdown
---
date: 2019-12-16 12:09:42+200
layout: post
tags: css
title: "Nouvelle CSS et 5 trucs bons à savoir"
image: "/public/2019/sapin-de-noel.jpg"
---

...

{% raw %}<figure>
  <img src="{{ page.image }}" alt="sapin-de-noel" />
  <figcaption>
    <a href="https://unsplash.com/photos/ySNkCkdKyTY">Sapin de Noël - Rodion Kutsaev</a>
  </figcaption>
</figure>{% endraw %}
```

Et je n'ai rien d'autre à faire pour que cette image soit réutilisée par le plugin [Jekyll Feed](https://github.com/jekyll/jekyll-feed) :

```xml
<entry>
  ...
  <media:thumbnail url="https://blog.pagesd.info/public/2019/sapin-de-noel.jpg"/>
  <media:content medium="image" url="https://blog.pagesd.info/public/2019/sapin-de-noel.jpg"/>
</entry>
```


## Ajout du plugin Jekyll SEO Tag

Maintenant que je défini l'illustration de mes billets dans l'en-tête, je veux bien entendu que cela serve aussi quand je fais de la publicité pour mes billets sur Twitter. Je pourrais faire ça à la main dans le template "\_layout/default.html", mais il existe un plugin qui fait ça et même un peu plus : [Jekyll SEO Tag](https://github.com/jekyll/jekyll-seo-tag).

Et ce qui est très important, c'est que ce plugin fait partie des rares privilégiés à être accepté par Github Pages : [About GitHub Pages and Jekyll](https://help.github.com/en/github/working-with-github-pages/about-github-pages-and-jekyll#plugins) (et suivre le lien "Dependency versions").

C'est super simple à faire en 2 temps 3 mouvements. D'abord ajouter ce plugin à la liste des plugins déjà utilisés dans "\_config.yaml" :

```yaml
plugins:
  - jekyll-feed
  - jekyll-seo-tag
```

Puis j'ajoute `{% raw %}{% seo %}{% endraw %}` dans le template "\_layout/default.html" :

```html
    {% raw %}...
    {% seo title=false %}{% endraw %}
  </head>
```

Note : je ne fais pas de `gem 'jekyll-seo-tag'` pour ajouter le plugin à mon fichier "Gemfile" parce que je n'ai pas installé Jekyll en local. Je compte exclusivement sur Github Pages pour publier mon blogue.

J'ai ajouté `title=false` pour éviter que le plugin ajoute la balise `<title>` que j'insère déjà à ma sauce un peu plus haut. Et magie de l'informatique, mes billets comprennent désormais tout un tas de truc en plus pour améliorer le référencement :

```html
<meta name="generator" content="Jekyll v3.8.5" />
<meta property="og:title" content="Nouvelle CSS et 5 trucs bons à savoir" />
<meta name="author" content="michel" />
<meta property="og:locale" content="en" />
<meta name="description" content="English version: A new CSS and 5 tips to know." />
<meta property="og:description" content="English version: A new CSS and 5 tips to know." />
<link rel="canonical" href="https://blog.pagesd.info/2019/12/16/nouvelle-css-quelques-trucs/" />
<meta property="og:url" content="https://blog.pagesd.info/2019/12/16/nouvelle-css-quelques-trucs/" />
<meta property="og:site_name" content="blog.pagesd.info" />
<meta property="og:image" content="https://blog.pagesd.info/public/2019/sapin-de-noel.jpg" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2019-12-16T10:09:42+00:00" />
<script type="application/ld+json">...</script>
```

Parfait. Je retrouve bien mon sapin de Noël. Sinon, `generator` c'est moyen. `application/ld+json` c'est quoi ? Et par contre, les "descriptions" c'est tout pourri :(


## Personnalisation du résumé du billet

Avec Jekyll, à chaque billet est associé un extrait ("excerpt" en anglais) qui peut être utilisé via `post.excerpt` dans une table des matières par exemple. C'est aussi ce qu'utilise le plugin Jekyll SEO Tag pour initialiser les descriptions qu'il génère.

Le problème qu'il y a, c'est que dans mon cas, les extraits générés par Jekyll ne sont pas géniaux. Par défaut, Jekyll prend le premier paragraphe du billet. On peut éventuellement rallonger ça en définissant un `excerpt_separator: <!--more-->` dans "\_config.yaml" puis en marquant la fin de l'extrait par un `<!--more-->` dans les billets.

J'ai donc 3 solutions :

1. Ajouter un `<!--more-->` dans tous (?) les billets, mais j'aurais quand même le lien pour la traduction en début de l'extrait
1. Enlever le lien vers la traduction en début de billet, mais je trouve plus sympa de prévenir dès le début qu'il existe une version traduite pour ceux que ça intéresse.
1. Définir manuellement le contenu de l'extrait par une clé `excerpt` dans le Front Matter.

Comme je ne crois pas que Github Pages me laisse créer mes propres plugins dans le répertoire "\_plugins" (à tester pour plus tard sans trop d'espoir), je laisse de côté la méthode de [Scott Watermasysk](https://dev.to/scottw) : [Better Jekyll Excerpts](https://scottw.com/blog/better-jekyll-excerpts/).

Pour l'instant, je pars sur la méthode n° 3 et je modifie le Front Matter de mes billets :

```markdown
---
date: 2019-12-16 12:09:42+200
layout: post
tags: css
title: "Nouvelle CSS et 5 trucs bons à savoir"
image: "/public/2019/sapin-de-noel.jpg"
excerpt: "Pour la nouvelle année à venir, j'ai un peu rafraîchi la charte graphique de mon blogue. Outre le côté 'tout nouveau, tout beau', cela m'a permis de voir 2 ou 3 trucs de CSS et de Jekyll que je ne connaissais pas."
---
```

Mais je vais pas passer ma vie dessus => je ne fais ça que pour les billets récents et j'essaierai de m'y tenir à l'avenir. Ou bien je chercherai une autre solution...


## Changement de la structure des billets

Ça c'est un truc perso que je traîne depuis que je blogue. J'ai toujours utilisé la balise `<h1>` pour le titre du blogue, ce qui me laisse avec la balise `<h2>` pour le titre du billet et les balises `<h3>` et `<h4>` pour les différentes sous-parties de l'article.

Mais je vois bien que c'est un peu bizarre et que généralement on utilise la balise `<h1>` pour le titre du billet. Outre le fait que ces jours-ci ce doit être mieux d'un point de vue SEO, cela me permettrait de plus facilement republier mes billets en anglais sur [dev.to] (actuellement je dois faire attention à remplacer les `### ... ` par des `## ... `).

Je me suis donc lancé dans toute une série de rechercher / remplacer pour mettre à jour tous mes billets et après avoir corrigé quelques vieux billets mal structurés, je suis enfin entré dans le rang :

* h1 = titre du billet
* h2 = sous-titres du billet
* h3 = sous-titres de niveau 2


## Mise à jour de la page d'archive

Ça faisait partie des bricoles que j'avais prévues de faire il y a 3 ans, à savoir afficher les mois en français et pas en anglais. J'ai trouvé quelques pistes un peu partout :

* L'inévitable Christophe Ducamp : [Comment localiser la date en français dans Jekyll ?](https://www.christopheducamp.com/2013/12/26/jekyll-localiser-la-date/)
* La mise à jour où il renvoie : [Traduire la date dans Jekyll](http://ouyaah.legtux.org/informatique/web/2017/05/19/traduire-date-jekyll.html)
* Quelques pistes sur Stack Overflow : [Locale specific date in Jekyll](https://stackoverflow.com/questions/10714980/locale-specific-date-in-jekyll)

Au final, j'ai fait ça :

```liquid
  {% raw %}{% capture month %}{{ post.date | date: "%m" }}{% endcapture %}
  {% if current_month != month %}
    {% assign current_month = month %}
### {% case month %}
      {% when "01" %}Janvier {{ year }}
      {% when "02" %}Février {{ year }}
      {% when "03" %}Mars {{ year }}
      {% when "04" %}Avril {{ year }}
      {% when "05" %}Mai {{ year }}
      {% when "06" %}Juin {{ year }}
      {% when "07" %}Juillet {{ year }}
      {% when "08" %}Août {{ year }}
      {% when "09" %}Septembre {{ year }}
      {% when "10" %}Octobre {{ year }}
      {% when "11" %}Novembre {{ year }}
      {% when "12" %}Décembre {{ year }}
    {% endcase %}
  {% endif %}{% endraw %}
```

C'est pas très beau et j'ai un peu beaucoup galéré parce que je voulais aussi en profiter ajouter l'année à côté du nom du mois. Et [kramdown](https://kramdown.gettalong.org/) s'obstinait à séparer le mois de l'année ce qui fait que je me retrouvais avec le nom du mois en sous-titre `<h3>Décembre</h3>` et l'année sur une ligne à part `<p>2019</p>`, quand ce n'était pas `<pre>2019</pre>`.


## Suppression de la coloration syntaxique

Puisque j'en suis sur kramdown, j'en profite pour supprimer la coloration dans les blocs de code, le fameux "[Code and Syntax Highlighting](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#code)" de Markdown. Je ne l'utilise pas sur ce blogue et c'est donc du gaspillage que Jekyll perde du temps à générer ça et que Github se ruine à stocker le supplément de code HTML que cela représente.

La solution est encore une fois sur [About GitHub Pages and Jekyll](https://help.github.com/en/github/working-with-github-pages/about-github-pages-and-jekyll#syntax-highlighting) avec 3 lignes supplémentaires dans "\_config.yaml" :

```yaml
kramdown:
  syntax_highlighter_opts:
    disable : true
```

Au final, ça fait baisser pas mal la taille de certains billets avec beaucoup de code et ça améliore donc les performances de mon blogue.


## Sélection de la langue des billets

En regardant de plus près mon nouveau fil Atom ou les balises générées par le plugin Jekyll SEO Tag, je me suis rendu compte que j'avais un nouveau problème. Ils indiquent tous les deux que mes billets sont en anglais. Dans certains cas, c'est pas faux, mais dans la grande majorité, c'est pas ça du tout.

Et comme depuis quelques temps j'essaie de publier mes billets en français et en anglais, c'est quand même un problème sérieux. La solution, c'est de commencer par signaler que mon blogue est en français au niveau du fichier "\_config.yaml" :

```yaml
title: blog.pagesd.info
author: michel
lang: fr-FR
```

Note : Je ne sais pas trop ce qui est le mieux : `fr-FR`, `fr-fr` ou `fr` tout court.

Puis pour tous les billets en anglais, je modifie le Front Matter pour redéfinir l'attribut `lang` :

```markdown
---
date: 2019-12-17 12:09:42+200
layout: post
tags: css
lang: en-US
title: "A new CSS and 5 tips to know"
---
```

Il faut ensuite modifier le template dans "\_layout/default.html" pour utiliser la langue définie dans le billet ou sinon la langue générale du blogue :

```html
{% raw %}<!DOCTYPE html>
<html lang="{{ page.lang | default: site.lang }}">
  <head>
    <meta charset="utf-8">
    ...{% endraw %}
```

Pour faire bonne mesure, je précise aussi la langue dans les liens suivant / précédent en bas de chaque billet :

```html
{% raw %}<nav class="paginate">
  {% if post.previous.url %}
    <a href="{{ post.previous.url }}" hreflang="{{ post.previous.lang | default: site.lang }}">{{ post.previous.title }}</a>
  {% endif %}
  {% if post.next.url %}
    <a href="{{ post.next.url }}" hreflang="{{ post.next.lang | default: site.lang }}">{{ post.next.title }}</a>
  {% endif %}
</nav>{% endraw %}
```

Et aussi dans les liens entre les traductions :

```html
{% raw %}English version: [A new CSS ...]({% post_url ... %}){:hreflang="en"}.{% endraw %}
```

Ou :

```html
{% raw %}Version en français : [Nouvelle CSS ...]({% post_url ... %}){:hreflang="fr"}.{% endraw %}
```

Le coup du `{% raw %}{:hreflang="xx"}{% endraw %}` n'a pas été facile à trouver, mais pourtant ça existe bel et bien : [Additional link attributes can be added by using a span IAL after the inline link](https://kramdown.gettalong.org/syntax.html#inline-links).

{:.encart}
English version: [Jekyll configuration update]({% post_url 2019-12-30-jekyll-configuration-update %}){:hreflang="en"}.
