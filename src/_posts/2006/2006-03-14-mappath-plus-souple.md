---
date: 2006-03-14 07:51:00
layout: post
redirect_from: "post/2006/03/14/Un-MapPath-plus-souple"
tags: .net, qc
title: "Un MapPath() plus souple"
---

La méthode MapPath() renvoie le chemin d'accès physique qui correspond à
l'url qui lui est passé en argument.

Le problème est que Server.MapPath() n'accepte que les répertoires virtuels
comme paramètre, qu'il s'agisse d'une url absolue (here/myfile.txt) ou relative
(../yourdir/yourfile.txt) ou même d'une url commençant par un tilde
(~/ourdir/ourfile.txt).

Mais elle provoque une erreur dès que son argument est une url complète
(http://www.example.com/mydir/myfile.txt) ou correspond déjà à une adresse
physique (D:\websites\example.com\mydir\myfile.txt).

Pour simplifier l'utilisation de la méthode MapPath() et éviter de tester
ses arguments à chaque appel, ajout d'une méthode MapPath() améliorée à la
classe Common.cs. :

```
///<summary>
/// Same as Server.MapPath but don't hang on physical path
///</summary>
public static string MapPath (string path) {
   string temp = path;
   try {
      temp = System.Web.HttpContext.Current.Server.MapPath(path);
   } catch (Exception ex) {
      try {
         System.Uri utemp = new System.Uri(path);
         if (utemp.IsFile == true) {
            temp = utemp.LocalPath;
         } else {
            temp = System.Web.HttpContext.Current.Server.MapPath(utemp.LocalPath);
         }
      } catch {
         throw ex;
      }
   }
   return (temp);
}
```

Màj du 19/03 : gère le cas où l'url passée en argument comprend des
paramètres (here/myflash.swf?file=test.mp3).

```
public static string MapPath (string path) {
   string temp = path + "?";
   temp = temp.Split('?')[0];
   try {
      temp = Context.Server.MapPath(temp);
   } catch (Exception ex) {
      try {
         Uri utemp = new Uri(temp);
         if (utemp.IsFile == true) {
            temp = utemp.LocalPath;
         } else {
            temp = Context.Server.MapPath(utemp.LocalPath);
         }
      } catch {
         throw ex;
      }
   }
   return (temp);
}
```
