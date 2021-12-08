---
date: 2006-10-25 12:00:00
layout: post
redirect_from: "post/2006/10/25/Evolutions-QC-au-25-octobre-2006"
tags: qc
title: "Evolutions QC au 25 octobre 2006"
---

Récapitulatif de ce qui a été fait depuis le [29 juin 2006]({% post_url 2006-06-29-evolutions-qc-29-juin-2006 %})
(essentiellement lié à la fusion des sources de OTT) :

* _dumpdb.aspx : Fichier dump.sql généré dans le sous-répertoire data
(car il a toujours les droits d'écriture)
* _initdb.aspx : Amélioration gestion enchainement de commandes sql
* _initdb.aspx : Prise en compte des instructions MODIFY et RENAME
* LiteralFR.config : Traduction des messages de la boite
Classic.Password
* BDHelper.cs : Gestion des erreurs dans la fonction ListZip
* BDHelper.cs : Simplification de la traduction des
pseudos-fonctions
* BDHelper.cs : Ajout des pseudos-fonctions sql #DAY(), #MONTH(),
#YEAR() et #SUBSTRING()
* editDiscussions.ascx.cs : Gestion du marqueur {@OK} pour le Helpdesk
Snef
* viewFeedback.ascx : Les champs paramétrables sont mis à
Enabled=False
* viewPassword.ascx.cs : Utilisation des messages traduits en
français
* Common.cs : Ajout de la propriété IsLoopback
* Email.cs : Ajout de la propriété Reply-To
* Email.cs : Utilisation de smtp.gmail.com en plus de
smtp.ifrance.com
* InputHelper.cs : Suppression des &lt;br /&gt; en début ou fin de texte
dans la fonction newLineToBR()
* Regular.cs : Passage des variables {@user.ip} et {@user.dns} dans la
fonction CommonVariables()
* Users.cs : Accepte un mot de passe vide quand on est en localhost
* dlgFiles.aspx.cs : Gère cas où pas de fichier uploadé avec
Firefox
* qc_Classic.cs : Amélioration présentation des XTables
