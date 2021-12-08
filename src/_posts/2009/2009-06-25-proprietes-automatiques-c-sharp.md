---
date: 2009-06-25 13:34:00
layout: post
redirect_from: "post/2009/06/25/Les-proprietes-automatiques-du-c-sharp"
tags: csharp
title: "Les propriétés automatiques du c#"
---

Avec le compilateur de C# 3.0, il est possible d'avoir des propriétés
automatiques. En fait, c'est tout simplement une nouvelle façon de déclarer les
propriétés qui permet d'avoir un code source beaucoup plus concis.

Jusqu'à maintenant, quand j'ai besoin de gérer des propriétés dans une
classe en C# 1.1, j'écris plus ou moins le code suivant :

```
private int _Id;
private string _Nom;
private string _Prenom;

public property int Id {
        get { return _Id; }
        set { _Id =  value; }
}

public property string Nom {
        get { return _Nom; }
        set { _Nom = value; }
}

public property string Prenom {
        get { return _Prenom; }
        set { _Prenom = value; }
}
```

Avec Visual Studio 2008 et C# 3.0, tout ça c'est du passé et grâce aux
propriétés automatiques je pourrai à l'avenir ramener ça à 3 lignes de
codes :

```
public property int Id { get; set; }
public property string Nom { get; set; }
public property string Prenom { get; set; }
```

Dans ce cas, c'est le compilateur qui va faire le boulot à ma place (y'a
rien à faire !) et générer peu ou prou tout le code que je tapais auparavant
moi-même.

Par conséquent, si on regarde ça du point de vue du code compilé, ce n'est
pas du tout la même chose que de se contenter de déclarer de simples variables
publiques :

```
public int Id;
public string Nom;
public string Prenom;
```

Ma conversion à l'utilisation de propriétés plutôt que des variables
publiques remonte à tellement longtemps que j'ai un peu oublié pourquoi j'avais
trouvé les propriétés plus mieux que les variables. Ce qui fait qu'aujourd'hui
j'ai un peu de mal à voir ce que ces nouvelles propriétés automatiques
m'apportent réellement de plus que de bêtes variables publiques... (et
apparemment [je ne suis pas le seul](http://stackoverflow.com/questions/174198/c3-0-automatic-properties-why-not-access-the-field-directly/174201))

Ou alors, à la rigueur, ce qui est plus intéressant c'est qu'avec cette
méthode il est possible définir des propriétés en lecture seule (voire en
écriture seule ?), ce que je ne peux pas absolument pas faire avec des
variables. Pour cela, il ne suffit pas d'omettre le "set;" (ça aurait été trop
simple), mais il faut le rendre "private" afin qu'il ne soit pas visible et
donc utilisable en dehors de la classe :

```
public property int Id { get; private set; }    // lecture seule
public property string Nom { get; set; }
public property string Prenom { get; set; }seule
```

Dans ce cas, je peux définir la propriété "Id" dans tout le code source à
l'intérieur de ma classe, et par contre elle n'est pas modifiable par tout le
code en dehors de cette classe.

## Mise à jour après coup

Le fait d'avoir un "set" privé n'est pas limité aux propriétés automatiques.
Cela existe depuis C# 2.0 pour toutes les propriétés. L'avantage c'est que ça
permet d'avoir du code plus homogène dans la mesure où cela permet d'éviter que
le code de la classe utilise dans certains cas les variables privés et dans
d'autres cas les propriétés.

Avec C# 1.1, même si on se forçait à utiliser partout les propriétés à
l'intérieur de la classe, il fallait passer par les variables privées dès qu'on
voulait avoir avoir des propriétés en lecture seules (c'est à dire sans set).
Avec un private set, on peut donc avoir une propriété en lecture seule et
malgré tout l'utiliser en écriture à l'intérieur de la classe.
