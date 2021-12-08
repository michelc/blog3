---
date: 2020-02-24 12:27:34+200
layout: post
tags: mail
title: "Accéder à Office 365 Mail depuis GMail"
image: "/public/2020/office365-gmail.jpg"
---

Pour ne pas oublier comment j'ai fait et retrouver ce paramétrage le jour où j'en aurai besoin, je note ici comment j'ai procédé pour gérer mon adresse mél Office 365 depuis mon client GMail. Parce que généralement, ce qu'on trouve sur internet explique surtout comment migrer de GMail à Office 365 ou inversement...

<figure>
  <img src="{{ page.image }}" alt="office365-gmail" />
  <figcaption>
    <a href="https://funny.pho.to/fr/antique-oil-painting/">Antique Oil Painting - PHO.TO</a>
  </figcaption>
</figure>

Le but de cette manipulation, c'est de me permettre de continuer à utiliser le webmail GMail pour :

* recevoir mes méls depuis mon adresse Office 365,
* envoyer des méls via cette adresse.


## Recevoir les méls Office 365 dand GMail

Cette partie du paramétrage doit être faite depuis Outlook 365 (en français dans mon cas) :

* Cliquer sur l'icone "Paramètres" (un engrenage en haut à droite dans la barre de menu).
* Cliquer sur "Afficher tous les paramètres de Outlook" en bas, ce qui ouvre une nouvelle fenêtre.
* Cliquer sur le sous-menu "Courrier" puis "Transfert".
* Renseigner l'adresse GMail où faire suire les méls (prenom.nom@gmail.com par exemple) :

![](/public/2020/office-gmail-1.png)

Puis valider en cliquant sur le bouton "Enregistrer" en bas à droite.


## Envoyer des méls Office 365 depuis GMail

Cette partie du paramétrage se fait depuis GMail (en anglais dans mon cas) :

* Cliquer sur l'icone "Settings" (un engrenage en haut à droite).
* Choisir le sous-menu "Settings".
* Aller dans l'onglet "Accounts and Import".
* Il y a une section "Send mail as" => cliquer sur "Add another email address".

On commence par indiquer quelle est notre adresse sur le serveur Office 365 :

![](/public/2020/office-gmail-2.png)

Puis un clic sur "Next step »" et on paramètre le serveur SMTP correspondant :

* Serveur SMTP : smtp.office365.com
* Port : choisir "587"
* Username : indiquer l'adresse mél Office 365, par exemple "prenom.nom@societe.fr"
* Password : saisir le mot de passe corespondant à l'adresse mél
* Sélectionner "Secured connection using TLS"

![](/public/2020/office-gmail-3.png)

Après avoir cliqué sur "Add Account »", la section "Send mail as" contient désormais les informations suivantes :

```
Prenom Nom <prenom.nom@societe.fr>
Mail is sent through: smtp.office365.com
Secured connection on port 587 using TLS
```

Juste en dessous, il est préférable de définir que l'on souhaite par défaut répondre aux messages en utilisant l'adresse à laquelle le message a été envoyé. Pour cela, il faut sélectionner l'option "Reply from the same address the message was sent to", plutôt que "Always reply from default address (currently prenom.nom@gmail.com)".


## Conclusion

Ca marche et surtout, j'ai maintenant accès à mon adresse Office 365 aussi bien depuis GMail que Outlook.

Mais pour information, j'ai testé différentes méthodes jusqu'à ce que je trouve quelque chose qui fonctionne (et je n'ai pas cherché plus loin). Je suis donc preneur si quelqu'un connait une meilleure solution et idéalement la méthode "officielle".

{:.encart}
English version: [How to access Office 365 email from GMail]({% post_url 2020-02-25-access-office-365-mail-from-gmail %}){:hreflang="en"}.
