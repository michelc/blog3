---
date: 2005-09-14 16:58:00
layout: post
redirect_from: "post/2005/09/14/Capitalization"
tags: code-snippets, csharp
title: "Capitalization"
---

D'après [C# Regular Expressions](http://windows.oreilly.com/news/csharp_0101.html) :

```
using System.Text.RegularExpressions;

public class MyClass {

  public static void Main() {
    string text = "the quick red fox jumped over the lazy brown DOG.";
    System.Console.WriteLine("text=[" + text + "]");
    string result = Regex.Replace(text, @"w+", new MatchEvaluator(MyClass.CapText));
    System.Console.WriteLine("result=[" + result + "]");
    System.Console.ReadLine();
  }

  static string CapText(Match m) {
    string temp = m.ToString();
    temp = char.ToUpper(temp[0]) + temp.Substring(1, temp.Length - 1).ToLower();
    return temp;
  }

}
```

Edit : commentaire de utagger :

> Here's a shorter version:
>
>
> ```
> protected void Button1_Click(object sender, EventArgs e) {
>   Label1.Text = Regex.Replace(TextBox1.Text, @”\b\w”, new MatchEvaluator(stam));
> }
>
> protected string stam(Match m) {
>   return m.Value.ToUpper();
> }
> ```
>
>
> (the trick is using \b which is a 0-length match of word boundaries,
> including ^ and \s)
