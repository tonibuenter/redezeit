create schema SOC;


-- STATUS 0=new/open, 1=draft, 2=stored, 4=published, 5=activated/accepted, 9=deleted/invisible/denied, 
-- ACCESS 0=public, 1=access-control


-- create function SOC.currentMillis() returns BIGINT
-- PARAMETER STYLE JAVA NO SQL LANGUAGE JAVA
-- EXTERNAL NAME 'java.lang.System.currentTimeMillis';



-- **********************
-- *** SOC TING GROUP ***
-- **********************

-- drop table SOC.T_TING_GROUP
create table SOC.T_TING_GROUP (
    TING_GROUP_TID bigint,
    NAME varchar(256) not null,
    DESCRIPTION varchar(4000),
    ACCESS int default 1,
    --
    CREATED bigint not null,
    CREATOR_TID bigint not null, 
    UPDATED bigint not null,
    UPDATER_TID bigint not null, 
    STATUS int default 0,
    primary key (TING_GROUP_TID),
    unique(NAME)
);
create unique index SOC_T_TING_GROUP_I2 ON SOC.T_TING_GROUP (NAME ASC);


-- select * from SOC.T_TING drop table SOC.T_TING_TOPIC

-- SQL150320211040551  select t.* from sys.sysconstraints c left join sys.systables t on t.TABLEID = c.TABLEID where c.CONSTRAINTNAME  ='SQL150320211040551' 
-- select * from sys.systables


-- drop table SOC.T_TING_TOPIC
create table SOC.T_TING (
	TING_TID bigint not null,
	TING_GROUP_TID bigint not null default -1,
	INDX bigint not null default -1,
	NAME varchar(256), 
	LOCATION varchar(4000) not null default '-na-', 
	LOCATION_DESCRIPTION varchar(4000) not null default '-na-', 
	START_TIME bigint not null,
	END_TIME bigint,
	DURATION_MIN bigint,
	DESCRIPTION varchar(4000),
	--
	CREATED bigint not null,
	CREATOR_TID bigint not null, 
	UPDATED bigint not null,
	UPDATER_TID bigint not null, 
	STATUS int default 0,
	foreign key (TING_GROUP_TID) references SOC.T_TING_GROUP(TING_GROUP_TID),
	primary key (TING_TID)
);
--create unique index SOC_T_TING_I2 ON SOC.T_TING (NAME ASC);
create index SOC_T_TING_I3 ON SOC.T_TING (START_TIME ASC);


alter table SOC.T_TING ADD PRIVATE bigint default 0;
create index SOC_T_TING_I4 ON SOC.T_TING (PRIVATE ASC);

--select * from SOC.T_TING where TING_GROUP_TID = 41131

--drop  index SOC.SOC_T_TING_I2;


alter table SOC.T_TING ADD TIME_NAME varchar(128);

-- drop table SOC.T_TING_TOPIC;
create table SOC.T_TING_TOPIC (
	TING_TOPIC_TID bigint not null,
	TING_TID bigint not null,
	INDX bigint not null default -1,
	NAME varchar(512) not null,
	DESCRIPTION varchar(4000),
	DURATION_PLANNED_MIN int, 
	--
	CREATED bigint not null,
	CREATOR_TID bigint not null, 
	UPDATED bigint not null,
	UPDATER_TID bigint not null, 
	STATUS int default 0,
	primary key (TING_TOPIC_TID),
	foreign key (TING_TID) references SOC.T_TING(TING_TID)
);

-- drop table SOC.T_TING_TOPIC

create index SOC_T_TING_TOPIC_IN1 ON SOC.T_TING_TOPIC (NAME ASC);

-- create unique index SOC_T_TING_TOPIC_IN1 ON SOC.T_TING_TOPIC (TING_TID, NAME ASC);
alter table SOC.T_TING_TOPIC ADD PRIVATE bigint default 0;

create index SOC_T_TING_TOPIC_I4 ON SOC.T_TING_TOPIC (PRIVATE ASC);



drop view SOC.V_USER_ACCESS_TING
;
drop view SOC.V_TING_UNION
;
drop view SOC.V_TING_GROUP_ACCESS 
;
drop view SOC.V_TING_ACCESS
;
drop view SOC.V_TING_TOPIC_ACCESS
;


--
-- SOC.V_TING_TOPIC_ACCESS
--

