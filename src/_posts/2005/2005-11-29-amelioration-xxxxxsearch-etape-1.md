---
date: 2005-11-29 11:06:00
layout: post
redirect_from: "post/2005/11/29/Amelioration-XxxxxSearch-Etape-1"
tags: qc
title: "Amélioration XxxxxSearch - Etape 1"
---

* Renommé les clés des paramètres pour les préfixer par "search" au lieu de
"google", "msn" et "yahoo",
* Mise en commun de la quasi-totalité du source de viewXxxxxSearch.ascx.cs, à
l'exception de celui de ExecuteSearch qui reste spécifique à GoogleSearch,
MsnSearch ou YahooSearch,
* Suppression de la table pour la mise en forme des formulaires de recherche
(inspiré par [Search Form
Layout](http://simplyaccessible.org/article/search-form-layout))

```
<fieldset class="search_form">
<div class="search_cols">
 <a href="http://www.google.com/" target="_blank">
  <asp:Image id="logoSearch" runat="server"
       AlternateText="Google" ImageUrl="google_logo.gif" />
 </a>
</div>
<div class="search_cols">
 <p>
  <asp:textbox id="txtQuery" runat="server"
       Columns="35" maxlength="100" />
  <asp:button id="btnSearch" runat="server" Text=" Go! " />
 </p>
 <p>
  <asp:radiobuttonlist id="chxRange" runat="server"
       RepeatDirection="Horizontal" RepeatLayout="Flow" />
 </p>
</div>
</fieldset>
```

Reste à faire :

* DONE: Améliorer le fonctionnement en mode GET (cf. [étape
2]({% post_url 2005-12-01-amelioration-xxxxxxsearch-etape-2 %})),
* Ne plus passer par le postback ?
* Remplacer GoogleSearchService.dll, Msn.API.dll et Yahoo.API.dll par une
seule DLL.
