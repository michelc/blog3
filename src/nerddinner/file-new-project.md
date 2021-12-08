---
date: 2009-11-20 15:49:00
layout: page
permalink: nerddinner/file-new-project/
redirect_from: "pages/NerdDinner/File-New-project"
title: "NerdDinner(fr) : File -› New project"
---

Nous allons commencer notre application NerdDinner en sélectionnant la
commande **File -&gt; New Project** dans Visual Studio 2008 ou
Visual Web Developer 2008 Express.

Cela fait apparaître la boite de dialogue "New Project". Pour créer une
nouvelle application ASP.NET MVC, nous sélectionnons la branche "Web" dans la
partie gauche de la boîte de dialogue avant de choisir le modèle de projet
"ASP.NET MVC Web Application" dans la partie droite :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image008.png)

On donne le nom "NerdDinner" au nouveau projet puis on clique sur le bouton
"OK" pour le créer.

Quand on clique "OK" Visual Studio fait apparaître une nouvelle boite de
dialogue qui nous propose de créer en même temps un projet de tests unitaires
pour l'application. Ce projet de tests unitaires nous permet de réaliser des
tests automatisés pour contrôler les fonctionnalités et le comportement de
notre application (ce que nous aborderons plus tard dans la suite de ce
tutoriel).

![](http://nerddinnerbook.s3.amazonaws.com/Images/image009.png)

La liste déroulante "test framework" ci-dessus est automatiquement remplie
avec la liste de tous les frameworks de tests unitaires installés sur notre
machine. On peut télécharger des versions pour NUnit, MBUnit et XUnit. Le type
de test intégré Visual Studio Unit Test Framework est également géré.

''Note: le Visual Studio Unit Test-Framework est disponible uniquement avec
Visual Studio 2008 Professional (ou versions supérieures). Si vous utilisez VS
2008 Standard Edition ou Visual Web Developer 2008 Express, vous devez
télécharger et installer les extensions NUnit, MBUnit ou XUnit pour ASP.NET MVC
afin que cette boite de dialogue soit visible. La boîte de dialogue ne
s'affiche pas s'il n'y a pas de framework de tests installé.''

Nous allons conserver le nom "NerdDinner.Tests" proposé par défaut pour le
projet de tests que nous créons, et utiliser le framework de tests "Visual
Studio Unit Test". Après avoir cliqué sur le bouton "OK", Visual Studio crée
une solution contenant deux projets, un pour notre application Web et un autre
pour notre projet de tests :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image010.png)

## Contenu du répertoire NerdDinner

Quand on crée une application ASP.NET MVC avec Visual Studio, un certain
nombre de fichiers et de répertoires sont automatiquement ajoutés au
projet :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image011.png)

Par défaut, les projets ASP.NET MVC contiennent six répertoires de premier
niveau :

<table>
  <thead>
    <tr>
      <th>Répertoire</th>
      <th>Fonction</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/Controllers</td>
      <td>Pour les classes Controllers qui gère les requêtes URL</td>
    </tr>
    <tr>
      <td>/Models</td>
      <td>Pour les classes qui représentent et gèrent les données</td>
    </tr>
    <tr>
      <td>/Views</td>
      <td>Pour la partie présentation des interfaces utilisateurs</td>
    </tr>
    <tr>
      <td>/Scripts</td>
      <td>Pour les librairies JavaScript et les fichiers scripts (.js)</td>
    </tr>
    <tr>
      <td>/Content</td>
      <td>Pour les CSS, les images et tout contenu ni dynamique ni script</td>
    </tr>
    <tr>
      <td>/App_Data</td>
      <td>Pour les fichiers de données qui doivent être lus et mis à jour</td>
    </tr>
  </tbody>
</table>

Cette organisation n'est pas obligatoire. En fait les développeurs qui
travaillent sur une grosse application vont généralement la découper en
plusieurs projets pour la rendre plus facile à gérer (par exemple, la classe
d'accès aux données va souvent être dans un projet de bibliothèque de classe
séparé de l'application Web). Mais dans notre cas, l'organisation par défaut
est suffisante pour ce que nous souhaitons faire.

Lorsque nous déplions le répertoire /Controllers, nous pouvons voir que par
défaut Visual Studio a ajouté deux classes contrôleurs au projet :
HomeController et AccountController :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image012.png)

Lorsque nous déplions le répertoire /Views, nous y trouvons 3
sous-répertoires également ajouté par défaut (/Home, /Account et /Shared) avec
plusieurs fichiers de modèles à l'intérieur de ceux-ci :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image013.png)

Lorsque nous déplions les répertoires /Content et /Scripts, nous avons un
fichier Site.css utilisé pour définir le style de tout le HTML du site, ainsi
que des librairies JavaScript pour offrir le support de ASP.NET AJAX et jQuery
dans toute l'application :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image014.png)

Lorsque nous déplions le projet NerdDinner.Tests, il y a deux classes qui
contiennent les tests unitaires pour nos deux classes contrôleurs :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image015.png)

Ces fichiers ajoutés par défaut par Visual Studio nous fournissent une
structure de base pour une application complète avec une page d'accueil, une
page à propos, des pages de connexion, de déconnexion et d'inscription, et une
page pour les erreurs non gérées, le tout prêt à être utilisé sans autre
manipulation.

## Lancer l'application NerdDinner

Nous pouvons lancer notre projet en choisissant __Debug -&gt; Start
Debugging **ou** Debug -&gt; Start Without Debugging__ dans les
menus de Visual Studio :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image016.png)

Cette commande va lancer le serveur web intégré de Visual Studio et exécuter
notre application :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image017.png)

Voici la page d'accueil de notre nouveau projet (URL: "/") quand il
s'exécute :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image018.png)

En cliquant sur l'onglet "About", il apparaît une page d'à propos (URL :
"/Home/About") :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image019.png)

Un clic sur le lien "Log On" en haut à droite nous conduit vers une page de
connexion (URL: "/Account/LogOn") :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image020.png)

Si nous n'avons pas encore de compte, nous pouvons nous inscrire en cliquant
sur le lien "Register" pour créer un nouveau compte (URL :
"/Account/Register") :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image021.png)

Tout le code pour réaliser les quatre écrans précédents a été généré par
défaut lorsque nous avons créé notre nouveau projet. Nous allons l'utiliser
comme point de départ de notre application.

## Test de l'application NerdDinner

Si nous utilisons Visual Studio Professional Edition ou une version
supérieure, nous pouvons utiliser l'environnement de test unitaire intégré au
sein de Visual Studio pour tester notre projet :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image022.png)

Après avoir choisi une des options ci-dessus, le panneau "Test Results"
s'ouvre dans l'IDE et nous indique le résultat (réussi ou échoué) pour les 27
tests unitaires inclus dans notre nouveau projet et qui couvrent ses
fonctionnalités de base :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image023.png)

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Créer la base de données](/nerddinner/creation-base-donnees/)
