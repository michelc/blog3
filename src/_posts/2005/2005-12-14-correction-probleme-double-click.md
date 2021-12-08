---
date: 2005-12-14 13:37:00
layout: post
redirect_from: "post/2005/12/14/Correction-probleme-double-click"
tags: qc
title: "Correction problème double click"
---

Certains utilisateurs cliquent plusieurs fois sur le bouton [OK] (à cause
d'un problème de souris ou parce qu'ils ont l'habitude de double-cliquer pour
valider). Lorsque l'on ne teste pas si les données saisies sont uniques (cas
des messages d'un forum par exemple), cela conduit à créer deux enregistrements
au lieu d'un.

Pour contourner ce problème, le bouton de validation est caché via
l'évènement client "onclick". Et pour éviter de mettre à jour les boutons de
chaque formulaire, la modification est gérée de façon globale au niveau de
l'évènement serveur "Render" de default.aspx.cs :

```
protected override void Render(HtmlTextWriter output) {
    // Get normal html ouput
    StringBuilder stringBuilder = new StringBuilder();
    StringWriter stringWriter = new StringWriter(stringBuilder);
    HtmlTextWriter htmlWriter = new HtmlTextWriter(stringWriter);
    base.Render(htmlWriter);
    string html = stringBuilder.ToString();
    // Enhance submit buttons
    string onclick1 = "\"if (typeof(Page_ClientValidate) == 'function') Page_ClientValidate();";
    string onclick2 = "\"this.style.display='none';";
    html = html.Replace("onclick=" + onclick1, "onclick=" + onclick2 + onclick1.Substring(1));
    // Render updated html
    output.Write(html);
}
```

Note: la modification de default.aspx.cs est suffisante étant donné qu'il
s'agit de la seule "vrai" page de Quick-Content et que toutes les autres pages
ne sont que de l'url rewriting.

Voir aussi : [
Comment résoudre le problème du "double-clic" en asp.net]({% post_url 2005-12-14-comment-resoudre-probleme-double-clic-aspnet %})
