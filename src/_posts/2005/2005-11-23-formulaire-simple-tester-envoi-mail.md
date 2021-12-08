---
date: 2005-11-23 16:30:00
layout: post
redirect_from: "post/2005/11/23/Un-formulaire-simple-pour-tester-lenvoi-de-mail"
tags: .net, code-snippets
title: "Un formulaire simple pour tester l'envoi de mail"
---

```
<%@ Page Language="C#" %>
<%@ Import Namespace="System.Web.Mail" %>
<script runat="server">
void btnSubmit_Click(Object sender, EventArgs e) {
  MailMessage mail = new MailMessage();
  mail.To = txtTo.Text;
  mail.From = txtFrom.Text;
  mail.Subject = txtSubject.Text;
  mail.Body = txtMessage.Text;
  mail.Priority = MailPriority.High;
  mail.BodyFormat = MailFormat.Text;
  SmtpMail.SmtpServer = txtSmtpServer.Text;
  if (txtSmtpUsername.Text.Trim() != "") {
    if (txtSmtpPassword.Text.Trim() != "") {
      mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate", "1");
      mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendusername", txtSmtpUsername.Text);
      mail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendpassword", txtSmtpPassword.Text);
    }
  }
  try {
    SmtpMail.Send(mail);
    Response.Write("OK!");
  } catch (Exception ex) {
    Response.Write("KO: " + ex.ToString());
  }
}
</script>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Mail test</title>
  </head>
  <body>
    <form runat="server">
      <ul>
        <li>Smtp Server : <asp:TextBox id="txtSmtpServer" runat="server"></asp:TextBox></li>
        <li>Smtp Username : <asp:TextBox id="txtSmtpUsername" runat="server"></asp:TextBox></li>
        <li>Smtp Password : <asp:TextBox id="txtSmtpPassword" runat="server"></asp:TextBox></li>
        <li>From : <asp:TextBox id="txtFrom" runat="server"></asp:TextBox></li>
        <li>To : <asp:TextBox id="txtTo" runat="server"></asp:TextBox></li>
        <li>Subject : <asp:TextBox id="txtSubject" runat="server"></asp:TextBox></li>
        <li>Message : <asp:TextBox id="txtMessage" TextMode="MultiLine" runat="server"></asp:TextBox></li>
      </ul>
      <asp:Button runat="server" id="btnSubmit" OnClick="btnSubmit_Click" Text="Send"></asp:Button>
    </form>
  </body>
</html>
```
