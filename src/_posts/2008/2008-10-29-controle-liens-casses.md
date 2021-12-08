---
date: 2008-10-29 18:23:00
layout: post
redirect_from: "post/2008/10/29/Controle-des-liens-casses"
tags: ap, referencement
title: "Contrôle des liens cassés"
---

A force de référencer des sites dans l'[annuaire sur l'Ardèche](http://07-ardeche.com/), il faut aussi de temps en
temps penser à vérifier que tout les liens enregistrés sont toujours bien
valides.

Pour cela, la table dir_Links contient un champ `status` qui est
initialisé à 0 par défaut lors de la création pour indiquer qu'il s'agit d'un
lien valide. Le principe est ensuite de faire varier cette valeur de la façon
suivante :

* augmenter cette valeur de 1 à chaque fois que le lien ne fonctionne
pas
* remettre cette valeur à zéro lorsque le lien est re-valide

Et bien entendu, lorsque cette valeur est trop élevée il convient de
supprimer le lien. La notion de "trop élevé" va dépendre du nombre de fois où
on a contrôlé les liens cassés. Dans le cas où on on fait un contrôle général
par mois, on peut considérer que 2 ou 3 c'est déjà une valeur trop élevée.

Pour réaliser le contrôle des urls référencées, j'ai développé un petit
utilitaire qui prend la liste des liens existants, contrôle que leur url répond
correctement puis génère un état récapitulatif.

## Utilisation

Pour commencer, il faut créer la requête suivante dans la base de
données :

```
SELECT dir_Links.idLink AS id, dir_Links.title, dir_Links.url, dir_Links.status
FROM   dir_Links
ORDER BY dir_Links.idLink;
```

Puis exécuter cette requête et exporter son résultat au format TXT
(tabulations, nom champ sur 1° ligne, aucun délimiteur chaine) dans
D:\Portals\pi\pi_test.txt.

Et pour finir, on lance le programme CheckUrls => après 5 à 10 minutes
cela aura généré un fichier pi_test.html avec les liens posant problèmes,
regroupés par type de problèmes.

## Contenu de http://localhost/pi/pi_test.html

* 1° colonne : champ status actuel (0 : OK, &gt;0 : KO)
* 2° colonne : titre du lien dans PI (clic pour formulaire mise à
jour)
* 3° colonne : url du lien dans PI (clic pour aller sur le site)
* 4° colonne : erreur http
* 5° colonne : url obtenue (clic pour la suivre)
* 6° colonne : complément erreur / url obtenue

Il est possible de copier ce fichier sur le site de production. De cette
façon, si on est connecté en tant qu'administrateur, on peut aller directement
mettre à jour le lien en cliquand sur la 2° colonne de ce rapport.

## Types de problèmes

* resurrected : liens avec status &gt; 0 qui "re-marchent" => à
vérifier et réactiver
* permanent : redirection permanente => généralement à prendre en
compte sauf si redirige vers une "ferme" à liens
* notfound : n'existent plus (ou n'aiment pas les robots)
* redirect : redirection plus ou moins bien faite => à traiter au cas
par cas
* others : autres résultats bizarres
* ok : tout ce qui va bien

## Que faire de ça

* toujours vérifier le nouveau lien avant mise à jour
* ne pas oublier de mettre à jour le champ status dans le formulaire du
lien
* essayer de prendre en compte les permanent redirect
* être plus circonspect avec les autres redirect
* m'a permis de corriger quelques erreurs de frappe (http:wwwtoto.com au lieu
de http:www.toto.com)
* dans un premier temps corriger les sructures d'urls qui ont changés
(sitesperso.orange.fr/xxxx en perso.orange.fr/xxxx, aliceadsl... ou
www.toto.com/sitev1/ en www.toto.com ...)
* ne pas toucher quand www.azerty.com remplacé par azerty.free.fr ou autre et
que www.azerty.com marche toujours
* ne pas toucher quand www.azerty.fr.st remplacé par azerty.free.fr ou autre
et que www.azerty.fr.st marche toujours (quoique ?)
* corriger quand www.azerty.com redirigé permanent sur azerty.com
* quand un lien est cassé et que mène sur rien ou erreur => espérer que ce
n'est qu'un pb temporaire et donc ne pas supprimer immédiatement
* quand un lien mène sur une "ferme" à lien qui nous propose d'acheter le
lien => soit la boite a disparue, soit elle a dû changer d'url (parce
qu'elle a changé de prestataire ?)
* quand un lien ne marche plus, faire des recherches sur titre lien / tag /
commune => on peut arriver à découvrir la nouvelle adresse du site
* etc...
