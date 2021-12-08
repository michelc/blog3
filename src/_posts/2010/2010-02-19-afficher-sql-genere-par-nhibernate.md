---
date: 2010-02-19 08:06:00
layout: post
redirect_from: "post/2010/02/19/afficher-le-sql-genere-par-nhibernate"
tags: nhibernate
title: "Afficher le SQL généré par NHibernate"
---

## Problème

Quand on débute avec un ORM (et avec NHibernate en l'occurrence), il n'est
pas très très simple de comprendre ce qui va se passer au niveau de la base de
données quand on fait tel ou tel truc avec NHibernate et encore moins quand on
s'essaie à faire des requêtes LINQ to NHibernate. Pour quelqu'un qui comme moi
écrit du SQL depuis des années, l'idéal ce serait donc d'arriver à voir de mes
propres yeux le code SQL que fabrique NHibernate.

Au début, j'ai donc eu la réaction classique et je me suis demandé pourquoi
diable je ne parvenais pas à voir le source des requêtes SQL générées par
NHibernate alors que j'avais pourtant bien initialisé la propriété "show_sql" à
"true" :

```
<property name="show_sql">true</property>
```

Puis j'ai finalement remarqué que ça c'était bon pour quand je faisais des
tests unitaires ou de petits essais sous forme d'applications consoles, mais
que ça n'était pas prévu pour les applications web (et même pas du tout
puisqu'il n'y avait rien).

Qu'à cela ne tienne, la réponse est dans Google. Mais là, le problème c'est
qu'il y a beaucoup de réponses. Trop même. Et la plupart du temps il y a
surtout tout un tas d'explications sur le fonctionnement de NHibernate et de
log4net, la façon dont NHibernate utilise log4net, les différentes
manipulations et configurations à faire pour qu'ils travaillent ensemble dans
de bonnes conditions, comment sélectionner ce qu'on veut loguer...

Enfin beaucoup trop de trucs à assimiler quand comme moi on veut juste
savoir à quoi ressemble le code SQL généré par NHibernate et qu'on n'a pas le
temps et les moyens de s'intéresser aux coulisses.

Mais comme je suis <s>persistant</s> persévérant, j'ai quand même réussi
à trouver <s>la</s> une solution et même qu'après un ou deux essais j'ai
réussi à isoler ce qu'il était nécessaire et indispensable de faire pour que
cela fonctionne de façon satisfaisante :

* il faut bien utiliser [log4net](http://logging.apache.org/log4net/)
* il n'y a pas énormément de trucs à faire

## Solution

La première phase pour utiliser log4net nécessite de le configurer au niveau
du fichier Web.config. Il faut commencer par ajouter la ligne suivante à
l'intérieur de la section `<configSections>` afin de déclarer
le nom de la section de configuration qui sera dédiée à log4net :

```
<section name="log4net" type="log4net.Config.Log4NetConfigurationSectionHandler,log4net" />
```

Ensuite, il faut ajouter cette section `<log4net>` (juste
après la section `<configSections>`) dans le Web.config pour
configurer réellement log4net. Comme pour l'instant mon seul objectif est de
pouvoir afficher les requêtes SQL au fur et à mesure que NHibernate les génère,
je peux me contenter d'insérer les quelques lignes suivantes :

```
  <log4net>

    <appender name="TraceAppender" type="log4net.Appender.TraceAppender">
      <layout type="log4net.Layout.PatternLayout">
        <conversionPattern value="%message%newline" />
      </layout>
    </appender>

    <logger name="NHibernate.SQL" additivity="false">
      <level value="ALL"/>
      <appender-ref ref="TraceAppender" />
    </logger>

  </log4net>
```

En gros, ça sert à dire que NHibernate doit loguer les requêtes SQL qu'il
génère et que log4net doit afficher ces logs dans la fenêtre de débugage de
Visual Studio (c'est peut être pas exactement ça, mais le résultat sera bientôt
là).

Une fois cette première phase de configuration terminée, il reste à activer
log4net. Pour cela, il faut tout d'abord ajouter la librairie log4net.dll dans
les références du projet. Ceci fait, il reste à "démarrer" log4net, ou plus
exactement à lui indiquer qu'il doit se paramétrer en utilisant la
configuration définie dans le fichier Web.config.

Pour ça, il suffit d'ajouter une ligne
`log4net.Config.XmlConfigurator.Configure();` au niveau de la
procédure Application_Start dans le Global.axax.cs (et peut-être un `using
log4net;` en début de fichier) :

```
using log4net;

...
        protected void Application_Start()
        {
            log4net.Config.XmlConfigurator.Configure();
            RegisterRoutes(RouteTable.Routes);
        }
```

Et c'est tout ! En fait, on n'a même pas besoin d'avoir initialisé la
propriété "show_sql" à "true" pour que ça marche :

![](/public/2010/nhibernate-log4net.png)

## Pour aller plus loin

Trois liens intéressants parmi tant d'autres qui m'ont permis d'arriver à
cette solution :

* [Logging NHibernate SQL with log4net in ASP.NET](http://www.leniel.net/2009/05/logging-nhibernate-sql-log4net-aspnet.html) explique
comment enregistrer les requêtes SQL de NHibernate dans un fichier de
logs : pas tout à fait ce que je cherche donc, mais malgré tout bien
détaillé et suffisamment clair
* [Displaying NHibernate SQL in Visual Studio's Output Window](http://suspendedwithpay.wordpress.com/2009/04/03/displaying-nhibernate-sql-in-visual-studios-output-window/)
fait quasiment ce que je veux mais ne n'explique pas tout ce qu'il faut faire
pour que ça marche
* [log4net Config Examples](http://logging.apache.org/log4net/release/config-examples.html) présente des exemples de
configuration pour tous les types de sorties des logs : base de données,
fichier, smtp...
