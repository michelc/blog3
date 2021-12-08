---
date: 2005-06-06 10:04:00
layout: post
redirect_from: "post/2005/06/06/Multi-langue"
tags: qc
title: "Multi-langue"
---

QC peut désormais gérer plusieurs langues par l'intermédaire d'un fichier de
configuration LiteralXX.config. Celui-ci doit être déclaré dans le Web.config
de la façon suivante : `<appsettings
file="LiteralFR.config">`.

Le fichier LiteralXX.config est constitué de paires key/value :

* `<add key="announcements_ReadMore" value="Suite..."
/>`
* `<add key="announcements_Title" value="Titre" />`
* `<add key="announcements_Summary" value="Accroche"
/>`
* `<add key="announcements_Content" value="Contenu" />`

Pour l'instant, la traduction est prise en compte au niveau des webforms
grace au nouveau contrôle utilisateur `<qc:Literal>` qui accepte deux
atttributs :

* id : identidiant du texte (correspond à l'attribut key dans
LiteralXX.config)
* text : valeur du texte par défaut (= attribut value dans
LiteralXX.config)

```
<p>
  <label>
    <qc:literal id="announcements_Summary"
                text="Summary"
                runat="server" /> 
  </label>
  <asp:textbox id="txtSummary" 
               cssclass="std" 
               maxlength="250" 
               textmode="MultiLine" 
               rows="2" 
               runat="server" />
```

La traduction peut également être obtenue au moyen de la nouvelle fonction
`Common.Literal(id, text)`.

Il y a encore quelques trucs à finir :

* trouver comment gérer le cas des libellés pour les contrôles Validator
(boucler dessus dans BoxControl.cs et appeler `Common.Literal()` ou tous les
surclasser en `<qc:Validator>`)
* il reste 2 ou 3 traductions "en dur" dans default.aspx.cs
* voir comment faire pour gérer plusieurs traductions en fonction de
l'utilisateur
