---
date: 2011-04-29 13:22:00
layout: post
redirect_from: "post/2011/04/29/un-formulaire-de-contact-avec-Sinatra"
tags: ruby, sinatra
title: "Un formulaire de contact avec Sinatra"
---

{:.encart}
Ceci est la traduction du tutoriel "[An Email Contact Form in Sinatra](http://ididitmyway.herokuapp.com/past/2010/12/4/an_email_contact_form_in_sinatra/)" de Darren Jones.

Dans cet épisode, je vais vous montrer les étapes nécessaires pour créer une
page avec un formulaire de contact qui vous enverra un email. Cet exemple peut
facilement être adapté pour envoyer tout autre type d'email à partir d'une
interface web. Dans ce tutoriel, je vais utiliser mon compte GMail pour
réaliser l'envoi du mail.

Nous utiliserons également la librairie [Pony](https://github.com/benprew/pony) pour envoyer les mails
et il faut donc commencer par installer le gem Pony :

```
C:\Ruby>gem install pony
```

Pour démarrer, nous allons nous occuper du formulaire de contact. Celui-ci
sera disponible à l'URL "/contact" grâce au gestionnaire suivant :

```
get '/contact' do
  erb :contact
end
```

Puis nous enregistrons la vue "contact.erb" dans le répertoire
"views" :

```
<p>Vous pouvez utiliser le formulaire ci-dessous pour nous contacter :</p>
<form action="/contact" method="post">
  <label for="name">Votre nom :</label>
  <input type="text" name="name">
  <label for="email">Votre adresse mél :</label>
  <input type="text" name="email">
  <label for="to">Votre message :</label>
  <textarea name="message" rows="16" cols="28">
  <input type="submit" value="Envoyer">
</form>
```

Nous devons maintenant gérer les données du formulaire lorsqu'il est validé.
Pour cela, nous allons créer un gestionnaire de type POST pour la même URL
"/contact" (celle que nous avons indiquée dans l'attribut action du formulaire
web) :

```
post '/contact' do
    require 'pony'
    Pony.mail(
      :from => params[:name] + "<" + params[:email] + ">",
      :to => 'adresseperso@gmail.com',
      :subject => "Vous avez un message de " + params[:name],
      :body => params[:message],
      :port => '587',
      :via => :smtp,
      :via_options => {
        :address              => 'smtp.gmail.com',
        :port                 => '587',
        :enable_starttls_auto => true,
        :user_name            => 'adresseperso',
        :password             => 'p@55w0rd',
        :authentication       => :plain,
        :domain               => 'localhost.localdomain'
      })
    redirect '/success'
end
```

Note : en local sur mon PC j'ai dû utiliser le port 25 au lieu du port
587 pour que l'[envoi de mail marche avec le SMTP de GMail]({% post_url 2009-04-21-systemnetmail-smtpgmailcom %}).

Grosso modo, nous nous contentons de remplir les informations attendues par
Pony et d'envoyer le mail en utilisant notre compte GMail personnel (par
conséquent pensez à employer vos propres identifiants !). Si cela fonctionne
correctement, on doit recevoir un email avec le sujet "Vous avez un message de
Daz". Al la fin du code, l'utilisateur est redirigé vers l'URL "/success" que
nous prenons en charge de la façon suivante :

```
get('/success') {"Merci pour votre message. Nous vous contacterons bientôt."}
```

C'est clair qu'il faudrait développez un peu plus pour une vrai application,
mais vous voyez l'idée.

## Heroku

Heroku vous permet d'utiliser l'option Sendgrid pour envoyer vos emails.
Vous pouvez vous inscrire pour bénéficier d'un compte gratuit (limité à 200
méls par jour) à l'aide de la commande suivante (à lancer via une console Git
bash) :

```
$ heroku addons:add sendgrid:free
```

Pour utiliser Sendgrid, vous devez modifier le paramétrage de Pony de la
façon suivante :

```
post '/contact' do
    require 'pony'
     Pony.mail(
      :from => params[:name] + "<" + params[:email] + ">",
      :to => 'adresseperso@gmail.com',
      :subject => "Vous avez un message de " + params[:name],
      :body => params[:message],
      :port => '587',
      :via => :smtp,
      :via_options => {
        :address              => 'smtp.sendgrid.net',
        :port                 => '587',
        :enable_starttls_auto => true,
        :user_name            => ENV['SENDGRID_USERNAME'],
        :password             => ENV['SENDGRID_PASSWORD'],
        :authentication       => :plain,
        :domain               => ENV['SENDGRID_DOMAIN']
      })
    redirect '/success'
end
```

```
ENV['SENDGRID_USERNAME]
```
, `ENV['SENDGRID_PASSWORD']`
et `ENV['SENDGRID_DOMAIN']` sont trois variables d'environnement de
Heroku qui sont définies automatiquement lorsque vous installez l'option
Sendgrid.

En pratique, il serait plus judicieux de définir ces informations
séparément, en utilisant la commande "set" de Sinatra :

```
set :email_username, ENV['SENDGRID_USERNAME] || 'adresseperso'
set :email_password, ENV['SENDGRID_PASSWORD'] || 'p@55w0rd'
set :email_address, 'daz@gmail.com'
set :email_service, ENV['EMAIL_SERVICE'] || 'gmail.com'
set :email_domain, ENV['SENDGRID_DOMAIN'] || 'localhost.localdomain'
```

La variable d'environnement `ENV['EMAIL_SERVICE']` n'étant pas
définie automatiquement, vous devez penser à l'initialiser vous-même avec la
commande suivante :

```
$ heroku config:add EMAIL_SERVICE=sendgrid.net
```

Et après cela, vous pouvez mettre à jour votre code pour envoyer un email en
utilisant Pony :

```
post '/contact' do
    require 'pony'
     Pony.mail(
      :from => params[:name] + "<" + params[:email] + ">",
      :to => settings.email_address,
      :subject => "Vous avez un message de " + params[:name],
      :body => params[:message],
      :port => '587',
      :via => :smtp,
      :via_options => {
        :address              => 'smtp.' + settings.email_service,
        :port                 => '587',
        :enable_starttls_auto => true,
        :user_name            => settings.email_username,
        :password             => settings.email_password,
        :authentication       => :plain,
        :domain               => settings.email_domain
      })
    redirect '/success'
end
```

Cette méthode vous permet d'utiliser votre formulaire de contact en local
(en utilisant votre adresse GMail perso) ou depuis Heroku (en passant par
Sendgrid).
