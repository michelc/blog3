---
date: 2009-04-28 11:30:00
layout: post
redirect_from: "post/2009/04/28/Pinguer-une-Url"
tags: code-snippets, csharp
title: "Pinguer une Url"
---

Il est quelquefois très pratique de pouvoir exécuter un traitement sur un
site web. Par exemple, dans PI il existe une page pour sauvegarder
automatiquement la base de données. Le problème, c'est que sous Windows, il
n'est pas possible de faire une tache planifiée qui appelle directement une
page web.

J'avais écrit il y a quelques temps un petit utilitaire UrlPing pour faire
une requête sur une page web en indiquant simplement l'url à atteindre. Tout
marchait plutôt bien depuis plus d'un an jusqu'à ce qu'hier j'essaie de
l'utiliser avec une url qui ne correspond pas à un "vrai" fichier .aspx mais à
une url "rewritée". Et là, cela provoque une erreur du type "[Tentatives de redirection
automatique trop nombreuses](http://stackoverflow.com/questions/518181/too-many-automatic-redirections-were-attempted-error-message-when-using-a-httpweb)".

J'en ai donc profité pour améliorer le code et le publier si jamais cela
intéresse quelqu'un.

```
using System;
using System.Net;

namespace Altrr.Tools.UrlPing
{
  class Start
  {
    [STAThread]
    static void Main(string[] args)
    {
      if (args.Length == 1)
      {
        string url = args[0];
        Console.Write(url + " : ");
        try
        {
          var request = (HttpWebRequest)HttpWebRequest.Create(url);
          request.CookieContainer = new CookieContainer();
          request.Method = "HEAD";

          var response = (HttpWebResponse)request.GetResponse();
          Console.WriteLine("OK (" + Convert.ToInt32(response.StatusCode) + " - " + response.StatusDescription + ")");

          string urlr = response.ResponseUri.ToString();
          if (url != urlr) {
            Console.WriteLine("-------\n" + urlr);
          }
        }
        catch (Exception ex)
        {
          Console.WriteLine("KO\n-------\n" + ex.Message);
        }
      }
      else
      {
        Console.WriteLine("Syntax : UrlPing url");
      }
    }
  }
}
```

## Mises à jour

Si jamais le site visé renvoie une erreur `401 - Non autorisé` et que
l'authentification est basé sur Active Directory, il faut initialiser l'objet
`HttpWebRequest` de la façon suivante :

```
          request.Method = "GET";
          request.UseDefaultCredentials = true;
          request.PreAuthenticate = true;
          request.Credentials = CredentialCache.DefaultCredentials;
```

Dans le cas où l'utilisateur en cours n'aurait pas les droits nécessaires, c'est
juste un petit peu plus compliqué :

```
          request.Method = "GET";
          request.UseDefaultCredentials = false;
          request.PreAuthenticate = true;
          var cache = new CredentialCache();
          cache.Add(new Uri(url)
                  , "NTLM"
                  , new NetworkCredential("username", "password", "domain"));
          request.Credentials = cache;
```

Et pour mémoire, ça ne marche pas du tout avec `request.Method = "HEAD";` !

## Version PowerShell

```
# Crée un objet PSCredential
# (pour ne pas avoir à saisir login/motpasse interactivement)

$mon_password = ConvertTo-SecureString "password" -AsPlainText -Force
$mon_credential = New-Object System.Management.Automation.PSCredential ("domain\username", $mon_password)

# Pingue l'URL

$mon_url = "http://www.mon-intranet.com/"
Invoke-RestMethod -Uri $mon_url -Credential $mon_credential
```

Sources :

* <https://msdn.microsoft.com/en-us/powershell/reference/5.1/microsoft.powershell.utility/invoke-restmethod>
* <https://blogs.msdn.microsoft.com/koteshb/2010/02/12/powershell-how-to-create-a-pscredential-object/>
