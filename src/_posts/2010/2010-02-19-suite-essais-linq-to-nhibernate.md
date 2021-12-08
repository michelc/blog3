---
date: 2010-02-19 08:55:00
layout: post
redirect_from: "post/2010/02/19/suite-essais-linq-to-nhibernate"
tags: linq, nhibernate
title: "Suite des essais LINQ to NHibernate"
---

Cette fois-ci je vais me contenter de refaire le même genre de tests que
lors de mes [premiers essais avec LINQ to NHibernate]({% post_url 2010-02-17-premiers-essais-linq-to-nhibernate %}) d'hier. Mais
aujourd'hui, au lieu de partir d'un contact pour accéder au groupe auquel il
est lié, je vais explorer l'autre côté de la relation entre les deux tables et
partir d'un groupe puis accéder aux contacts qui lui sont rattachés.

## Essai numéro 1

Je commence doucement avec une requête LINQ toute simple :

```
var linq1 = (from g in _session.Linq<Group>()
             where g.Id == id
             select g).FirstOrDefault();
```

Sans trop de surprise (maintenant que j'ai quelques essais au compteur),
NHibernate génère la requête SQL suivante :

```
SELECT top 1
       this_.Id as Id0_0_,
       this_.Name as Name0_0_
FROM   Groups this_
WHERE  this_.Id = @p0; // @p0 = 1
```

Puis j'essaie d'accéder à la propriété Contacts de l'objet Group que vient
de renvoyer la première requête LINQ :

```
int count = linq1.Contacts.Count();
```

NHibernate génère alors une seconde requête SQL afin de charger la liste des
contacts associés au groupe :

```
SELECT contacts0_.groupId as groupId1_,
       contacts0_.Id as Id1_,
       contacts0_.Id as Id1_0_,
       contacts0_.FirstName as FirstName1_0_,
       contacts0_.LastName as LastName1_0_,
       contacts0_.Phone as Phone1_0_,
       contacts0_.Email as Email1_0_,
       contacts0_.groupId as groupId1_0_
FROM   Contacts contacts0_
WHERE  contacts0_.groupId=@p0; // @p0 = 1
```

Jusqu'ici, c'est tout pareil par rapport aux résultats que que j'avais
obtenus au cours de mon premier essai dans l'autre sens.

## Essai numéro 2

Comme lors de mes premiers tests, ce deuxième essai va consister à utiliser
la méthode Extend("Entité") pour vérifier que cela fonctionne à peu près de la
même façon que pour aller du contact vers le groupe. Ce qui me donne donc la
requête LINQ suivante :

```
var linq2 = (from g in _session.Linq<Group>().Expand("Contacts")
             where g.Id == id
             select g).FirstOrDefault();
```

Et comme je pouvais presque m'y attendre, cela a eu pour effet de faire
apparaitre une jointure avec la table Contacts dans la requête SQL qui est
générée par NHibernate :

```
SELECT top 1
       this_.Id as Id0_1_,
       this_.Name as Name0_1_,
       contacts2_.groupId as groupId3_,
       contacts2_.Id as Id3_,
       contacts2_.Id as Id1_0_,
       contacts2_.FirstName as FirstName1_0_,
       contacts2_.LastName as LastName1_0_,
       contacts2_.Phone as Phone1_0_,
       contacts2_.Email as Email1_0_,
       contacts2_.groupId as groupId1_0_
FROM   Groups this_
       left outer join Contacts contacts2_ on this_.Id=contacts2_.groupId
WHERE  this_.Id = @p0; // @p0 = 1
```

Et comme hier, le fait d'accéder à la liste des contacts de l'objet Group
renvoyé n'a pas d'impact et NHibernate ne génère pas une nouvelle requête
SQL :

```
int count2 = linq2.Contacts.Count();
```

Jusqu'ici, tout va toujours bien puisque NHibernate se comporte toujours
rigoureusement de la même façon dans les deux sens de la relation.

## Interlude

Pour rester le plus synchro possible avec mon billet précédent, voici le
fichier de mapping NHibernate que j'ai défini pour les groupes :

```
<?xml version="1.0" encoding="utf-8" ?>
<hibernate-mapping xmlns="urn:nhibernate-mapping-2.2" namespace="ContactManager.Models" assembly="ContactManager">

  <class name="Group" table="Groups" dynamic-update="true">

    <cache usage="read-write" />

    <id name="Id" column="Id" type="integer">
      <generator class="identity" />
    </id>
    <property name="Name" type="string" />
    <bag
        name="Contacts"
        inverse="true"
        lazy="true">
      <key column="groupId" />
      <one-to-many class="Contact" />
    </bag>

  </class>

 </hibernate-mapping>
```

Comme dans le fichier Contact.hbm.xml d'hier, ce fichier de mapping spécifie
également la relation qui existe entre les tables Groups et Contacts. Par
rapport à la simple balise `<many-to-one ... />` d'hier, il
faut utiliser un élément `<bag ... />` pour représenter le
fait qu'à un groupe sont liés plusieurs contacts.

## Essai numéro 3

Dans le fichier de mapping Group.hbm.xml, le fait que je fasse du
lazy-loading est pour l'instant défini de façon explicite grâce à l'attribut
`lazy="false"`. Par conséquent, si je souhaite maintenant ne plus
faire de lazy-loading, il est donc nécessaire que je modifie le mapping
NHibernate de la façon suivante :

```
...
    <bag
        name="Contacts"
        inverse="true"
        lazy="false">
      <key column="groupId" />
      <one-to-many class="Contact" />
    </bag>
...
```

Et désormais, si je reprend la même requête LINQ qu'au début de ce
billet :

```
var linq3 = (from g in _session.Linq<Group>()
             where g.Id == id
             select g).FirstOrDefault();
```

Lorsque je l'exécute, je peux voir que NHibernate a cette fois-ci généré 2
requêtes SQL différentes. La première sert pour charger les informations du
groupe et la seconde permet de charger les données correspondantes aux contacts
qui sont rattachés au groupe :

```
SELECT top 1
       this_.Id as Id0_0_,
       this_.Name as Name0_0_
FROM   Groups this_
WHERE  this_.Id = @p0; // @p0 = 1

SELECT contacts0_.groupId as groupId1_,
       contacts0_.Id as Id1_,
       contacts0_.Id as Id1_0_,
       contacts0_.FirstName as FirstName1_0_,
       contacts0_.LastName as LastName1_0_,
       contacts0_.Phone as Phone1_0_,
       contacts0_.Email as Email1_0_,
       contacts0_.groupId as groupId1_0_
FROM   Contacts contacts0_
WHERE  contacts0_.groupId=@p0; // @p0 = 1
```

## Deuxième bilan

Ce qui est vraiment bien, c'est que ça fonctionne exactement de la même
façon dans les deux sens ! Et donc normalement, une fois que je serai un
peu mieux rodé à l'utilisation de NHibernate et de LINQ to NHibernate, je
devrais grosso-modo réussir à prévoir ce qui va se passer sans trop de
problème.

Par contre, j'ai encore pas mal de difficultés en ce qui concerne le
mapping. Pour l'instant je fais surtout du copié / collé de différents trucs
trouvés sur internet (dont le tutoriel [Utiliser ASP.NET MVC et NHibernate]({% post_url 2010-01-29-utiliser-aspnetmvc-nhibernate-1 %})) => je ne sais pas trop
(et je me demande) s'il est nécessaire / obligatoire / conseillé de définir la
relation dans les deux fichiers de mapping ou si on peut se contenter de faire
ça d'un seul côté (c'est à dire dans un seul fichier de mapping). C'est
d'ailleurs peut-être à ça que sert l'attribut
`inverse="true"` ? => Encore pas mal trucs à creuser pour
plus tard...
