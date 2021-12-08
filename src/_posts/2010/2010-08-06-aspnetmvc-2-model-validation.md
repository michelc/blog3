---
date: 2010-08-06 17:42:00
layout: post
redirect_from: "post/2010/08/06/asp-net-mvc-2-model-validation"
tags: mvc
title: "ASP.NET MVC 2 : Validation basée sur le modèle"
---

{:.encart}
Ceci est la traduction du billet "[ASP.NET MVC 2: Model Validation](http://weblogs.asp.net/scottgu/archive/2010/01/15/asp-net-mvc-2-model-validation.aspx)" de Scott Guthrie.

Ceci est le deuxième billet d'une série consacrée à la prochaine sortie de
ASP.NET MVC 2. Ce billet aborde les améliorations apportées à la validation
dans la future version de ASP.NET MVC 2.

## La validation dans ASP.NET MVC 2

Valider les saisies utilisateurs et appliquer des règles métiers est un
besoin élémentaire dans la plupart des applications web. ASP.NET MVC 2 propose
un tas de nouvelles fonctionnalités qui simplifient de façon significative la
validation de la saisie utilisateur et l'application de règles de validation
sur les objets Model ou ViewModel. Ces fonctionnalités sont conçues de façon à
ce que la logique de validation soit toujours appliquée côté serveur et qu'en
option elle puisse aussi être applicable côté client via du code Javascript.
L'infrastructure et les fonctionnalités de validation d'ASP.NET MVC 2 sont
conçues avec deux objectifs :

* Les développeurs peuvent facilement employer les DataAnnotations pour gérer
la validation. Basées sur de simples déclarations, les DataAnnotations donnent
la possibilité d'ajouter des règles de validation aux objets et aux propriétés
avec un minimum de code.
* S'ils le souhaitent, les développeurs peuvent intégrer leur propre système
de validation ou employer un framework de validation existant, tel que Castle
Validator ou EntLib Validation Library. Les fonctionnalités de validation de
ASP.NET MVC 2 sont conçues pour faciliter l'incorporation de tout type
d'architecture de validation - tout en conservant les avantages de la nouvelle
infrastructure de validation de ASP.NET MVC 2 (comprenant la validation côté
client, la validation du binding avec le modèle, etc...)

Grâce à tout cela, la validation est vraiment très simple dans la majorité
des cas, tout en restant suffisamment flexible pour les scénarios d'utilisation
les plus évolués.

## Utiliser les DataAnnotations pour la validation en ASP.NET MVC 2

Pour apprendre à tirer parti du support des DataAnnotations pour valider les
données, nous allons étudier un exemple de scénario CRUD tout simple. Et nous
allons plus précisément développer un formulaire "Create" qui permettra à
l'utilisateur de saisir les coordonnées de ses amis :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_5F17F852.png)

Notre objectif est de vérifier que les informations saisies sont valides
avant de les enregistrer dans la base de données et si ce n'est pas le cas
afficher les messages d'erreurs correspondant :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_63AE030C.png)

Nous souhaitons que cette validation s'effectue à la fois côté serveur et
côté client (via du Javascript). Et nous voulons que notre code respecte
l'approche DRY ("Don't Repeat Yourself") - ce qui implique que nous devons
appliquer les règles de validation en un seul endroit et qu'elles soient
respectées par les contrôleurs, les actions et les vues.

Je vais utiliser VS 2010 et ASP.NET MVC 2 pour mettre en oeuvre le scénario
décrit ci-dessus. Mais vous pouvez tout aussi bien employer VS 2008 et ASP.NET
MVC 2 pour arriver au même résultat.

## Etape 1: Implémenter FriendsController (sans validation pour
commencer)

Nous commencerons par ajouter une classe "Person" toute simple à notre
nouveau projet ASP.NET MVC 2 :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_36B8A031.png)

Celle-ci contient 4 propriétés, implémentées en utilisant les [propriétés automatiques de C#]({% post_url 2009-06-25-proprietes-automatiques-c-sharp %}) (un truc que VB gère aussi dans
VS 2010 - Youhou !).

