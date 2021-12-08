---
date: 2005-06-24 15:00:00
layout: post
redirect_from: "post/2005/06/24/Authentification-LDAP"
tags: qc
title: "Authentification LDAP"
---

Ajouté la possibilité de gérer l'authentification de l'utilisateur par
rapport à l'Active Directory. L'existence de l'utilisateur et la validité de
son mot de passe sont tout d'abord contrôlés via le serveur LDAP. S'ils sont
ok, le nom de l'utilisateur et son adresse mél sont récupérés dans l'AD et
servent à mettre à jour l'enregistrement correspondant à l'utilisateur dans la
table qc_Users.

Liste des paramètres du Web.config :

* ldapServer (obligatoire) : configure le serveur LDAP à employer par le site
pour effectuer l'authentification (peut être de la forme
"LDAP://ldap.exemple.com" ou
"LDAP://ldap.exemple.com/dc=azerty,dc=exemple.com")
* ldapUsername et ldapPassword : spécifient éventuellement le compte et le
mot de passe nécessaires à l'utilisation du serveur LDAP. Lorsque l'un de ces
paramètres est vide, la connexion se fait avec le login et le mot de passe de
l'utilisateur et le fait de réussir à créer l'objet signifie que
l'authentification est ok
* ldapFilter : indique sur quel critère filtrer la lecture des informations
de l'utilisateur ("uid" par exemple et "SAMAccountName" par défaut)
* ldapPropertyName : nom de la propriété à utiliser pour retrouver le nom de
l'utilisateur ("cn" par défaut)
* ldapPropertyMail : nom de la propriété à utiliser pour retrouver l'email de
l'utilisateur ("mail" par défaut)
* ldapRoles : défini les rôles attribués par défaut à un nouvel utilisateur
(pas encore implémenté)

Lorsque l'authentification échoue via l'AD, une seconde tentative est
effectuée via la table qc_Users => il est ainsi possible d'avoir des comptes
LDAP et des comptes spécifiques à QC.

Il y a toujours création d'un enregistrement dans qc_Users pour chaque
compte LDAP car les autorisations sont uniquement gérées au niveau de la base
de données (pour l'instant ?).

Référence : [LDAP,
What is Lightweight Directory Access Protocol?](http://www.youcanlearnseries.com/Programming Tips/CSharp/WhatisLDAP.aspx)
