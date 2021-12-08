---
date: 2020-02-25 12:23:34+200
layout: post
lang: en-US
tags: mail
title: "How to access Office 365 email from GMail"
image: "/public/2020/office365-gmail.jpg"
---

I'm writing this so I don't forget how I did and so that I can find this setting one day. Here's how I handle my Office365 email address from my GMail client. Because generally, the internet mostly explains how to migrate from GMail to Office 365 or vice versa...

<figure>
  <img src="{{ page.image }}" alt="office365-gmail" />
  <figcaption>
    <a href="https://funny.pho.to/fr/antique-oil-painting/">Antique Oil Painting - PHO.TO</a>
  </figcaption>
</figure>

The purpose of this manipulation is to allow me to continue to use GMail web interface for:

* receive emails from my Office 365 address,
* send emails with this address.


## Get Office 365 emails into GMail

This part of the configuration must be done from Outlook 365 (in French in my case):

* Click the "Settings" icon (a gear at the top right in the menu bar).
* Click on "Show all Outlook settings" at the bottom, which opens a new window.
* Click the "Mail" submenu and then "Transfer".
* Fill in the GMail address where to send the emails (like "prenom.nom@gmail.com" for example):

![](/public/2020/office-gmail-1.png)

Then validate by clicking "Save" at the bottom right.


## Sending Office 365 emails from GMail

This part of the configuration is done from GMail:

* Click on the "Settings" icon (a gear in the top right corner).
* Choose the "Settings" submenu.
* Go to the "Accounts and Import" tab.
* There is a section "Send mail as" => click on "Add another email address".

First, you have to enter your address on the Office 365 server:

![](/public/2020/office-gmail-2.png)

Then click on "Next step »" and set up the corresponding SMTP server:

* Address: smtp.office365.com
* Port: choose "587"
* Username: give the Office 365 email address, e.g. "prenom.nom@societe.fr"
* Password: enter the password corresponding to this email address
* Select "Secured connection using TLS"

![](/public/2020/office-gmail-3.png)

After clicking on "Add Account »", the "Send mail as" section now contains the following information:

```
Prenom Nom <prenom.nom@societe.fr>
Mail is sent through: smtp.office365.com
Secured connection on port 587 using TLS
```

Just below, it is better to define that by default you want to reply to messages using the address to which the message was sent. To do this, select the option "Reply from the same address the message was sent to", rather than "Always reply from default address (currently prenom.nom@gmail.com)".


## Conclusion

It works. And most importantly, I now have access to my Office 365 address from both GMail and Outlook.

But for the record, I tested different methods until I found something that works (and I didn't look any further). I'm interested if someone knows a better solution and ideally the "official" settings.

{:.encart}
Version en français : [Accéder à Office 365 Mail depuis GMail]({% post_url 2020-02-24-acceder-office-365-mail-depuis-gmail %}){:hreflang="fr"}.
