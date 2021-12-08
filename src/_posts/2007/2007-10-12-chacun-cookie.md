---
date: 2007-10-12 10:58:00
layout: post
redirect_from: "post/2007/10/12/A-chacun-son-cookie"
tags: ap
title: "A chacun son cookie"
---

Altrr-Press utilise pour l'instant 3 cookies :

* le cookie d'authentification,
* qc_siteroles : un cookie crypté pour stocker les rôles de l'utilisateur
(ses autorisations),
* qc_adminvisible : un cookie pour stocker si la barre d'administration est
affichée ou cachée.

Le cookie d'authentification ne pose pas de problème. Il est entièrement
pris en charge par ASP.NET et il est propre à chaque session utilisateur (c'est
du moins ce qu'il me semble).

Le cookie "qc_siteroles" est géré "manuellement" au niveau de l'évènement
"Application_AuthenticateRequest" dans le Global.asax. Le problème c'est qu'il
s'appelle "qc_siteroles" pour toutes les sessions utilisateurs ce qui provoque
des erreurs :

* Si on se connecte à 2 répertoires virtuels localhost/xxx et localhost/yyy
cela provoque une exception System.Security.Cryptography.CryptographicException
à cause de données incorrectes (je suppose que c'est parce qu'il a été crypté
dans un contexte et qu'on cherche à le décrypter dans un autre).
* Si on se connecte à 1 répertoire virtuel localhost/xxx sous 2 logins
différents cela ne provoque pas d'erreur, mais le 2° connecté récupère les
droits du 1° connecté puisqu'en fait on lit le cookie créé pour le 1°
login.

## Solution temporaire et qui n'a que trop durée

Au tout début du développement, le problème crucial c'était de tester que la
gestion des droits fonctionnait sans bugs. Il fallait donc au minimum pouvoir
se connecter au même répertoire virtuel sous plusieurs logins pour vérifier que
les droits paramétrés s'appliquaient comme on pouvait s'y attendre.

Par conséquent, ce qui avait été fait, c'était d'ajouter le login de
l'utilisateur connecté dans le nom du cookie qui était ainsi devenu
"qc_monlogin_siteroles". Grace à cette astuce, il devenait possible de se
connecter à un même répertoire virtuel localhost/xxx sous 2 logins différents
et de ne pas s'emméler dans les autorisations.

C'était plutôt pas mal puisque ça a permis de mettre en place un système de
gestion des droits qui tenait la route. Par contre, ça a quand même laissé en
plan un certain nombre de problèmes :

* il y avait toujours l'exception cryptographique quand on se connectait à 2
répertoires virtuels différents avec le même login,
* pas sûr que ça ait jamais été testé dans le cas de sites avec des domaines
ou des sous-domaines différents,
* c'est limite faille de sécurité que de faire apparaitre en clair le login
dans le nom du cookie.

## Première tentative d'amélioration

Après presque 3 ans à temporiser, le fait de ne pas pouvoir se connecter à
plusieurs répertoires virtuels en même temps commençait à devenir pesant. Il
fallait louvoyer en ouvrant un site local dans Internet Explorer et un autre
dans Firefox (voire un troisième dans Safari ces derniers temps), mais ça
tenait vraiment trop du cache-misère.

Puisqu'il fallait pouvoir se connecter à des répertoires virtuels
différents, la solution de facilité était d'insérer le nom de ces répertoires
dans le nom du cookie. Et c'est comme ça qu'on est passé de
"qc_monlogin_siteroles" à "qc_xxx_monlogin_infos". (Au passage "_siteroles" est
devenu "_infos" parce que le cookie a gagné le droit de stocker le nom et
l'email de l'utilisateur en plus de ses rôles.)

C'est déjà un tout petit peu mieux :

* la connexion à des répertoires virtuels différents avec le même login
marche enfin,
* le cas de sites avec des domaines ou des sous-domaines différents n'est pas
encore testé,
* et la faille de sécurité est toujours là.

## Dernière tentative bonne pour la route

Le soucis de sécurité venant du fait que le login utilisateur apparait en
clair dans le nom du cookie, il suffit de le crypter pour résoudre ce problème.
Par conséquent, au lieu de garder en clair la chaine "xxx_monlogin_infos" dans
le nom du cookie, celle-ci est maintenant codée et le nom du cookie devient
quelque chose comme ap_97DA57F427F4AAA84DFF310904005EB5.

string cookieName = Common.applicationPath + Context.User.Identity.Name +
"/roles"; cookieName = "ap_" +
FormsAuthentication.HashPasswordForStoringInConfigFile(cookieName, "md5");

Voilà! Il ne reste plus qu'à tester que tout ça fonctionne aussi pour des
domaines ou des sous-domaines différents. Bien qu'à prori je ne vois pas trop
pourquoi cela créerait des difficultés.

Et pour conclure, je n'ai pas oublié le cas du cookie "qc_adminVisible". Il
est lui aussi commun à toutes les sessions locales, mais dans la pratique ce
n'est ni bloquant ni foncièrement génant. J'ai seulement changé son nom en
"ap_adminVisible".

## Quelques explications supplémentaires après coup.

Bonne nouvelle : ça marche dans le cas de domaines ou de sous-domaines
différents. Ouf!

Sinon, en regardant un peu mieux comment fonctionnaient les cookies sous IE,
il existe une espèce de fichier conteneur par site dans lequel sont enregistrés
tous les cookies du site. Il y a donc un conteneur pour stocker tous les
cookies créés par les sites situés sur localhost. C'est ce qui explique qu'il
faille donner un nom différent pour éviter que les cookies d'un répertoire
virtuel soit en conflit avec ceux des autres répertoires virtuels de
localhost.

D'un autre côté, les cookies ont une propriété Path qui permet de définir
l'url à laquelle ils s'appliquent. Jusque là, j'avais gardé la façon de faire
de IBuySpy Portal qui initialisait cette valeur à "/". En fait, il suffit de
l'initialiser avec le nom du répertoire virtuel pour créer un conteneur par
répertoire virtuel. Par conséquent, plutôt que de faire apparaitre le nom du
répertoire virtuel dans le nom du cookie, il serait possible d'utiliser cette
propriété pour distinguer les cookies de chaque répertoire virtuel. Mais bon,
c'est pas vital.

Et pour finir : au moment du logout, on supprime les cookies ap_*, mais ils
ne disparaitront vraiment que lorsque le navigateur sera fermé !!! Ou plutôt
lorsque le cookie aura expiré (soit 1 minute après sa création dans le cas du
cookie pour les rôles) ? Heureusement, ça ne pose pas de problème dans le cas
où on fait Page précédente : même si on a les icones de mise à jour on tombe
toujours sur "Access denied" lorsqu'on essaie de les utiliser.
