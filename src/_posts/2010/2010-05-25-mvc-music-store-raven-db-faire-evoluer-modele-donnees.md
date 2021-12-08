---
date: 2010-05-25 19:55:00
layout: post
redirect_from: "post/2010/05/25/mvc-music-store-raven-db-faire-evoluer-modele-donnees"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : Faire évoluer le modèle de données"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: Migrations](http://ayende.com/Blog/archive/2010/05/23/porting-mvc-music-store-to-raven-migrations.aspx)", le sixième de
la série consacrée au portage de l'application MVC Music Store sous RavenDB par
Oren Eini, alias Ayende Rahien.

Dans mon dernier billet, j'ai indiqué que nous devions ajouter une propriété
CountSold à tous les albums, généralement quelque chose d'assez pénible à faire
dans l'univers des bases de données SQL. La commande pour ajouter une colonne
est toute simple, mais c'est une vrai galère d'en venir à bout, de la déployer
et de la versionner. Avec Raven, quand vous ajoutez une propriété, elle sera
automatiquement ajoutée à votre document la prochaine fois que vous le
sauvegarderez. Vous n'avez rien d'autre à faire. Et même, c'est pareil si vous
décidez de supprimer une propriété. Raven s'occupera de fera le ménage après
vous.

Mais comment faire quand on veut initialiser cette propriété avec une valeur
définie, et pas se contenter de la valeur par défaut ? Dans ce cas là, il
faut un peu mettre la main à la pâte, mais ça reste très simple :

```
using (var documentStore = new DocumentStore { Url = "http://localhost:8080" })
{
    documentStore.Initialise();
    using (var session = documentStore.OpenSession())
    {
        IDictionary<string,int> albumToSoldCount = new Dictionary<string, int>();
        int count = 0;

        do
        {
            var results = session.Query<SoldAlbum>("SoldAlbums")
                .Take(128)
                .Skip(count)
                .ToArray();

            if (results.Length == 0)
                break;
            count += results.Length;
            foreach (var soldAlbum in results)
            {
                albumToSoldCount[soldAlbum.Album] = soldAlbum.Quantity;
            }
        } while (true);

        count = 0;
        do
        {
            var albums = session.Query<Album>()
                .Skip(count)
                .Take(128)
                .ToArray();
            if (albums.Length == 0)
                break;

            foreach (var album in albums)
            {
                int value;
                albumToSoldCount.TryGetValue(album.Id, out value);

                album.CountSold = value;
            }

            count += albums.Length;

            session.SaveChanges();
            session.Clear();
        } while (true);
    }
}
```

Pour ceux d'entre-vous qui n'ont pas pris la peine de lire le code, cette
fonction parcours l'index SoldAlbums que nous avons créé auparavant et mémorise
ses valeurs. Puis nous parcourons les albums par lot de 128 et nous mettons à
jour leur compteur CountSold. L'un dans l'autre, c'est plutôt facile.

Un des autres avantages de ce script, c'est que vous pouvez l'exécuter
autant de fois que vous le voulez sans que cela fausse vos données.
