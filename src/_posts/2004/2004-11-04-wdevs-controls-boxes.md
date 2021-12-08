---
date: 2004-11-04 19:32:00
layout: post
redirect_from: "post/2004/11/04/Wdevs-Of-controls-and-boxes"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Of controls and boxes"
---

Now that I'm more confident with mono and MySQL, I can work on some more
real tests.

IBuySpy and DotNetNuke have modules but it's not easy to use this word. You
never know wether "module" means "the piece of code and UI placed in a tab" or
"built-in module type". And I don't speak about translating these concepts. So
I select "Box", a short word wich appeared expressive. And with it, it's easier
to make the distingo between Box and BoxType.

I create the qc_BoxTypes table to record modules types, as the
ModuleDefinitions does for IBuySpy. Here again, I choose to have a string id
even if the difference between the content of idBoxType and title isn't very
obvious.

```
CREATE TABLE qc_BoxTypes (
    idBoxType varchar(20) NOT NULL default '',
    title varchar(100) NOT NULL default '',
    description varchar(255) default NULL,
    ctrlSource varchar(255) default NULL,
    editSource varchar(255) default NULL,
    defaultCache int(4) default NULL,
    toolbox varchar(20) default NULL
) ENGINE=InnoDB;

ALTER TABLE qc_BoxTypes
    ADD CONSTRAINT PK_qc_BoxTypes PRIMARY KEY (idBoxType);

INSERT INTO qc_BoxTypes
    (idBoxType, title, description, ctrlSource, editSource, defaultCache, toolbox)
VALUES
    ('htmltext', 'Htmltext', 'Html editor', '/classic/htmltext/edithtmltext.ascx', 60, 'Classic');
```

My qc_Boxes table is like Modules in IBuySpy. I just add an "alwaysVisible"
boolean field so that a Box will be visible on every screen.

```
CREATE TABLE qc_Boxes (
    idBox varchar(20) NOT NULL default '',
    idScreen varchar(20) NOT NULL default '',
    idBoxType varchar(20) NOT NULL default '',
    title varchar(100) NOT NULL default '',
    paneName varchar(20) NOT NULL default '',
    paneOrder int(4) default NULL,
    cacheTime int(4) default NULL,
    alwaysVisible bit NOT NULL
) ENGINE=InnoDB;

ALTER TABLE qc_Boxes
    ADD CONSTRAINT PK_qc_Boxes PRIMARY KEY (idBox);

ALTER TABLE qc_Boxes
    ADD CONSTRAINT FK_qc_Boxes_Screens FOREIGN KEY (idScreen) REFERENCES qc_Screens (idScreen) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE qc_Boxes
    ADD CONSTRAINT FK_qc_Boxes_BoxTypes FOREIGN KEY (idBoxType) REFERENCES qc_BoxTypes (idBoxType) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO qc_Boxes
    (idBox, idScreen, idBoxType, title, paneName, paneOrder, cacheTime, alwaysVisible)
VALUES
    ('skidootoo', 'home', 'htmltext', 'New Minty Fresh Flavor!', 'paneMain', 1, 60, false);
INSERT INTO qc_Boxes
    (idBox, idScreen, idBoxType, title, paneName, paneOrder, cacheTime, alwaysVisible)
VALUES
    ('thanks', 'home', 'htmltext', 'Remerciements', 'paneMore', 1, 60, true);
INSERT INTO qc_Boxes
    (idBox, idScreen, idBoxType, title, paneName, paneOrder, cacheTime, alwaysVisible)
VALUES
    ('test1', 'htmltext', 'htmltext', 'First Html test', 'paneMain', 1, 60, false);
```

Finally, I create a qc_Htmltexts table to handle the content of my future
first module box.

```
CREATE TABLE qc_Htmltexts (
    idBox varchar(20) NOT NULL default '',
    title varchar(100) NOT NULL default '',
    content text
) ENGINE=InnoDB;

ALTER TABLE qc_Htmltexts
    ADD CONSTRAINT PK_qc_Htmltexts PRIMARY KEY (idBox);

ALTER TABLE qc_HtmlTexts
    ADD CONSTRAINT FK_qc_Htmltexts_Boxes FOREIGN KEY (idBox) REFERENCES qc_Boxes (idBox) ON DELETE CASCADE ON UPDATE CASCADE;

INSERT...
```

Enough for tables. Let's write some c# code use them. BoxTypes.cs and
Boxes.cs are simply intended to handle qc_BoxTypes and qc_Boxes tables.
BoxControl.cs is like DesktopControls.cs in IBuySpy. Its interest is to be used
as a basis to be inherited for my future boxes. I just override Render method
to display box's title instead of using a DesktopModuleTitle.ascx control. And
I also use it to "incorporate" all the html render in a div tag to which I set
a specific ID (according to the box id) and a CSS class (according to the box
type). What will give:

```
<div class='boxDefault boxBoxType' id='qc_Box_id>
<h3>Box title</h3>
    ...
    ... user control basic render
    ...
</div> <!<del> qc_Box_id </del>>
```

Then I have Htmltext.cs for qc_Htmltexts table and viewHtmltext.ascx for
finally displaying my first contents.

The .ascx part :

```
<%@ Control Language="c#" AutoEventWireup="false"
  Codebehind="viewHtmltext.ascx.cs" Inherits="qc.Classic.Htmltext.viewHtmltext"
  TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<asp:placeholder id="boxHolder" runat="server" />
```

The .ascx.cs part :

```
public class viewHtmltext : qc.Core.BoxControl {

    protected System.Web.UI.WebControls.PlaceHolder boxHolder;

    private void Page_Load(object sender, System.EventArgs e) {
        try {
            Htmltext obj = new Htmltext(this.box.id);
            this.boxTitle = obj.title;
            string content = Server.HtmlDecode(obj.content) + "
";
            boxHolder.Controls.Add(new LiteralControl(content));
        }
        catch (Exception ex) {
            string content = ex.Message + ":(";
            boxHolder.Controls.Add(new LiteralControl(content));
        }
    }
...
```

The css part :

```
/* h3 styling for middle column */
#middleColumn .boxHtmltext h3 {
    background-image: url(styles/boxHtmltext.gif);
    background-repeat: no-repeat;
    background-position: left 0.1em;
    text-indent: 20px;
}

/* h3 styling for right column according to current screen */
#rightColumn h3 {
    color: #888;
    border-bottom: 2px dotted #888;
}
#home #rightColumn h3 {
    color: #00f;
    border-bottom: 2px dotted #00f;
}
#tests #rightColumn h3 {
    color: #f00;
    border-bottom: 2px dotted #f00;
}
#admin #rightColumn h3 {
    color: #080;
    border-bottom: 2px dotted #080;
}
```

And soon the demo link...
