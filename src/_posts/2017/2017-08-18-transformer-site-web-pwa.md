---
date: 2017-08-18 12:25:43
layout: post
tags: pwa
title: "Comment transformer votre site web en PWA"
---

{:.encart}
Ceci est la traduction du billet "[How to turn your website into a PWA](https://mxb.at/blog/how-to-turn-your-website-into-a-pwa/)" de Max Böck.

<p class="accroche">Une Application Web Progressive, ou PWA, utilise des
fonctionnalités web modernes pour offrir une expérience utilisateur similaire à
celle d'une application native. Tout site internet peut être une PWA -- voici
comment faire.</p>

<figure>
  <img src="/public/2017/mxb-install.jpg" alt="" />
  <figcaption>L'invite "ajouter à l'écran d'accueil" dans une PWA</figcaption>
</figure>

Transformer un simple site internet en PWA n'est pas difficile et offre un
grand nombre d'avantages, c'est pourquoi je souhaite vous présenter les trois
étapes nécessaires pour y parvenir.

Mais pour commencer, je vais corriger quelques idées fausses trop largement
répandues en ce qui concerne les PWAs.

### 1) PWA ≠ "Application"

Une Application Web Progressive peut aussi bien être un blog, un site de
présentation, une boutique ou une galerie de petits chats trop mignons. Une PWA
est avant tout un moyen d'optimiser votre site pour plus de rapidité et un
meilleur rendu. Vous pouvez (et vous devriez) profiter de ces nouvelles
techniques quel que soit votre contenu.

