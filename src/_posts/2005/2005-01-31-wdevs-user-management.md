---
date: 2005-01-31 13:43:00
layout: post
redirect_from: "post/2005/01/31/Wdevs-User-management"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) User management"
---

After inserting some new fields to my users table, I almost accomplish all
my primary requirements concerning functionalities for user management.

Firstly, my Admin toolbox has a Roles box where administrators can list
roles and manage them. As my roles table is extremely basic, this box is rather
straightforward to use.

The Admin toolbox also includes a Users box. Administrators can place this
box on a screen in order to display registered users. In addition, this box
gives access to users' management where authorized users can create new user,
change account information and assign them to roles.

My Users box is an enhanced version of the IBuySpy one. First, it can
generate random user id and password when administrator let one of them empty.
Second, it allows filtering of users according to selected roles. This way, an
administrator can easily visualize users and roles association. In addition,
this box contains a DropDownList control filled by users that quickly assigns a
user to selected roles. Third, another DropDownList operates as a filter for
users according to their last login date. This discriminates users that did not
access since more than 3 or 6 months and gives a method to remove them in one
click.

For final user, I have a Login box, where each registered user can give his
user id and his password when he needs to access to protected screens. This
Login box also provides a reminder password box. Here one can give his email
address and whether he is a registered user, he will receive an email with a
new random generated password. As passwords are stored as a MD5 non-reversible
encrypted string, I cannot send original password.

When authenticated users would like to change their password, I build a
Password box with the standard three fields (old password, new password and
confirm password) and a "Save" button to apply their new password.

There is an auto-registration box where one can give his email address and
his name. If his email domain belongs to an authorized domain, a new account
will be created with default roles and the new user will receive an email with
his account information. This kind of registration will be useful for
intranets.

Later, I will complete my LDAP integration tests. In a first time, my
intention is to check authentication according to my users table and then
control it against a LDAP server.

* Authentication is ok with database and ko with LDAP => it's a
"local/private/temp/multipurpose..." user account,
* Authentication is ko with database and ok with LDAP => create a new
account in users table according to LDAP data and with default roles,
* Authentication is ok with database and ok with LDAP => update account
according to LDAP data.

Of course, when a user will exist in LDAP, I will not store his password in
database. Therefore, an empty password will denote a LDAP user. Presently, I
will associate users to roles in database. Utilization of LDAP groups to
generate roles will come in a far far away time.

But now, I have to revise my SQL scripts and to update my monoforge
demonstration. Next, I need to make some tests before updating the Access
version.
