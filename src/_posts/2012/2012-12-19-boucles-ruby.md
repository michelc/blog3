---
date: 2012-12-19 22:05:00
layout: post
redirect_from: "post/2012/12/19/boucles-ruby"
tags: ruby
title: "Les boucles en Ruby"
---

## La boucle "for"

Avec mon passé de développeur Basic, je commence par la boucle "for".

```
10 FOR I = 0 TO 5
20   PRINT I
30 NEXT
```

En Ruby, le `for` sert à parcourir les différentes valeurs des
objets qui sont capables de répondre à la méthode `each` (comme les
Array et les Range).

C'est donc plus une instruction "for ... in" (un peu comme le
`foreach` du C#). Utilisé avec un tableau, cela donne le code
suivant :

```
for i in [0, 1, 2, 3, 4, 5] do
  puts "- nombre = #{i}"
end

=>

- nombre = 0
- nombre = 1
- nombre = 2
- nombre = 3
- nombre = 4
- nombre = 5
```

Apparemment, Ruby traite ça comme si c'était :

```
[0, 1, 2, 3, 4, 5].each do |i|
  puts "- nombre = #{i}"
end
```

Et pour les Range, cela donne :

```
for i in (0..5) do
  puts "- nombre = #{i}"
end

=>

- nombre = 0
- nombre = 1
- nombre = 2
- nombre = 3
- nombre = 4
- nombre = 5
```

Que Ruby traite comme :

```
(0..5).each do |i|
  puts "- nombre = #{i}"
end
```

Par conséquent, il est beaucoup plus naturel d'employer les
`each` en Ruby que le `for`.

## Les itérations

```
each
```
 est donc un "itérateur" : il permet de parcourir tous
les éléments d'un ensemble (un tableau, un range...) un par un.

```
times
```
 est un autre itérateur qui est utilisé assez couramment
en Ruby. Par exemple, pour refaire la boucle des exemples précédents qui tourne
un nombre précis de fois, on aura plus tendance à utiliser cette méthode
`times` :

```
6.times do |i|
  puts "- nombre = #{i}"    # => 0, 1, 2, 3, 4, 5
end
```

Note : si le traitement à l'intérieur de la boucle n'a
pas besoin de la valeur de l'indice, il n'est pas nécessaire de le faire
apparaître :

```
3.times do
  puts "Penny"      # => Penny, Penny, Penny
end
```

Il existe 3 autres itérateurs pour boucler d'une valeur à l'autre et qui se
rapprocherait peut être plus du fonctionnement du "FOR ... NEXT" de
Basic :

```
# FOR I = O TO 5 : ... : NEXT
0.upto(5) do |i|
  puts "- nombre = #{i}"      # => 0, 1, 2, 3, 4, 5
end

# FOR I = 5 TO 0 STEP -1 : ... : NEXT
5.downto(0) do |i|
  puts "- nombre = #{i}"      # => 5, 4, 3, 2, 1
end

# FOR I = 0 TO 5 STEP 2 : ... : NEXT
0.step(5, 2) do |i|
  puts "- nombre = #{i}"      # => 0, 2, 4
end
```

## Les boucles "while" et "until"

Là il s'agit d'instructions qui font vraiment parti du langage Ruby (pas
comme le `for` qui est plus une "surcouche" pour le
`each`).

La boucle "while" permet de répéter le traitement d'un bloc de code tant
qu'une condition est vraie :

```
i = 0
while i <= 5 do
  puts "- nombre = #{i}"    # => 0, 1, 2, 3, 4, 5
  i += 1
end
```

Et la boucle "until" sert pour répéter le traitement jusqu'à ce que la
condition soit vraie :

```
i = 0
until i > 5 do
  puts "- nombre = #{i}"    # => 0, 1, 2, 3, 4, 5
  i += 1
end
```

On peut même arriver à faire des trucs comme :

```
i = 0
puts "- nombre = #{i += 1}" while i <= 5    # => 1, 2, 3, 4, 5, 6
```

## La boucle "loop"

Et finalement, Ruby dispose aussi d'une autre instruction native pour
effectuer des boucles.

```
loop do
   ...
end
```

Le seul truc, c'est qu'il faut prévoir quelque chose dans le corps de la
boucle pour en sortir, sinon ça bouclera éternellement.

C'est pour cela qu'il existe l'instruction `break` :

```
i = 0
loop do
  break if i > 5
  puts "- nombre = #{i}"    # => 0, 1, 2, 3, 4, 5
  i += 1
end
```

Et comme on fait le "break" sur une condition, on a droit à toutes les
variantes de notre choix :

* `break if i > 5`
* `if i > 5 break`
* `break unless i <= 5`
* `unless i <= 5 break`

On peut même placer l'instruction `break` où on veut dans la
boucle :

```
i = 0
loop do
  puts "- nombre = #{i}"    # => 0, 1, 2, 3, 4, 5
  i += 1
  break if i > 5
end

i = 0
loop do
  puts "- nombre = #{i}"    # => 0, 1, 2, 3, 4, 5, 6
  break if i > 5
  i += 1
end
```

Dans le même style que `break`, il existe `next` qui
permet en quelque sorte de "passer un tour" :

```
i = 0
loop do
  i += 1
  break if i > 5
  next if i < 3
  puts "- nombre = #{i}"    # => 3, 4, 5
end
```

## Portée des variables

En C#, une variable déclarée dans la boucle est locale et ne peut pas être
utilisé en dehors de la boucle :

```
for (int i = 0; i < 6; i++)
{
  var fois2 = i + i;
  Console.WriteLine(fois2);
}
Console.WriteLine(fois2);
```

=> `Le nom 'fois2' n'existe pas dans le contexte actuel`

C'est pareil en Ruby où une variable qui apparaît dans la boucle est
locale :

```
6.times do |i|
  fois2 = i + i
  puts fois2
end
puts fois2
```

=> `c:/Ruby/Rubyq.rb:5:in `<main>': undefined local variable
or method `fois2' for main:Object (NameError)`

Attention toutefois, car la variable ne sera pas locale du moment qu'elle
est apparue avant dans le source, y compris dans le cas où le code où elle
apparaissait n'a pas été exécuté :

```
if (1 == 2)
  fois2 = -3
end
6.times do |i|
  fois2 = i + i
  puts fois2
end
puts fois2
```

=> Le dernier `puts fois2` renverra 10.

D'autre part, la variable utilisée pour indicer la boucle est toujours
locale à la boucle, même dans le cas où une variable de même nom existe en
dehors de la boucle.

```
i = 99
6.times do |i|
  puts i
end
puts i
```

=> Le dernier `puts i` affichera 99 (et pas 10).
