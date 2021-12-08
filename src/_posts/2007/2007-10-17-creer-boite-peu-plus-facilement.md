---
date: 2007-10-17 14:06:00
layout: post
redirect_from: "post/2007/10/17/Creer-une-boite-un-peu-plus-facilement"
tags: ap
title: "Créer une boite un peu plus facilement"
---

Tout d'abord, Altrr-Press avait gardé de IBuySpy le fait qu'il fallait
ajouter une boite à un écran puis cliquer sur l'icone de mise à jour de la
boite que l'on venait d'insérer pour saisir le contenu de cette boite.

En pratique, dès qu'on voulait ajouter un nouveau bloc de texte, il fallait
en passer par les sept étapes suivantes :

* cliquer sur le bouton ![](/public/2007/addbox.gif) pour
créer une nouvelle boite
* sélectionner dans une popup le type de boite à insérer
* définir les propriétés de la boite
* valider la création de la boite
* cliquer sur le bouton ![](/public/2007/upditem.gif)
ou ![](/public/2007/cfgitem.gif) pour saisir le contenu
de la boite
* saisir le contenu de la boite
* valider la saisie du contenu

## Première amélioration

La 1° évolution a consisté à faire disparaitre l'étape n° 2. J'avais fait ça
à une époque où il y avait beaucoup plus de types de boites et où je pensais
qu'il y en aurait toujours plus. Mais c'est beaucoup moins nécessaire
maintenant (et ça va le devenir de moins en moins). Mais cette fenêtre popup
qui apparaissait dès qu'on voulait insérer un nouveau contenu c'était une
fausse bonne idée qui se révelait trop compliqué et demandait beaucoup d'effort
pour rien.

Le type de boite est maintenant défini avec les autres propriétés de la
boite à l'aide d'une simple liste déroulante.

## Deuxième amélioration

La 2° évolution a été de simplifier la saisie des propriétés de la boite
:

* par défaut, le titre donné à la nouvelle boite est celui de l'écran
* sélection automatique du type de boite Htmltext

Il suffit désormais de valider directement le formulaire de l'étape n° 3
sans rien saisir pour créer une nouvelle boite Htmltext qui s'avère être celle
qui est le plus largement utilisée.

## Troisième amélioration

La 3° évolution a été de passer automatiquement en saisie du contenu une
fois la création de la boite validée et ainsi d'éliminer l'étape n° 5. C'est
tout bête, mais encore fallait-il y penser et le faire...

## Bilan

Le nombre d'étapes pour créer une nouvelle boite est passé de 7 à 5 et ça
fait la seconde fenêtre popup qui disparait.
