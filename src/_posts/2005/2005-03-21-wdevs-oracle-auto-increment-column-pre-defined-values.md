---
date: 2005-03-21 17:17:00
layout: post
redirect_from: "post/2005/03/21/Wdevs-Oracle-auto-increment-column-and-pre-defined-values"
tags: qc, sql, wdevs
lang: en-US
title: "(Wdevs) Oracle, auto-increment column and pre-defined values"
---

This week-end, I looked for a way to have auto-increment column in Oracle
while having the possibility to set a given value in some inserts.

Several years ago, I used a trigger where the pseudo auto-incremented column
was initialized with a sequence only when its value is empty.

```
CREATE OR REPLACE TRIGGER TRG_BI_all_Increments
   BEFORE INSERT
   ON all_Increments
   FOR EACH ROW
BEGIN
   IF (:NEW.ID IS NULL) THEN
      SELECT SEQ_all_Increments.NEXTVAL INTO :NEW.ID FROM DUAL;
   END IF;
END;
```

That enabled me to initialize parameters tables with default values from an
sql script. The drawback was that once the data are loaded, the start value for
the sequence had to be manually reset to the maxim value inserted in order to
avoid duplicate errors.

I rewrote it so that when an INSERT statement define the ID value, the
triggeer checks if this value is greather than the current sequence value and
in this case automatically reset the sequence to the inserted value.

```
/* create table */
CREATE TABLE all_Increments (
    id   INT NOT NULL ,
    test VARCHAR2(100) ,
    CONSTRAINT PK_all_Increments
    PRIMARY KEY ( id )
);

/* create sequence */
CREATE SEQUENCE SEQ_all_Increments
    START WITH 1
    MAXVALUE 1.0E28
    MINVALUE 1
    NOCYCLE
    NOCACHE
    ORDER;

/* create trigger */
CREATE OR REPLACE TRIGGER TRG_BI_all_Increments
    BEFORE INSERT
    ON all_Increments
    FOR EACH ROW
DECLARE
    last_Sequence NUMBER;
    last_InsertID NUMBER;
BEGIN
    IF (:NEW.id IS NULL) THEN
         SELECT SEQ_all_Increments.NEXTVAL INTO :NEW.id FROM DUAL;
    ELSE
         SELECT NVL(Last_Number, 0) INTO last_Sequence
           FROM User_Sequences
          WHERE UPPER(Sequence_Name) = UPPER('SEQ_all_Increments');
         SELECT :NEW.id INTO last_InsertID FROM DUAL;
         WHILE (last_InsertID > last_Sequence) LOOP
              SELECT SEQ_all_Increments.NEXTVAL INTO last_Sequence FROM DUAL;
         END LOOP;
    END IF;
END;

/* test values */
INSERT INTO all_Increments (id, test) values (1, 'one');
INSERT INTO all_Increments (id, test) values (2, 'two');
INSERT INTO all_Increments (id, test) values (3, 'three');
INSERT INTO all_Increments (id, test) values (10, 'ten');
INSERT INTO all_Increments (test) values ('eleven?');
INSERT INTO all_Increments (id, test) values (5, 'five?');
INSERT INTO all_Increments (test) values ('twelve?');
```