Nous allons ensuite ajouter une classe contrôleur "FriendsController" à
notre projet qui exposera deux méthodes d'action "Create". La première action
est appelée lorsque une requête HTTP-GET est faite sur l'URL /Friends/Create.
Cela affichera un formulaire vide pour y saisir les informations d'une
personnes. La seconde action est appelée lorsque une requête HTTP-POST est
postée vers l'URL /Friends/Create. Elle fait correspondre les zones de saisie
du formulaire avec un objet Person, contrôle qu'il n'y a pas d'erreur de
correspondance, et si c'est correct va éventuellement l'enregistrer dans la
base de données (nous verrons cet aspect du travail plus loin dans ce
tutoriel). Si les données envoyées par le formulaire sont incorrectes, la
méthode d'action ré-affiche le formulaire de saisi avec les messages
d'erreur :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_1558FA95.png)

Une fois que nous avons programmé notre contrôleur, nous pouvons faire un
clic-droit à l'intérieur d'une de ces méthodes d'action et sélectionner la
commande "Add View" de Visual Studio - ce qui affiche la boite de dialogue "Add
View". Nous demandons à générer une vue de type "Create" basée sur un objet
Person :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_0569B5D1.png)

Visual Studio va alors générer automatiquement un fichier Create.aspx dans
le répertoire \Views\Friends de notre projet. Vous pouvez pouvoir voir
ci-dessous comment il tire parti des nouveaux helpers HTML fortement typés
gérés par ASP.NET MVC 2 (ce qui offre un contrôle à la compilation et une
meilleure intellisense).

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_43169D8D.png)

Et maintenant, lorsque nous lançons l'application et appelons l'URL
/Friends/Create nous arrivons sur un formulaire vide dans lequel nous pouvons
effectuer notre saisie :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_67C7B504.png)

Cependant, étant donné que nous n'avons pas encore implémenté l'aspect
validation, rien ne nous empêche de saisir des informations erronées dans ce
formulaire et de les publier vers le serveur.

## Etape 2: Activer la Validation avec les DataAnnotations

Nous allons maintenant mettre à jour notre application pour qu'elle respecte
quelques règles de validation de base. Nous implémenterons ces règles sur notre
objet "Person" - et pas dans le contrôleur "FriendsController" ou la vue
"Create". L'avantage d'implémenter ces règles au niveau de l'objet "Person"
nous assure que ces règles seront suivies dans tous les cas où notre
application utilisera l'objet "Person" (pour gérer l'action "Edit" par
exemple). Cela nous aide à éviter de répéter nos règles de validation plusieurs
fois dans notre application et donc à respecter la philosophie DRY.

ASP.NET MVC 2 permet aux développeurs d'ajouter facilement des attributs de
validation sous forme de déclaration aux différentes classes Model ou ViewModel
et ensuite que ces règles de validation soient automatiquement appliquées
chaque fois que l'application fera du binding de données pour ces classes. Pour
mettre cela en application, nous allons modifier notre classe Person pour y
définir quelques attributs de validation. Pour cela, nous commençons par faire
un "using" de l'espace de noms "System.ComponentModel.DataAnnotations" dans
l'en-tête du fichier source - puis préfixer les propriétés de l'objet Person
avec les attributs de validation [Required], [StringLength], [Range], et
[RegularExpression] (qui sont tous disponible via cet espace de nom) :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_576C3D4B.png)

Remarque : Nous avons défini les messages d'erreurs sous
forme de chaines. Il est aussi possible de les définir dans des fichiers de
ressources puis de les adapter en fonction de la langue des visiteurs. Vous
avez plus d'informations sur la façon de localiser les messages d'erreur dans
le billet "[Localizing ASP.NET MVC Validation](http://haacked.com/archive/2009/12/12/localizing-aspnetmvc-validation.aspx)".

Maintenant que nous avons ajoutés des attributs de validation à notre classe
Person, nous pouvons relancer l'application et regarder ce qui se passe quand
nous saisissons des données incorrectes puis que nous les envoyons au
serveur :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_554F3E82.png)

Vous pouvez constater que notre application offre désormais une gestion des
erreurs tout à fait satisfaisante. Les zones de saisies avec des données
incorrectes sont surlignées en rouge et les messages d'erreur de validation que
nous avons définis sont portés à la connaissance de l'utilisateur. D'autre
part, le formulaire a conservé le contenu des éléments saisis - si bien que
l'utilisateur n'a qu'à les corriger et pas à les saisir à nouveau.

Vous vous demandez sans doute comment ça marche ?

