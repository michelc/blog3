---
date: 2008-09-22 13:52:00
layout: post
redirect_from: "post/2008/09/22/Recapitulatif-un-peu-long"
tags: ap, code-killer
title: "Récapitulatif un peu long"
---

Ce billet est avant tout une sorte de message de service qui est
essentiellement destiné à tenir deux collègues au courant de tout ce qui s'est
passé sur PI et AP ces derniers temps.

## Les modifications de PI (Pages d'Infos)

### Les cinémas

J'ai fait pas mal de mises à jour sur les programmes de cinéma et il y a
maintenant 3 présentations pour les séances :

* affiches avec un tableau des séances hebdomadaires (jour par jour)
* affiches avec un tableau des séances quotidiennes (heure par heure)
* seulement les affiches

Et quand c'est disponible, la description et le réalisateur du film sont
aussi affichés.

Pour l'Ardèche, j'utilise le tableau hebdo avec les cinémas où il y a peu de
films et le tableau jour pour les autres.

Jusqu'à présent, les anciennes séances de dir_Seances étaient conservées
seulement pendant 2 semaines (14 jours). J'ai passé ça à 5 semaines (35 jours)
pour éviter de perdre trop vite les descriptions et les informations liées au
film dans la table dir_Movies (et donc d'avoir à les re-saisir quand le film
passe enfin dans les petites salles de l'Ardèche). En effet, on supprime les
films de dir_Movies dès qu'ils n'apparaissent plus dans dir_Seances.

Et enfin, j'ai ajouté un champ "information" à la table dir_Cinemas pour
ajouter une information ponctuelle à la page d'un cinéma. Si ce champ commence
par un "!", il ne s'affiche que dans le cas où il n'y a pas de séances
connues : je m'en suis servi pour afficher les périodes de fermeture des
cinémas pendant l'été.

### Les communes

Le template _PlaceTemplate.txt employé pour les communes gère maintenant une
macro {@place.urlOffice} pour afficher un lien vers l'office de tourisme. Pour
l'Ardèche, c'est un lien vers la page interne consacrée à l'office de
tourisme.

Pour cela, le champ urlOffice de la table dir_Places contient :

```
<a
href="[%AP.Path.Application%]annuaire/office-tourisme/mon-village.aspx"
title="Office-tourisme">OT de Mon Village**</a>
```

(admirez l'utilisation des macros Altrr-Press :)

Pour vous, vous pouvez mettre directement quelque chose comme :

```
<a href="http://www.ot-mon-village.fr/"> title="Office
tourisme">OT de Mon Village **</a>
```

J'ai aussi ajouté la macro {@place.weather} pour insérer l'encart météo
juste au moment du rendu de la page d'une commune.

Avec la nouvelle macro {@place.htmlDescription} (ou {@place.description}),
ce qui m'a permis de créer un encart avec :

* un lien vers office de tourisme
* la météo de la commune
* une mini-description de la commune

La macro {@place.description} renvoie juste le contenu du champ description
de la table dir_Places. Par contre, la macro {@place.htmlDescription} génère du
code html autour pour intégrer la description :

* `<p class="infodesc">la description de la commune
...</p>`
* `<blockquote><p>une citation sur la commune
...<cite>l'auteur de la
citation</cite></p></blockquote>`

La macro {@place.htmlDescription} détermine automatiquement que le champ
description contient une citation lorsqu'il y a un séparateur pipe | entre la
citation et l'auteur.

Par ailleurs, la description brute est utilisée pour la balise meta
description de la page. C'est ce qui est conseillé par les outils Google pour
les webmasters pour avoir moins de pages avec la même description.

### Les liens

Je ne fais plus apparaitre de publicité à l'intérieur des liens lorsqu'ils
sont affichés sous forme minimisée. Parce que ça faisait trop de publicité dans
la page par rapport au contenu texte. Ce qui faisait que dans certains cas,
Google laissait vide le bandeau latéral sur la droite.

Il y a maintenant un champ displayMode dans la table dir_Tags pour choisir
comment présenter la liste des liens d'un tag :

* Défaut : initialisé à 0 pour les tags qui ont moins de 100 liens
* Par commune : initialisé à 1 pour les tags avec au moins 100
liens

La présentation par commune affiche les tags en les classant par commune,
comme on peut par exemple le voir dans la page des [restos de l'Ardèche](http://07-ardeche.com/annuaire.aspx/restaurant). Les
pages concernées sont beaucoup plus légères qu'avant et je trouve que c'est
plus pratique à lire et pour y trouver d'un coup d'oeil les sites d'une
commune.

### En vrac

Il est maintenant possible de modifier un marché (avant il fallait aller
taper dans la base de données).

J'ai modifié la présentation des évènements. Maintenant ça fait vraiment
trop comme dans les sites internet pour de vrai ! (mais y'a que moi qui en
profite).

J'ai optimisé pas mal de code en remplaçant de nombreuses variables string
par des StringBuilder.

La très vielle AjaxBox (3 ans et demi quand même) a complètement été évincée
au profit du tout nouveau AutoComplete (en attendant jQuery peut être un jour
ou l'autre).

Sinon, j'avais commencé à ajouter du code pour gérer la version 2 des Pages
d'Infos (avec notamment une nouvelle charte graphique plus moderne), mais ça
fait un bon bout de temps que je n'ai rien fait dessus.

## Les modifications de AP (Altrr-Press)

### Moins de code

Pour résumer, l'objectif général de toutes les modifications apportées à
Altrr-Press c'est de diminuer la quantité de code (si besoin en réduisant les
fonctionnalités) et d'améliorer la qualité du code restant (ou en tout cas de
le simplifier au maximum). Tout ça en vue d'arriver à faire une version 1 avant
de passer très vide à une version 2 qui tournerait sous ASP.NET 2.

J'ai définitivement supprimé les boites FlashFile, Image, Redirect, Sitemap
et Sitemenu qui ne sont normalement plus utilisées depuis pas mal de temps (ou
alors vous êtes vraiment à la traine).

J'ai aussi supprimé la boite SqlRepeat qui ne servait que sur le site de
Saint-Privat (et la preuve que je suis prêt à tout pour diminuer la quantité de
code, c'est que j'ai utilisé du XML pour la remplacer).

Pour plus d'explications, vous pouvez vous reporter au billet [Régime XML]({% post_url 2008-09-02-regime-d-ete %}).

### Un nouveau Wysiwyg

J'ai aussi définitivement remplacé l'éditeur wysiwyg [widgEditor](http://code.google.com/p/widgeditor/) par Altrr-Editt, un super
nouveau éditeur wysiwyg que j'ai fait moi-même en reprenant des morceaux de
widgEditor à la sauce jQuery.

Il est plus mieux bien, vous pouvez me faire confiance, même s'il faudra
attendre encore un petit peu pour que je trouve le temps de vous expliquer
pourquoi.

### Mise à jour des macros

Désormais, toutes les macros de AP sont sous la forme [%AP.Xxxxxx.Yyyyyy%].
Pour rappel, les macros c'est les trucs qu'on peut utiliser dans les chartes
graphiques ou les boites RawContent. Avant, on avait vraiment de tout et
n'importe quoi :

* {@department.xxxx} pour les informations sur le département
* &lt;%= siteMacro("xxxxx") %&gt; dans les chartes graphiques
* et même {@public.start} et {@public.end} pour encadrer les scripts de
statistiques

Pour l'instant, le source de default.aspx.cs contient encore les fonctions
siteMacro() et RenderLegacy() pour gérer toutes les anciennes syntaxes, mais je
compte bien m'en débarrasser le plus vide possible.

A noter : à part {@department.xxxx} qui est devenu
[%AP.Department.Xxxxx%], toutes les autres macros de PI utilisées dans les
templates /data/##/_xxxxx.txt sont restées sous la forme
{@objet.propriete}.

Et accessoirement, les macros ne sont plus statiques (je me demande bien
comment il pouvait y avoir du statique là dedans ?). A mon avis, il y a une
petite chance que ça permette de résoudre les plantages pour le Gîte de
Julie.

J'ai aussi ajouté les macros [%AP.Link.Next%] et [%AP.Link.Previous%] pour
générer un lien vers la page suivante ou la page précédente à l'intérieur d'un
même niveau d'arborescence. Vous pouvez aller voir les 2 galeries de photos sur
le site de Saint-Privat pour voir ce que ça donne. Au passage, ces 2 galeries
contiennent du XML, saurez-vous le retrouver ?

### Poliçage du code

J'ai aussi essayé de passer les sources d'Altrr-Press à la moulinette
[StyleCop](http://code.msdn.microsoft.com/sourceanalysis) (c'est un
programme made in Microsoft pour valider l'organisation et le style des sources
C#), mais c'est pas simple parce qu'il faut faire les corrections à la main et
qu'en plus ils prônent un style qui n'est pas très "AP like" (surtout pour les
{ et les } sur des lignes séparées !!!).

Malgré tout, il y a quelques trucs intéressants :

* utiliser string.Empty au lieu de ""
* mettre les using à l'intérieur du namespace (et pas une fois l'un et une
fois l'autre)
* commenter beaucoup plus (tout commenter en fait)
* espacer pour que ça soit plus clair (ajouter des lignes vides)
* utiliser this.xxxx
* return xxxx; et pas return (xxxx);
* etc...

Sur BDHlper.cs où j'ai fait le plus de travail il y a encore 392
avertissements (heureusement y'en a beaucoup qui sont liés les uns aux
autres).

### Pour la suite

J'ai le début d'un autre billet en préparation sur tout ce qu'il est
nécessaire de prévoir pour faire passer Altrr-Press en ASP.NET 2. Et j'ai peur
que ça implique pas mal de trucs...

Et il faudrait aussi graver dans le blog comment je compte faire évoluer
Altrr-Press :

* verrouiller le périmètre de ce qui sera dans la version 1 (idéalement ne
plus rien ajouter)
* version 2 (périmètre identique sous ASP.NET 2) : comment s'y prendre
et comment tester
* les priorités / les indispensables à incorporer dans une version 2.1
* les idées pour plus loin...

Mais en attendant, il faut aussi que je m'occupe de finaliser les scripts
SQL qui permettront aux retardataires de faire une mise à jour quasi sans
douleur par rapport à toutes les modifications répertoriées dans ce billet.
