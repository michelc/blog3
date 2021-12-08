---
date: 2006-01-14 16:37:00
layout: post
redirect_from: "post/2006/01/14/Google-Sitemap"
tags: qc, referencement
title: "Google Sitemap"
---

Quick-Content peut désormais générer automatiquement un fichier sitemap.xml
à chaque fois qu'un écran est modifié.

L'attribut `<lastmod>` correspond à la date de dernière mise à jour de l'écran
telle qu'elle est enregistrée dans le champ "lastUpdate" de la table
qc_Screens.

L'attribut `<changefreq>` est généré en comparant la date de dernière
modification de l'écran à la date en cours :

* "daily" s'il y a moins de 7 jours,
* "weekly" s'il y a moins de 15 jours,
* "monthly" s'il y a moins de 3 mois,
* "yearly" dans les autres cas.

En ce qui concerne l'attribut `<priority>`, il est initialisé à 0.7, 0.5 ou
0.3 selon que l'écran est de niveau 1, 2 ou 3.

La boite de configuration du site a été mise à jour pour permettre la saisie
de l'url du fichier sitemap.xml à générer (en général, indiquer "~/sitemap.xml").
Dans le cas où ASP.NET n'a pas de droit en écriture sur la racine du site mais
seulement sur le sous-répertoire "/data", il faut :

* indiquer "~/data/sitemap.xml" pour que Quick-Content puisse écrire le
fichier,
* placer le fichier "_sitemap.aspx" à la racine du site pour que Google
accepte toutes les urls qu'il contient.

Le fichier "_sitemap.aspx" se contente de renvoyer le contenu du fichier
"/data/sitemap.xml" :

```
<%@ Page Language="C#" %>
<script runat="server">
void Page_Load(object sender, System.EventArgs e) {
    Response.ContentType = "application/xml";
    Server.Transfer("data/sitemap.xml");
}
</script>
```

Il est également nécessaire d'inscrire l'url du fichier sitemap sur Google
Sitemaps pour qu'il soit pris en compte.

Note : même si selon Google un fichier sitemap n'est pas
censé améliorer le référencement du site, cela présente au moins les avantages
suivants :

* diminution de la consommation de bande passante par GoogleBot,
* possibilité de vérifier et de suivre l'évolution de son utilisation sur le
site Google Sitemaps (<http://www.google.com/webmasters/sitemaps/>).