Pour bien comprendre ce comportement, regardons de plus près la méthode
d'action Create qui gère la requête POST envoyée par le formulaire :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_3A366F74.png)

Quand notre formulaire HTML est envoyé vers le serveur, la méthode ci-dessus
est appelée. Etant donnée que cette méthode d'action attend un objet "Person"
en paramètre, ASP.NET MVC va créer un objet "Person" et automatiquement
initialiser ses propriétés à partir des informations du formulaire. Au cours de
cette phase, il va aussi contrôler si les attributs de validation
DataAnnotation sont valides pour cet objet Person. Si tout est correct, alors
la propriété ModelState.IsValid renverra vrai et dans ce cas nous
sauvegarderons (bientôt) cette personne dans la base de données puis nous
ferons une redirection vers la page d'accueil.

S'il y a la moindre erreur de validation pour notre objet "Person", la
méthode d'action va ré-afficher le formulaire avec les données saisies. C'est
ce dont se charge la dernière ligne de code dans l'exemple ci-dessus.

Les messages d'erreurs sont alors affichés dans la vue grâce au fait que
notre formulaire Create contient des méthodes helper &lt;%=
Html.ValidationMessageFor() %&gt; en face de chaque helper &lt;%=
Html.TextBoxFor() %&gt;. Ces helpers vont afficher le message d'erreur
correspondant pour chaque propriété incorrecte qui aura été passée à à
vue :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_263CDCDE.png)

Le plus sympa avec cette approche, c'est qu'elle est carrément simple à
mettre en œuvre et qu'elle nous permet très facilement d'ajouter ou de modifier
des règles de validation à notre classe Person sans avoir à mettre à jour le
moindre code dans nos vues ou nos contrôleurs. Cette capacité de définir les
règles de validation à un seul endroit pour qu'elles soient prises en compte et
respectées partout ailleurs nous permet de faire évoluer notre application et
ses règles extrêmement rapidement avec un minimum de travail et en suivant au
mieux la philosophie DRY.

## Etape 3: Activer la validation côté client

Actuellement, la validation pour notre application ne s'exécute que côté
serveur, ce qui signifie que nos utilisateurs devront valider le formulaire
pour l'envoyer vers le serveur afin de savoir si leur saisie est correcte.

Un des aspects intéressant de l'architecture de validation de ASP.NET MVC 2
c'est qu'elle gère à la fois le côté serveur et le côté client. Tout ce que
nous avons à faire pour que cela fonctionne, c'est de référencer deux
Javascripts dans notre vue et d'ajouter une ligne de code :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_1D6CD492.png)

Une fois que nous avons ajouté ces trois lignes, ASP.NET MVC 2 va utiliser
les méta-données de validation que nous avons ajouté à notre classe Person et
s'occupera pour nous de tous les traitements de validation en Javascript côté
client. Cela signifie que les utilisateurs auront un retour immédiat sur les
erreurs de validation dès qu'ils quitteront une zone de saisie.

Pour voir ce que donne cette prise en charge Javascript côté client dans le
cas de notre application, nous n'avons qu'à relancer l'application et remplir
les trois premières zones de saisie avec des valeurs correctes avant d'essayer
de cliquer sur le bouton "Create". Comme vous pouvez le voir ci-dessous, nous
obtenons aussitôt un message d'erreur sans que le formulaire ait besoin d'être
envoyé vers le serveur :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_02C03879.png)

Si nous saisissons alors n'importe quoi d'incorrect, le message d'erreur
passe immédiatement de "Email Required" à "Not a valid email" (tout deux
correspondant aux messages d'erreurs que nous avons définis quand nous avons
ajouté les règles de validation à la classe Person) :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_6C8A1D26.png)

Le message d'erreur disparait dès que nous saisissons une adresse email
valide et le fond de la zone de saisie revient à sa couleur normale :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_4000ED40.png)

Ce qu'il y a de bien, c'est que nous n'avons pas eu à écrire nous même le
moindre morceau de JavaScript pour que cela fonctionne. Et notre code pour la
validation reste fidèle au principe DRY - nous pouvons définir les règles à un
seul endroit et elles s'appliquent dans toute l'application - aussi bien côté
serveur que côté client.

