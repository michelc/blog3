---
date: 2009-11-23 10:26:00
layout: page
permalink: nerddinner/creation-base-donnees/
redirect_from: "pages/NerdDinner/Creation-base-donnees"
title: "NerdDinner(fr) : Création de la base de données"
---

Nous utiliserons une base de données pour enregistrer toutes les
informations concernant les dîners et les confirmations de notre application
NerdDinner.

Les étapes ci-dessous montrent comment créer la base de données en utilisant
la version gratuite de SQL Server Express. Tout le code que nous allons écrire
fonctionnera aussi bien avec un SQL Server complet ou un simple SQL Server
Express.

## Création d'une nouvelle base de données SQL Server Express

Nous allons commencer par faire un clic droit sur notre projet Web, pour
sélectionner les commandes **Add -&gt; New Item** :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image024.png)

Cela fait apparaître la boite de dialogue "Add New Item" dans laquelle nous
sélectionnons la catégorie "Data" puis le modèle "SQL Server Database" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image025.png)

Nous appelons alors la base de données SQL Server Express que nous allons
créer "NerdDinner.mdf" puis cliquons sur "Add". Visual Studio nous demande si
nous souhaitons ajouter ce fichier à notre répertoire \App_Data (il s'agit d'un
répertoire déjà configuré avec des droits ACL en lecture et écriture).

![](http://nerddinnerbook.s3.amazonaws.com/Images/image026.png)

Cliquons sur "Yes" et notre nouvelle base de données sera créée et ajoutée
au bon endroit dans l'explorateur de solution :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image027.png)

## Création des tables de la base de données

Nous disposons maintenant d'une nouvelle base de données vide à laquelle
nous allons ajouter quelques tables.

Pour cela, nous allons passer par la fenêtre "Server Explorer" de Visual
Studio, qui nous permet de gérer des bases de données et les serveurs. Les
bases de données SQL Server Express stockées dans le répertoire \App_Data de
notre application apparaissent automatiquement dans l'explorateur de serveurs.
Nous pouvons éventuellement utiliser l'icône "Connect to Database" en haut de
la fenêtre de l'explorateur de serveurs pour ajouter d'autres bases de données
SQL Server (aussi bien locales que distantes) à cette liste :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image028.png)

Nous ajouterons deux tables à notre base de données NerdDinner : une pour
stocker nos dîners et l'autre pour gérer les confirmations de présence (RSVP).
Nous pouvons créer de nouvelles tables en faisant un clic droit sur la branche
"Tables" dans le dossier de notre base de données puis en choisissant la
commande "Add New Table" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image029.png)

Cela ouvre une fenêtre avec le concepteur de table qui nous permet de
définir le schéma de notre nouvelle table. Pour la table des dîners, nous
allons ajouter les 10 colonnes suivantes :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image030.png)

Nous voulons que la colonne "DinnerID" soit une clé primaire unique pour la
table. Cela se paramètre par un clic-droit sur le nom de la colonne puis en
choisissant la commande "Set Primary Key".

![](http://nerddinnerbook.s3.amazonaws.com/Images/image031.png)

En plus de faire de DinnerID une clé primaire, nous souhaitons qu'il
s'agisse d'une colonne "Identity", c'est-à-dire une colonne dont la valeur est
automatiquement incrémentée au fur et à mesure que de nouvelles lignes de
données sont insérées dans la table (ce qui signifie que la première ligne
dîner créée aura 1 comme DinnerID, la deuxième ligne insérée aura un DinnerID
de 2, etc…).

Cela se configure en sélectionnant la colonne "DinnerID" puis en utilisant
le panneau "Column Properties" pour configurer la propriété "(Is Identity)" de
la colonne à "Yes". Nous utiliserons les valeurs standards pour une colonne
"Identity", à savoir commence à 1 et augmente de 1 à chaque nouvelle ligne
insérée :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image032.png)

Nous pouvons alors presser Ctrl-S ou utiliser le menu __File -&gt; Save__
pour enregistrer notre table. Lorsque Visual Studio nous demande de donner un
nom à notre table, répondre "Dinners" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image033.png)

Notre nouvelle table Dinners apparaît désormais dans la liste des tables de
notre base de données dans l'explorateur de serveurs.

Nous allons répéter les étapes précédentes et créer cette fois-ci une table
"RSVP" contenant 3 colonnes. Nous paramètrerons la colonne RsvpID en tant que
clé primaire et colonne "Identity" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image034.png)

Enregistrons la table en l'appelant "RSVP".

## Définir une relation de clé étrangère entre nos tables

Notre base de données contient désormais deux tables. La dernière étape dans
la conception de notre base de données sera de définir une relation de "un à
plusieurs" entre ces deux tables, de façon à pouvoir associer chaque ligne de
la table Dinners avec zéro ou plusieurs lignes de la table RSVP qui lui
correspondent. Pour cela, nous allons configurer la colonne "DinnerID" de la
table RSVP pour lui associer une relation de clé étrangère avec la colonne
"DinnerID" de la table Dinners.

Dans l'explorateur de serveurs, double-cliquons sur la table RSVP pour
l'ouvrir avec le concepteur de tables. On fait ensuite un clic-droit sur la
colonne "DinnerID" et on sélectionne "Relationships…" dans le menu
contextuel :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image035.png)

Cela fait apparaître une boîte de dialogue qui va nous servir pour
configurer les relations entre les deux tables :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image036.png)

Cliquons sur le bouton "Add" pour ajouter une nouvelle relation. Une fois
que la relation a été créée, il faut cliquer sur le bouton "…" en face du
groupe de propriétés "Tables And Columns Specifications" pour paramétrer notre
nouvelle relation :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image037.png)

Après avoir cliqué sur le bouton "...", il apparaît une autre boîte de
dialogue qui nous permet de spécifier les tables et colonnes qui sont
impliquées dans la relation, en plus de nous permettre de donner un nom à cette
relation.

Nous allons sélectionner la table "Dinners" dans la liste déroulante
"Primary key table", puis la colonne "DinnerID" de la table Dinners comme clé
primaire. Puis nous choisissons notre table RSVP dans la liste "Foreign key
table" et associons la colonne "RSVP.DinnerID" comme clé étrangère :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image038.png)

A partir de maintenant, chaque ligne de la table RSVP sera associée à une
ligne dans la table Dinners. SQL Server maintiendra l'intégrité référentielle
pour nous - et nous évitera d'ajouter une nouvelle ligne dans la table RSVP si
elle ne fait pas référence à une ligne existante de la table Dinners. Il se
chargera également d'interdire la suppression d'une ligne de la table Dinners
s'il existe des lignes de la table RSVP qui correspondent à celle-ci.

## Ajout de données à nos tables

Pour finir, nous allons remplir notre table Dinners avec un jeu d'essai.
Nous pouvons ajouter des données à une table en faisant un clic-droit sur
celle-ci dans l'explorateur de serveurs puis en choisissant la commande "Show
Table Data" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image039.png)

Insérons quelques lignes dans la table Dinners qui nous servirons par la
suite lorsque nous commencerons à réaliser l'application :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image040.png)

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Construire le modèle](/nerddinner/construire-modele/)
