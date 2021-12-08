---
date: 2010-01-25 13:30:00
layout: post
redirect_from: "post/2010/01/25/nouvelle-charte-graphique-prisca"
tags: blog, html
title: "Nouvelle charte graphique Prisca"
---

Un billet quasi-obligé pour donner quelques nouvelles du blogue en attendant
d'ici peu d'autres informations sur la traduction du tutoriel NerdDinner. Pour
commencer, l'évolution la plus évidente c'est le changement de la charte
graphique. Dans la charte graphique précédente, j'avais cherché à mettre en
avant le contenu du blogue en l'isolant dans un cadre sur fond blanc alors que
tout le reste du contenu était "posé" directement sur un fond de page aux tons
marron clair.

Le problème, c'est que j'avais essayé de faire en sorte que le maximum de
contenu soit visible en une seule fois. Pour cela, j'avais diminué la taille
des caractères, réduit un peu trop les marges et pas mal chargé les blocs
d'en-tête où j'avais regroupées toutes les informations du billet : titre,
date, permalien, tags...

Un autre truc que j'avais fini par trouver un peu lassant à la longue,
c'était le côté très encadré (et même enfermé) des différents éléments de cette
ancienne charte graphique. En plus du cadre général pour le contenu principal,
j'avais utilisé une couleur de fond plus foncée pour dessiner une sorte de
cadre pour les blocs d'en-tête des billets. Et pour bien insister, j'étais allé
jusqu'à présenter les tags et même quelques éléments de navigation sous forme
de boutons avec un léger effet 3D... A tel point que j'avais d'ailleurs appelé
cette charte graphique "[Boxed]({% post_url 2008-10-30-nouveau-theme-boxed %})" :)

Ce coup-ci, j'ai commencé par essayer de corriger ça en démarrant encore une
fois avec un grand bloc blanc mais en y disposant des marges beaucoup plus
importantes. Je cherchais en fait à obtenir un peu le même effet que sur une
page dans Word avec des marges de 3 ou 4 centimètres. Le problème, c'était que
si je voulais rester dans une échelle d'environ 960 pixels de large, il ne me
restait pas tant d'espace que ça pour le texte (et surtout les extraits de code
source) une fois que j'avais compté l'espace pris par ces marges et le bandeau
vertical destiné aux tags et aux différents menus ou liens...

Alors je me suis dit qu'à tant qu'à faire, pour gagner un maximum de place
le mieux c'était de carrément supprimer le cadre blanc et de partir avec un
simple fond de page tout blanc sur lequel je pourrai placer directement tous
les éléments du blogue. Avec cette méthode, je n'avais plus besoin que d'une
large marge entre le contenu principal et la colonne latérale.

Puis j'ai augmenté la taille des caractères du contenu principal pour qu'il
ressorte plus par rapport à tout le reste du blogue (et au début j'avais même
essayé avec des caractères 10% plus gros mais ça faisait un peu trop). Pour
accentuer ce contraste entre ce contenu principal et le reste du contenu, j'ai
aussi traité les liens de deux façons différentes, même si je les affiche
toujours en bleu dans les deux cas :

* soulignés par défaut dans le contenu principal puis non soulignés lors du
passage de la souris,
* non soulignés par défaut dans le contenu secondaire et soulignés seulement
au moment du passage de la souris dessus.

Pour compléter l'impression de clarté et de simplicité apportée par le fond
blanc sans bordure, j'ai aussi cherché à simplifier l'aspect général du blogue.
Pour commencer, j'ai éclairci le texte en employant un gris foncé plutôt que du
noir. J'ai aussi allégé la présentation en augmentant de façon significative
l'espacement entre les lignes. Et pour renforcer un peu plus cette idée de
sobriété, j'ai aussi diminué le nombre de polices de caractères
employées :

* Georgia pour le titre du blog (balise &lt;h1&gt;)
* une police style Courrier pour le code source
* Verdana pour tout le reste

Après j'ai re-stylé la présentation des différents niveaux de titres et de
sous-titres. Pour eux aussi, j'ai tout d'abord utilisé une taille de caractères
beaucoup plus grosse que dans la version précédente. Puis j'ai utilisé un jeu
de couleurs propre à chaque niveau de titre : un vert basique pour le plus
haut niveau (balise &lt;h2&gt;), un gris assez clair pour le niveau
intermédiaire (balise &lt;h3&gt;) et un simple noir pour le dernier niveau de
titre (balise &lt;h4&gt;).

La seule fioriture au niveau des titres a été de placer une sorte de liseré
gris très très clair en dessous des titres des billets pour marquer la
séparation avec le contenu du billet lui-même. L'avantage c'est que je peux
m'en servir pour y afficher la date de publication du billet, son lien
permanent et la liste de ses tags.

Pour finir, en plus de l'avoir fait passer du côté gauche au côté droit de
l'écran, j'ai complètement réorganisé le contenu du bandeau latéral. La partie
lien a été fusionnée avec la partie navigation de Dotclear et ne contient plus
que trois liens vers l'accueil, les archives et le fil RSS. Par la suite, il
est possible que je rajoute une page spéciale pour remettre certains des liens
qui apparaissaient auparavant dans cette barre latérale. Après réflexion j'ai
décidé de conserver la zone de recherche parce qu'il m'arrive de m'en servir au
moins pour rechercher parmi mes Blogmarks. Et je l'ai complété par la liste des
derniers billets publiés (mais je ne suis pas vraiment sûr d'avoir envie de
garder celle-ci). Et en dessous de cette liste j'ai relégué la liste des tags
de laquelle j'ai fait disparaitre la corélation entre la taille des caractères
et le nombre de billets correspondant aux tags.

Et sinon, à part ce changement au niveau de la charte graphique, le blogue a
connu deux autres évolutions assez importantes même si elles sont beaucoup
moins visibles.

La première de ces évolutions, c'est que j'ai enfin terminé de reprendre
tous les billets que j'avais publiés à l'origine sur mes précédentes tentatives
de blogues sous [
Blogger et WordPress]({% post_url 2006-10-12-avancement-mise-a-jour-site-gandiblog %}), sans compter tous les billets consacrés à QC que je
suis allé récupérer dans les [archives de
l'internet]({% post_url 2008-09-24-je-me-souviens %}). Ca m'a pris du temps, mais je suis bien content de l'avoir
fait.

En ce qui concerne la seconde de ces évolutions, elle n'est pas vraiment de
mon fait, mais elle contribue à me simplifier pas mal la vie. Suite à la mise
en place d'une version plus récente de Dotclear sur la plateforme GandiBlog, je
peux maintenant republier mes Blogmarks de façon un peu plus automatisée.
Avant, une fois que j'avais récupéré les blogmarks de la veille (par RSS) puis
que je les avais envoyé vers Dotclear (via l'interface XML-RPC), je devais
encore me connecter au blog pour ajouter manuellement un tag "Blogmarks". Mais
maintenant, l'API de Dotclear prend en compte la propriété mt_keywords et je
peux enfin définir le tag "Blogmarks" directement via l'interface XML-RPC. Et
au passage, j'en ai profité pour bidouiller un peu le contenu généré par
Blogmarks pour mieux gérer le cas où celui-ci contient un bloc de citation
&lt;blockquote&gt;.
