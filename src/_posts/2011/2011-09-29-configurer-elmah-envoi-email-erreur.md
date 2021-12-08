---
date: 2011-09-29 20:57:00
layout: post
redirect_from: "post/2011/09/29/configurer-elmah-envoi-email-erreur"
tags: .net
title: "Configurer ELMAH pour envoyer les erreurs par email"
---

Après avoir vu [comment installer ELMAH avec NuGet]({% post_url 2011-09-28-installer-elmah-nuget %}), j'ai fait quelques tests avec pour
voir ce que ça pouvait donner avec différents types d'erreurs.

Et quand je repense au peu d'effort que ça m'a demandé pour l'installer, le
résultat est quand même assez bluffant. Au moins ça donne envie d'aller plus
loin et d'étudier un peu mieux comment utiliser "réellement" ELMAH dans une
application.

Un premier truc intéressant, c'est de s'occuper de paramétrer ELMAH afin de
recevoir un email quand qu'il détecte un problème. De cette façon, je serai
averti quasiment instantanément chaque fois que mon application provoquera une
exception. Ca fait un peu peur quand même...

Concrètement, ELMAH est plutôt bien fait et il n'y a pas besoin de grand
chose pour paramétrer l'envoi d'email. Mais ce qui est encore plus génial,
c'est que l'essentiel du travail de paramétrage a déjà été fait lors de
l'installation via NuGet. Pour mémoire, il avait ajouté les 3 lignes suivantes
aux bons endroits dans le Web.config :

* `<section name="errorMail" requirePermission="false"
type="Elmah.ErrorMailSectionHandler, Elmah" />`
* `<add name="ErrorMail" type="Elmah.ErrorMailModule, Elmah"
/>`
* `<add name="ErrorMail" type="Elmah.ErrorMailModule, Elmah"
preCondition="managedHandler" />`

Pour ma part, il ne me reste plus qu'à ajouter une section
`<elmah>` avec des informations personnelles :

```
<configuration>
  ...
  <elmah>
    <errorMail
       from="go@gmail.com"
       to="michel@gmail.com"
       subject="Application Exception"
       async="true"
       smtpPort="587"
       useSsl="true"
       smtpServer="smtp.gmail.com"
       userName="go@mail.com"
       password="mot_de_passe">
    </errorMail>
  </elmah>
```

Note : étant donné que j'utilise GMail comme serveur
SMTP, il est nécessaire d'activer SSL (d'où le `useSsl="true"`) et
de préciser qu'il faut utiliser le port 587 (quoique ?, voir mon billet
[System.Net.Mail et smtp.gmail.com]({% post_url 2009-04-21-systemnetmail-smtpgmailcom %})).

Après ça, je n'ai plus qu'à relancer mon application et à provoquer quelques
erreurs pour aussitôt voir ma boite mail se remplir. Heureusement que c'est
pour du test...

Et pour être complet, il est sans doute préférable d'extraire le paramétrage
du serveur SMTP de la configuration spécifique d'ELMAH et de le définir au
niveau de la section prévue à cet effet dans le Web.config :

```
<configuration>
  ...
  <elmah>
    <errorMail
       from="go@gmail.com"
       to="michel@gmail.com"
       subject="Application Exception"
       async="true"
       smtpPort="0"
       useSsl="true">
    </errorMail>
  </elmah>
  ...
  <system.net>
    <mailSettings>
      <smtp deliveryMethod ="Network">
        <network host="smtp.gmail.com" 
                 port="587"
                 userName="go@gmail.com"
                 password="mot_de_passe" />
      </smtp>
    </mailSettings>
  </system.net>
```

Dans ce cas, il faut faire attention aux deux points suivants :

* paramétrer le port "0" au niveau de la section
`<errorMail>` pour que ce le port défini au niveau de la
section `<network>` soit pris en compte,
* l'activation du SSL se fait toujours dans la section
`<errorMail>`.