*Remarque : le terme "Application" dans PWA est [source de discussion](https://adactio.com/journal/12461),
car certains trouvent qu'il ne véhicule pas le bon concept. Pour moi, ça n'est
qu'un nom. Et de toute façon, il est de plus en plus difficile de définir ce qui
différencie un site internet d'une "application web".*

### 2) PWA ≠ Javascript + Application web monopage

Encore une fois, ce n'est pas parce que votre site n'est pas une
<abbr title="Single Page Application">SPA</abbr> sous React-Redux que cela n'est
pas pour vous. Mon site personnel est seulement composé
[de pages HTML statiques](https://github.com/maxboeck/mxb) générées par Jekyll,
mais c'est une PWA tout à fait valide. Quoique vous ayez publié sur internet,
vous pouvez donc en profiter.

### 3) PWA ≠ Google ou Android

Ce qui est génial, c'est que les PWAs offrent le meilleur des deux mondes :
* les liens directs et les URLs du monde web,
* un accès déconnecté, des notifications et plein d'autres trucs du monde des
applications natives.

Et tout ça en restant complètement indépendant de la plate-forme où cela
s'exécute. Pas besoin d'AppStore ou d'un environnement iOS ou Android, mais
juste ce bon vieux web.

### 4) PWA = prêt et sûr dès aujourd'hui

Dans PWA, il y a un "P" pour progressif ! Ce "P" signifie que toutes ces
techniques ne sont que des améliorations accessoires. Si un ancien navigateur ne
gère pas telle amélioration, il ne va pas planter. Il se contentera d'afficher
le site web de base.

## OK, mais pourquoi moi ?

Transformer votre site internet en PWA offre pas mal d'avantages :

* Une expérience utilisateur plus rapide et plus sécurisée
* Un meilleur classement Google
* Une meilleure convivialité
* De meilleures performances
* Un accès hors-ligne

Même si vous n'en êtes pas encore à espérer que vos utilisateurs "installent"
votre PWA (en plaçant un raccourci sur leur écran d'accueil), vous avez quand
même beaucoup à gagner à faire le saut. En fait, toutes les étapes nécessaires
pour transformer votre site en PWA vont améliorer votre site internet et sont
communément considérées comme de bonnes pratiques du web.

## Étape 1 : Le Manifeste

Un *manifeste* est un simple fichier JSON qui décrit toutes les métadonnées de
votre PWA. Il contient des choses telles que le nom, la langue et l'icône de
votre application. Ces informations indiquent aux navigateurs comment afficher
votre application quand elle est installée en tant que raccourci. Ce fichier se
présente de la façon suivante :

```
{
 "lang" : "fr",
 "dir" : "ltr",
 "name" : "Voici une super PWA",
 "short_name" : "maPWA",
 "icons" :   [
   {
     "src" : "\/assets\/images\/touch\/android-chrome-192x192.png",
     "sizes" : "192x192",
     "type" : "image\/png"
   }
 ],
 "theme_color" : "#1a1a1a",
 "background_color" : "#1a1a1a",
 "start_url" : "/",
 "display" : "standalone",
 "orientation" : "natural"
}
```

Ce fichier est généralement nommé "manifest.json" et il est déclaré au niveau de
la balise `<head>` de votre site :

```
<link rel= "manifest" href= "manifest.json">
```

🔥 Astuce : Vous n'avez même pas à écrire ce fichier vous-même. Il faut plusieurs
tailles d'icônes pour les différents systèmes et c'est assez compliqué pour que
tout soit correct. Contentez-vous de faire une seule image en 500x500 (votre
logo par exemple) et rendez-vous sur [Real Favicon Generator](http://realfavicongenerator.net/).
Ils génèrent les différentes tailles nécessaires, les balises méta et vous
fournissent un fichier manifeste tout prêt. Excellent !

## Étape 2 : Passez à HTTPS

Les Applications Web Progressives doivent être servies via une connexion
sécurisée, ce qui signifie un **protocole HTTPS**. HTTPS encrypte les données
que les utilisateurs envoient vers votre serveur et empêche les intrus de
falsifier leur connexion. Et depuis quelque temps, Google favorise les sites en
HTTPS et les classe mieux que les sites concurrents non sécurisés.

Pour passer à HTTPS, vous aurez besoin d'un certificat SSL fourni par une
autorité de confiance. La façon d'obtenir un tel certificat dépend de la façon
dont est hébergé votre site. Globalement, il existe deux cas de figures.

👉 Si vous gérez **votre propre serveur** ou que vous avez un accès root à
celui-ci, voyez du côté de [LetsEncrypt](https://letsencrypt.org/). C'est une
autorité de certification gratuite, ouverte et simple qui permet à tout le monde
de commencer à utiliser HTTPS. C'est assez facile à mettre en œuvre et aussi
sécurisé que les autres fournisseurs.

👉 Si vous êtes sur un **hébergement mutualisé**, la plupart d'entre eux ne
permettent malheureusement pas d'utiliser LetsEncrypt mais offrent d'autres
certificats SSL moyennant finance. Si vous ne savez pas comment obtenir un
certificat, renseignez-vous auprès de votre hébergeur.

Après avoir obtenu votre certificat SSL, il y aura sans doute quelques
ajustements à faire dans votre code pour que tout soit servi via une connexion
sécurisée. Pour plus d'informations à ce sujet, vous pouvez lire ce [guide
détaillé de KeyCDN](https://www.keycdn.com/blog/http-to-https/) ou suivre
l'[article de Chris Coyier](https://css-tricks.com/moving-to-https-on-wordpress/)
pour migrer un site WordPress.

Quand tout sera ok, vous serez gratifié d'un joli cadenas vert juste devant
votre URL :

![Icone HTTPS](/public/2017/mxb-lock-icon.png)

## Étape 3 : Le Service Worker

C'est là que la magie opère. Un Service Worker est essentiellement un bout de
code Javascript qui sert d'intermédiaire entre le navigateur et l'hôte. Il
s'installe automatiquement dans les navigateurs pris en charge, peut intercepter
les requêtes effectuées sur votre site et y répondre de différentes façons.

Vous pouvez configurer un nouveau SW en créant simplement un fichier Javascript
dans le répertoire racine de votre projet. Appelons-le `sw.js`. Le contenu de ce
fichier va dépendre de ce que vous souhaitez réaliser -- nous y viendrons dans
une seconde.

Pour informer le navigateur que nous avons l'intention d'utiliser ce fichier en
tant que Service Worker, nous devons d'abord l'enregistrer. Dans le script
principal de votre site, ajoutez la fonction suivante :

```
function registerServiceWorker() {
  // enregistre le script sw avec les navigateurs qui le gèrent
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js', { scope: '/' }).then(() => {
      console.log('Service Worker enregistré correctement.');
    }).catch(error => {
      console.log('Erreur lors de l''enregistrement du Service Worker : ', error);
    });
  }
}
```

Le paramètre `scope` indique quelles requêtes doivent être interceptées par le
SW. Il s'agit d'un chemin relatif par rapport à la racine de votre domaine. Par
exemple, si vous le définissez à `/articles`, vous contrôlez les requêtes vers
`votredomaine.com/articles/my-post` mais pas vers `/votredomaine.com/contact`.

### La mode est au déconnecté

Il y a plusieurs trucs intéressants qui peuvent être réalisés grâce aux Service
Workers. Vous pouvez en particulier mettre votre contenu en cache et le stocker
en local pour qu'il soit disponible lorsque l'utilisateur est déconnecté. Cela
aura également  un impact important sur le temps de chargement de la page même
dans le cas où l'utilisateur est connecté, car les requêtes n'ont pas besoin
d'accéder au réseau et les différents contenus sont immédiatement disponibles.

En plus de la mise en cache traditionnelle par le navigateur, vous pouvez
définir une liste des fichiers à mettre en cache dès que le Service Worker est
installé -- de sorte que l'utilisateur n'a pas à naviguer vers une page pour
qu'elle soit mise en cache. Voici comment faire cela :

```
// sw.js
self.addEventListener('install', e => {
 e.waitUntil(
   // Après l'installation du service worker,
   // ouvre un nouveau cache
   caches.open('mon-cache-pwa').then(cache => {
     // Ajoute toutes les URLs des éléments à mettre en cache
     return cache.addAll([
       '/',
       '/index.html',
       '/about.html',
       '/images/doggo.jpg',
       '/styles/main.min.css',
       '/scripts/main.min.js',
     ]);
   })
 );
});
```

🔥 Astuce: Si vous souhaitez vous mettre rapidement au mode déconnecté, je vous
recommande vivement d'utiliser [sw-precache](https://github.com/GoogleChrome/sw-precache).
Il s'agit d'un outil créé par Google qui s'intègre à votre processus de
génération Gulp ou Grunt pour **générer le fichier du Service Worker à votre
place**.

Vous lui donnez simplement une liste de fichiers et il suivra automatiquement
toutes leurs modifications afin de mettre à jour votre cache Service Worker.
Etant donné que `sw-precache` s'intègre dans le processus de génération de votre
site, vous pouvez utiliser des caractères génériques pour définir *tous* les
éléments à mettre en pré-cache de la façon suivante :

```
import gulp from 'gulp';
import path from 'path';
import swPrecache from 'sw-precache';

const rootDir = '/';

gulp.task('generate-service-worker', callback => {
  swPrecache.write(path.join(rootDir, 'sw.js'), {
    staticFileGlobs: [
      // Suit et met en cache tous les fichiers qui correspondent à ce modèle
      rootDir + '/**/*.{js,html,css,png,jpg,gif}',
    ],
    stripPrefix: rootDir
  }, callback);
});
```

Exécutez cette tâche dans votre build, et vous n'aurez plus jamais à vous
préoccuper de l'invalidation du cache ! Dans le cas de sites plus petits, comme
des sites statiques, vous pouvez même lui faire mettre en cache tous vos
fichiers image, HTML, Javascript et CSS. Pour les sites ayant beaucoup de
contenu dynamique ou de nombreuses images de grande taille qui ne sont pas
nécessaires en permanence, il vaut mieux pré-cacher seulement un "squelette" de
votre site.

*PS : Pour traiter le support du mode déconnecté de façon plus exhaustive,
n'hésitez pas à lire "[The Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/)" de Jake Archibald.*

## Testez votre PWA

Chrome [Lighthouse Extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)
est un outil de test pour vérifier les Applications Web Progressives, en ce qui
concerne leur performance, leur accessibilité et leur conformité aux
spécifications PWA.

Il teste votre site dans plusieurs tailles et selon différentes vitesses du
réseau, mesure le temps pour afficher la première page et d'autres facteurs de
performance, pour vous donner des conseils utiles sur les points qui doivent
encore être améliorés. De façon générale, c'est un très bon outil d'évaluation
pour les sites web.

<figure class="extend">
  <img src="/public/2017/mxb-lighthouse.png" alt="Rapport Google Lighthouse avec
  les résultats  PWA, performance, accessibilité et meilleures pratiques" />
  <figcaption>Rapport de Lighthouse pour mxb.at</figcaption>
</figure>

Vous pouvez au choix installer l'extension Lighthouse depuis le
[Chrome Web Store](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk),
ou bien utiliser Chrome Canary, où cette extension est déjà présente par défaut.

## Lectures complémentaires

J'espère vous avoir donné un bon aperçu pour démarrer avec les PWA. Si vous
souhaitez approfondir le sujet, voici quelques liens intéressants pour en
apprendre plus :

* Google Developers : [Votre première Application Web Progressive](https://developers.google.com/web/fundamentals/getting-started/codelabs/your-first-pwapp/)
* Smashing Magazine : [Un guide pour les débutants des PWAs](https://www.smashingmagazine.com/2016/08/a-beginners-guide-to-progressive-web-apps/)
* Cours d'Udacity gratuit : [Introduction aux Applications Web Progressives](https://www.udacity.com/course/intro-to-progressive-web-apps--ud811)
