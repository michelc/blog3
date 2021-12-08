---
date: 2013-02-06 22:59:00
layout: post
redirect_from: "post/2013/02/06/ruby-boucle-times-csharp"
tags: csharp, ruby
title: "La boucle \"times\" de Ruby en C#"
---

Pour mon billet sur [les
boucles en Ruby]({% post_url 2012-12-19-boucles-ruby %}), j'étais tombé sur une version de l'itérateur
`times` de Ruby porté sur C# :

```
public static class Extensions
{
    public static void Times(this int count, Action action)
    {
        for (int i=0; i < count; i++)
        {
             action();
        }
    }

    public static void Times(this int count, Action<int> action)
    {
        for (int i=0; i < count; i++)
        {
             action(i);
        }
    }
}
```

Ca s'utilise aussi simplement que ça :

```
5.Times(() => Console.WriteLine("Hi"));
5.Times(i => Console.WriteLine("Index: {0}", i));
```

Source : [Any chances to imitate times() Ruby method in C#?](http://stackoverflow.com/questions/177538/any-chances-to-imitate-times-ruby-method-in-c) et c'est
une réponse de Jon Skeet. Le [Jon Skeet](http://askjonskeet.com/) !

Et maintenant, grâce à cette extension, je peux remplacer ce "vieux"
code :

```
for (int i = 0; i < 5; i++)
{
  var fois2 = i + i;
  Console.WriteLine(fois2);
}
```

Par ça :

```
5.Times(i => {
  var fois2 = i + i;
  Console.WriteLine(fois2);
});
```

Pour qu'il ait un meilleur goût de Ruby :

```
5.times do |i|
  fois2 = i + i
  puts fois2
end
```
