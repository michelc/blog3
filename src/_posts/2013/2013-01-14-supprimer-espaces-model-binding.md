---
date: 2013-01-14 22:55:00
layout: post
redirect_from: "post/2013/01/14/supprimer-espaces-model-binding"
tags: csharp, mvc
title: "Supprimer les espaces lors du Model Binding"
---

Il arrive quelquefois que les utilisateurs saisissent des données en
"insérant" des espaces au début ou à la fin de leur saisie. Et c'est même très
souvent le cas quand ils font du copier / coller. Par exemple, si pour saisir
une adresse client, on fait un copier / coller depuis un site internet ou un
fichier Excel, il y a un gros risque de se retrouver avec des espaces en début
ou en fin de ligne.

Du temps de mes applications en WebForm, j'avais résolu ça en appliquant
systématiquement un `Trim()` à tous les contrôles TextBox :

```
protected void btnUpdate_Click(object sender, System.EventArgs e)
{
  if (Page.IsValid == true)
  {
    Book obj = new Book();
    obj.title = txtTitle.Text.Trim();
    ...
    obj.Save();
```

De cette façon, je suis sûr que les colonnes textes de ma base de données ne
sont pas polluées par des espaces oubliés en début ou en fin de texte. Sans
cela, on se retrouve ensuite avec des trucs bizarres quand on fait des tris ou
pire si on doit faire une recherche sur un libellé exact...

Depuis que j'utilise MVC, j'avais un peu laissé ça de côté.

```
//
// POST: /Books/Create
[HttpPost, ValidateAntiForgeryToken]

public ActionResult Create(Book book)
{
  if (ModelState.IsValid)
  {
    db.Entry(book).State = EntityState.Modified;
    db.SaveChanges();
```

Je vais quand même pas rajouter des lignes `book.title =
book.title.Trim() ...` dans le code de mes actions ? Je pourrais
aussi faire ça au niveau du modèle ou avoir une méthode d'extension
suffisamment générique pour faire un `Trim()` sur toutes les
propriétés de type `string`.

Mais, inspiré par un "vieux" billet de Phil Haack qui expliquait comment
faire un model binder personnalisé ([Model Binding Decimal Values](http://haacked.com/archive/2011/03/19/fixing-binding-to-decimals.aspx)), j'ai décidé de m'y
essayer.

La technique consiste à créer un Model Binder spécifique qui remplacera le
ModelBinder par défaut pour les chaînes de caractères de façon à effectuer un
`Trim()` de la valeur postée avant qu'elle ne soit transmise à
l'action du contrôleur.

```
public class StringModelBinder : IModelBinder
{
  /// <summary>
  /// Supprime les espaces en début et en fin des chaines de caractères saisies
  /// </summary>
  /// <param name="controllerContext"></param>
  /// <param name="bindingContext"></param>
  /// <returns></returns>
  public object BindModel(ControllerContext controllerContext, ModelBindingContext bindingContext)
  {
    var valueResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
    object actualValue = valueResult == null ? null : valueResult.AttemptedValue;

    if (actualValue != null)
    {
      actualValue = ((string)actualValue).Trim();
      if ((string)actualValue == string.Empty)
      {
        actualValue = null;
      }
    }

    return actualValue;
  }
```

Les 2 premières lignes commencent par récupérer la valeur. Si celle-ci n'est
pas nulle, on lui applique un `Trim()`. Et dans le cas où la valeur
alors obtenue est vide, on renvoie `null`, sinon on renvoie la
valeur trimée.

Il faut ensuite déclarer ce ModelBinder. Cela se passe dans la méthode
`Application_Start()` du fichier Global.asax.cs :

```
protected void Application_Start()
{
  AreaRegistration.RegisterAllAreas();

  ModelBinders.Binders.Add(typeof(string), new StringModelBinder());
```

Et maintenant, même si un utilisateur laisse passer quelques espaces en
début ou en fin de saisie, ceux-ci seront automatiquement supprimés avant même
que les données soient transmises à l'action.

L'avantage par rapport à coder des `Trim()` explicites, c'est
qu'on n'a pas à y penser. Il n'y a "rien" à faire puisque ça se fait tout
seul...
