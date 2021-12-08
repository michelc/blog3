---
date: 2010-01-29 11:49:00
layout: post
redirect_from: "post/2010/01/29/utiliser-asp-net-mvc-et-nhibernate-1"
tags: mvc, nhibernate
title: "Utiliser ASP.NET MVC et NHibernate (1° partie)"
---

{:.encart}
Ceci est la traduction du billet "[Using ASP.NET MVC and NHibernate (Part 1)](http://forerunnerg34.wordpress.com/2009/11/03/using-asp-net-mvc-and-nhibernate-part-1/)" de César
Intriago.

Dans cet article je vais expliquer comment installer et configurer
NHibernate pour l'utiliser dans une application ASP.NET MVC. Ceci est le
premier article d'une série dans laquelle je montrerai comment installer
NHibernate pour une application .Net.

![Utiliser ASP.NET MVC et NHibernate](/public/2010/asp-net-mvc-nhibernate.jpg)

## NHibernate c'est quoi ?

NHibernate est un outil de mapping Objet-Relationnel (object-relational
mapping ou ORM en anglais) pour .Net qui permet de faire correspondre des
modèles orientés objets avec une base de données. Comme vous le verrez dans cet
article, NHibernate s'occupera de la plupart des tâches relatives à la couche
de persistance. Vous pouvez avoir plus d'informations au sujet de NHibernate à
partir du site consacré à la [communauté NHibernate](http://nhforge.org/).

Vous pouvez [télécharger la dernière version de NHibernate sur
SourceForge](http://sourceforge.net/projects/nhibernate/files/). Les exemples de code dans cet article sont basés sur
NHibernate 2.1.1 (la version la plus récente disponible au moment de la
rédaction de cet article).

## Installer NHibernate

Téléchargez et dézippez NHibernate sur votre ordinateur. Ca y est,
NHibernate est installé.

## Créer le projet ASP.NET MVC

Créez un nouveau projet ASP.NET MVC et **n'oubliez pas de créer un
projet de test**.

Ajoutez deux nouveaux projets de type "Bibliothèque de classe" à votre
solution : **Infrastructure** et **Core** (pour
que tout soit structuré du mieux possible).

Dans le projet Core, ajoutez une référence à l'assemblie
**NHibernate**.

## La base de données

Pour notre exemple, nous allons créer un modèle contenant des
**Posts** (des billets en français) et des
**Categories**. C'est un modèle très simple qui nous aidera à bien
comprendre comment NHibernate fonctionne : un billet (ou post) peut
appartenir à une ou plusieurs catégories et une catégorie peut contenir zéro ou
plus de zéro billets :

![](http://forerunnerg34.files.wordpress.com/2009/11/postscategoriesmodel.png)

Nous allons utiliser SQL Server 2008 Express Edition pour créer notre base
de données, une autre solution étant de créer notre modèle dans Visual Studio
et de demander à NHibernate de créer la base de données pour nous. Mais dans
notre cas, nous allons créer manuellement la base de données.

## Créer le Modèle

L'étape suivante va consister à créer notre modèle qui est une
représentation orientée objet de notre base de données. Pour cela nous allons
utiliser le concepteur de classes de Visual Studio :

![](http://forerunnerg34.files.wordpress.com/2009/11/postscategoriesmodel1.png)

## Les Repository

Un Repository nous permet de créer, sélectionner, modifier et supprimer nos
objets et il est indépendant de la base de données. Pour ce tutoriel, nous
avons besoin de créer deux repositorys : **PostRepository**
et **CategoryRepository**. Tout deux vont implémenter la même
interface présentée ci-dessous :

### IRepository.cs

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Core
{
    public interface IRepository<T>
    {
        void Save(T entity);
        void Update(T entity);
        void Delete(Guid id);
        T GetById(Guid id);
        T GetAll();
    }
}
```

Pour créer nous deux repositorys, nous avons d'abord besoin d'une une classe
helper pour créer une **session NHibernate** sur notre base de
données :

### NHibernateHelper.cs

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NHibernate.Cfg;
using NHibernate;

namespace Core.Domain.Repositories
{

    public class NHibernateHelper
    {
        private static ISessionFactory _sessionFactory;

        private static ISessionFactory SessionFactory
        {
            get
            {
                if (_sessionFactory == null)
                {
                    var configuration = new Configuration();
                    configuration.Configure();
                    _sessionFactory = configuration.BuildSessionFactory();
                }
                return _sessionFactory;
            }
        }

        public static ISession OpenSession()
        {
            return SessionFactory.OpenSession();
        }
    }
}
```

Ensuite, nous pouvons créer les repositorys :

### PostRepository.cs

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Core.Domain.Model;
using NHibernate;
using NHibernate.Criterion;

namespace Core.Domain.Repositories
{
    public class PostRepository: IRepository<Post>
    {
        #region IRepository<Post> Members

        void IRepository<Post>.Save(Post entity)
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                using (ITransaction transaction = session.BeginTransaction())
                {
                    session.Save(entity);
                    transaction.Commit();
                }
            }
        }

        void IRepository<Post>.Update(Post entity)
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                using (ITransaction transaction = session.BeginTransaction())
                {
                    session.Update(entity);
                    transaction.Commit();
                }
            }
        }

        void IRepository<Post>.Delete(Guid id)
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                using (ITransaction transaction = session.BeginTransaction())
                {
                    session.Delete(id);
                    transaction.Commit();
                }
            }
        }

        Post IRepository<Post>.GetById(Guid id)
        {
            using (ISession session = NHibernateHelper.OpenSession())
                return session.CreateCriteria<Post>().Add(Restrictions.Eq("Id", id)).UniqueResult<Post>();
        }

        Post IRepository<Post>.GetAll()
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}
```

### CategoryRepository.cs

```
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Core.Domain.Model;
using NHibernate;
using NHibernate.Criterion;

