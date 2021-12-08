---
date: 2010-05-26 13:29:00
layout: post
redirect_from: "post/2010/05/26/mvc-music-store-raven-db-migration-plus-poussee"
tags: mvc, nosql
title: "MVC Music Store / Raven DB : Faire une migration plus poussée"
---

{:.encart}
Ceci est la traduction du billet "[Porting MVC Music Store to Raven: Advanced Migrations](http://ayende.com/Blog/archive/2010/05/24/porting-mvc-music-store-to-raven-advanced-migrations.aspx)", le
septième de la série consacrée au portage de l'application MVC Music Store sous
RavenDB par Oren Eini, alias Ayende Rahien.

Je me suis rendu compte qu'à cause d'une faute de frappe lorsque j'avais
fait la reprise des données, les informations sur l'artiste étaient
enregistrées en tant que "Arist" au lieu de "Artist". Cela va me donner
l'occasion de montrer comment faire une migration du modèle de données un peu
plus sophistiquée.

```
using (var documentStore = new DocumentStore { Url = "http://localhost:8080" })
{
    documentStore.Initialise();

    var count = 0;

    do
    {
        var queryResult = documentStore.DatabaseCommands.Query("Raven/DocumentsByEntityName", new IndexQuery
        {
            Query = "Tag:`Albums`",
            PageSize = 128,
            Start = count
        });

        if (queryResult.Results.Length == 0)
            break;

        count += queryResult.Results.Length;
        var cmds = new List<ICommandData>();
        foreach (var result in queryResult.Results)
        {
            var arist = result.Value<JObject>("Arist");
            if(arist == null)
                continue;
                        
            result["Artist"] = arist;
            result.Remove("Arist");

            cmds.Add(new PutCommandData
            {
                Document = result,
                Metadata = result.Value<JObject>("@metadata"),
                Key = result.Value<JObject>("@metadata").Value<string>("@id"),
            });
        }

        documentStore.DatabaseCommands.Batch(cmds.ToArray());

    } while (true);
    
}
```

Je ne pense pas que le code soit très compliqué à suivre. Vous pouvez voir
comment on peut manipuler les documents en travaillant directement au niveau du
document JSON plutôt que de passer par une couche objet.
