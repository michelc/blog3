---
date: 2012-03-01 13:22:00
layout: post
redirect_from: "post/2012/03/01/ruby-or-parentheses"
tags: ruby
title: "Ruby, or et parenthèses"
---

Question du collègue derrière les écrans de l'autre coté du bureau d'en
face : *`True or False` ça doit faire quoi ?*

Très bon réflexe de ma part, plutôt que de démarrer mon cerveau, je lance
PowerShell + IRB :

```
C:\> irb
irb(main):001:0> puts true or false
true
=> false
irb(main):002:0>
```

Question perfide : *Et dans l'autre sens ?*

Ben pareil ?

```
irb(main):002:0> puts false or true
false
=> true
irb(main):003:0>
```

Heu... Qu'est-ce qui se passe là ?

Je recommence autrement :

```
irb(main):003:0> puts true || false
true
=> nil
irb(main):004:0> puts false || true
true
=> nil
irb(main):005:0>
```

C'est mieux !

Mais à quoi ça sert d'avoir le choix entre *`or`* et
*`||`* si c'est pour que ça soit pas pareil ?

DuckDuckGo "ruby or" => [Ruby boolean operator (or ruby parsing) bug](http://adamloving.com/internet-programming/ruby-boolean-operator-or-ruby-parsing-bug)

En résumé, l'affectation est prioritaire sur l'opérateur
*`or`*.

```
irb(main):005:0> puts (true or false)
true
=> nil
irb(main):006:0> puts (false or true)
true
=> nil
irb(main):007:0>
```

Jamais je vais m'en souvenir.

Et sinon, c'était quoi la question déjà ?