create view SOC.V_TING_TOPIC_ACCESS as
select u.USER_ID
, u.USER_TID
, tt.TING_TOPIC_TID  as TING_TOPIC_TID
, t.TING_TID         as TING_TID
, tg.TING_GROUP_TID  as TING_GROUP_TID
, coalesce(tta.RIGHT_TID, -1)      as TING_TOPIC_ACCESS
, coalesce(ta.RIGHT_TID, -1)       as TING_ACCESS
, coalesce(tga.RIGHT_TID, -1)      as TING_GROUP_ACCESS
, coalesce(tta.RIGHT_TID, ta.RIGHT_TID, tga.RIGHT_TID, 0) as COMP_ACCESS
from
SOC.V_USER u
left join
SOC.T_TING_TOPIC tt on true
left join
SOC.T_TING t on t.TING_TID = tt.TING_TID
left join
SOC.T_TING_GROUP tg on tg.TING_GROUP_TID = t.TING_GROUP_TID
left join
SOC.T_ACCESS tta on tta.ITEM_TID = tt.TING_TOPIC_TID and tta.USER_TID = u.USER_TID
left join
SOC.T_ACCESS ta on ta.ITEM_TID = t.TING_TID and ta.USER_TID = u.USER_TID
left join
SOC.T_ACCESS tga on tga.ITEM_TID = tg.TING_GROUP_TID and tga.USER_TID = u.USER_TID
order by 1, 3, 4, 5
;



--
-- SOC.V_TING_ACCESS
--

create view SOC.V_TING_ACCESS as
select u.USER_ID
, u.USER_TID
, t.TING_TID         as TING_TID
, tg.TING_GROUP_TID  as TING_GROUP_TID
, coalesce(ta.RIGHT_TID, -1)  as TING_ACCESS
, coalesce(tga.RIGHT_TID, -1)    as TING_GROUP_ACCESS
, coalesce(ta.RIGHT_TID,tga.RIGHT_TID, 0) as COMP_ACCESS
from
SOC.V_USER u
left join
SOC.T_TING t on true
left join
SOC.T_TING_GROUP tg on tg.TING_GROUP_TID = t.TING_GROUP_TID
left join
SOC.T_ACCESS ta on ta.ITEM_TID = t.TING_TID and ta.USER_TID = u.USER_TID
left join
SOC.T_ACCESS tga on tga.ITEM_TID = tg.TING_GROUP_TID and tga.USER_TID = u.USER_TID
order by 1, 3, 4
;

-- select * from SOC.V_TING_ACCESS where USER_TID = 26294 and TING_TID = 34574
-- select * from SOC.T_ACCESS where USER_TID = 26294 and ITEM_TID = 34574
-- delete from SOC.T_ACCESS where RIGHT_TID = -1
--
-- SOC.V_TING_GROUP_ACCESS
--

create view SOC.V_TING_GROUP_ACCESS as
select u.USER_ID
, u.USER_TID
, tg.TING_GROUP_TID  as TING_GROUP_TID
, coalesce(tga.RIGHT_TID, -1) as TING_GROUP_ACCESS
, coalesce(tga.RIGHT_TID, 0) as COMP_ACCESS
from
SOC.V_USER u
left join
SOC.T_TING_GROUP tg on true
left join
SOC.T_ACCESS tga on tga.ITEM_TID = tg.TING_GROUP_TID and tga.USER_TID = u.USER_TID
order by 1, 3
;



select u.USER_ID
, u.USER_TID
, tg.TING_GROUP_TID  as TING_GROUP_TID
, coalesce(tga.RIGHT_TID, -1) as TING_GROUP_ACCESS
, coalesce(tga.RIGHT_TID, 0) as COMP_ACCESS
from
SOC.V_USER u
left join
SOC.T_TING_GROUP tg on true
left join
SOC.T_ACCESS tga on tga.ITEM_TID = tg.TING_GROUP_TID and tga.USER_TID = u.USER_TID
order by 1, 3
;
select * from SOC.T_ACCESS
;
select * from SOC.V_USER
-- 
-- select * from SOC.V_USER




-- OLDER ...








-- 
drop view SOC.V_TING_UNION;

create view SOC.V_TING_UNION
as  
select * from (
select TING_TOPIC_TID as "ITEM_TID", NAME,  TING_TID as "PARENT_TID" , 'TOPIC' from SOC.T_TING_TOPIC 
union
select TING_TID as "ITEM_TID", NAME, TING_GROUP_TID as "PARENT_ID" , 'TING' from SOC.T_TING
union
select TING_GROUP_TID as "ITEM_TID", NAME, TING_GROUP_TID as "PARENT_ID", 'GROUP' from SOC.T_TING_GROUP
) as t(ITEM_TID, NAME, PARENT_TID, ITEM_TYPE)
order by 3, 2;







