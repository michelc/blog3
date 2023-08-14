---
date: 2023-08-14 12:07:46 +02:00
tags: [ javascript, jeux ]
title: "Générer un badge / avatar en C#"
cover:
  image: /public/2023/avatars-csharp.png
excerpt: Une méthode simple pour afficher un avatar sans se péoccuper de savoir s'il s'agit d'une image statique ou d'une image dynamique générée en C#.
---

J'ai récemment eu besoin d'afficher à nouveau des avatars, et j'ai voulu en profiter pour essayer une autre façon de faire par rapport à ce que j'avais fait il y a 2 ans avec "{% goto_fr "Créer un badge / avatar en CSS", "2021-12-10-creer-badge-avatar-css" %}".

Et donc, plutôt que de faire ça avec du bon vieux code HTML et CSS, je génère automatiquement une image pour les personnes qui n'ont pas de "vrai" avatar.


## Renvoyer une image statique

Les images des avatars sont stockées dans le dossier "/wwwroot/avatars" pour les cas où il existe un avatar.

Chaque avatar est enregistré en JPG, avec un nom de la forme "trigramme.prenom.nom.jpg".

* trigramme = initiale du prénom + initiale du nom + lettre finale du nom (donc 3 lettres au total)
* prenom = le prénom en minuscule sans accents, espaces, tirets... de la personne
* nom = le nom en minuscule sans accents, espaces, tirets... de la personne

Par conséquent, un nom de fichier est composé uniquement des 26 lettres "a" à "z", avec un "." pour séparer les différentes parties : "tsk.tony.stark.jpg", "bbr.bruce.banner.jpg", "srs.steve.rogers.jpg", etc...

De cette façon, lorsqu'il existe un "vrai" avatar pour une personne, j'utilise simplement l'URL de l'image "/avatars/tsk.tony.stark.jpg" et le middleware "UseStaticFiles()" renvoie cette image sans chercher plus loin.


## Renvoyer une image dynamique

Dans les cas où il n'existe pas d'image, j'ai une route qui prend le relai et qui renvoie une image générée à la volée. Ce qui donne au niveau de mon fichier "Program.cs" :

```csharp
// Middleware pour les fichiers statiques
// => renvoie entre autre les images utilisées pour les avatars
app.UseStaticFiles();

...

// Route par défaut pour une application MVC basique
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Route spécifique pour générer des avatars
app.MapControllerRoute(
    name: "avatars",
    pattern: "/avatars/{id}.jpg",
    defaults: new { controller = "Avatars", action = "Index" });
```

Puis, dans le contrôleur "AvatarsController.cs", je n'ai plus qu'à générer une image en fonction de l'identifiant de l'image, à savoir une chaine de la forme "trigramme.prenom.nom.jpg".

```csharp
public ActionResult Index(string id = "")
{
    var trigramme = id.Substring(0, 3).ToUpper();

    var color = GetColor(trigramme);
    var avatar = GetBitmap(color, trigramme);

    // Convertir l'image en tableau de bytes (byte array)
    using (MemoryStream ms = new MemoryStream())
    {
        avatar.Save(ms, ImageFormat.Jpeg);
        byte[] imageBytes = ms.ToArray();

        // Renvoyer l'image directement comme réponse HTTP avec le type de contenu approprié
        return File(imageBytes, "image/jpg");
    }
}
```

Je commence par récupérer le trigramme de la personne car il va me permettre de générer une couleur de fond pour l'avatar, via la fonction `GetColor(trigramme)`.

Puis j'appelle la méthode `GetImage(color, trigramme)` qui est chargée de générer l'image correspondant à l'avatar.

Et enfin, je renvoie cette image au navigateur. Je peux alors utiliser la route de cette image "/avatars/tsk.tony.stark.jpg" exactement comme si c'état un fchier statique.

## Afficher l'avatar

Côté HTML, je n'ai donc pas à me préoccuper de savoir s'il s'agit d'une image statique ou dynamique et je peux me contenter d'afficher une image basique :

```html
<div class="round-avatar">
    <img src="/avatars/@(user.Trigramme).@(user.Prenom).@(user.Nom).jpg" />
</div>
```

Puis quelques lignes de CSS pour donner un look "fini" à l'avatar :

```css
/* Avatars ronds */
.round-avatar img {
    border-radius: 50%;
    height: 64px;
    width: 64px;
}
/* Bordure au survol */
.round-avatar:hover img {
    box-shadow: 0 0 0 4px #fff;
}
```

## Générer l'avatar en C#

La fonction `GetColor()` est un peu tarabiscottée et me permet de définir une couleur en fonction du trigramme. Je ferais peut-être un autre billet pour expliquer comment je procède...

La fonction `GetImage()` génère un carré avec le fond de la couleur demandée et les initiales de la personne en blanc. Pour cela, j'utilise `System.Drawing` de façon assez basique :

```csharp
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
...

private Bitmap GetBitmap (Color color, string trigramme)
{
    // Créer une image avec le fond de la couleur demandée
    var image = new Bitmap(400, 400);
    using (Graphics gfx = Graphics.FromImage(image))
    {
        gfx.SmoothingMode = SmoothingMode.AntiAlias;
        gfx.Clear(color);
    }

    // Ajouter les 2 initiales du trigramme centré au milieu de l'image
    using (Graphics gfx = Graphics.FromImage(image))
    {
        Font font = new Font("Calibri", 128, FontStyle.Bold);
        Brush brush = new SolidBrush(Color.White);
        StringFormat format = new StringFormat();
        format.Alignment = StringAlignment.Center;
        format.LineAlignment = StringAlignment.Center;

        gfx.DrawString(trigramme.Substring(0, 2), font, brush, new Rectangle(0, 0, 400, 400), format);
    }

    // Renvoie l'image générée
    return image;
}
```

## Conclusion

C'était pas très compliqué à coder et c'est amusant d'avoir un truc simple capable d'afficher des avatars sans avoir à faire la distinction entre les personnes pour lesquelles il existe un "vrai" avatar et celles pour lesquelles il n'y en a pas.
