---
date: 2005-12-14 19:32:00
layout: post
redirect_from: "post/2005/12/14/Comment-resoudre-le-probleme-du-double-clic-en-aspnet"
tags: .net, code-snippets
title: "Comment résoudre le problème du \"double-clic\" en asp.net"
---

Une méthode générique pour pallier au problème du "double-clic" quand un
utilisateur double clique au lieu de simplement cliquer une fois pour valider
un formulaire, ce qui risque de le soumettre 2 fois. Pour contourner ça, le
bouton qui a été cliqué est caché une fois que l'utilisateur a cliqué
dessus.

Pour que ça fonctionne avec tous les formulaires, la bidouille est appliqué
au niveau de l'évènement Render de la page.

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
