---
date: 2011-06-16 19:35:00
layout: post
redirect_from: "post/2011/06/16/telecharger-fichiers-avec-sinatra"
tags: ruby, sinatra
title: "Télécharger des fichiers avec Sinatra"
---

{:.encart}
Ceci est la traduction du tutoriel "[Uploading Files In Sinatra](http://ididitmyway.herokuapp.com/past/2011/1/16/uploading_files_in_sinatra/)" de Darren Jones.

Il arrive fréquemment qu'on ait besoin de télécharger un fichier dans nos
applications, que ce soit une image ou un fichier PDF. Dans ce tutoriel, je
vais vous présenter le code nécessaire pour télécharger des fichiers avec votre
application Sinatra. C'est une solution toute simple, mais ça fait ce qu'on lui
demande.

## L'application Sinatra

Pour commencer, nous avons besoin de créer une application Sinatra basique
avec une page "upload" :

```
require 'rubygems'
require 'sinatra'

get '/upload' do
  haml :upload
end

__END__

@@upload
%h2 Upload
%form{:action=>"/upload",:method=>"post",:enctype=>"multipart/form-data"}
  %input{:type=>"file",:name=>"file"}
  %input{:type=>"submit",:value=>"Télécharger"}
```

(Remarque : je n'ai pas défini de layout pour cet exemple)

Cette page va afficher un formulaire tout simple qui va nous permettre de
sélectionner un fichier sur notre PC. Le truc le plus important, c'est
l'attribut "enctype" qui doit impérativement être initialisé à
"multipart/form-data".

Nous devons ensuite gérer ce qui se passe lorsque le formulaire est validé
en créant un autre handler (à placer juste avant la déclaration
`__END__`) :

```
post '/upload' do
  unless params[:file] && (tmpfile = params[:file][:tempfile]) && (name = params[:file][:filename])
    return haml(:upload)
  end
  while blk = tmpfile.read(65536)
    File.open(File.join(Dir.pwd,"public/uploads", name), "wb") { |f| f.write(tmpfile.read) }
  end
 'terminé'
end
```

Etudions un peu ce code pour voir comment ça marche. Après avoir sélectionné
un fichier et cliqué sur le bouton "Télécharger", un objet `file`
est envoyé au serveur via le hash "params". Cet objet `file`
contient une propriété "tempfile" qui correspond au fichier temporaire créé
pendant le téléchargement du fichier. Il contient aussi une propriété
"filemane" qui correspond au nom du fichier tel qu'il était défini sur votre
système. La première ligne de code vérifie que l'on a bien sélectionné un
fichier et utilise les 2 propriétés "tempfile" et "filename" pour initialiser
deux variables du même nom. Dans le cas où aucun fichier n'a été sélectionné,
le formulaire de téléchargement est simplement ré-affiché (ligne 2).

La boucle `while` est alors utilisé pour gérer le contenu du
fichier au fur et à mesure de son chargement. On fait cela par bloc de 65536
octets qui selon moi devrait servir de tampon pour limiter l'utilisation de la
RAM. Ces blocs sont enregistrés dans un fichier dans le répertoire public nommé
"uploads". Il est nécessaire d'avoir au préalable créé vous-même ce
sous-répertoire "uploads" dans le répertoire "public" de votre application. Le
paramètre "wb" indique à Ruby qu'il s'agit d'un fichier binaire (le "b") et
qu'il est en écriture seule (le "w"). Vous pouvez retrouver les différentes
valeurs acceptées par de paramètre qui défini le mode du fichier au début de la
[documentation
de la classe IO de Ruby](http://ruby-doc.org/core/classes/IO.html). Et pour finir, une fois que le fichier a été
entièrement chargé, on se contente pour l'instant d'afficher un simple message
"terminé", mais il est bien évident qu'on pourrait faire mieux.

Pour avoir plus d'informations sur l'objet `file` en Ruby, je
vous invite à consulter le chapitre qui est consacré à la classe
`File` sur la version en ligne du [Ruby Pickaxe Book](http://ruby-doc.org/docs/ProgrammingRuby/html/ref_c_file.html).

Note du traducteur : plutôt que de copier "manuellement" le
contenu du fichier, on aurait pu utiliser la méthode `cp` (ou
`copy`) de la classe FileUtils :

```
  fullname = File.join(Dir.pwd, "public/uploads", name)
  FileUtils.cp(tmpfile.path, fullname)
```

## Heroku

Le code présenté ci-dessus est tout à fait correct et fonctionnel, mais
Heroku ne vous permet pas de stocker beaucoup de fichiers sur leurs serveurs
(seuls les fichiers relatifs au code de votre application devraient s'y
trouver). Par conséquent, vous êtes censés héberger vos fichiers ailleurs. La
solution qui vient à l'esprit, c'est d'utiliser [Amazon's Simple Storage Service
(S3)](http://aws.amazon.com/fr/s3/). Cela vous permet de stocker vos fichiers sur les serveurs d'Amazon
pour un coût extrêmement minime. Heroku étant également hébergé sur les
serveurs Amazon, en y hébergeant vos propres fichiers vous devriez réduire au
maximum les temps de latence pour récupérer vos fichiers.

## Inscription à Amazon S3

La première chose à faire, c'est de vous enregistrer sur S3, ce que vous
pouvez faire en vous rendant sur le site et en cliquant le bouton
"Inscrivez-vous à Amazon S3". Si vous êtes déjà un client d'Amazon, vous pouvez
ré-utiliser les informations de votre compte. Une fois que vous avez terminé le
processus d'inscription, vous pouvez commencer à ajouter des fichiers à votre
compte S3. Pour cela, Amazon propose une [console web](http://aws.amazon.com/s3/us) ou si vous préférez, vous pouvez
employer [l'extension S3Fox](http://www.s3fox.net/)
pour Firefox. Amazon S3 utilise un concept de compartiment (bucket) pour gérer
vos fichiers. Et vous pouvez créer des dossiers à l'intérieur de chaque
compartiment. Personnellement, j'ai l'habitude de définir un compartiment pour
chacun de mes sites web.

## Le code source Sinatra

Maintenant que vous disposez d'un compte Amazon S3 en état de marche, vous
allez pouvoir y enregistrer vos fichiers en utilisant son interface web et en
apportant quelques modifications à votre code Sinatra. Pour commence, il faut
installer la [librairie
aws-s3](http://amazon.rubyforge.org/):

```
C:\Ruby>gem install aws-s3
```

Lorsque vous vous êtes inscrit à Amazon S3, vous devez avoir reçu deux
informations importante : un Access Key ID de 20 chiffres et une Secret
Access Key. Vous poiuvez les obtenir en vous identifiant sur la page [Amazon Web Services](http://aws.amazon.com/fr/) puis en
cliquant sur l'onglet "Compte". Puis vous devez cliquer sur le lien
"Identification de sécurité". Les informations dont vous avez besoin
apparaissent dans une boite au milieu de la page (vous devrez cliquer pour
faire apparaitre la clé secrète qui fait 40 caractères).

Une fois que vous avez récupéré ces informations, vous allez pouvoir la
commande `set` de Sinatra pour les enregistrer. Et nous allons en
profiter pour ajouter une instruction `require` afin que la
librairie aws-s3 soit inclue dans notre code source :

```
require 'rubygems'
require 'sinatra'
require 'aws/s3'

set :bucket, 'mybucket'
set :s3_key, THISISANEXAMPLEKEYID
set :s3_secret, Thi$isJu5taNExamp/etO0itSh0u1dBel0NgeR
```

Bien entendu, pour un site en production il faut définir ces variables en
passant par des paramètres d'environnement de Heroku pour que vos clés restent
secrètes. Vous pouvez vous reporter au billet [Configuration et paramétrage avec Sinatra]({% post_url 2011-05-03-configuration-parametrage-sinatra %}) pour avoir plus
d'explications à ce sujet.

Nous devons ensuite nous occuper de nos handlers. Le premier handler pour le
GET reste tel quel alors que le second pour le POST doit être légèrement
modifié de façon à utiliser la librairie aws-s3 pour établir la connexio avec
Amazon S3 et enregistrer le fichier. Vous pouvez voir que nous utilisons pour
cela les variables définies auparavant et qu'à part cela, le code Sinatra final
reste tel qu'il était :

```
get '/upload' do
  haml :upload
end

post '/upload' do
  unless params[:file] && (tmpfile = params[:file][:tempfile]) && (name = params[:file][:filename])
    return haml(:upload)
  end
  while blk = tmpfile.read(65536)
    AWS::S3::Base.establish_connection!(
      :access_key_id     => settings.s3_key,
      :secret_access_key => settings.s3_secret)
    AWS::S3::S3Object.store(name,open(tmpfile),settings.bucket,:access => :public_read)
  end
 'terminé'
end

__END__

@@upload
%h2 Upload
%form{:action=>"/upload",:method=>"post",:enctype=>"multipart/form-data"}
  %input{:type=>"file",:name=>"file"}
  %input{:type=>"submit",:value=>"Télécharger"}
```

Et c'est tout ! Tout cela devrait amplement vous suffire pour gérer les
bases du téléchargement de fichiers avec Sinatra. Il est bien évident que cela
peut être amélioré, notamment dans les domaines suivants :

* Un formulaire un peu plus sexy
* Un meilleur retour à la fin du téléchargement (y compris dans le cas où
aucun fichier n'a été sélectionné)
* Une barre de progression au fur et à mesure du téléchargement du
fichier
* La possibilité de télécharger dans différents dossiers
* Un contrôle du type de fichier téléchargé
* Un traitement des images téléchargées (créer une vignette automatiquement
par exemple), bien qu'il s'agisse là d'un sujet qui mérite un billet à lui tout
seul,
* La possibilité de pouvoir télécharger plusieurs fichiers à la fois
