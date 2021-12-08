---
date: 2008-10-07 18:53:00
layout: post
redirect_from: "post/2008/10/07/Configuration-de-TortoiseSVN"
tags: svn
title: "Configuration de TortoiseSVN"
---

Après avoir installé TortoiseSVN (pour l'instant une version 1.4.6, 1.4.7 ou
1.4.8) sur le poste de travail, il reste à le configurer pour qu'il fonctionne
de manière optimale avec les sources de Altrr-Press.

Faire clic-droit dans l'explorateur de fichiers puis choisir les menus
"TortoiseSVN" et "Settings" :

![](/public/2008/config-1.png)

On obtient alors le premier écran de configuration suivant :

![](/public/2008/config-2.png)

Les paramètres à y définir :

* conserver "English" comme langue (c'est plus facile pour trouver de la
documentation quand on connait le terme anglais exact)
* pour la liste des fichiers à ignorer, définir : Web.config *.suo *.webinfo
*.user *\bin *\obj *\data *.mdb *.bak *.zip *.rar
* bien penser à utiliser "_svn" plutôt que ".svn" pour que tout fonctionne
correctement avec ASP.NET

Cliquer sur le bouton [Appliquer] puis sur "Look and Feel" pour poursuivre
le paramétrage :

![](/public/2008/config-3.png)

Là, il faut normalement juste décocher "Check for modifications" pour que
cette commande apparaisse dès le clic-droit dans le répertoire de travail (et
pas comme un sous-menu de "TortoiseSVN").

Après validation avec le bouton [Appliquer], passer à l'écran "Icon
Overlays" :

![](/public/2008/config-4.png)

Dans cet écran, choisir d'appliquer le recouvrement d'icônes uniquement sur
les disques fixes, pour éviter de perdre du temps quand on est sur des lecteurs
réseaux.

Pour être encore plus efficace, on peut aussi :

* exclure tout le disque C:
* ne gérer que le répertoire D:\Portals et ses sous-répertoires (puisque
c'est là que sont "théoriquement" tous les sources importants)

(d'après le billet [
Optimize Tortoise SVN Cache (TSVNCache.exe) Disk I/O](http://paraesthesia.com/archive/2007/09/26/optimize-tortoise-svn-cache-tsvncache.exe-disk-io.aspx))