create view SOC.V_USER_ACCESS_TOPIC 
(USER_TID, TOPIC_TID, TING_TID, TING_TID, TOPIC_RID, MEETING_INSTANCE_RID , MEETING_RID)
as
select
u.USER_TID,
a.TOPIC_TID,
mi.TING_TID
,
m.TING_TID
,
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = a.TOPIC_TID AND aa.USER_TID = u.USER_TID),-1) as "TOPIC_RID",
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = mi.TING_TID AND aa.USER_TID = u.USER_TID),-1) as "MEETING_INSTANCE_RID",
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = m.TING_TID  AND aa.USER_TID = u.USER_TID),-1) as "MEETING_RID"
from
SOC.T_TING_TOPIC a left join SOC.T_TING_INSTANCE mi on mi.TING_TID = a.TING_TID
left join SOC.T_TING m  on m.TING_TID = mi.parent_tid
,
JGROUND.T_USER u;




create view SOC.V_USER_ACCESS_TING_INSTANCE
(USER_TID, TING_TID, TING_TID, MEETING_INSTANCE_RID , MEETING_RID)
as
select
u.USER_TID,
mi.TING_TID,
m.TING_TID,
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = mi.TING_TID AND aa.USER_TID = u.USER_TID), -1) as "MEETING_INSTANCE_RID",
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = m.TING_TID  AND USER_TID = aa.u.USER_TID),-1) as "MEETING_RID"
from
SOC.T_TING_INSTANCE mi
left join SOC.T_TING m  on m.TING_TID = mi.parent_tid,
JGROUND.T_USER u
;



create view SOC.V_USER_ACCESS_TING
(USER_TID, TING_TID, MEETING_RID)
as
select
u.USER_TID,
m.TING_TID,
coalesce( (select RIGHT_TID from SOC.T_ACCESS aa where aa.ITEM_TID = m.TING_TID  AND aa.USER_TID = u.USER_TID), -1) as "MEETING_RID"
from
SOC.T_TING m,
JGROUND.T_USER u
;



drop view  SOC.V_USER_ACCESS_ITEM ;

create view SOC.V_USER_ACCESS_ITEM 
(USER_TID, TOPIC_TID, TING_TID, TING_TID, TOPIC_RID, MEETING_INSTANCE_RID , MEETING_RID)
as
select
u.USER_TID,
a.TOPIC_TID,
mi.TING_TID
,
m.TING_TID
,
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = a.TOPIC_TID AND aa.USER_TID = u.USER_TID),-1) as "TOPIC_RID",
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = mi.TING_TID AND aa.USER_TID = u.USER_TID),-1) as "MEETING_INSTANCE_RID",
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = m.TING_TID  AND aa.USER_TID = u.USER_TID),-1) as "MEETING_RID"
from
SOC.T_TING_TOPIC a left join SOC.T_TING_INSTANCE mi on mi.TING_TID = a.TING_TID
left join SOC.T_TING m  on m.TING_TID = mi.parent_tid
,
JGROUND.T_USER u

union

select
u.USER_TID,
-1 as "TOPIC_TID",
mi.TING_TID,
m.TING_TID ,
-1 as "TOPIC_RID",
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = mi.TING_TID AND aa.USER_TID = u.USER_TID), -1) as "MEETING_INSTANCE_RID",
coalesce((select RIGHT_TID from SOC.T_ACCESS aa where ITEM_TID = m.TING_TID  AND USER_TID = aa.u.USER_TID),-1) as "MEETING_RID"
from
SOC.T_TING_INSTANCE mi
left join SOC.T_TING m  on m.TING_TID = mi.parent_tid,
JGROUND.T_USER u

union

select
u.USER_TID, -1 as "TOPIC_TID", -1 as "TING_TID",
m.TING_TID ,
-1 as "TOPIC_RID", -1 as "MEETING_INSTANCE_RID",
coalesce( (select RIGHT_TID from SOC.T_ACCESS aa where aa.ITEM_TID = m.TING_TID  AND aa.USER_TID = u.USER_TID), -1) as "MEETING_RID"
from
SOC.T_TING m,
JGROUND.T_USER u
;