namespace Core.Domain.Repositories
{
    public class CategoryRepository: IRepository<Category>
    {
        #region IRepository<Category> Members

        void IRepository<Category>.Save(Category entity)
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                using (ITransaction transaction = session.BeginTransaction())
                {
                    session.Save(entity);
                    transaction.Commit();
                }
            }
        }

        void IRepository<Category>.Update(Category entity)
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                using (ITransaction transaction = session.BeginTransaction())
                {
                    session.Update(entity);
                    transaction.Commit();
                }
            }
        }

        void IRepository<Category>.Delete(Guid id)
        {
            using (ISession session = NHibernateHelper.OpenSession())
            {
                using (ITransaction transaction = session.BeginTransaction())
                {
                    session.Delete(id);
                    transaction.Commit();
                }
            }
        }

        Category IRepository<Category>.GetById(Guid id)
        {
            using (ISession session = NHibernateHelper.OpenSession())
                return session.CreateCriteria<Category>().Add(Restrictions.Eq("Id", id)).UniqueResult<Category>();
        }

        Category IRepository<Category>.GetAll()
        {
            throw new NotImplementedException();
        }

        #endregion
    }
}
```

Comme vous pouvez le constater, c'est dans les repositorys que nous plaçons
le code pour appeler les méthodes NHibernate, ce que nous faisons en créant un
objet **Session** en premier.

## Où est-ce que nous en sommes...

Avant de continuer, revoyons un peu ce que nous avons déjà fait :

* Nous avons créé un projet **Core*  - qui référence la librairie
NHibernadte.dll
* Dans ce projet **Core**, nous avons créé deux classes qui
représentent notre modèle : "Post.cs" et "Category.cs", la classe Post
ayant une collection de catégories.
* Nous avons cré deux repositorys pour enregistrer, modifier, supprimer et
retrouver les objets de notre modèle.

## Les Mappings

Il est temps de faire quelque chose dans notre projet
**Infrastructure** où nous mapperont notre modèle à notre base de
données, ce qui se fait via des fichiers XML avec NHibernate. Nous allons
suivre la convention de nommage qui existe au sujet des fichiers maps :
[ClassName].hbm.xml.

Nous allons créer deux nouveaux fichiers :
**Category.hbm.xml** et **Post.hbm.xml**. Le contenu
de chacun de ces fichiers fait correspondre une classe à une table, une
propriété à une colonne, et indique aussi le type de données. Pour cette
première partie du tutoriel, nous avons besoin de créer le fichier
**Category.hbm.xml** :

```
<?xml version="1.0" encoding="utf-8" ?>
<hibernate-mapping xmlns="urn:nhibernate-mapping-2.2"
                                    namespace="Core.Domain.Model"
                                    assembly="Core">

  <class name="Category" table="Categories" dynamic-update="true">
    <cache usage="read-write"/>
    <id name="Id" column="Id" type="Guid">
      <generator class="guid"/>
    </id>
    <property name="Name" length="100"/>
  </class>
