---
date: 2021-12-20 12:29:43
tags: [ 11ty ]
title: "Création de mon site Eleventy"
cover:
  image: /public/2021/tour-eiffel.jpg
  text: La naissance de la tour Eiffel
  link: https://www.toureiffel.paris/fr/le-monument/histoire
excerpt: Pour migrer mon ancien blogue de Jekyll vers Eleventy, j'ai commencé de façon classique en suivant les instructions disponibles un peu partout, en particulier la page Getting started sur le site d'Eleventy.
---

Pour migrer mon ancien blogue de Jekyll vers Eleventy, j'ai commencé de façon classique en suivant les instructions disponibles un peu partout, en particulier la page [Getting started](https://www.11ty.dev/docs/getting-started/) sur le site d'Eleventy.

```
mkdir blog11
cd blog11
npm init -y
npm install --save-dev @11ty/eleventy
```

Puis sous VS Code, je modifie l'entrée "scripts" du fichier "package.json" pour pouvoir facilement lancer mon site par un simple `npm start`.

```json
  "scripts": {
    "build": "npx @11ty/eleventy",
    "start": "npx @11ty/eleventy --serve"
  },
```

Comme je vais utiliser [Git](https://git-scm.com/), je crée un fichier ".gitignore" pour indiquer les éléments que Git ne doit pas gérer.

```
node_modules/
package-lock.json
_site/
```

*Note : Pour l'instant, j'exclus les classiques "node_modules/" et "package-lock.json" comme dans tous mes projets Node JS. J'y ajoute le dossier "_site/" où Eleventy génèrera le contenu du site.*

Par défaut, Eleventy ne gère pas les fichiers référencés dans le fichier ".gitignore". Mais il est également possible d'exclure d'autres fichiers spécifiquement pour Eleventy en utilisant un fichier ".eleventyignore".

```
README.md
```

Pour entrer dans le vif du sujet, j'ajoute le fichier ".eleventy.js" pour configurer Eleventy. Ce fichier sert à regrouper tout ce qui permet de configurer Eleventy, y compris pour remplacer certains trucs qui sinon devraient être gérés au niveau de la ligne de commande.

Dans mon cas, je copie le contenu proposé par Sia Karamalegos dans son tutoriel [Itsiest, Bitsiest Eleventy Tutorial](https://sia.codes/posts/itsiest-bitsiest-eleventy-tutorial/) qui reprend uniquement les valeurs par défaut employées par Eleventy. Mais je trouve plus clair de savoir à quoi m'attendre.

```js
module.exports = function(eleventyConfig) {
  // Set custom directories for input, output, includes, and data
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
};
```

La ligne `input: "src"` indique que les fichiers sources du site sont stockés dans le répertoire "src". Je crée donc ce répertoire.

```
mkdir src
```

*Note : Avec `input: "src"` j'indique à Eleventy qu'il doit traiter les fichiers du dossier "src" et de ses sous-répertoires. Par conséquent, je n'ai pas vraiment besoin d'exclure le fichier "README.md" via le fichier ".eleventyignore", puisqu'il est présent au niveau au dessus du répertoire "src".*

La ligne `includes: "_includes"` indique que la charte graphique sera stockée dans le répertoire "_includes" du dossier "src". De même, la ligne `data: "_data"` indique que le paramétrage global du site est enregistré dans le répertoire "_data" du dossier "src". Je crée donc ces 2 répertoires à l'intérieur du répertoire "src".

```
cd src
mkdir _includes
mkdir _data
```

Pour tester que ça marche, je crée enfin un premier fichier "index.md" dans le répertoire "src" avec un peu de contenu.

```markdown
# Mon nouveau Blogue

C'est parti pour la migration de Jekyll vers Eleventy.

Jusqu'ici tout va bien...
```

Puis je "compile" :

```
npm start
```

Ce qui donne :

```
> blog11@1.0.0 start
> npx @11ty/eleventy --serve

Writing _site/index.html from ./src/index.md.
Wrote 1 file in 0.21 seconds (v0.12.1)
Watching…
[Browsersync] Access URLs:
 ---------------------------------------
       Local: http://localhost:8080
    External: http://192.168.42.236:8080
 ---------------------------------------
          UI: http://localhost:3001
 UI External: http://localhost:3001
 ---------------------------------------
[Browsersync] Serving files from: _site
```

Déjà il n'y a pas d'erreur ! Et je peux aller voir le site généré sur [http://localhost:8080](http://localhost:8080).

![](/public/2021/eleventy-001.jpg)

C'est bien. Mais si j'affiche le code source de cette page, je peux constater que ce n'est pas un contenu HTML complet. On n'y retrouve que les 3 lignes du fichier source transformées en HTML.

```html
<h1>Mon nouveau Blogue</h1>
<p>C'est parti pour la migration de Jekyll vers Eleventy.</p>
<p>Jusqu'ici tout va bien...</p>
```

{% include "_adsense.njk" %}

Je vais donc devoir ajouter un "layout" pour que Eleventy ait un "cadre" où insérer le HTML qu'il génère à partir des fichiers Markdown. Pour cela, je crée un fichier "layout.njk" dans le sous-répertoire "src/_includes".

```njk
<!DOCTYPE html>
<html lang="fr-FR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon nouveau blogue</title>
</head>
<body>
  <!-- Le contenu généré par Eleventy sera ajouté là -->
  {% raw %}{{ content | safe }}{% endraw %}
</body>
</html>
```

Puis il faut que j'indique à Eleventy d'utiliser ce layout lorsqu'il génère le contenu du site. Pour cela, j'ajoute un "front matter" au tout début du fichier "index.md" qui devient alors :

```markdown
---
layout: layout.njk
---
# Mon nouveau Blogue

C'est parti pour la migration de Jekyll vers Eleventy.

Jusqu'ici tout va bien...
```

Lorsque je sauvegarde le fichier, le site est recompilé automatiquement, car la commande "npm start" (qui a lancé la commande `npx @11ty/eleventy --serve`) est toujours en cours dans le terminal de VS Code.

```
File changed: src\index.md
Writing _site/index.html from ./src/index.md.
Wrote 1 file in 0.07 seconds (v0.12.1)
Watching…
[Browsersync] Reloading Browsers...
```

Et le contenu du navigateur est lui aussi automatiquement rafraichi (grâce à [Browsersync](https://browsersync.io/) qui est utilisé par Eleventy).

![](/public/2021/eleventy-002.jpg)

Rien qu'au titre de l'onglet qui est passé de "localhost:8080" à "Mon nouveau blogue", je peux voir que Eleventy a bien pris en compte le nouveau layout. Mais ça ne coûte qu'un clic-droit de vérifier en affichant le code source de la page.

```html
<!DOCTYPE html>
<html lang="fr-FR">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mon nouveau blogue</title>
</head>
<body><script id="__bs_script__">//<![CDATA[
    document.write("<script async src='/browser-sync/browser-sync-client.js?v=2.27.7'><\/script>".replace("HOST", location.hostname));
//]]></script>

  <!-- Le contenu généré par Eleventy sera ajouté là -->
  <h1>Mon nouveau Blogue</h1>
<p>C'est parti pour la migration de Jekyll vers Eleventy.</p>
<p>Jusqu'ici tout va bien...</p>
</body>
</html>
```

C'est pas mal !

Mais comme on peut le voir, le titre de mon nouveau blogue apparait 2 fois : une première dans la balise `<title>` et une seconde dans la balise `<h1>`. Ce qui est assez normal. Ce qui est moins amusant, c'est que pour cela j'ai dû le répéter dans 2 fichiers différents :

* dans "layout.njk" pour qu'il apparaisse dans la balise `<title>`
* dans "index.md" pour qu'il s'affiche dans le titre `<h1>`

Et qu'en plus je n'ai même pas été foutu de l'écrire de la même façon à chaque fois :)

C'est là que le dossier "src/_data" va servir. Je vais créer un fichier "site.json" pour y renseigner tous les informations globales du site. Ça correspond au fichier "_config.yml" de Jekyll.

```json
{
    "title": "Mon nouveau Blogue",
    "url": "https://mon.nouveau.blog",
    "lang": "fr-FR",
    "description": "Mon blog, de 2004 à aujourd'hui...",
    "author": "Michel"
}
```

J'en ai mis un peu plus...

Maintenant, je peux mettre à jour le layout pour y utiliser les variables globales "site.lang" et "site.title".

```njk
<!DOCTYPE html>
<html lang="{% raw %}{{ site.lang }}{% endraw %}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% raw %}{{ site.title }}{% endraw %}</title>
</head>
<body>
  <!-- Le contenu généré par Eleventy sera ajouté là -->
  {% raw %}{{ content | safe }}{% endraw %}
</body>
</html>
```

Et aussi le fichier "index.md" pour y utiliser la variable globale "site.title".

```markdown
---
layout: layout.njk
---
# {% raw %}{{ site.title }}{% endraw %}

C'est parti pour la migration de Jekyll vers Eleventy.

Jusqu'ici tout va bien...
```

Je retourne sur le navigateur et je peux constater que maintenant c'est bien "Mon nouveau Blogue" partout.

Un dernier truc pour aujourd'hui. Comme le site va contenir plusieurs pages et des tas de billets, je vais avoir besoin de définir un titre pour chaque page en plus du titre général du site. 

Pour donner un titre à la page, j'ajoute la variable "title" dans le front matter du fichier "index.md" et je remplace l'utilisation de la variable globale "site.title" par celle de cette nouvelle variable.

```markdown
---
layout: layout.njk
title: Accueil
---
# {% raw %}{{ title }}{% endraw %}

C'est parti pour la migration de Jekyll vers Eleventy.

Jusqu'ici tout va bien...
```

Puis j'ajoute le titre de la page dans "layout.njk" , pour que l'utilisateur sache sur quelle page il est en plus d'avoir le titre du blogue.

```njk
<!DOCTYPE html>
<html lang="{% raw %}{{ site.lang }}{% endraw %}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% raw %}{{ title }} - {{ site.title }}{% endraw %}</title>
</head>
<body>
  <!-- Le contenu généré par Eleventy sera ajouté là -->
  {% raw %}{{ content | safe }}{% endraw %}
</body>
</html>
```

Ce qui donne :

![](/public/2021/eleventy-003.jpg)

Ctrl+C dans le terminal de VS Code pour arrêter la tâche "npm start" et c'est bon pour aujourd'hui.

Ou alors juste :

```
c:\code\blog11> git init -b main
c:\code\blog11> git add .
c:\code\blog11> git commit -m "Création du blog."
```
