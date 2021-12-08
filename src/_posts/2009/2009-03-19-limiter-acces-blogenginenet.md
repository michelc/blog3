---
date: 2009-03-19 07:22:00
layout: post
redirect_from: "post/2009/03/19/Limiter-l-acces-a-BlogEngineNET"
tags: .net, referencement
title: "Limiter l'accès à BlogEngine.NET"
---

Pour faire un blog privé avec [BlogEngine.NET](http://www.dotnetblogengine.net/), il faut modifier son
fichier Web.config de façon à interdire l'accès aux visiteurs anonymes. Pour
cela, il faut ajouter une [section
autorization](http://msdn.microsoft.com/en-us/library/wce3kxhd.aspx) dans le Web.Config :

```
  <system.web>
    ...
    <authorization>
        <deny users="?" />
        <allow users="*" />
    </authorization>
    ...
  </system.web>
```

Cela permet de :

* interdire (deny) l'accès aux visiteurs anonymes (users="?")
* autoriser (allow) l'accès aux utilisateurs identifiées (users="*")

De cette façon, tous les visiteurs sont forcés de s'identifier pour pouvoir
consulter le contenu du blog => ils sont automatiquement redirigés vers
l'écran de connexion.

Dans le cas où le thème du site est up to date et qu'il utilise des
HttpHandlers pour gérer les CSS et les JavaScripts, il faut malgré tout donner
l'accès à ceux-ci pour que l'écran de connexion puisse fonctionner
correctement.

Là encore, il faut modifier le fichier Web.config et y ajouter des [éléments location](http://msdn.microsoft.com/en-us/library/b6x6shw7.aspx)
pour autoriser les visiteurs anonymes à accéder à ces 2 types de
ressources :

```
  </system.web>
    ...
   <location path="themes/Scribbish/css.axd">
     <system.web>
       <authorization>
         <allow users="*" />
       </authorization>
     </system.web>
   </location>

   <location path="js.axd">
     <system.web>
       <authorization>
         <allow users="*" />
       </authorization>
     </system.web>
   </location>
    ...
</configuration>
```

Pour ne pas voir à revenir modifier le fichier Web.config à chaque
changement de thème, il est même préférable de ne pas se limiter au fichier
"themes/Scribbish/css.axd", mais d'indiquer seulement "themes" pour autoriser
l'accès à toutes les ressources du dossier "themes" et de ses
sous-dossiers.

Pour que tout soit parfait, on peut aussi cacher le bandeau de Widgets qui
apparait automatiquement sur toutes les pages du blog et par conséquent
également sur la page de connexion.

Pour cela, il faut mettre à jour le fichier site.master du thème
(/themes/Scribbish/site.master dans mon cas) et remplacer la ligne :

```
<blog:WidgetZone runat="server" ID="rightzone" />
```

Par :

```
<% if (Page.User.Identity.IsAuthenticated) { %>
        <blog:WidgetZone runat="server" ID="rightzone" />
<% } %>
```

Ainsi, le bloc de Widgets ne sera généré que dans le cas des visiteurs
identifiés.

Ensuite, pour vivre complètement cachés, il faut aussi aller dans la partie
Paramètres du blogue et passer dans l'onglet / Ping Services pour supprimer
tous les services qui sont pingués à chaque fois que l'on publie un nouveau
billet.

Et pour finir, il est aussi préférable de modifier le fichier robots.txt
pour interdire complètement l'accès du blog à tous les moteurs de recherche et
autres bots qui pourraient avoir eu vent de notre existence :

```
User-agent: *
Disallow: /
```