</hibernate-mapping>
```

Important : Vous devez définir l'action de génération
de ces deux fichiers à "**Ressource incorporée**" afin que
NHibernate puisse trouver le bon fichier dans l'assembly.

## Configurer NHibernate

Nous sommes presque prêts. La prochaine étape va consister définir la chaine
de connexion à la base de données et quelques paramètres pour NHibernate. Cette
configuration doit être stockée dans un fichier "hibernate.cfg.xml"
(**définissez l'action de génération de ce fichier à "Ressource
incorporée"**). NHibernate dispose d'une fonctionnalité spéciale de
"Lazy-Loading" pour *dynamic proxy systems*, et nous devons ajouter les
références suivantes à notre projet Infrastructure pour qu'il puisse
l'utiliser :

* Castle.Core
* Castle.DynamicProxy2
* NHibernate.ByteCode.Castle.dll

Nous pouvons alors créer le fichier de configuration XML suivant :

### hibernate.cfg.xml

```
<hibernate-configuration xmlns="urn:nhibernate-configuration-2.2">
  <session-factory>
    <property name="connection.driver_class">NHibernate.Driver.SqlClientDriver</property>
    <property name="connection.connection_string">server=.\SQLExpress;database=NHibernate101;Integrated Security=true;</property>
    <property name="show_sql">true</property>
    <property name="dialect">NHibernate.Dialect.MsSql2008Dialect</property>
    <property name="cache.use_query_cache">false</property>
    <property name="adonet.batch_size">100</property>
    <property name="proxyfactory.factory_class">NHibernate.ByteCode.Castle.ProxyFactoryFactory, NHibernate.ByteCode.Castle</property>
    <mapping assembly="Infrastructure" />
  </session-factory>
</hibernate-configuration>
```

La ligne `<property name="proxyfactory.factory_class">...`
utilise la fonctionalité de "lazy loading" au sujet de laquelle vous trouverez
plus d'informations sur le site d'[Hibernate](https://www.hibernate.org/162.html).

## Test unitaire de NHibernate

Il est enfin temps de tester notre configuration de NHibernate ! Nous
allons ajouter quelques données à notre table "Categories". Pour cela nous
avons besoin que notre projet de test référence l'assembly NHibernate et d'y
copier le fichier hibernate.cfg.xml.

Ajouter les références suivantes :

* Castle.Core
* Castle.DynamicProxy2
* Infrastructure
* NHibernate
* NHibernate.ByteCode.Castle

Puis ajouter la méthode de test suivante :

```
[TestMethod]
        [DeploymentItem("hibernate.cfg.xml")]
        public void CanCreateCategory()
        {
            IRepository<Category> repo = new CategoryRepository();
            Category category = new Category();
            category.Name = "ASP.NET";

            repo.Save(category);

        }
```

Lancer le projet de test et notre méthode de test CanCreateCategory devrait
réussir le test (avec un peu de chance) :

![](http://forerunnerg34.files.wordpress.com/2009/11/test.jpg)

Nous pouvons alors vérifier dans la base de données que la nouvelle
catégorie a bien été ajoutée :

![](http://forerunnerg34.files.wordpress.com/2009/11/database.jpg)

Dans la [prochaine partie]({% post_url 2010-01-29-utiliser-aspnetmvc-nhibernate-2 %}) de ce tutoriel, nous complèterons le modèle
et les tests unitaires puis nous attaquerons la création de notre application
ASP.NET MVC.

{:.encart}
Ceci est la traduction du billet "[Using ASP.NET MVC and NHibernate (Part 1)](http://forerunnerg34.wordpress.com/2009/11/03/using-asp-net-mvc-and-nhibernate-part-1/)" de César
Intriago.
