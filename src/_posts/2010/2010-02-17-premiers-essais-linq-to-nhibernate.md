---
date: 2010-02-17 15:44:00
layout: post
redirect_from: "post/2010/02/17/premiers-essais-linq-to-nhibernate"
tags: linq, nhibernate
title: "Premiers essais avec LINQ to NHibernate"
---

Etant donné que je débute avec NHibernate et LINQ to NHibernate, j'ai fait
quelques essais pour comprendre ce qui se passe côté SQL quand je fais telle ou
telle requête LINQ.

## Essai numéro 1

Quand je fais la requête LINQ suivante :

```
var linq1 = (from c in _session.Linq<Contact>()
            where c.Id == id
            select c).FirstOrDefault();
```

NHibernate génère la requête SQL ci-dessous :

```
SELECT top 1
       this_.Id as Id1_0_,
       this_.FirstName as FirstName1_0_,
       this_.LastName as LastName1_0_,
       this_.Phone as Phone1_0_,
       this_.Email as Email1_0_,
       this_.groupId as groupId1_0_
FROM   Contacts this_
WHERE  this_.Id = @p0; // @p0 = 13
```

Ensuite, lorsque j'accède à une propriété liée de l'objet Contact qui a été
retourné par la requête LINQ :

```
string NomGroupe = linq1.Group.Name;
```

Alors NHibernate va générer une seconde requête SQL pour charger l'objet
Group associé au contact :

```
SELECT group0_.Id as Id0_0_,
       group0_.Name as Name0_0_
FROM   Groups group0_
WHERE  group0_.Id=@p0; // @p0 = 1
```

## Essai numéro 2

Après quelques recherches, j'ai trouvé qu'il était possible de reproduire la
méthode Include("Entité") de ADO.NET Entity Framework en utilisant la méthode
Expand(). Cela me permet donc d'écrire ma requête LINQ de la façon
suivante :

```
var linq2 = (from c in _session.Linq<Contact>().Expand("Group")
            where c.Id == id
            select c).FirstOrDefault();
```

Et dans ce cas, NHibernate insère automatiquement une jointure avec la table
Groups dans la requête SQL qu'il génère :

```
SELECT top 1
       this_.Id as Id1_1_,
       this_.FirstName as FirstName1_1_,
       this_.LastName as LastName1_1_,
       this_.Phone as Phone1_1_,
       this_.Email as Email1_1_,
       this_.groupId as groupId1_1_,
       group2_.Id as Id0_0_,
       group2_.Name as Name0_0_
FROM   Contacts this_
       inner join Groups group2_ on this_.groupId=group2_.Id
WHERE  this_.Id = @p0; // @p0 = 13
```

Comme je suis d'un naturel méfiant, je suis allé jusqu'à vérifier ce qui se
passait quand j'accédais à la propriété Group de l'objet Contact :

```
string NomGroupe2 = linq2.Group.Name;
```

Et fort heureusement il ne se passe rien et NHibernate ne génère pas de
requête SQL supplémentaire.

## Interlude

OK. Mais NHibernate ça ne peut pas être aussi simple que ça et il y des tas
de trucs à prendre en compte. Jusqu'à maintenant, j'ai fait mes deux essais
avec le fichier de mapping suivant pour les contacts :

```
<?xml version="1.0" encoding="utf-8" ?>
<hibernate-mapping xmlns="urn:nhibernate-mapping-2.2" namespace="ContactManager.Models" assembly="ContactManager">

  <class name="Contact" table="Contacts" dynamic-update="true">

    <cache usage="read-write" />

    <id name="Id" column="Id" type="integer">
      <generator class="identity" />
    </id>
    <property name="FirstName" type="string" />
    <property name="LastName" type="string" />
    <property name="Phone" type="string" />
    <property name="Email" type="string" />
    <many-to-one name="Group" column="groupId" not-null="true" />

  </class>

</hibernate-mapping>
```

Dans ce fichier, il y a une ligne `<many-to-one name="Group"
column="groupId" not-null="true" />` qui sert à définir la relation
entre les tables Contacts et Groups :

* 1 contact appartient à 1 groupe
* 1 groupe peut contenir 0 à N contact(s)

Par défaut, cette relation "fonctionne" en mode lazy-loading, ce qui
signifie que le groupe ne sera chargé que lorsqu'on en aura réellement besoin.
Et au vu de mes deux premiers essais, je ne peux qu'être satisfait puisque
c'est exactement comme cela que ça s'est passé.

## Essai numéro 3

Et maintenant, supposons que je ne veuille plus faire de lazy-loading ?
Pour commencer, je dois ajouter `lazy="false"` à mon fichier de
mapping :

```
...
    <many-to-one name="Group" column="groupId" not-null="true" lazy="false" />
...
```

Et ce coup-ci, quand je refais la même requête LINQ que lors de mon premier
essai :

```
var linq3 = (from c in _session.Linq<Contact>()
            where c.Id == id
            select c).FirstOrDefault();
```

Je peux constater que NHibernate a généré directement les 2 requêtes SQL
suivantes :

```
SELECT top 1
       this_.Id as Id1_0_,
       this_.FirstName as FirstName1_0_,
       this_.LastName as LastName1_0_,
       this_.Phone as Phone1_0_,
       this_.Email as Email1_0_,
       this_.groupId as groupId1_0_
FROM   Contacts this_
WHERE  this_.Id = @p0; // @p0 = 13

SELECT group0_.Id as Id0_0_,
       group0_.Name as Name0_0_
FROM   Groups group0_
WHERE  group0_.Id=@p0; // @p0 = 1
```

Par acquit de conscience j'ai re-vérifié mon premier essai sans
`lazy="false"`. Pas de problème : NHibernate ne génère bien que
la 1° requête SQL si je me contente de faire la requête LINQ et que je ne
cherche pas à accéder à l'objet Group.

## Premier bilan

Au moins, ça commence à être un peu plus clair pour ce côté de la relation.
Si tout va bien, je ferais plus tard quelques essais supplémentaires pour
étudier comment ça se passe dans le cas où je pars d'un groupe et que j'accède
ensuite à ses contacts.

J'ai pas trainé : la suite de mes [essais avec LINQ to NHibernate]({% post_url 2010-02-19-suite-essais-linq-to-nhibernate %}) !
