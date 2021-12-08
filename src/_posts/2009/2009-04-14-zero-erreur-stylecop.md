---
date: 2009-04-14 13:48:00
layout: post
redirect_from: "post/2009/04/14/Zero-erreur-avec-StyleCop"
tags: csharp
title: "Zéro erreur avec StyleCop"
---

Après une lutte presque acharnée, j'ai enfin réussi à faire passer haut la
main tous les contrôles de [StyleCop](http://code.msdn.microsoft.com/sourceanalysis) à
mon projet BDHelper. Il s'agit du projet qui regroupe tout ce qui concerne
l'accès aux bases de données dans Altrr-Press.

## Un tiers de boulot

Pour en arriver là, j'ai dû commencer par faire beaucoup de modifications à
la main et surtout ajouter des commentaires en pagaille. Personnellement, j'en
met là où cela me parait nécessaire pour comprendre ce qui se passe, mais avec
StyleCop il faut vraiment en mettre de partout !

Un autre truc à faire c'était de remplacer tous les "" par des string.Empty,
en faisant bien attention de ne pas toucher aux "" dans les scripts javascript
sinon c'est tout cassé.

Et pour finir, j'ai dû faire une croix sur les variables locales préfixées
par un "_". Donc, plus de :

```
public string cnxString {
    get {
        return _cnxString;
    }
    set {
        _cnxString = value;
    }
}
private string _cnxString = "";
```

Mais à la place :

```
public string CnxString {
    get {
        return this.cnxString;
    }
    set {
        this.cnxString = value;
    }
}
private string cnxString = string.Empty;
```

## Un tiers d'artistique

Une fois cette première étape réalisée, il ne me restait quasiment plus que
des problèmes de présentation. Grosso modo, il fallait que je trouve un moyen
pour re-formater mon code de ça :

```
public string LastSQL {
    get {
        return this.lastSQL;
    }
    set {
        this.lastSQL = value;
    }
}
```

En ça :

```
public string LastSQL
{
    get
    {
        return this.lastSQL;
    }

    set
    {
        this.lastSQL = value;
    }
}
```

C'est à dire :

* placer les accolades ouvrantes sur une nouvelle ligne,
* faire un saut de ligne après un accolade fermante,
* et ce qui se voit un peu moins, remplacer les tabulations par des
espaces.

Outre le fait que cette façon d'écrire le code est un peu contraire à mes
convictions, ça risquait d'être assez coton de faire ça à la main.

Et c'est là que [Artistic Style](http://astyle.sourceforge.net/) entre en jeu. C'est un petit utilitaire en open source
capable de re-formater les fichiers sources C, C++, C# et Java.

Grace à lui, j'ai pu assez vite obtenir la présentation exigée par StyleCop,
en définissant seulement le paramètre --style=ansi. Celui-ci permet d'appliquer
un formatage du code selon le style pré-défini "ANSI", à savoir :

* les accolades sont placées sur des lignes à part,
* le code est indenté sur 4 espaces (remplacement des tabulations mais aussi
correction des indentations incorrectes),
* les éléments namespace, classe et switch ne sont pas indentés.

Ce qui permet d'obtenir ce style de code :

```
namespace foospace
{
int Foo()
{
    if (isBar)
    {
        bar();
        return 1;
    }
    else
        return 0;
}
}
```

## Un tiers d'expression régulière

Après un passage éclair par Artistic Style, le nombre d'anomalies pour le
projet BDHelper est tombé à seulement 30 avertissements. Déjà, rien que le fait
d'avoir une simple ligne catch {} provoque 4 avertissements :

* Layout rule SA1501 : A C# statement containing opening and closing
curly brackets is written completely on a single line
* Readability rule SA1107 : The C# code contains more than one statement
on a single line
* Spacing rule SA1012 : An opening curly bracket within a C# element is
not spaced correctly
* Spacing rule SA1013 : A closing curly bracket within a C# element is
not spaced correctly

Pour franchir cet ultime pallier, j'ai tout simplement utilisé Visual Studio
et la possibilité qu'il offre de faire des remplacements à base d'expressions
régulières.

Pour traiter les 3 cas où la ligne "catch {}" apparait, j'ai effectué le
remplacement suivant :

* Rechercher : `^{ *}catch \{\}`
* Remplacer par : `\1catch
\1{
\1}`

Après ce premier remplacement, il ne me reste plus que 18 avertissements,
correspondants aux 4 règles suivantes :

* Layout rule SA1505 : An opening curly bracket within a C# element,
statement, or expression is followed by a blank line
* Layout rule SA1506 : An element documentation header above a C#
element is followed by a blank line
* Layout rule SA1508 : A closing curly bracket within a C# element,
statement, or expression is preceded by a blank line
* Layout rule SA1512 : A single-line comment within C# code is followed
by a blank line

Là encore, trois rechercher / remplacer à base d'expressions régulières et
le tour est joué.

Supprimer la ligne vide après un commentaire, qu'il s'agisse d'un commentaire
simple `// xxxx` (SA1512) ou d'un commentaire d'en-tête de la forme `/// xxxx`
(SA1506) :

* Rechercher : `//{.*}`
* Remplacer par : `//\1`

Supprimer la ligne vide après une accolade ouvrante (SA1505) :

* Rechercher : `\{`
* Remplacer par : `{`

Supprimer la ligne vide avant une accolade fermante (SA1508) :

* Rechercher : `\}`
* Remplacer par : `}`

## Et voilà le résultat !

```
------ StyleCop started ------

Pass 1: AssemblyInfo.cs...
Pass 1: BDError.cs...
Pass 1: BDHelper.cs...

---------------------- Done ----------------------

Violation Count: 0
```
