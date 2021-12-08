---
date: 2009-11-13 11:15:00
layout: post
redirect_from: "post/2009/11/13/Portage-du-tutoriel-Contact-Manager-sous-LINQ-to-SQL"
tags: linq, mvc, sql
title: "Portage du tutoriel Contact Manager sous LINQ to SQL"
---

Encouragé par un premier succès pour faire [passer le tutoriel ContactManager en tout jQuery]({% post_url 2009-11-03-gestion-contacts-aspnetmvc-jquery %}), j'ai décidé
de continuer ma formation ASP.NET MVC en modifiant l'application ContactManager
pour remplacer Entity Framework par LINQ to SQL.

## Création du modèle LINQ to SQL

Après un ou deux essais, j'ai vu que le plus pratique était de commencer par
exclure ou supprimer du projet tout ce qui touchait à Entity Framework, à
savoir ContactManagerModel.edmx et EntityContactManagerRepository.cs. Il
devient alors possible d'ajouter un modèle LINQ to SQL au projet pour
représenter la base de données, sans que cela provoque des définitions en
double avec les objets générés par Entity Framework.

L'ajout d'un modèle LINQ to SQL est plutôt simple :

* se placer dans le dossier Models de l'explorateur de solution
* faire un clic droit pour sélectionner la commande "New items..."
* dans la catégorie "Data", choisir le modèle "LINQ to SQL Classes"
* le nommer "ContactManagerModel.dbml" et cliquer sur le bouton "Add" pour le
créer

Le concepteur LINQ to SQL est alors automatiquement ouvert et il est
possible d'y faire glisser les deux tables "Contacts" et "Groups" depuis
l'explorateur de base de données, ce qui a pour effet de :

* créer les classes "Contact" et "Group" basées sur ces deux tables
* ajouter une propriété "Group" à la classe "Contact" pour refléter le côté
"1" de la relation entre les deux tables
* ajouter une propriété "Contacts" à la classe "Group" pour refléter le côté
"N" de la relation entre les deux tables

Cela génère aussi une classe ContactManagerModelDataContext.cs qui fourni
deux propriétés "Contacts" et "Groups" permettant de gérer des objets "Contact"
et "Group" issus de la base de données.

Concrètement, cette première étape a eu pour résultat de substituer
ContactManagerModel.dbml à ContactManagerModel.edmx.

## Création d'un Repository basé sur LINQ to SQL

Cette seconde étape va consister à remplacer
EntityContactManagerRepository.cs par une classe L2SContactManagerRepository.cs
qui implémente elle aussi l'interface IContactManagerRepository. Et au lieu
d'utiliser un objet ContactManagerDBEntities, cette nouvelle classe va utiliser
un objet ContactManagerModelDataContext.

```
using System.Collections.Generic;
using System.Linq;

namespace ContactManager.Models
{
    public class L2SContactManagerRepository : IContactManagerRepository
    {
        private ContactManagerModelDataContext _context = new ContactManagerModelDataContext();

        ...
    }
}
```

Il reste alors à implémenter les différentes méthodes déclarées dans
l'interface IContactManagerRepository, mais à la sauce LINQ to SQL. Par rapport
au repository basé sur Entity Framework, les différences sont finalement assez
mineures.

* Les objets _entities.ContactSet et _entities.GroupSet deviennent des objets
_context.Contacts et _context.Groups :

```
// ---------- Entity Framework
public IEnumerable<Group> ListGroups()
{
    return _entities.GroupSet.OrderBy(o => o.Name).ToList();
}

// ---------- LINQ to SQL
public IEnumerable<Group> ListGroups()
{
    return _context.Groups.OrderBy(o => o.Name).ToList();
}
```

* Les méthodes pour la mise à jour des données ont des noms différents :
AddToXxxxxxSet() devient InsertOnSubmit(), DeleteObject() devient
DeleteOnSubmit() et SaveChanges() devient SubmitChanges() :

