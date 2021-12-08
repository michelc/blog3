---
date: 2010-01-29 11:50:00
layout: post
redirect_from: "post/2010/01/29/utiliser-asp-net-mvc-et-nhibernate-2"
tags: mvc, nhibernate
title: "Utiliser ASP.NET MVC et NHibernate (2° partie)"
---

{:.encart}
Ceci est la traduction du billet "[Using ASP.NET MVC and NHibernate (Part 2)](http://forerunnerg34.wordpress.com/2009/11/03/using-asp-net-mvc-and-nhibernate-part-2/)" de César
Intriago.

Et voici la deuxième partie d'une série d'article consacré à l'utilisation
de NHibernate dans une application ASP.NET MVC. Vous pouvez lire la [première partie de ce tutoriel ici]({% post_url 2010-01-29-utiliser-aspnetmvc-nhibernate-1 %}).

## Représenter une relation many-to-many

Nous allons continuer en créant un fichier de mapping pour la classe Post.
Celui-ci est légèrement différent de celui pour la classe Category étant donné
que nous devons représenter une relation plusieurs-à-plusieurs entre les tables
Posts et Categories, ce que nous réaliserons en utilisant un élément BAG dans
le fichier de mapping. Voici le code de notre fichier Post.hbm.xml :

Important : Vous devez définir l'action de génération
de tous les fichiers de mapping à "**Ressource incorporée**" afin
que NHibernate puisse trouver le bon fichier dans l'assembly.

### Post.hbm.xml

```
<?xml version="1.0" encoding="utf-8" ?>
<hibernate-mapping xmlns="urn:nhibernate-mapping-2.2"
                                    namespace="Core.Domain.Model"
                                    assembly="Core">

  <class name="Post" table="Posts" dynamic-update="true">
    <cache usage="read-write"/>
    <id name="Id" column="Id" type="Guid">
      <generator class="guid"/>
    </id>
    <property name="Title" length="100"/>
    <property name="Body"/>
    <property name="CreationDate" type="datetime"/>
    <property name="IsPublic" type="bool"/>

    <bag name="Categories" table="PostCategory" lazy="false" >
      <key column="idPost" ></key>
      <many-to-many class="Category" column="idCategory" ></many-to-many>
    </bag>

  </class>
</hibernate-mapping>
```

Voici quelques explications sur ce que nous avons fait au niveau de
l'élément `<bag>` :

* L'attribut `name` défini le nom de la propriété de la classe
Post où nous stockerons la collection des catégories.
* L'attribut `table` correspond au nom de la table dans la
base de données qui relie les tables Posts et Categories.
* L'attribut `key.column` est le nom de l'identifiant de la
table Posts.
* L'attribut `class` représente le nom de la classe Category
dans le modèle d'objet.
* L'attribut `many-to-many.column` est le nom de l'identifiant
de la table Categories.

Pour vous aider à mieux comprendre ce fichier de mapping, voici tout d'abord
à quoi ressemble le diagramme de classe :

![](http://forerunnerg34.files.wordpress.com/2009/11/mapping.png)

puis le schéma de la base de données correspondante :

![](http://forerunnerg34.files.wordpress.com/2009/11/postscategoriesmodel2.png)

Comme vous pouvez le constater dans le diagramme de classe, nous n'avons pas
besoin de créer une classe pour la table PostCategory.

## Test unitaire

Nous allons maintenant tester nos repositorys et vérifier que nous pouvons
créer des billets à l'aide des tests unitaires suivants :

```
using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Core.Domain.Model;
using Core.Domain.Repositories;
using Core;

namespace NHibernate101.Tests
{
    [TestClass]
    public class RepositoriesTest
    {
        IRepository<Category> categoriesRepository;
        IRepository<Post> postsRepository;
        Post testPost;
        Category testCategory1;
        Category testCategory2;

        public RepositoriesTest()
        {
        }

        private TestContext testContextInstance;

        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        [TestInitialize()]
        public void CreateRepositories()
        {
            categoriesRepository = new CategoryRepository();
            postsRepository = new PostRepository();
        }

        [TestMethod]
        [DeploymentItem("hibernate.cfg.xml")]
        public void CanCreateCategory()
        {
            testCategory1 = new Category() { Name = "ASP.NET" };
            categoriesRepository.Save(testCategory1);
        }

        [TestMethod]
        [DeploymentItem("hibernate.cfg.xml")]
        public void CanCreatePost()
        {
            testPost = new Post();
            testPost.Title = "ASP.NET MVC and NHibernate";
            testPost.Body = "In this article I'm going to cover how to install and configure NHibernate and use it in a ASP.NET MVC application.";
            testPost.CreationDate = DateTime.Now;
            testPost.IsPublic = true;

            testCategory2 = new Category() { Name= "ASP.NET MVC"};

            categoriesRepository.Save(testCategory2);
            testPost.Categories.Add(testCategory2);

            postsRepository.Save(testPost);
        }
    }
}
```

Lancer le test et s'il réussi, nous devrions retrouver le nouveau billet et
la nouvelle catégorie dans la base de données :

![](http://forerunnerg34.files.wordpress.com/2009/11/postandcategory.png)

Il s'agit là des rudiments de NHibernate. Je vous encourage à vous
documenter plus en détail sur le site de la [communauté NHibernate](http://nhforge.org/). Dans la [prochaine partie]({% post_url 2010-01-29-utiliser-aspnetmvc-nhibernate-3-fin %}) de ce tutoriel nous commencerons à
développer notre application ASP.NET MVC pour gérer les billets et les
catégories !

{:.encart}
Ceci est la traduction du billet "[Using ASP.NET MVC and NHibernate (Part 2)](http://forerunnerg34.wordpress.com/2009/11/03/using-asp-net-mvc-and-nhibernate-part-2/)" de César
Intriago.
