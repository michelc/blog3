---
date: 2007-09-10 14:05:00
layout: post
redirect_from: "post/2007/09/10/Comment-je-me-suis-debarrasse-des-sessions"
tags: .net, ap
title: "Comment je me suis débarrassé des sessions"
---

Et pas "Pourquoi je me suis débarrassé des sessions" : je suis grand,
je fais comme je veux.

Pour tout dire, j'avais depuis toujours essayé d'éviter le recours aux
variables de session, mais je n'avais jamais vraiment trouvé le temps d'aller
jusqu'au bout. Et au final la situation de départ est quand même assez
confortable dans la mesure où Altrr-Press n'utilise quasiment pas de variables
de session :

* une pour mettre en cache le nom du répertoire virtuel (plutôt que le
retrouver à chaque fois à partir de Request.ApplicationPath),
* trois pour conserver le login, le nom et l'adresse mél de l'utilisateur
connecté,
* une pour faire passer des données d'une page à l'autre.

## Trop facile !

Dans le 1° cas, une simple variable statique a fait l'affaire. Je ne vois
d'ailleurs vraiment pas pourquoi j'avais utilisé une variable de session alors
qu'il s'agit d'une valeur commune à tous les utilisateurs.

```
public static string applicationPath {
    get {
        if (_applicationPath == null) {
            _applicationPath = HttpContext.Current.Request.ApplicationPath;
            if (_applicationPath != "/") {
                _applicationPath += "/";
            }
        }
        return _applicationPath;
    }
}
private static string _applicationPath;
```

## Quoique ?

Ca a été un peu moins simple en ce qui concerne le stockage des informations
sur l'utilisateur connecté puisque dans ce cas il s'agit bel et bien
d'informations distinctes pour chaque utilisateur.

Jusqu'à présent, chaque page commençait par contrôler que les informations
sur l'utilisateur connecté étaient à jour :

* vérifier si l'utilisateur connecté est toujours le même en comparant
Context.User.Identity.Name et Session["userId"]
* lorsque ce n'était pas/plus le cas, lire la fiche de l'utilisateur dans la
table des utilisateurs
* puis stocker son login (Session["userId"]), son nom (Session["userName"])
et son mél (Session["userEmail"])

Le but de tout ça étant d'éviter d'accéder à la base de données à chaque
fois qu'il était nécessaire d'utiliser ce genre d'informations (quand on
utilise Access ou qu'on n'est pas doué en SqlServer ou Oracle il faut savoir
compenser).

Je passe les détails mais c'était malgré tout assez compliqué. D'autant plus
qu'il fallait aussi tenir compte du fait qu'un utilisateur pouvait se connecter
et se déconnecter en cours de session.

Le défi était donc de trouver comment s'y prendre pour garder cette notion
de cache (pour économiser la base de données) tout en stockant ça ailleurs que
dans une variable session ?

* 1° solution possible : un cookie. Mais est-ce que c'est une réelle
économie comparée à un accès base de données ?
* 2° solution possible : la collection Context.Items. Mais elle ne vit
que le temps d'une page et cela obligerait à accéder à la base de donnée pour
chaque page.
* 3° solution possible : stocker ça dans un tableau ou une collection
qui serait conservé(e) en variable aplication ou en variable statique. Au
secours!

Je repasse les détails mais au final c'est un peu un mélange des 2 premières
solutions. Comme le faisait IBuySpy Portal à l'origine, Altrr-Press utilise un
cookie pour stocker les rôles de l'utilisateur connecté. Et ce cookie est géré
par l'évènement Application_AuthenticateRequest :

* s'il n'existe pas : la fiche utilisateur est lue depuis la base de
données et la liste de ses rôles est mise en cache dans le cookie,
* s'il existe : la liste des rôles de l'utilisateur est retrouvée à
partir du cookie sans accéder à la base de données.

Génial! Il y a tout ce dont j'ai besoin : l'accès à la fiche
utilisateur et la mise en cache dans un cookie. Au lieu de se limiter à la
liste des rôles, il suffit d'y ajouter le nom et l'adresse mél de l'utilisateur
et le tour est joué.

Et pour éviter d'avoir à accéder au cookie à longueur de page pour un oui ou
pour un non, j'ai en plus choisi de stocker le nom et le mél dans la collection
Context.Items. Comme ça, il suffit juste de remplacer toutes les utilisations
de Session["userXxxxx"] par Context.Items["userXxxxx"].

Pour ceux qui n'ont pas suivi (et pour que je m'en souvienne
moi-même) :

* les informations sur l'utilisateur qui proviennent de la base de données
sont mises en cache dans le cookie (pour quelques minutes),
* le nom et le mél qui proviennent du cookie sont mis en cache dans la
collection Context.Items (pour la durée de vie de la page).

## Plus qu'une...

Et de deux! Reste plus qu'à se débarrasser de la dernière variable de
session qui me sert à passer des données d'une page à une autre.

Concrètement, j'ai une classe XTable pour générer facilement un tableau HTML
à partir d'une requête SQL. Ca ne permet sans doute pas tout ce que font un
DataGrid ou un Repeater mais c'est optimisé, ça produit à coup sûr du code
XHTML valide et jusqu'à présent je n'ai pas eu besoin de plus.

Cette classe a une propriété AllowExport qui permet de faire apparaitre une
mini icone Excel. Un clic dessus pus un petit peu de magie et cela génère
automatiquement un fichier CSV correspondant aux données affichées. Le truc
c'est que les données au format CSV sont générées sous forme de StringBuilder
puis passées via une variable session à une fenêtre ouverte en popup qui les
envoie au client en tant que "application/x-csv" pour que ça lui démarre
Excel.

Je sais qu'il n'y a vraiment pas de quoi être fier. Mais d'un ça avait été
fait en 5 seconder pour en jeter plein la vue et de deux c'est le genre de
fonctionnalité qui ne sert pas si souvent que ça.

Pour l'instant, j'ai pas cherché midi à quatorze heures (je ferai mieux le
jour où ça sera réellement indispensable) :

* je génère un GUID,
* je crée une variable application dont la clé est le GUID,
* j'y stocke mes données CSV,
* je passe le GUID à la page appelée par la popup,
* celle-ci récupère la variable application à partir du GUID, la supprime
puis renvoie son contenu au client.

Après quelques essais j'ai finalement décidé de remplacer la variable
application par l'utilisation de cache (Context.Cache) parce qu'il a en plus la
faculté d'expirer tout seul.

## Et ça marche :)

Une dernière recompilation générale, une ligne &lt;sessionState mode="Off"
/&gt; dans le Web.config, un test complet et ça marche ou presque.

En fait, au moment de la déconnexion je faisais un Session.RemoveAll() et un
Session.Abandon() pour supprimer toutes les variables de session qui auraient
pu être créées ici ou là. Et ben ça plante quand les sessions ne sont pas
activées.

J'ai mis un try/catch autour. On peut pas savoir.
