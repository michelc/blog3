---
date: 2010-03-23 13:05:00
layout: post
redirect_from: "post/2010/03/23/porter-contact-manager-sous-nhibernate"
tags: mvc, nhibernate
title: "Porter Contact Manager sous NHibernate"
---

Après avoir fait quelques essais très basiques avec NHibernate, j'ai voulu
essayer d'être plus concret et d'aller un peu plus loin en tentant de porter
l'application Contact Manager sous NHibernate. A priori, ça ne devait pas être
trop compliqué dans la mesure où il y a quelques temps j'avais déjà [remplacé Entity Framework par LINQ to SQL]({% post_url 2009-11-13-portage-tutoriel-contact-manager-linq-to-sql %}) et que ça ne
s'était pas trop mal passé. Sans compter, que je souhaitais juste faire en
sorte que ça marche à peu près tel quel, sans trop chercher à découvrir ou à
mettre au point la "bonne" façon d'utiliser NHibernate avec ASP.NET MVC.

Dans la pratique, ça m'a pris un peu plus de temps que ce que j'avais pensé
y consacrer. En fait, j'aurais pu faire ce billet depuis un petit moment, mais
avant il fallait que j'arrive à mettre au propre la solution que j'avais
suivie. Parce que c'est là que le bât blesse, c'est qu'avec NHibernate il y a
tout plein de façons de faire et que je n'ai pas réussi à trouver une
documentation "officielle" (et récente) qui décrive clairement quel est l'état
de l'art pour utiliser NHibernate dans le cadre d'une application ASP.NET.

Voici donc parmi tous mes essais (avec des réussites, des ratés et des
abandons) une des façons de faire à laquelle je suis arrivé et qui est assez
"simple" à expliquer. Ca marche correctement, mais je ne peux absolument pas
affirmer que c'est la méthode à suivre.

## Etape 1 : Installer NHibernate

