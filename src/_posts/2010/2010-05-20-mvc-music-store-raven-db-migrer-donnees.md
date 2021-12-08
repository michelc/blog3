---
date: 2010-05-20 13:12:00
layout: post
redirect_from: "post/2010/05/20/mvc-music-store-raven-db-migrer-donnees"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : Migrer les données"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: Data migration](http://ayende.com/Blog/archive/2010/05/20/porting-mvc-music-store-to-raven-data-migration.aspx)", le
troisième de la série consacrée au portage de l'application MVC Music Store
sous RavenDB par Oren Eini, alias Ayende Rahien.

Voici le code nécessaire pour lire les données dans la base de données de
[MVC Music Store](http://mvcmusicstore.codeplex.com/)
et les transformer en documents comme attendu par Raven :

```
using (var documentStore = new DocumentStore { Url = "http://localhost:8080" })
{
    documentStore.Initialise();
    using (var session = documentStore.OpenSession())
    {
        foreach (var album in storeDB.Albums.Include("Artist").Include("Genre"))
        {
            session.Store(new
            {
                Id = "albums/" + album.AlbumId,
                album.AlbumArtUrl,
                Arist = new { album.Artist.Name, Id = "artists/" + album.Artist.ArtistId },
                Genre = new { album.Genre.Name, Id = "genres/" + album.Genre.GenreId },
                album.Price,
                album.Title,
            });
        }
        foreach (var genre in storeDB.Genres)
        {
            session.Store(new
            {
                genre.Description,
                genre.Name,
                Id = "genres/" + genre.GenreId
            });
        }
        session.SaveChanges();
    }
}
```

Comme vous pouvez le constater, c'est plutôt simple. Et même si c'est moi
qui le dit, plutôt bien foutu.

J'ai utilisé des types anonymes parce que je me contente de migrer les
données. Je ne m'occupe pas vraiment de savoir comment gérer les types pour
l'instant.