Ce qu'il faut savoir, c'est que pour des raisons de sécurité, les règles de
validations seront toujours appliquées côté serveur, même dans le cas où vous
les avez déjà activées côté client. De cette façon, vous être protégé des
pirates qui pourraient essayer de contourner les règles de validation côté
client pour tromper votre serveur.

Avec ASP.NET MVC 2, le support de la validation côté client en JavaScript
peut fonctionner avec n'importe quel framework ou système de validation que
vous pouvez utiliser. Cela ne nécessite pas d'avoir choisi l'approche
DataAnnotation - l'ensemble du système fonctionne de façon totalement
indépendante des DataAnnotations et peut aussi bien être employée avec Castle
Validator, EntLib Validation Block ou tout autre méthode de validation
personnalisée que vous pouvez décider de mettre en place.

Si vous ne souhaitez pas utiliser nos fichiers JavaScript côté client, vous
pouvez également les remplacer par un plugin de validation en jQuery et
employer cette librairie à la place. Le téléchargement de ASP.NET MVC Futures
intègrera la possibilité d'utiliser une validation jQuery en complément de la
validation ASP.NET MVC 2 côté serveur.

## Etape 4: Créer un attribut de validation personnalisé

L'espace de nom System.ComponentModel.DataAnnotations du framework .NET
contient un certain nombre d'attributs de validation tous prêts que vous pouvez
utiliser. Nous en avons déjà vu 4 jusqu'à présent : [Required],
[StringLength], [Required], et [RegularExpression].

Vous avez aussi la possibilité de définir et d'employer vos propres
attributs de validations personnalisés. Vous pouvez développer des attributs
spécialisés à partir de zéro en utilisant la classe de base ValidationAttribute
disponible dans l'espace de noms System.ComponentModel.DataAnnotations. Une
autre solution consiste à hériter d'un des attributs de validation déjà
existant et à simplement étendre certaine de ses fonctionnalités.

Par exemple, pour arriver à nettoyer un peu le code de la classe Person,
nous pourrions créer un nouvel attribut de validation [Email] qui utiliserait
l'expression régulière servant à vérifier les adresses email. Pour cela, il
nous suffit d'hériter de la classe d'attribut RegularExpression et de
simplement appeler le constructeur de l'objet de base avec la bonne expression
régulière :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_1EA147A4.png)

Nous pouvons alors mettre à jour la classe Person pour qu'elle utilise notre
nouvel attribut [Email] au lieu de l'expression régulière que nous utilisions
jusqu'ici - ce qui rend notre code beaucoup plus clair et concis :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_4EE81C5A.png)

Lors de la création d'attributs de validation personnalisés, vous pouvez
spécifier une logique de validation qui s'exécute à la fois sur le serveur et
sur le client via JavaScript.

## Etape 5: Sauvegarder dans la base de données

Nous allons maintenant développer les traitements nécessaires pour
enregistrer nos amis dans la base de données :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_4618140E.png)

Pour l'instant, nous travaillons seulement avec une bonne vieille classe C#
(aussi connue sous le nom de classe "POCO" pour "Plain Old CLR (ou C#)
Object"). Nous aurions pu écrire un morceau de code supplémentaire pour assurer
la persistance en faisant correspondre les éléments de cette classe à la base
de données. Les solutions de mapping objet-relationnel (ORM) telles que
NHibernate gèrent désormais très bien ce genre de mapping POCO / PI
(Persistence Ignorant). la nouvelle version de ADO.NET Entity Framework (EF)
qui va être livrée avec .NET 4 supportera elle aussi le mapping POCO / PI et
comme NHibernate, elle permettra également de spécifier le mapping pour la
persistance directement au niveau du code (sans qu'il soit besoin de passer par
des fichiers de configuration ou des concepteurs visuels).

Si notre objet Person avait été mappé à la base de données d'une de ces
façons, nous n'aurions rien eu d'autre à faire, ni au niveau de la classe
Person, ni au niveau des règles de validation : tout aurait continué à
fonctionner parfaitement.

### Mais qu'est-ce qui se passe dans le cas où nous utilisons un outil
graphique pour effectuer notre mapping objet-relationnel ?

De nos jours, la plupart des développeurs qui utilisent Visual Studio
n'écrivent pas eux même le code dont ils ont besoin pour le mapping et la
persistance. Ils font confiance pour cela au concepteurs graphiques intégrés de
Visual Studio qui s'en chargent pour eux.

Une question qui revient souvent quand on utilise les DataAnnotations (ou
tout autre forme de validation basée sur des attributs) est : "Comment
faire pour les appliquer lorsque le modèle d'objet avec lequel on travaille est
créé / mis à jour via un concepteur visuel ?". Par exemple, que se passerait-il
si au lieu d'avoir une classe Person de type POCO comme celle que nous
utilisons depuis le début, nous avions mis au point cette classe Person avec un
outil graphique tel que le concepteur LINQ to SQL ou celui de ADO.NET
EF ?

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_2B6B77F5.png)

