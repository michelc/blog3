---
date: 2009-04-21 17:17:00
layout: post
redirect_from: "post/2009/04/21/SystemNetMail-et-smtpgmailcom"
tags: ap, code-snippets, csharp
title: "System.Net.Mail et smtp.gmail.com"
---

Poursuivant mes essais de [migration d'Altrr-Press vers ASP.NET 2.0]({% post_url 2008-10-02-migration-altrr-press-net-1-net-2 %}), j'ai enfin étudié comment
remplacer System.Web.Mail par System.Net.Mail. Jusqu'à présent, j'utilisais la
méthode décrite dans mon plus célèbre billet [System.Web.Mail and smtp.gmail.com]({% post_url 2005-01-14-wdevs-systemwebmail-smtpgmailcom %}).

Par rapport à cette méthode, les modifications à apporter n'ont finalement
pas été si compliquées que ça :

```
public string sendMail (string from, string to, string cc, string bcc, string subject, string body) {

  // Mail initialization
  MailMessage mail = new MailMessage();
  mail.From = new MailAddress(from);
  mail.To.Add(to);
  if (cc != "") {
    mail.Cc.Add(new MailAddress(cc));
  }
  if (bcc != "") {
    mail.Bcc.Add(new MailAddress(bcc));
  }
  mail.Subject = subject;
  mail.IsBodyHtml = false;
  mail.BodyEncoding = System.Text.Encoding.UTF8;
  mail.Body = body;

  // Smtp configuration
  SmtpClient smtp = new SmtpClient();
  smtp.Host = "smtp.gmail.com";
  // - smtp.gmail.com use smtp authentication
  smtp.Credentials = new NetworkCredential("myemail@gmail.com", "mypassword");
  // - smtp.gmail.com with System.Net.Mail accepts port 25 or 587
  smtp.Port = 25;
  // - smtp.gmail.com use STARTTLS (some clients call this SSL)
  smtp.EnableSsl = true;

  // Mail sending
  try {
    smtp.Send(mail);
    return "";
  } catch (Exception ex) {
    return ex.Message;
  }
}
```

Une première petite difficulté est venu des propriétés From, To, Cc et Bcc
de l'objet MailMessage qui ne sont plus de type chaine comme en .NET 1 mais du
type MailAddress ou collection de MailAddress.

Mais le plus gros problème, c'est qu'avec System.Net.Mail, je n'ai jamais
réussi à utiliser le port 465 alors qu'il fonctionne très bien avec
System.Web.Mail (et même sur un site en .NET 2 qui utilise encore
System.Web.Mail !!!). Et comme en local le port 587 n'est pas ouvert, j'ai un
peu trainé pour faire mes tests puisque je devais à chaque fois faire une mise
en production afin de vérifier si cela fonctionnait.

Mais au final, j'ai quand même découvert qu'avec System.Net.Mail :

* cela fonctionne aussi bien avec le port 587 qu'avec le port 25 (!)
* il n'est même pas nécessaire de définir la propriété smtp.Port pour que le
mail parte (re !)