```
// ---------- Entity Framework
public Group CreateGroup(Group groupToCreate)
{
    _entities.AddToGroupSet(groupToCreate);
    _entities.SaveChanges();
    return groupToCreate;
}

// ---------- LINQ to SQL
public Group CreateGroup(Group groupToCreate)
{
    _context.Groups.InsertOnSubmit(groupToCreate);
    _context.SubmitChanges();
    return groupToCreate;
}
```

* La méthode ApplyPropertyChanges() de Entity Framework n'ayant apparemment
pas d'équivalent en LINQ to SQL, et le helper UpdateModel() étant lié à la
classe Controller, je me suis pour l'instant contenté d'une mise à jour des
propriétés à la main pour retrouver la même fonctionnalité :

```
// ---------- Entity Framework
public Contact EditContact(int groupId, Contact contactToEdit)
{
    // Get original contact
    var originalContact = GetContact(contactToEdit.Id);

    // Update with new group
    originalContact.Group = GetGroup(groupId);

    // Save changes
    _entities.ApplyPropertyChanges(originalContact.EntityKey.EntitySetName, contactToEdit);
    _entities.SaveChanges();
    return contactToEdit;
}

// ---------- LINQ to SQL
public Contact EditContact(int groupId, Contact contactToEdit)
{
    // Get original contact
    var originalContact = GetContact(contactToEdit.Id);

    // Update with new group
    originalContact.Group = GetGroup(groupId);

    // Update properties
    originalContact.FirstName = contactToEdit.FirstName;
    originalContact.LastName = contactToEdit.LastName;
    originalContact.Phone = contactToEdit.Phone;
    originalContact.Email = contactToEdit.Email;

    // Save changes
    _context.SubmitChanges();
    return contactToEdit;
}
```

Malgré tout, il y a une autre "grosse" différence dans la mesure où avec
Entity Framework on utilise la méthode Include(relation) dans la requête LINQ
pour retrouver les objets associés à l'élément sur lequel on effectue la
requête.

Concrètement, cela a pour effet de générer une jointure lors de l'exécution
de la requête LINQ.

* Sans le Include(relation) :

```
return (from c in _entities.ContactSet
        where c.Id == id
        select c).FirstOrDefault();

=>  SELECT 1 AS [C1],
                [Extent1].[Id] AS [Id],
                [Extent1].[FirstName] AS [FirstName],
                [Extent1].[LastName] AS [LastName],
                [Extent1].[Phone] AS [Phone],
                [Extent1].[Email] AS [Email],
                [Extent1].[groupId] AS [groupId]
        FROM [dbo].[Contacts] AS [Extent1]
        WHERE [Extent1].[Id] = @p__linq__1
```

* Avec le Include(relation) :

```
return (from c in _entities.ContactSet.Include("Group")
        where c.Id == id
        select c).FirstOrDefault();

=> SELECT 1 AS [C1],
                [Extent1].[Id] AS [Id],
                [Extent1].[FirstName] AS [FirstName],
                [Extent1].[LastName] AS [LastName],
                [Extent1].[Phone] AS [Phone],
                [Extent1].[Email] AS [Email],
                [Extent2].[Id] AS [Id1],
                [Extent2].[Name] AS [Name]
        FROM  [dbo].[Contacts] AS [Extent1]
        LEFT OUTER JOIN [dbo].[Groups] AS [Extent2] ON [Extent1].[groupId] = [Extent2].[Id]
        WHERE [Extent1].[Id] = @p__linq__1
```

Là aussi, je n'ai pas réussi à trouver d'équivalent pour LINQ to SQL,
d'autant que dans ce cas je n'ai pas cherché avec beaucoup d'acharnement
puisque l'application fonctionne parfaitement même si on s'en passe...

```
// ---------- Entity Framework
public Contact GetContact(int id)
{
    return (from c in _entities.ContactSet.Include("Group")
            where c.Id == id
            select c).FirstOrDefault();
}

// ---------- LINQ to SQL
public Contact GetContact(int id)
{
    return (from c in _context.Contacts
            where c.Id == id
            select c).FirstOrDefault();
}
```

## Isoler les tests unitaires de l'ORM

Une fois la classe Repository complètement ré-écrite pour s'appuyer sur LINQ
to SQL et plus Entity Framework, le projet Contact manager compile sans
problème. Encore faut-il penser à modifier la couche de service pour instancier
un objet IContactManagerRepository à partir de
L2SContactManagerRepository :

