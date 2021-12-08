---
date: 2008-10-02 18:53:00
layout: post
redirect_from: "post/2008/10/02/Migration-de-Altrr-Press-de-NET-1-vers-NET-2"
tags: .net, ap
title: "Migration de Altrr-Press de .NET 1 vers .NET 2"
---

## Carnet de route

### Les pré-requis

* Renommer les projets, les assemblys et les namespaces de qc.  - en ap.*
* Supprimer les trucs inutiles :
  - les boites obsolètes
  - SqlRepeat et BangGrid.cs
  - widgEditor
  - treeview (et DestroyDrop Tree et FileExplorer)
* Refactoriser / fusionner le code pour
  - parcourir les écrans
  - parcourir les fichiers
* Nettoyer / simplifier le code
* Vérifier que tout est subversionné et se compile sans erreur

Premier bon point : à part le renommage, je suis maintenant quasiment
bon sur tout et je peux donc considérer que j'ai une version 1.0 "finie" sous
ASP.NET 1.

### Comment faire

Dans un premier temps, juste pour tester :

* Faire une sauvegarde complète
* Copier la solution de D:\Portals\pi sur D:\Portals\az (il suffit de lancer
ApCopy az)
* Ouvrir la solution az.sln sous Visual Studio 2005 => lance l'assistant
de migration
* Il faut ensuite re-référencer à la main les projets ap.Engine, ap.Classic,
ap.Department et ap.Devel dans le projet ap.Framework (pas sûr)
* Une fois terminé, faire clic-droit, Convertir en application Web sur les
projets ap.Engine, ap.Classic, ap.Department et ap.Devel
* A la fin, on se retrouve avec des fichiers *.ascx.designer.cs en plus
(suite à Convertir en application Web)

Deuxième bon point : depuis la mise au point de ApCopy.bat, c'est
devenu très facile de copier la solution de pi vers az et donc de faire des
tests aussi souvent que je veux.

Une fois que ces premiers tests seront OK, cela devrait être suffisant pour
passer en production certains des petits sites sous ASP.NET 2. Puis si tout se
passe bien, il sera alors possible de tout migrer en ASP.NET 2.

Dans un second temps, et pour aller plus loin qu'une simple compilation sous
.NET 2, il faudra aussi envisager de mettre en place les modifications
suivantes dans le cadres de (ou ça pourrait faire l'objet d'une version 2.1
?)

* Remplacer les DLL compilées en .NET 1 par leur équivalent en .NET 2
  - Ajax.dll
  - Altrr.Services.dll
  - GoogleSearchEngine.dll
  - MySql.Data.dll (et donc ICSharpCode.SharpZipLib.dll)
  - Npgsql.dll (et donc Mono.Security.dll)
* Utiliser les nouveautés du .NET 2 :
  - les providers de ADO.NET 2 => revoir le fonctionnementdu BDHelper
  - les classes génériques
  - les méthodes d'extensions
  - etc...

## Les premières tentatives

Après les tous premiers essais de migration qui furent un peu difficile, la
situation est maintenant pas mal rodée pour finaliser la mise à jour du code
avant d'attaquer les tests.

Troisième bon point : désormais la compilation des sources de
Altrr-Press sous Visual Studio 2005 ne génère plus que 47 avertissements. Et il
me suffit de quelques modifications très simples pour ramener ce nombre à
13.

### Page_Load() ne s'éxécute plus (pas signalé !!!)

C'est un problème critique parce que sans ça Altrr-Press ne fonctionne pas
du tout puisque c'est dans le Page_Load() de default.aspx.cs que sont chargées
toutes les boites de contenu. Et ce qui est très ennuyeur, c'est que ce n'est
pas signalé à la conversion et que ça ne génère pas d'erreur de compilation ou
d'exécution.

Par conséquent, la première chose à faire une fois que la conversion est
terminée, c'est de penser à aller modifier la méthode InitializeComponent() de
/default.aspx.cs pour y ajouter manuellement la ligne suivante :

```
this.Load += new System.EventHandler(this.Page_Load);
```

