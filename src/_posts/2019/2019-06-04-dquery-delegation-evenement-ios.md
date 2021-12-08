---
date: 2019-06-04 12:37:50
layout: post
tags: javascript, jquery
title: "dQuery - Délégation d'évènements et IOS"
---

<div class="encart" markdown="1">

Cette série de billets retrace quelques-unes des étapes pour développer une
mini-librairie JavaScript qui remplacera(it) un jour jQuery sur mon site de jeux
de solitaires.

1. [Comment j'ai (bientôt) remplacé jQuery]({% post_url 2019-04-30-dquery-remplacer-jquery %})
2. [Une version compatible IE9 / ES5]({% post_url 2019-05-07-dquery-compatibilite-ie9-es5 %})
3. [Ma librairie pour manipuler le DOM]({% post_url 2019-05-14-dquery-librairie-js-manipulation-dom %})
4. [La délégation des évènements en JS]({% post_url 2019-05-21-dquery-delegation-evenement-javascript %})
5. [Délégation d'évènements et « event.target »]({% post_url 2019-05-28-dquery-delegation-evenement-event-target %})
6. [Délégation d'évènements et iOS]({% post_url 2019-06-04-dquery-delegation-evenement-ios %})

</div>

## 1° série de tests (à la main)

J'ai donc réussi à gérer assez correctement la délégation d'évènements dans ma
librairie dQuery. Après pas mal de tests et un grand nombre de parties de
solitaire jouées, sous Chrome, Firefox, Edge et même Internet Explorer, j'ai pu
valider que tout était OK.

Les essais menés dans le mode "device" de Chrome pour tester le fonctionnement
"responsive" des smartphones étaient eux aussi réussis. Je teste ensuite pour de
vrai sur un Samsung sous Android et même un vieux Wiko et là encore tout marche
correctement.

Jusqu'au moment où j'essaie de jouer sur un iPhone... Et là, rien ne se passe...
C'est comme si le "clic" n'avait pas lieu :

* Ça marche quand je pioche (car pas de delegate) ;
* Ça ne réagit pas du tout quand j'appuie sur une carte du tableau.


## 2° série de tests (plus automatisés)

Dans [NanoJS](https://github.com/vladocar/nanoJS/), Vladimir Carrer a écrit des
tests unitaires pour vérifier que le code de sa librairie fonctionne comme
prévu.

Mais je ne vais quand même pas apprendre à utiliser un framework de tests
JavaScript à cause d'un bête iPhone. Et surtout, il faudrait que j'arrive à
faire tourner ces tests directement sur un iPhone pour que cela soit réellement
concluant.

Je bidouille plutôt une page "dQuery.html" avec les principaux cas à tester pour
vérifier mon code et essayer de comprendre où cela bloque dans le cas de
l'iPhone. J'écris donc quelques tests sur :

* La sélection des éléments (c'est-à-dire les `$(...)`) pour être sûr qu'il n'y
a pas de problème à cause de `.querySelectorAll()` ;
* Les clics basiques pour tester les cas `.on(évènement, fonction)` même si cela
semble déjà être OK ;
* Les clics sur les cartes pour tester la délégation d'évènement et la méthode
`.on(évènement, filtre, fonction)`.

Comme je n'ai pas immédiatement accès à un iPhone, j'exécute ces tests un peu
partout ailleurs pour être certain qu'ils n'aient pas de problème. Ça me permet
au passage d'y apporter quelques améliorations :

* Corriger des bugs de base ;
* J'avais bêtement utilisé l'interpolation  de chaînes que IE9 n'aime pas ;
* J'ajoute finalement des tests sur à peu près toutes les méthodes pour ne pas
risquer de rater quelque chose le moment venu.

Enfin vient le jour où je peux à nouveau tester sur un iPhone... Et là, tous les
tests passent ! Ah ben zut alors :

* Soit mes tests sont pourris ;
* Soit je ne sais plus quoi faire...


## 3° série de tests (sur émulateur)

Manifestement, il y a un vrai problème avec les iPhones. Si je veux trouver la
solution, il faut impérativement que je puisse faire des essais dessus autrement
que de façon épisodique.

Je pensais naïvement commencer par tester sur Safari pour déminer un peu le
terrain. Mais malheureusement, je me rends alors compte que Safari pour Windows
n'existe plus depuis un sacré moment. Pas de chance.

Heureusement, on trouve quelques outils en lignes qui permettent de faire des
tests sur un "vrai" iPhone, entre autres :

* [BrowserStack](https://www.browserstack.com/)
* [LambdaTest](https://www.lambdatest.com/)
* [Kobiton](https://kobiton.com/)

Finalement, je me concentre sur LambdaTest, car sa version gratuite donne
suffisamment de temps pour mener les essais jusqu'au bout sans avoir
l'impression d'être dans Fort Boyard.

Et là, il faut bien me rendre à l'évidence, ce n'était pas l'iPhone sur lequel
j'avais testé qui était cassé, mais bien mon programme. Et en fait, c'est même
un problème plus général avec Apple, puisque ça ne fonctionne pas non plus quand
je teste via LambdaTest sur un iPad.

Je ne vais jamais y arriver... Sauf si d'autres ont déjà eu le problème et
qu'ils ont trouvé la solution (eux). Je cherche donc "javascript event delegate
iphone" et effectivement, c'est un problème connu. J'aurais quand même pu penser
un peu plus tôt à faire appel à mon ami Google.

Non seulement c'est un problème connu, mais c'est en plus un gros problème,
tellement que c'en est même une "fonctionnalité" :

> From the dawn of history browsers have supported event delegation. If you
> click on an element, the event will bubble all the way up to the document in
> search of event handlers to execute.
>
> It turns out that Safari on the iPhone does not support event delegation for
> click events, unless the click takes place on a link or input. That's an
> annoying bug, but fortunately there's a workaround available.
>
> [Click event delegation on the iPhone](https://www.quirksmode.org/blog/archives/2010/09/click_event_del.html)
> -- Peter-Paul Koch

Honnêtement, le point de vue chez Apple ne me parait pas si stupide que ça. Mais
comme tous les autres navigateurs font différemment, c'est un peu dommage de ne
pas adopter ce qui fait consensus.

Et donc, si je veux pouvoir faire de la délégation d'évènements en Vanilla
JavaScript qui fonctionne sur iOS, PPK a la solution, ajouter délibérément un
évènement `onclick` "vide" à tous les éléments non cliquables selon iOS :

> Fortunately it's pretty easy to solve: you have to make the element clickable
> by giving it an onclick event handler of its very own. That handler can be
> empty; as long as it's present it will make any element clickable.
>
> [Event delegation on the iPhone - Workaround](https://www.quirksmode.org/blog/archives/2010/09/click_event_del.html#link4)
> -- Peter-Paul Koch

Quelle horreur ! Ça va faire moche dans mon code si je dois ajouter / créer tous
ces "faux" onclick pour que mon jeu marche. Et puis il faut faire ça que pour
les iPhones / iPads et aussi espérer que ça n'aura pas d'autres effets...

Après avoir pas mal temporisé, je cherche un peu mieux des résultats plus
récents (et surtout je lis les articles jusqu'au bout) et il semblerait qu'il
existe une solution super-simple :

> Setting the cursor of the div to pointer in CSS also does the trick without
> any extra JS.
>
> [Event delegation on the iPhone - Comments #10](https://www.quirksmode.org/blog/archives/2010/09/click_event_del.html#c14825)
> -- Jimmy Byrum

Miracle ! Il suffit donc que j'ajoute une propriété `cursor: pointer` à la
classe `.card` de ma feuille de style pour qu'iOS devienne raisonnable :

* Je modifie mon CSS
* Je publie sur un site de test
* Je lance LambdaTest
* Ça marche !

Merci PPK, merci Jimmy, merci LambdaTest, merci Google... C'était peut-être
beaucoup plus facile avec jQuery, mais vachement moins amusant !
