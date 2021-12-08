---
date: 2005-01-14 14:21:00
layout: post
redirect_from: "post/2005/01/14/Wdevs-SystemWebMail-and-smtpgmailcom"
tags: code-snippets, csharp, qc, wdevs
lang: en-US
title: "(Wdevs) System.Web.Mail and smtp.gmail.com"
---

Important update: there is another snippet to [use
smtp.gmail.com with System.Net.Mail]({% post_url 2009-04-21-systemnetmail-smtpgmailcom %}) for .NET 2.

Since I had difficulties to find examples on Google, I publish my code that
uses smtp.gmail.com as smtp server to send emails.

```
public string sendMail (string from, string to, string cc, string bcc, string subject, string body) {

  // Mail initialization
  MailMessage mail = new MailMessage();
  mail.From = from;
  mail.To = to;
  mail.Cc = cc;
  mail.Bcc = bcc;
  mail.Subject = subject;
  mail.BodyFormat = MailFormat.Text;
  mail.Body = body;

  // Smtp configuration
  SmtpMail.SmtpServer = "smtp.gmail.com";
  // - smtp.gmail.com use smtp authentication
  mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate", "1");
  mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendusername", "myemail@gmail.com");
  mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendpassword", "mypassword");
  // - smtp.gmail.com use port 465 or 587
  mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpserverport", "465");
  // - smtp.gmail.com use STARTTLS (some clients call this SSL)
  mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpusessl", "true");

  // Mail sending
  try {
    SmtpMail.Send(mail);
    return "";
  } catch (Exception ex) {
    return ex.Message;
}
```

In addition, two useful links:

* <http://www.systemwebmail.com/> : the
complete FAQ for the System.Web.Mail namespace
* <http://webman.developpez.com/articles/aspnet/email/csharp/> :
an article on how-to send emails win ASP.Net (in french)

Unfortunately this code doesn't function under mono:

```
Server reponse: '530 5.7.0 Must issue a STARTTLS command first';Status code: '530';Expected status code: '250';Last command: 'MAIL FROM: '
```
