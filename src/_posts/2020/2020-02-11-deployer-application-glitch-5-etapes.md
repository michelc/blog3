---
date: 2020-02-11 12:24:08+200
layout: post
lang: fr-FR
tags: javascript, node, sql
title: "Déployer une application sur Glitch en 5 étapes"
image: "/public/2020/ichthyology.jpg"
---

Ça faisait un petit moment que je voulais tester Glitch "pour de vrai" et déployer le projet réalisé pour mon tutoriel [Application CRUD avec Express et SQlite en 10 étapes]({% post_url 2019-09-11-crud-avec-express-sqlite-10-etapes %}). J'ai enfin trouvé le temps de m'y mettre et ça marche super bien.

<figure>
  <img src="{{ page.image }}" alt="ichthyology" />
  <figcaption>
    <a href="https://www.biodiversitylibrary.org/page/9665742">An introduction to the natural history of fishes - BHL</a>
  </figcaption>
</figure>


## 1. Créer un compte sur Glitch

Pour l'instant, je ne veux pas m'engager. Sur la page [https://glitch.com/](https://glitch.com/), je clique sur le bouton "Sign in" (en haut à droite) puis je me contente de :

* cliquer sur "Create an account" (en bas au milieu) pour créer un nouveau compte,
* cliquer ensuite sur "Email Magic Link" pour recevoir un mél qui contiendra un lien / code temporaire pour me connecter (après avoir donné mon adresse mél),
* depuis ma boite mél, je clique sur le lien reçu et me voilà connecté à Glitch.


## 2. Importer un projet GitHub

Glitch permet de gérer des applications Node, avec Express et cerise sur le gâteau, une base de données SQlite. C'est donc exactement ce qu'il me faut pour tenter d'héberger mon application AppTest développée il y a quelques mois. Pour cela, il me suffit de :

* cliquer sur "New Project" (en haut à droite),
* choisir "Clone from Git Repo" (en bas de la mini liste),
* coller l'URL de mon dépôt Git : https://github.com/michelc/AppTest

Et voilà ! Je me retrouve avec le code source de mon application Node directement dans l'éditeur de Glitch.


## 3. Adapter le projet à Glitch

Après lecture de quelques docs, je sais qu'avec Glitch la base de données SQlite doit être enregistrée dans un dossier ".data" qui est :

* caché, au moins dans l'éditeur de fichiers, mais visible depuis la console,
* conservé d'une fois à l'autre, ce qui permet d'y stocker les données de l'application

Dans le tutoriel j'avais créé un répertoire "data" pour y enregistrer la base de données. Je n'ai donc que 2 petites modifications à faire pour m'adapter à Glitch :

* renommer le dossier "data" en ".data",
* modifier la ligne 15 du fichier "index.js" pour y remplacer le chemin "data" par ".data".

```javascript
const db_name = path.join(__dirname, ".data", "apptest.db");
```

Normalement, Glitch gère un fichier secret ".env" où on peut configurer et sécuriser ce genre de trucs. Mais pour l'instant, je n'ai encore rien fait à ce niveau dans mon application AppTest.


## 4. Lancer l'application

Ces quelques modifications devraient être suffisantes pour me permettre d'exécuter mon programme depuis Glitch :

* cliquer sur le bouton "Show" (en haut à gauche),
* choisir "In a New Window" (à tant qu'à faire) pour lancer / afficher l'application dans une nouvelle fenêtre / onglet,
* un nouvel onglet s'ouvre avec l'URL [https://michelc-apptest.glitch.me/](https://michelc-apptest.glitch.me/) et affiche l'écran d'accueil de mon application !

Maintenant, si je clique sur "Livres" dans la barre de menu, j'obtiens bien la liste de livres telle que je l'avais créée. Pour tester, je peux mettre à jour cette liste et tout fonctionne correctement !


## 5. Inclure le bouton Glitch

Mais quand même, il manque les poissons ! Je regarde vite fait comment c'est fait sur le projet Node + Express par défaut de Glitch et c'est tout simple. Il faut ajouter quelques lignes à mon pseudo "layout" EJS :

* ouvrir le fichier "_footer.ejs" dans le répertoire "views",
* ajouter les 4 lignes suivantes juste avant la fermeture de la balise `</body>` :

```erb
  <!-- include the Glitch button to show what the webpage is about and
        to make it easier for folks to view source and remix -->
  <div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>
  <script src="https://button.glitch.me/button.js"></script>

</body>
```

Ça y est. Si je rafraichis ma page, je vois apparaitre les célèbres poissons Glitch pour qui voudrait réutiliser mon application :) Grâce à eux, je peux même embarquer mon application ici-même :

<div class="glitch-embed-wrap" style="height: 486px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; encrypted-media"
    src="https://glitch.com/embed/#!/embed/michelc-apptest?previewSize=100&previewFirst=true&sidebarCollapsed=true"
    alt="michelc-apptest on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>


## Conclusion

Pour un premier essai, c'était super facile. Ça vaut donc le coup d'investir un peu de temps dessus pour mieux maîtriser et faire des trucs un peu plus concrets...

{:.encart}
English version: [Deploy an application on Glitch in 5 steps]({% post_url 2020-02-12-deploy-application-glitch-5-steps %}){:hreflang="en"}.
