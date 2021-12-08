---
date: 2013-09-03 13:29:00
layout: post
redirect_from: "post/2013/09/03/cle-deja-existante-dans-ef-objectstatemanager"
tags: ef, unit-test
title: "Clé déjà existante dans EF.ObjectStateManager"
---

En ce moment, je testunite beaucoup et comme je persiste à utiliser une base
de données SQL CE pour ce qui touche à Entity Framework, je cherche tous les
moyens possibles pour améliorer la vitesse de mes tests.

Suite à ma dernière optimisation, j'avait 2 tests unitaires qui ne passaient
plus.

> Un objet ayant la même clé existe déjà dans ObjectStateManager.
> ObjectStateManager ne peut pas assurer le suivi de plusieurs objets ayant la
> même clé.

Ou en anglais :

> An object with the same key already exists in the ObjectStateManager. The
> ObjectStateManager cannot track multiple objects with the same key.

Dans les 2 tests, il s'agissait de vérifier que le POST sur l'action "Edit"
d'un contrôleur redirigeait bien vers l'action "Details" en cas de succès.

```
//
// POST: /Theaters/Edit/5

[HttpPost, ValidateAntiForgeryToken]
public ActionResult Edit(Theater theater)
{
    if (ModelState.IsValid)
    {
        // Enregistre les modifications
        var place = db.Places.Find(theater.Place_ID);
        theater.KeyTheater = StringHelper.Slugify(place.Caption + " " + theater.ShortName);
        db.Entry(theater).State = EntityState.Modified;
        db.SaveChanges();

        return RedirectToAction("Details", new { id = theater.Theater_ID });
    }

    ViewBag.Place_ID = db.SelectListPlaces(this.Department_ID, theater.Place_ID);
    return View(theater);
}
```

L'erreur apparaissait pile sur la ligne `db.Entry(theater).State =
EntityState.Modified;`.

Dans tous les autres contrôleurs, le problème ne se présentait pas, mais
uniquement dans ces 2 cas là. Après quelques recherches, il semblerait que le
fait d'utiliser l'objet `theater` dans la ligne `var place =
db.Places.Find(theater.Place_ID);` soit suffisant pour que l'entité soit
référencée dans l'`ObjectStateManager` de Entity Framework.

Et ensuite, la commande `db.Entry(theater).State =
EntityState.Modified;` provoquait à nouveau son référencement alors qu'il
l'avait déjà été deux lignes plus tôt (mais ça EF ne semblait pas capable de
s'en rendre compte).

J'ai trouvé [plusieurs](http://stackoverflow.com/questions/5672255/an-object-with-the-same-key-already-exists-in-the-objectstatemanager-the-object) [trucs](http://davidswindells.com/blog/2013/03/asp-net-mvc-enitity-framework-an-object-with-the-same-key-already-exists-in-the-objectstatemanager/) sur internet pour éviter le problème, mais quant à moi,
j'ai préféré tout simplement marquer l'objet à l'état "Modified" avant de
l'utiliser pour retrouver la commune correspondante :

```
        // Enregistre les modifications
        db.Entry(theater).State = EntityState.Modified;
        var place = db.Places.Find(theater.Place_ID);
        theater.KeyTheater = StringHelper.Slugify(place.Caption + " " + theater.ShortName);
        db.SaveChanges();
```