Pour faire simple, le plus pratique est d'aller sur le site de [Castle
ActiveRecord](http://www.castleproject.org/ActiveRecord/) et d'y télécharger la toute dernière version d'Active Record.
Une fois l'archive décompressée, il suffit de créer un répertoire "lib" dans le
répertoire racine de "ContactManager" et d'y copier les quelques fichiers
suivants :

* Iesi.Collections.dll
* Iesi.Collections.xml
* LinFu.DynamicProxy.dll
* log4net.dll
* log4net.xml
* nhibernate-configuration.xsd
* nhibernate-mapping.xsd
* NHibernate.ByteCode.LinFu.dll
* NHibernate.ByteCode.LinFu.xml
* NHibernate.dll
* NHibernate.Linq.dll
* NHibernate.xml

En réalité, je n'utilise pas du tout l'approche Active Record. Mais
l'avantage de passer par leur site c'est qu'on est certain d'avoir DLLs
récentes avec des versions compatibles entre elles. Au cours de mes différents
essais, j'avais récupéré des DLLs au fur et à mesure de mes besoins et d'un
petit peu tous les côtés et ça m'avait joué quelques mauvais tours.

Une fois ces différentes librairies mises en place, il suffit de référencer
les 4 éléments suivants dans l'application ContactManager existante :

* log4net.dll
* NHibernate.dll
* NHibernate.ByteCode.LinFu.dll
* NHibernate.Linq.dll

Et pour bien faire les choses, il faut aussi prendre le temps de
dé-référencer les éléments qui correspondent à Entity Framework et par
conséquent de supprimer les fichiers liés à EF dans le sous-répertoire
Models.

## Etape 2 : Configurer NHibernate

NHibernate est installé et référencé au niveau du projet. Il faut maintenant
le configurer pour lui expliquer qu'on aimerait bien qu'il utilise notre base
de données SQL Server habituelle. Et là commence la galère puisqu'il existe
apparement des tonnes de façon différentes pour faire ça. J'en ai essayé
quelques unes et je n'ai pas vraiment très bien compris quels sont les
avantages et les inconvénients de telle ou telle façon de faire (mais c'est
vrai que j'ai pas trop passé de temps dessus).

Par conséquent, je vais aller au plus simple et donner directement la
méthode que j'ai repérée sur la [vidéo de présentation de NHibernate proposée par TekPub](http://tekpub.com/preview/nhibernate).
C'est juste un extrait, mais ça m'a suffi pour emprunter le source à l'[application Kona de Rob
Conery](http://github.com/robconery/Kona). Cela consiste à créer un fichier "nhibernate.config" à la racine de
l'application ASP.NET MVC pour y définir tous les éléments nécessaires pour
configurer NHibernate :

```
<?xml version="1.0" encoding="utf-8" ?>
<hibernate-configuration xmlns="urn:nhibernate-configuration-2.2">

  <session-factory name="ContactManager">
    <property name="dialect">NHibernate.Dialect.MsSql2008Dialect</property>
    <property name="connection.driver_class">NHibernate.Driver.SqlClientDriver</property>
    <property name="connection.connection_string">server=.\SQLExpress;database=ContactManagerDB;Integrated Security=true;</property>
    <property name="show_sql">true</property>
    <property name="cache.use_query_cache">false</property>
    <property name="adonet.batch_size">16</property>
    <property name="proxyfactory.factory_class">NHibernate.ByteCode.LinFu.ProxyFactoryFactory, NHibernate.ByteCode.LinFu</property>
    <mapping assembly="ContactManager" />
  </session-factory>

</hibernate-configuration>
```

Par rapport à l'écriture de ces informations dans le Web.config, il me
semble que c'est un peu plus clair d'isoler ça dans un fichier à part (sans
compter que ça évite de complexitrifier le fichier Web.config inutilement).
Sinon, il aurait aussi été possible d'utiliser directement le fichier
"hibernate.cfg.xml" standard mais je trouve qu'un fichier ".config" c'est plus
propre (et plus sûr ?) qu'un fichier ".xml".

## Etape 3 : Gérer une session NHibernate

Dans la version Entity Framework de l'application Contact Manager, on
utilise un objet ContactManagerDBEntities généré automatiquement par ADO.NET EF
pour communiquer avec la base de données SQL Server. Dans la version portée
sous LINQ to SQL, c'est un objet ContactManagerModelDataContext qui joue ce
rôle.

En ce qui concerne NHibernate, les communications avec la base de données se
font par l'intermédiaire d'un objet Session. Et là aussi, pour gérer /
instancier cet objet Session, il existe tout plein de façons de faire.

Pour l'instant, je reprend de façon ultra simplifiée la méthode proposée par
Rob Conery parce qu'il est possible de la mettre en oeuvre en très très peu de
lignes au niveau du fichier global.asax.cs :

```
using System;
using System.IO;
using System.Web.Mvc;
using System.Web.Routing;
using NHibernate;
using NHibernate.Cfg;

namespace ContactManager
{

    public class MvcApplication : System.Web.HttpApplication
    {

        public static ISessionFactory SessionFactory = CreateSessionFactory();

        private static ISessionFactory CreateSessionFactory()
        {
            var cfg = new Configuration().Configure(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "nhibernate.config"));
            return cfg.BuildSessionFactory();
        }
```

Grâce à ça, il devient tout simple de remplacer la ligne :

```
private ContactManagerDBEntities _entities = new ContactManagerDBEntities();
```

par l'instruction suivante :

```
private ISession _session = MvcApplication.SessionFactory.GetCurrentSession();
```

## Etape 4 : Faire le mapping entre les tables et les objets

Avec NHibernate, les classes Contact et Group ne sont pas générées
automatiquement comme avec Entity Framework ou LINQ to SQL. Il faut donc créer
à la main des classes POCO (c'est pas le plus compliqué) et il faut également
créer un fichier de mapping XML pour associer chaque classe à la table
correspondante dans la base de données (c'est déjà un peu plus mariole).

Je ne vais pas expliquer comment faire ni entrer dans les détails de comment
ça marche (en plus je n'ai pas encore suffisament bien compris moi-même), mais
voici ce à quoi je suis arrivé après quelques essais.

### Models\Contact.cs

```
namespace ContactManager.Models
{
    public partial class Contact
    {
        public Contact()
        {
            Group = new Group();
        }
        public virtual int Id { get; set; }
        public virtual string FirstName { get; set; }
        public virtual string LastName { get; set; }
        public virtual string Phone { get; set; }
        public virtual string Email { get; set; }
        public virtual Group Group { get; set; }

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

### Mappings\Contact.hbm.xml

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

### Models\Group.cs

```
using System.Collections.Generic;

namespace ContactManager.Models
{
    public class Group
    {
        public Group()
        {
            Contacts = new List<Contact>();
        }
        public virtual int Id { get; set; }
        public virtual string Name { get; set; }
        public virtual IList<Contact> Contacts { get; set; }
    }
}
```

### Mappings\Group.hbm.xml

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

En ce qui concerne les deux fichiers Contact.hbm.xml et Group.hbm.xml, il
faut impérativement modifier leur propriété "Action de génération" au niveau de
l'explorateur de projet pour la définir à "Ressource incorporée" sans quoi le
mapping NHibernate ne fonctionne pas. C'est un problème très facile à
identifier parce qu'on obtient une erreur "Association references unmapped
class: ContactManager.Models.Contact" dès le lancement de l'application.

## Redévelopper le repository avec NHibernate

Après ces 4 premières étapes, tout est enfin prêt pour pouvoir modifier la
couche repository de l'application afin de remplacer Entity Framework par
NHibernate :

* NHibernate est installé et référencé
* NHibernate est configuré pour accéder à la base de données SQL Server
* Un objet NHibernate Session a été défini pour communiquer avec la base de
données
* Les objets données et les fichiers de mapping NHibernate sont en place

Par conséquent, il ne reste plus qu'à implémenter l'interface
IContactManagerRepository en utilisant NHibernate et LINQ to NHibernate pour
remplacer le fichier EntityContactManagerRepository.cs qui l'implémentait pour
Entity Framework.

### Models\NHContactManagerRepository.cs

```
using System.Collections.Generic;
using System.Linq;
using NHibernate;
using NHibernate.Linq;

namespace ContactManager.Models
{
    public class NHContactManagerRepository : IContactManagerRepository
    {
        private ISession _session = ContactManager.MvcApplication.SessionFactory.OpenSession();

        public Contact GetContact(int id)
        {
            return (from c in _session.Linq<Contact>()
                    where c.Id == id
                    select c).FirstOrDefault();
        }

        public Contact CreateContact(int groupId, Contact contactToCreate)
        {
            // Associate group with contact
            contactToCreate.Group = GetGroup(groupId);

            // Save new contact
            _session.SaveOrUpdate(contactToCreate);
            return contactToCreate;
        }

        public Contact EditContact(int groupId, Contact contactToEdit)
        {
            // Associate with new group
            contactToEdit.Group = GetGroup(groupId);

            // Save changes
            _session.SaveOrUpdate(contactToEdit);
            _session.Flush();
            return contactToEdit;
        }

        public void DeleteContact(Contact contactToDelete)
        {
            _session.Delete(contactToDelete);
            _session.Flush();
        }

        public Group CreateGroup(Group groupToCreate)
        {
            _session.SaveOrUpdate(groupToCreate);
            return groupToCreate;
        }

        public IEnumerable<Group> ListGroups()
        {
            return _session.Linq<Group>().OrderBy(o => o.Name).ToList();
        }

        public Group GetFirstGroup()
        {
            return _session.Linq<Group>().FirstOrDefault();
        }

        public Group GetGroup(int id)
        {
            return (from g in _session.Linq<Group>()
                    where g.Id == id
                    select g).FirstOrDefault();
        }

        public void DeleteGroup(Group groupToDelete)
        {
            _session.Delete(groupToDelete);
            _session.Flush();
        }

    }
}
```

Une fois encore, je n'ai pas cherché à faire "bien" mais simplement à ce que
ça marche. Dans la pratique, il vaudrait mieux éviter tous ces
"_session.Flush()" et passer par des transactions et des "using" mais pour
l'instant, ce n'était absolument pas mon objectif.

Pour pouvoir compiler et vérifier que tout fonctionne comme prévu, il reste
encore à modifier le constructeur ContactManagerService pour qu'il utilise ce
repository en lieu et place de celui d'Entity Framework.

```
public ContactManagerService(IValidationDictionary validationDictionary)
    : this(validationDictionary, new NHContactManagerRepository())
{
}
```

Une fois cette ultime modification réalisée, la solution compile sans aucune
erreur et elle m'offre bien les mêmes fonctionnalités que les versions avec
Entity Framework ou LINQ to SQL :

* lister les contacts rattachés à un groupe,
* ajouter, modifier ou supprimer un contact,
* ajouter ou supprimer un groupe de contacts.

Et juste pour le plaisir, je peux lancer les quelques tests unitaires de
ContactManager.Test et tout va bien !

## Conclusion

Par rapport au passage sous LINQ to SQL, ça a été beaucoup plus laborieux.
Le problème, c'est qu'il y a à la fois beaucoup (trop) de façon de faire et
beaucoup (trop) d'informations disponibles ce qui fait qu'il n'est vraiment pas
évident de savoir dans quelle direction partir.

Mais malgré tout, c'est quand même un succès. Il a suffi de changer le
repository (et de recréer les classes Contact et Group générées
automatiquement) pour que l'application ContactManager de base fonctionne
correctement avec NHibernate. C'est donc un nouveau bon point pour le pattern
Repository (zut! juste au moment où j'avais presque envie de me (ré)orienter
vers Active Record). Et avec la prochaine version de Entity Framework qui
devrait être POCO friendly, on peut même supposer que ce sera de plus en plus
facile de passer d'un ORM à l'autre.

Peut-être que plus tard (c'est à dire une fois que je saurai faire),
j'écrirai un autre billet pour présenter une façon d'utiliser Nibernate avec
ASPNET MVC qui soit un peu plus orthodoxe. Mais déjà, j'aimerai très vite
essayer de voir ce que ça donne en changeant la base de données et en testant
cette version de Contactmanager NHibernate avec MySQL ou Oracle.
