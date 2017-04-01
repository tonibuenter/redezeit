create schema SOC;


-- STATUS 0=new/open, 1=draft, 2=stored, 4=published, 5=activated/accepted, 9=deleted/invisible/denied, 
-- ACCESS 0=public, 1=access-control


-- create function SOC.currentMillis() returns BIGINT
-- PARAMETER STYLE JAVA NO SQL LANGUAGE JAVA
-- EXTERNAL NAME 'java.lang.System.currentTimeMillis';



-- ******************
-- *** SOC TICKET ***
-- ******************

-- drop table SOC.T_TICKET
create table SOC.T_TICKET (
    TICKET_TID bigint,
    TITLE varchar(256) not null,
    DESCRIPTION varchar(4000),
    TOPIC_TID bigint default 1,
    PRIORIY bigint default 1,
    --
    CREATED bigint not null,
    CREATOR_TID bigint not null, 
    UPDATED bigint not null,
    UPDATER_TID bigint not null, 
    STATUS bigint default 0,
    primary key (TICKET_TID)
);


-- use SOC.T_FILE_LIST_REL for attachment