Je suppose que ce problème doit être dû au fait qu'il existe des fichiers
default.aspx au niveau des chartes graphiques et que ceux-ci héritent de
/default.aspx.cs, ce qui doit pertuber le convertisseur (c'est pas Microsoft
qui n'est pas doué, c'est moi qui suis [trop tordu](http://www.dailymotion.com/video/x1a9w5_cest-etudie-pour_fun)
pour eux).

### ConfigurationSettings n'existe plus (29 avertissements)

* il suffit de faire un remplacer dans tous les fichiers de
ConfigurationSettings.AppSettings par ConfigurationManager.AppSettings
* Mais pour que ça marche, il faut aussi ajouter System.configuration aux
références des projets ap.Engine, ap.Department et ap.Devel
* Dans ap.Department, cela ne semble servir que pour DIR_levelOne (30 par
défaut) et DIR_levelTwo (75 par défaut) qui en fait sont rarement paramétrés
autrement => modifié ap.Department pour renvoyer des constantes et ne plus
avoir besoin de ConfigurationSettings

### Instancier une Hashtable (1 avertissement)

C# 2 n'aime pas que j'utilise :

```
Hashtable h = new Hashtable(CaseInsensitiveHashCodeProvider.Default, CaseInsensitiveComparer.Default);
```

Pour faciliter la migration (et éviter l'éparpillement), j'ai ajouté une
méthode Common.NewHashtable() qui se contente de renvoyer un nouvel objet
Hashtable. Sous Visual Studio 2005, il suffit de modifier cette méthode pour
renvoyer un truc comme

```
new Hashtable(StringComparer.InvariantCultureIgnoreCase);
```

Peut-être même qu'un simple new Hashtable() serait suffisant => il faudra
tester.

De toute façon, dans un second temps l'utilisation des Hashtables devrait
être avantageusement remplacée par des classes génériques.

### Blocs de scripts clients (4 avertissements)

En gros, il n'existe plus Page.RegisterClientScriptBlock(...) et autres et
il faut maintenant utiliser
Page.ClientScript.RegisterClientScriptBlock(Page.GetType(), ...)

Donc là aussi, ajout des deux méthodes Common.RegisterClientScript() et
Common.RegisterStartupScript() pour éviter l'éparpillement et faciliter la
migration vers .NET 2 de façon à ne faire le remplacement qu'à un endroit.

### Envois de méls (10 avertissements)

Comme System.Web.Mail n'est plus en odeur de sainteté, il faut maintenant
utiliser System.Net.Mail à la place puis faire toutes les modifications qui en
découlent. Normalement, cela devrait simplement consister à réécrire la méthode
sendMail de la classe Email (ça c'est pas compliqué) et re-tester que ça marche
encore dans tous les cas (ouille!).

Pour l'instant, pour faciliter les essais entre .NET 1 et .NET 2, je reste
avec System.Web.Mail => il y toujours 10 avertissements.

### Problèmes XML (3 avertissements)

'System.Web.UI.WebControls.Xml.Document' est obsolète : 'The
recommended alternative is the XPathNavigator property. Create a
System.Xml.XPath.XPathDocument and call CreateNavigator() to create an
XPathNavigator. http://go.microsoft.com/fwlink/?linkid=14202

'System.Xml.Xsl.XslTransform' est obsolète : 'This class has been
deprecated. Please use System.Xml.Xsl.XslCompiledTransform instead.
http://go.microsoft.com/fwlink/?linkid=14202

Maintenant que je me remet à faire du XML, il faudra bien que je trouve une
solution. Mais en attendant, il faut encore supporter les 3 avertissements que
cela génère.

## Ce que ça apporte

Pour l'instant, pas grand chose à part du boulot en plus et un
ralentissement perceptible dû au fait de travailler sous VS 2005 au lieu de VS
2003.

Autre problème : quand je teste les temps de génération des fichiers
statiques de PI, c'est quasiment 10% plus lent sous .Net 2 que sous .NET 1
:(

Sur mon portable, les chronométrages donnent les résultats
suivants :

1° test : après compilation et avec Explorer, DOS, IE, FF, VS2003,
VS2005... en mémoire

* ASP.NET 2 (sous IE) : 15:01:09 -&gt; 15:12:34 => 11 minutes 25
secondes
* ASP.NET 1 (sous FF) : 15:18:03 -&gt; 15:30:44 => 12 minutes 41
secondes

2° test : avec seulement IE en mémoire

* ASP.NET 2 (sous IE) : 15:35:56 -&gt; 15:47:08 => 11 minutes 12
secondes
* ASP.NET 1 (sous IE) : 15:50:07 -&gt; 16:00:31 => 10 minutes 24
secondes

3° test : au repos, avec seulement IE en mémoire

* ASP.NET 2 (sous IE) : 16:06:58 -&gt; 16:18:01 => 11 minutes 03
secondes
* ASP.NET 1 (sous IE) : 17:35:53 -&gt; 17:46:00 => 10 minutes 07
secondes

Pour l'instant, je vais mettre tout ça sur le compte du portable et
considérer qu'il n'est pas correctement dimensionné pour travailler avec le
.NET 2.

Et si je trouve le temps, j'essaierai de faire un nouveau chronométrage sur
un PC un peu plus récent.

## Est-ce que ça marche ?

Ca dépend.

En ce qui concerne les fichiers statiques générés par PI, une comparaison
avec [WinMerge](http://winmerge.org/) de tous les fichiers produits
par la version ASP.NET 1 et ceux issus de la version ASP.NET 2 montre qu'il n'y
a pas de différence. Donc, la migration ne va rien casser de ce côté là.

Pour être vraiment complet et vérifier que tout est bon, j'ai aussi fait un
petit programme pour lire toutes les pages du site sous ASP.NET 1 et les
enregistrer sur le disque dur. Puis pareil avec le site sous ASP.NET 2 avant de
lancer une comparaison entre les deux résultats obtenus. Et c'est là que ça
coince un peu. J'obtiens presque toujours des contenus identiques pour les deux
versions, sauf quand il y a des formulaires dans la page.

Il y a un premier problème avec ma technique pour [
éviter le double-clic]({% post_url 2005-12-14-comment-resoudre-probleme-double-clic-aspnet %}) en validation de saisie. Normalement, je remplace
l'évènement onclick du bouton de validation :

```
onclick="if (typeof(Page_ClientValidate) == 'function') Page_ClientValidate();"
```

par:

```
onclick="this.style.display='none';if (typeof(Page_ClientValidate) == 'function') Page_ClientValidate();"
```

Apparement, sous ASP.NET 2 il n'y a plus :

```
onclick="if (typeof(Page_ClientValidate) == 'function') Page_ClientValidate();"
```

mais :

```
onclick="javascript:WebForm_DoPostBackWithOptions(new WebForm_PostBackOptions("_ctl1:btnSend", "", true, "", "", false, false))"
```

Et j'ai un second problème avec les améliorations que j'apporte au html
généré par ASP.NET pour en faire du code XHTML plus présentable :

* Insertion de la balise input hidden générée pour le ViewState dans une
balise div (validation XHTML)
* Déplacement du viewState en fin de page ([pour
amélioration SEO](http://www.hanselman.com/blog/CommentView.aspx?guid=91073711-983c-4aa5-9fa2-40cd185769a9))

Donc, pour l'instant, après déjà pas mal de boulot, si je souhaite atteindre
le minimum pour mettre en production une version sous ASP.NET 2, je dois
encore :

* remplacer ma procédure Email.sendMail() par une version à base de
System.Net.Mail
* ne plus utiliser System.Web.UI.WebControls.Xml.Document et
System.Xml.Xsl.XslTransform
* espérer que sur un vrai serveur ASP.NET 2 sera au moins aussi rapide que
ASP.NET 1
* résoudre mes problèmes de formulaires (priorité 1)
* puis tester que tout ça marche correctement.

C'est pas gagné, mais y'a de l'espoir...