La copie d'écran ci-dessus montre une classe Person crée à l'aide du
concepteur ADO.NET EF dans VS 2010. La fenêtre du haut défini la classe Person
et la fenêtre du bas montre l'éditeur de mapping qui sert à assurer la
correspondance entre ses propriétés et une table "People" dans la base de
données. Quand on clique sur "Save", le concepteur génère automatiquement une
classe Person à votre place dans le projet. C'est très bien, sauf qu'à chaque
fois que vous changez quelque chose et re-cliquez sur "Save", il va re-générer
cette classe. Et ainsi tous les attributs de validation que vous auriez pu y
définir seraient perdu.

Une méthode qui s'offre à nous pour ajouter des méta-données sous forme
d'attribut (tels que les attributs de validations) à une classe qui est générée
et maintenue par un concepteur de Visual Studio est d'employer la technique de
la "buddy class". Cela consiste à créer une autre classe avec nos attributs de
validation et autres méta-données puis à la relier à la classe qui a été généré
par Visual Studio en appliquant un attribut "MetadataType" à une troisième
classe partielle qui sera combinée avec la classe générée lors de la
compilation. Prenons l'exemple des règles de validation que nous avons
utilisées jusqu'à maintenant. Si nous voulons les appliquer à une classe Person
qui provient des concepteurs LINQ to SQL ou ADO.NET EF, nous n'avons qu'à
placer ce code de validation dans une classe à part nommée "Person_Validation"
puis à faire le lien avec la classe "Person" générée par VS en utilisant le
code ci-dessous :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_6265562E.png)

L'approche ci-dessus n'est sans doute pas aussi élégante qu'une approche
purement POCO mais présente l'avantage de fonctionner plutôt bien avec
n'importe quel code généré par un outil ou un concepteur de Visual Studio.

### Dernière étape - Enregistrer en base de données

Notre dernière étape - que nous utilisions une classe "Person" de type POCO
ou générée automatiquement - sera de sauvegarder nos amis convenables dans la
base de données.

Faire cela demande juste de remplacer le "Todo" laissé dans la classe
FriendsController par 3 lignes de code qui enregistrent notre nouvel ami dans
la base de données. Le code ci-dessous présente la totalité de la classe
FriendsController dans le cas où on passe par ADO.NET EF pour gérer la
persistance des données.

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_1554E696.png)

Et maintenant, quand nous allons sur l'URL /Friends/Create nous pouvons
facilement ajouter des personnes à la base de données de nos amis :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_4000ED40.png)

La validation de toutes ces données est appliquée aussi bien par le
navigateur client que par le serveur. Nous pouvons donc facilement ajouter,
modifier ou supprimer des règles de validation à un seul endroit et avoir la
certitude qu'elles seront prises en compte par tous les contrôleurs et toutes
les vues de notre application.

## Conclusion

ASP.NET MVC 2 simplifie énormément la gestion de la validation dans les
applications web. Il favorise une approche DRY avec une validation qui s'appuie
sur le modèle ce qui permet de s'assurer que les règles de validation seront
appliquées de façon identique dans toute l'application. Avec la prise en charge
des DataAnnotations par ASP.NET MVC 2, la mise en oeuvre de la plupart des
scénarios classiques de validation devient un véritable jeu d'enfant. Et les
possibilités d'extension au niveau de l'infrastructure de validation de ASP.NET
MVC 2 vous permettent de gérer un grande variété de scénarios de validation
plus poussés - et d'intégrer n'importe quel framework ou système de validation
existant ou personnalisé.

{:.encart}
Ceci est la traduction du billet "[ASP.NET MVC 2: Model Validation](http://weblogs.asp.net/scottgu/archive/2010/01/15/asp-net-mvc-2-model-validation.aspx)" de Scott Guthrie.