```
public ContactManagerService(IValidationDictionary validationDictionary)
    : this(validationDictionary, new L2SContactManagerRepository())
{
}
```

Par contre, la compilation de la solution provoque une erreur parce que les
tests unitaires font appel à la méthode CreateContact() de la classe Contact.
Apparemment, Entity Framework génère automatiquement une méthode
CreateContact() pour ses objets, alors que LINQ to SQL n'en fait
rien !

Cela met en évidence deux problèmes :

* chez Microsoft, ils sont si peu [opiniated](http://gettingreal.37signals.com/ch04_Make_Opinionated_Software.php "Make Opinionated Software") qu'ils partent dans tous
les sens
* les tests unitaires du Contact Manager sont fortement liés à l'ORM Entity
Framework et ça, c'est [pas
bon du tout](http://jeffreypalermo.com/blog/making-it-easy-to-replace-nhibernate-in-five-years/ "Making it easy to replace NHibernate in five years ")

Dans un premier temps, j'ai tout simplement piraté la méthode
CreateContact() générée par Entity Framework et ajouté une classe partielle
Contact :

```
namespace ContactManager.Models
{
    public partial class Contact
    {
        /// <summary>
        /// Create a new Contact object.
        /// </summary>
        /// <param name="id">Initial value of Id.</param>
        /// <param name="firstName">Initial value of FirstName.</param>
        /// <param name="lastName">Initial value of LastName.</param>
        /// <param name="phone">Initial value of Phone.</param>
        /// <param name="email">Initial value of Email.</param>
        public static Contact CreateContact(int id, string firstName, string lastName, string phone, string email)
        {
            Contact contact = new Contact();
            contact.Id = id;
            contact.FirstName = firstName;
            contact.LastName = lastName;
            contact.Phone = phone;
            contact.Email = email;
            return contact;
        }
    }
}
```

Mais j'ai trouvé ça un peu trop spécifique pour LINQ to SQL (puisque c'est
redondant avec le code généré par Entity Framework) et j'ai finalement préféré
ajouter une méthode CreateContact() utilisant la syntaxe "Object initializers"
à la classe ContactManagerServiceTest des tests unitaires :

```
private Contact CreateContact(int id, string firstName, string lastName, string phone, string email)
{
    Contact contact = new Contact() { Id = id, FirstName = firstName, LastName = lastName, Phone = phone, Email = email };
    return contact;
}
```

Puis remplacer les appels à Contact.CreateContact() dans
ContactManagerServiceTest.cs par de simples appels à CreateContact().

Une fois cette dernière modification réalisée, la solution compile sans
erreur, les tests unitaires continuent à être OK et l'application fonctionne
sans problème. Je peux :

* lister les contacts rattachés à un groupe,
* ajouter, modifier ou supprimer un contact,
* ajouter ou supprimer un groupe de contacts.

## Conclusion

Suite à mes différents essais avec les tutoriels ContactManager et
NerdDinner, j'avais eu le pressentiment que cette notion de repository et de
service pouvait rendre une application indépendante de la façon d'implémenter
l'accès à la base de données.

La réalisation de ce petit exercice m'a permis de vérifier cette impression
puisque hormis une ligne de la couche service, seule la classe Repository a été
mise à jour. Par conséquent, si on fait les choses comme il faut, on ne se
retrouve pas lié corps et âme à un ORM mais au contraire complètement libre
d'en changer dans le cas où il ne serait pas satisfaisant.

[Dans la pratique]({% post_url 2009-10-08-tuer-code-reussir %} "Tuer du code pour réussir"), cela veut
dire qu'il ne faut pas se focaliser sur des détails techniques mais sur des
problèmes réels. Et notamment décider si on conserve une base de données
<s>pourrie</s> pléthorique et mal conçue ou si on fait table rase des
errements du passé pour construire une vrai base de données et de vrais objets
adaptés uniquement à nos [besoins actuels](http://en.wikipedia.org/wiki/You_ain't_gonna_need_it "You ain't gonna need it").
