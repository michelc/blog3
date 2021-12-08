---
date: 2013-01-29 14:20:00
layout: post
redirect_from: "post/2013/01/29/vs-2010-tres-lent-bloque"
tags: nhibernate
title: "VS 2010 très très lent voire bloqué"
---

Au boulot, certains de mes collègues voyaient leur Visual Studio 2010 se
mettre à ramer comme pas possible et ils finissaient même par se retrouver
bloqués à devoir attendre que VS 2010 finisse de "freezer" pour pouvoir espérer
taper deux ou trois caractères ou esquisser quelques clics de souris.

Après avoir passé des éternités à tout essayer :

* installer tous les derniers services packs disponibles,
* tester toutes les combinaisons de paramétrages possibles,
* supprimer les très rares extensions utilisées,
* changer de PC,
* <s>ajouter des tonnes de mémoire</s>
* etc...

Ca ne donnait jamais rien et la seule vrai solution c'était de quitter tant
bien que mal Visual Studio, éteindre le PC, redémarrer et partir en pause café
avant de relancer VS 2010 et d'attendre le prochain ralentissement...

Puis un jour, un plus obstiné qui refusait de se plier à cette situation a
réussi à isoler le problème au milieu de la solution de 19 projets et 7161
fichiers. D'abord le projet qui enclenchait la lenteur de VS 2010 dès qu'il
était chargé, puis de fil en aiguille le fichier de ce projet directement
responsable de ce ralentissement et enfin il a débusqué le bout de code
"fautif" :

```
public IQueryOver<Contrat, Contrat> ContratPourImpression()
{
  var contrat = ContratSrv.QueryOver()
                          .Fetch(x => x.Rubriques).Eager
                          .Fetch(x => x.Destinataire).Eager
                          .Fetch(x => x.Destinataire.Centre).Eager
                          .Fetch(x => x.Destinataire.Specifiques).Eager
                          .Fetch(x => x.Employe).Eager
                          .Fetch(x => x.Employe.Paiement).Eager
                          .Fetch(x => x.Employe.Specifique).Eager
                          .Fetch(x => x.Employe.Papier).Eager
                          .Fetch(x => x.Employe.Papier.Type).Eager
                          .Fetch(x => x.Employe.Papier.Source).Eager
                          .Fetch(x => x.Employe.Nationalite).Eager
                          .Fetch(x => x.Agence).Eager
                          .Fetch(x => x.Agence.Centre).Eager
                          .Fetch(x => x.Agence.Societe).Eager
                          .Fetch(x => x.Agence.Societe.Siege).Eager
                          .Fetch(x => x.Bureau).Eager
                          .Fetch(x => x.Bureau.Implantation).Eager
                          .Fetch(x => x.Metier).Eager
                          .Fetch(x => x.Type).Eager
                          .Fetch(x => x.Categorie1).Eager
                          .Fetch(x => x.Categorie2).Eager
                          .Fetch(x => x.Cycle).Eager
                          .Fetch(av => av.Mission).Eager
                          .Fetch(av => av.Mission.Qualification).Eager
                          .Fetch(av => av.Mission.Specifique).Eager
                          .TransformUsing(Transformers.DistinctRootEntity);

  return contrat;
}
```

En supprimant ce code, Visual Studio redevenait rapide et le restait pendant
toute la journée. Comme c'était malgré tout du code nécessaire, il a bien fallu
trouver un plan B pour le conserver tout en évitant l'asphixie.

En cherchant bien, il est apparu que l'accumulation des "fetch" et des
expressions lambdas avait pour résultat de bloquer Visual Studio quand il
essayait d'analyser ces quelques lignes de code. Oui, parce que VS n'est pas
qu'un simple éditeur de texte, il cherche aussi à comprendre ce qu'on lui
tape...

La solution, ça a été de lui faire avaler cette expression par petites
bouchées :

```
public IQueryOver<Contrat, Contrat> ContratPourImpression()
{
  var contrat = ContratSrv.QueryOver()
                          .Fetch(x => x.Rubriques).Eager
                          .Fetch(x => x.Destinataire).Eager
                          .Fetch(x => x.Destinataire.Centre).Eager
                          .Fetch(x => x.Destinataire.Specifiques).Eager;
  contrat = contrat.Fetch(x => x.Employe).Eager
                   .Fetch(x => x.Employe.Paiement).Eager
                   .Fetch(x => x.Employe.Specifique).Eager
                   .Fetch(x => x.Employe.Papier).Eager
                   .Fetch(x => x.Employe.Papier.Type).Eager;
  contrat = contrat.Fetch(x => x.Employe.Papier.Source).Eager
                   .Fetch(x => x.Employe.Nationalite).Eager
                   .Fetch(x => x.Agence).Eager
                   .Fetch(x => x.Agence.Centre).Eager
                   .Fetch(x => x.Agence.Societe).Eager;
  contrat = contrat.Fetch(x => x.Agence.Societe.Siege).Eager
                   .Fetch(x => x.Bureau).Eager
                   .Fetch(x => x.Bureau.Implantation).Eager
                   .Fetch(x => x.Metier).Eager
                   .Fetch(x => x.Type).Eager;
  contrat = contrat.Fetch(x => x.Categorie1).Eager
                   .Fetch(x => x.Categorie2).Eager
                   .Fetch(x => x.Cycle).Eager
                   .Fetch(av => av.Mission).Eager
                   .Fetch(av => av.Mission.Qualification).Eager
                   .Fetch(av => av.Mission.Specifique).Eager
                   .TransformUsing(Transformers.DistinctRootEntity);

  return contrat;
}
```

Slurp. Tout de suite ça devient bien plus appétissant !
