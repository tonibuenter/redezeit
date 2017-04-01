

--
--
--
--
-- SOC TING
--
--
--




--
-- TING GROUP SELECT
--
-- SERVICE_ID = TingGroup.select
-- ROLES      = TING_USER
--

set-if-empty:groupNameFilter=%
;
set-if-empty:groupDescriptionFilter=%
;
select 
tg.TING_GROUP_TID, 
tg.NAME as GROUP_NAME, 
tg.DESCRIPTION as GROUP_DESCRIPTION, 
tg.STATUS as GROUP_STATUS,
(select count(ti.TING_GROUP_TID) from SOC.T_TING ti where ti.TING_GROUP_TID = tg.TING_GROUP_TID) as NR_OF_TINGS,
(select count(ti.TING_GROUP_TID) from SOC.T_TING ti where ti.TING_GROUP_TID = tg.TING_GROUP_TID and ti.START_TIME > :$CURRENT_TIME_MILLIS) as NR_OF_FUTURE_TINGS,
tga.TING_GROUP_ACCESS as MY_RIGHT_TID
from 
SOC.T_TING_GROUP tg
left join
SOC.V_TING_GROUP_ACCESS tga on tga.TING_GROUP_TID = tg.TING_GROUP_TID
where
tg.NAME like :groupNameFilter
and
tg.DESCRIPTION like :groupDescriptionFilter
and
tga.USER_TID = :$USERTID
and
tga.TING_GROUP_ACCESS > 0

--
-- select * from SOC.T_ACCESS
USER_TID ITEM_TID RIGHT_TID FORBID_TID STATUS
 -------- -------- --------- ---------- ------
     1845    98904         3          1      0
     1845   100138         7          2      0
     1845   892311         3          0      1
     
-- select * from SOC.V_TING_GROUP_ACCESS

USER_TID ITEM_TID RIGHT_TID FORBID_TID STATUS
 -------- -------- --------- ---------- ------
     1845    98904         3          1      0
     1845   100138         7          2      0
     1845   892311         3          0      1
     
     
      sql-param $CURRENT_TIME_MILLIS : 1456855923753
DEBUG [http-nio-8080-exec-1] 19:12:03,757  (RemoteQuery.java:1277) sql-param groupNameFilter : %
DEBUG [http-nio-8080-exec-1] 19:12:03,757  (RemoteQuery.java:1277) sql-param groupDescriptionFilter : %
DEBUG [http-nio-8080-exec-1] 19:12:03,757  (RemoteQuery.java:1277) sql-param $USERTID : 1845
DEBUG [http-nio-8080-exec-1] 19:12:03,771  (RemoteQuery.java:4006) sql-result-header [tingGroupTid, groupName, groupDescription, groupStatus, nrOfTings, nrOfFutureTings, myRightTid]


select
tg.TING_GROUP_TID,
tg.NAME as GROUP_NAME,
tg.DESCRIPTION as GROUP_DESCRIPTION,
tg.STATUS as GROUP_STATUS,
(select count(ti.TING_GROUP_TID) from SOC.T_TING ti where ti.TING_GROUP_TID = tg.TING_GROUP_TID) as NR_OF_TINGS,
(select count(ti.TING_GROUP_TID) from SOC.T_TING ti where ti.TING_GROUP_TID = tg.TING_GROUP_TID and ti.START_TIME > 1456855923753) as NR_OF_FUTURE_TINGS,
tga.TING_GROUP_ACCESS as MY_RIGHT_TID,
tga.USER_TID 
from
SOC.T_TING_GROUP tg
left join
SOC.V_TING_GROUP_ACCESS tga on tga.TING_GROUP_TID = tg.TING_GROUP_TID
where
tg.NAME like '%'
and
tg.DESCRIPTION like '%'
and
tga.USER_TID = :$USERTID
and
tga.TING_GROUP_ACCESS > 0     
     
     
     
-- select * from SOC.T_TING_GROUP


select 
tg.TING_GROUP_TID, 
tg.NAME as GROUP_NAME, 
tg.DESCRIPTION as GROUP_DESCRIPTION, 
tg.STATUS as GROUP_STATUS,
(select count(ti.TING_GROUP_TID) from SOC.T_TING ti where ti.TING_GROUP_TID = tg.TING_GROUP_TID) as NR_OF_TINGS,
coalesce(a.RIGHT_TID, 0) as RIGHT_TID,
coalesce(a.FORBID_TID, 0) AS FORBID_TID,
coalesce(a.RIGHT_TID, 0) -coalesce(a.FORBID_TID, 0) AS ACCESS,
a.USER_TID
from 
SOC.T_TING_GROUP tg
left join
SOC.T_ACCESS a on a.ITEM_TID = tg.TING_GROUP_TID
where
tg.NAME like :groupNameFilter
and
tg.DESCRIPTION like :groupDescriptionFilter





select a.USER_TID, tg.T_TING_GROUP from
 SOC.T_ACCESS a
 left join
 SOC.T_TING_GROUP tg on tg.TING_GROUP_TID = a.ITEM_TID
 
 where 
 a.USER_TID in (select a2.USER_TID from SOC.T_ACCESS a2 where a.ITEM_TID = a2.ITEM_TID and )
 and
 not
 (
 a.USER_TID in (select a2.USER_TID from SOC.T_ACCESS a2 where a.ITEM_TID = a2.ITEM_TID and FORBID_TID > 1)
 )
 
 (
    USER_TID bigint not null,
    ITEM_TID bigint not null,
    RIGHT_TID bigint not null,
    FORBID_TID bigint not null,
    STATUS int default 0,

--
-- TING GROUP GET
--
-- SERVICE_ID = TingGroup.get
-- ROLES      = TING_USER
--

select 
tg.TING_GROUP_TID, 
tg.NAME as GROUP_NAME, 
tg.DESCRIPTION as GROUP_DESCRIPTION, 
tg.STATUS as GROUP_STATUS,
(select count(ti.TING_GROUP_TID) from SOC.T_TING ti where ti.TING_GROUP_TID = tg.TING_GROUP_TID) as NR_OF_TINGS,
(select count(ti.TING_GROUP_TID) from SOC.T_TING ti where ti.TING_GROUP_TID = tg.TING_GROUP_TID and ti.START_TIME > :$CURRENT_TIME_MILLIS) as NR_OF_FUTURE_TINGS,
tga.TING_GROUP_ACCESS as MY_RIGHT_TID,
(select case when count(TING_TID) = 0 then 'true' else 'false' end from SOC.T_TING where TING_GROUP_TID = :tingGroupTid) as CAN_DELETE
from 
SOC.T_TING_GROUP tg
left join
SOC.V_TING_GROUP_ACCESS tga on tga.TING_GROUP_TID = tg.TING_GROUP_TID
where
tga.USER_TID = :$USERTID
and
tga.TING_GROUP_ACCESS > 0
and 
tg.TING_GROUP_TID = :tingGroupTid



--
-- TING GROUP INSERT
--
-- SERVICE_ID = TingGroup.insert
-- ROLES      = TING_USER
--

set:tidName=$NEWTID
;
include:JGROUND.$NEWTID
;
insert into SOC.T_TING_GROUP
(
TING_GROUP_TID, 
NAME, 
DESCRIPTION,
CREATED,
CREATOR_TID,
UPDATED,
UPDATER_TID
)
VALUES 
(
:$NEWTID, 
:groupName,
:groupDescription,
:$CURRENT_TIME_MILLIS,
:$USERTID,
:$CURRENT_TIME_MILLIS,
:$USERTID
)
;
insert into SOC.T_ACCESS
(
USER_TID, 
ITEM_TID, 
RIGHT_TID,
FORBID_TID,
STATUS
)
VALUES 
(
:$USERTID, 
:$NEWTID, 
3,
0,
1
)

--
-- TING GROUP UPDATE
--
-- SERVICE_ID = TingGroup.update
-- TAGS = RQ
--

update 
SOC.T_TING_GROUP 
set 
NAME=:groupName, 
DESCRIPTION=:groupDescription, 
STATUS=:groupStatus,
UPDATED = :$CURRENT_TIME_MILLIS,
UPDATER_TID = :$USERTID
where 
TING_GROUP_TID = :tingGroupTid



--
-- TING GROUP DELETE
--
-- SERVICE_ID = TingGroup.delete
-- TAGS = RQ
--

delete from SOC.T_TING_GROUP where TING_GROUP_TID = :tingGroupTid



--
--
-- SERVICE_ID = SOC.MyUsers
--
--

select USER_TID, USER_ID from JGROUND.T_USER
where USER_TID > -1



--
--
-- SERVICE_ID = TingGroup.selectableUserAccess
-- TAGS = RQ
--
--

set-if-empty:userIdFilter=%
;
select u.USER_TID, u.USER_ID, '1' as RIGHT_TID from 
JGROUND.T_USER u
where
not (
u.USER_TID in (select u2.USER_TID from SOC.T_ACCESS u2 where u2.ITEM_TID = :tingGroupTid)
)
and 
USER_TID > -1
and
u.USER_ID like :userIdFilter



--
-- TING SELECT BY TING GROUP
--
-- SERVICE_ID = Ting.selectByTingGroup
-- TAGS = RQ
--

set-if-empty:tingNameFilter=%
;
select 
t.TING_TID, 
t.NAME as TING_NAME, 
t.TIME_NAME,
t.LOCATION, 
t.LOCATION_DESCRIPTION, 
t.START_TIME, 
t.END_TIME, 
t.DESCRIPTION as TING_DESCRIPTION, 
t.STATUS as TING_STATUS,
(select count(tti.TING_TID) from SOC.T_TING_TOPIC tti where tti.TING_TID = t.TING_TID) as NR_OF_TOPICS,
(select sum(tti.DURATION_PLANNED_MIN) from SOC.T_TING_TOPIC tti where tti.TING_TID = t.TING_TID) as DURATION_PLANNED_MIN,
ta.COMP_ACCESS as MY_ACCESS
from 
SOC.T_TING t 
left join 
SOC.V_TING_ACCESS ta on ta.TING_TID =  t.TING_TID 
where
t.TING_GROUP_TID = :tingGroupTid
and 
t.NAME like :tingNameFilter
and
ta.COMP_ACCESS > 0
and
ta.USER_TID = :$USERTID


--
-- TING TOPIC ORDER BY TING_TOPIC_TID
--
-- SERVICE_ID = TingTopic.orderByTingTopic
--

 [ {
    'foreach' : {
      'parameters' : 'select TING_TOPIC_TID from SOC.T_TING_TOPIC where TING_TID = :tingTid order by TING_TOPIC_TID',
      'index-name' : 'index',
      'do' : 'update SOC.T_TING_TOPIC set INDX = :index + 1 where TING_TOPIC_TID = :tingTopicTid'
    }
  }, 'serviceId:TingTopic.selectByTing' ]

  
  
--

--
-- TING TOPIC ORDER BY TING_TOPIC_TID
--
-- SERVICE_ID = TingTopic.move
-- TAGS = RQ
--

  
  update SOC.T_TING_TOPIC
  set INDX = INDX -1
  where TING_TID = :tingTid
  and INDX > :indx
  ;
  update SOC.T_TING_TOPIC
  set INDX = INDX + 1
  where TING_TID = :tingTid
  and INDX >= :newIndx
  ;
  update SOC.T_TING_TOPIC
  set INDX = :newIndx
  where TING_TID = :tingTid
  and TING_TOPIC_TID = :tingTopicTid
  ;
serviceId:TingTopic.selectByTing
  
--

---
--- *** BEGIN OF FILE MANAGEMENT ***
---


--
-- TING TOPIC GET
--
-- SERVICE_ID = TingTopic.get
-- TAGS = RQ
-- 

select 
tt.TING_TOPIC_TID, 
ti.TING_TID, 
ti.NAME as "TING_NAME", 
gr.NAME as "GROUP_NAME", 
tt.NAME as "TOPIC_NAME", 
tt.DESCRIPTION as "TOPIC_DESCRIPTION", 
tt.DURATION_PLANNED_MIN 
from 
SOC.T_TING_TOPIC tt
left join
SOC.T_TING ti on ti.TING_TID = tt.TING_TID
left join
SOC.T_TING_GROUP gr on gr.TING_GROUP_TID = ti.TING_GROUP_TID
where
t.TING_TOPIC_TID = :tingTopicTid



--
--
-- SERVICE_ID = TingTopic.getForUpdate
-- ROLES      = TING_USER
-- 

include:JGROUND.$NEWTID
;
insert into
SOC.T_FILE_LIST
(
FILE_LIST_TID,
OWNER_TID,
CREATED
)
values
(
:$NEWTID,
:tingTopicTid,
:$CURRENT_TIME_MILLIS
)
;
serviceId:TingGroup.fileListCopy
;
select 
tt.TING_TOPIC_TID, 
ti.TING_TID, 
ti.NAME as "TING_NAME", 
gr.NAME as "GROUP_NAME", 
tt.NAME as "TOPIC_NAME", 
tt.DESCRIPTION as "TOPIC_DESCRIPTION", 
tt.DURATION_PLANNED_MIN,
fl.FILE_LIST_TID
from 
SOC.T_TING_TOPIC tt
left join
SOC.T_TING ti on ti.TING_TID = tt.TING_TID
left join
SOC.T_TING_GROUP gr on gr.TING_GROUP_TID = ti.TING_GROUP_TID
left join
SOC.T_FILE_LIST fl on fl.OWNER_TID = tt.TING_TOPIC_TID
where
tt.TING_TOPIC_TID = :tingTopicTid
and
fl.FILE_LIST_TID = :$NEWTID


    

--
--
-- SERVICE_ID = TingTopic.getForInsert
-- 

include:JGROUND.$NEWTID
;
insert into
SOC.T_FILE_LIST
(
FILE_LIST_TID,
CREATED
)
values
(
:$NEWTID,
:$CURRENT_TIME_MILLIS
)
;
select 
TID as FILE_LIST_TID
from JGROUND.T_TID
where
TID = :$NEWTID



--
--
-- SERVICE_ID = TingGroup.fileListCopy
-- ROLES      = TING_USER,SOC_USER
-- TAGS       = RQ
--

[ {
      'foreach' : {
        'parameters' : 'select r.FILE_TID as I_FILE_TID from SOC.T_FILE_LIST_REL r left join SOC.T_FILE_LIST l on l.FILE_LIST_TID = r.FILE_LIST_TID where l.FILE_LIST_TID = :fileListTid',
        'index-name' : 'index',
        'do' : 'insert into SOC.T_FILE_LIST_REL (FILE_LIST_TID, FILE_TID) values (:$NEWTID, :iFileTid)'
      }
    } ]

    
--
--
-- SERVICE_ID = TingTopic.documents
-- TAGS       = RQ
-- 

select 
f.FILE_TID, 
f.FILENAME,
f.SHA,
coalesce(r.TARGET_TID, -1) as PREVIEW_FILE_TID
from
SOC.T_FILE_LIST_REL fr
left join
JGROUND.T_SHA_FILE f on f.FILE_TID = fr.FILE_TID
left join
JGROUND.T_SHA_FILE_REL r on r.FILE_TID = f.FILE_TID and r.REL_TID = -100 and r.INDX = 0
where
f.FILE_TID > 0
and
fr.FILE_LIST_TID = :fileListTid
--and



--
--
-- SERVICE_ID = Ting.PdfDocumentUploadService
-- ROLES      = SOC_USER,TING_USER
-- 

set:$fileListServiceId=Ting.FileListRel.insert
;
java:org.anakapa.app.jground.PdfDocumentUploadService



--
--
-- SERVICE_ID = Ting.FileListRel.insert
--
-- 

insert into
SOC.T_FILE_LIST_REL
(
FILE_LIST_TID,
FILE_TID
)
values
(
:fileListTid,
:fileTid
)
    


--
--
-- SERVICE_ID = Ting.FileListRel.delete
-- TAGS       = RQ
--

delete from SOC.T_FILE_LIST_REL where FILE_LIST_TID = :fileListTid and FILE_TID = :fileTid

    
--- *** END OF FILE MANAGEMENT ***

--
-- TING TOPIC ORDER BY TING_TOPIC_TID
--
-- SERVICE_ID = TingTopic.delete
-- TAGS = RQ
--

[ 
	{ 
		'switch' : 'select 1 from SOC.V_TING_TOPIC_ACCESS v where v.TING_TOPIC_TID = :tingTopicTid and v.COMP_ACCESS > 2 and v.USER_TID = :$USERTID', 
		'case:1' : 'serviceId:TingTopic.deleteSystem'
  }
]
  
  
 --
 
select 1 from SOC.V_TING_TOPIC_ACCESS v where v.TING_TOPIC_TID = 41097 and v.COMP_ACCESS > 2 and v.USER_TID = 1720

select * from SOC.V_TING_TOPIC_ACCESS where TING_TID = 42238 order by TING_TOPIC_TID

update  tt1
set INDX = (select  R  from  (select ROW_NUMBER() OVER () as R from SOC.T_TING_TOPIC tt where
tt.TING_TID = tt1.TING_TID) as t(RN, TTTID) where TTTID = tt1.TING_TOPIC_TID)
where

update  T_TING_TOPIC
set INDX = (select  R  from  (select ROW_NUMBER() OVER () as R from SOC.T_TING_TOPIC tt where
tt.TING_TID = tt1.TING_TID) as t(RN, TTTID) where TTTID = tt1.TING_TOPIC_TID)
where
TING_TID = 42238
and
TING_TOPIC_TID = 

[
'foreach':{'parameters':'select * SOC.T_TING_TOPIC where TING_TID = :tingTid'
,'do':'update SOC.T_TING_TOPIC set INDX = :index where TING_TOPIC_TID = :tingTopicTid'}
]

foreach:select * from  ;
select ROW_NUMBER() OVER () as R from SOC.T_TING_TOPIC tt where
tt.TING_TID = 42238 and tt.TING_TID 
;
end;


update SOC.T_TING_TOPIC tt1
set tt1.INDX = (select tt.indx from SOC.T_TING_TOPIC tt where tt1.T_TING_TOPIC = tt.TING_TOPIC)



from SOC.T_TING_TOPIC tt1

where


(
   SELECT 
     ROW_NUMBER() OVER () AS R, 
     T.* 
   FROM T
) AS TR



create view SOC.V_ROW_NUMBER_TING_TOPIC




where


select ROW_NUMBER() OVER () as ORD , tt.* from SOC.T_TING_TOPIC tt where
tt.TING_TID = 42238

select ROW_NUMBER() OVER () as ORD, tt.* from SOC.T_TING_TOPIC tt



--
-- TING GET
--
-- SERVICE_ID = Ting.get
-- TAGS = RQ
--

select 
t.TING_TID, 
g.NAME as TING_GROUP_NAME, 
g.TING_GROUP_TID, 
t.NAME as TING_NAME, 
t.TIME_NAME,
t.LOCATION, 
t.LOCATION_DESCRIPTION, 
t.START_TIME, 
t.END_TIME, 
t.DESCRIPTION as TING_DESCRIPTION, 
t.STATUS as TING_STATUS,
(select case when count(TING_TOPIC_TID) = 0 then 'true' else 'false' end from SOC.T_TING_TOPIC where TING_TID = :tingTid) as CAN_DELETE
from 
SOC.T_TING t 
left join 
SOC.T_TING_GROUP g on g.TING_GROUP_TID = t.TING_GROUP_TID
where
t.TING_GROUP_TID = :tingGroupTid
and
t.TING_TID = :tingTid



--
-- TING INSERT
--
-- SERVICE_ID = Ting.insert
-- TAGS = RQ
--

set-if-empty:locationDescription=-
;
set:tidName=$NEWTID
;
include:JGROUND.$NEWTID
;
insert into SOC.T_TING 
(
TING_TID, 
TING_GROUP_TID, 
NAME, 
TIME_NAME,
LOCATION, 
LOCATION_DESCRIPTION, 
START_TIME, 
DESCRIPTION, 
STATUS,
CREATED,
CREATOR_TID,
UPDATED,
UPDATER_TID
)
VALUES 
(
:$NEWTID,
:tingGroupTid, 
:tingName, 
:timeName,
:location, 
:locationDescription, 
:startTime, 
:tingDescription, 
0,
:$CURRENT_TIME_MILLIS,
:$USERTID,
-1,
-1
)
;
update SOC.T_TING 
set END_TIME = :endTime
where
TING_TID = :$NEWTID




--
-- TING NEW
--
-- SERVICE_ID = Ting.new
-- TAGS = RQ
--

select 
TING_GROUP_TID,
'' as LOCATION_DESCRIPTION
from
SOC.T_TING_GROUP 
where
TING_GROUP_TID = :tingGroupTid



--
-- TING UPDATE
--
-- SERVICE_ID = Ting.update
-- TAGS = RQ
--

set-if-empty:locationDescription=-
;
set-if-empty:tingGroupTid=-1
;
update 
SOC.T_TING 
set 
TING_GROUP_TID        = :tingGroupTid, 
NAME                  = :tingName, 
TIME_NAME             = :timeName, 
LOCATION              = :location, 
LOCATION_DESCRIPTION  = :locationDescription, 
START_TIME            = :startTime, 
DESCRIPTION           = :tingDescription, 
STATUS                = :tingStatus,
UPDATED               = :$CURRENT_TIME_MILLIS,
UPDATER_TID           = :$USERTID
where 
TING_TID = :tingTid
;
update 
SOC.T_TING 
set 
END_TIME              = null
where 
TING_TID = :tingTid
;
update 
SOC.T_TING 
set 
END_TIME              = :endTime
where 
TING_TID = :tingTid



--
-- TING DELETE
--
-- SERVICE_ID = Ting.delete
-- TAGS = RQ
--

delete from 
SOC.T_TING
where
TING_TID = :tingTid



--
-- TING TOPIC SELECT
--
-- SERVICE_ID = TingTopic.selectByTing
-- TAGS = RQ
-- select * from SOC.T_TING_TOPIC

select 
tt.TING_TOPIC_TID, 
ti.TING_TID, 
ti.NAME as "TING_NAME", 
gr.NAME as "GROUP_NAME", 
tt.NAME as "TOPIC_NAME", 
tt.DESCRIPTION as "TOPIC_DESCRIPTION", 
tt.DURATION_PLANNED_MIN,
tt.INDX,
fl.FILE_LIST_TID
from 
SOC.T_TING_TOPIC tt
left join
SOC.T_TING ti on ti.TING_TID = tt.TING_TID
left join
SOC.T_TING_GROUP gr on gr.TING_GROUP_TID = ti.TING_GROUP_TID
left join
SOC.T_FILE_LIST fl on fl.OWNER_TID = tt.TING_TOPIC_TID and fl.STATUS = 1
where
ti.TING_TID = :tingTid
order by tt.INDX, tt.TING_TOPIC_TID



--
-- TING TOPIC INSERT
--
-- SERVICE_ID = TingTopic.insert
--

[ 
	{ 
		'switch' : 'select 1 from SOC.V_TING_ACCESS v where v.TING_TID = :tingTid and v.COMP_ACCESS > 2 and v.USER_TID = :$USERTID', 
		'case:1' : 'serviceId:TingTopic.insertSystem',
		'null' : {'userMessage':'warn:Sorry, you can not add Topics - you have not enough rights!'}
  }
]



--
-- TING TOPIC INSERT
--
-- SERVICE_ID = TingTopic.insertSystem
-- TAGS = RQ
--

set-if-empty:topicName=-
;
set:tidName=$NEWTID
;
include:JGROUND.$NEWTID
;
set-if-empty:durationPlannedMin=10
;
insert into SOC.T_TING_TOPIC 
(
TING_TOPIC_TID, 
TING_TID, 
NAME, 
DESCRIPTION, 
DURATION_PLANNED_MIN,
INDX,
STATUS,
CREATED,
CREATOR_TID,
UPDATED,
UPDATER_TID
)
VALUES 
(
:$NEWTID,
:tingTid, 
:topicName, 
:topicDescription, 
:durationPlannedMin,
(select 1+count(i.TING_TOPIC_TID) from SOC.T_TING_TOPIC i where i.TING_TID = :tingTid),
0,
:$CURRENT_TIME_MILLIS,
:$USERTID,
-1,
-1
)



--
-- TING TOPIC UPDATE
--
-- SERVICE_ID = TingTopic.update
-- TAGS = RQ
-- select * from SOC.T_TING_TOPIC

set-if-empty:durationPlannedMin=10
;
set-if-empty:topicDescription=...
;
serviceId:TingTopic.checkInsert
;
update SOC.T_TING_TOPIC
set
NAME = :topicName,
DESCRIPTION = :topicDescription,
DURATION_PLANNED_MIN = :durationPlannedMin,
UPDATED = :$CURRENT_TIME_MILLIS,
UPDATER_TID = :$USERTID
where
TING_TOPIC_TID = :tingTopicTid
;
delete from
SOC.T_FILE_LIST
where
OWNER_TID = :tingTopicTid
;
insert into
SOC.T_FILE_LIST
(
FILE_LIST_TID,
OWNER_TID,
CREATED,
STATUS
)
values
(
:fileListTid,
:tingTopicTid,
:$CURRENT_TIME_MILLIS,
1
)
;
delete from SOC.T_FILE_LIST_REL fr
where
(select i.FILE_LIST_TID from SOC.T_FILE_LIST i where i.FILE_LIST_TID = fr.FILE_LIST_TID) is null



--
--
-- SERVICE_ID = TingTopic.checkInsert
-- 
-- 

 [
        'set-if-empty:tingTopicTid=-1',
        'set-if-empty:topicName=-',
        'set-if-empty:topicDescription=...',
        {
          'switch' : 'select TING_TOPIC_TID from SOC.T_TING_TOPIC where TING_TOPIC_TID = :tingTopicTid',
          'null' : [
                'include:JGROUND.$NEWTID',
                'include:TingTopic.insert0',
                'parameters:select TID as TING_TOPIC_TID from JGROUND.T_TID where TID = :$NEWTID',
                'update SOC.T_FILE_LIST set OWNER_TID = :tingTopicTid where FILE_LIST_TID = :fileListTid' ]
        }
    ]

--
-- TING TOPIC INSERT 0
--
-- SERVICE_ID = TingTopic.insert0
-- 
-- 

insert into SOC.T_TING_TOPIC 
(TING_TOPIC_TID, TING_TID, NAME, DESCRIPTION, CREATOR_TID, CREATED, UPDATER_TID, UPDATED) 
values 
(:$NEWTID, :tingTid, :topicName, :topicDescription, :$USERTID, :$CURRENT_TIME_MILLIS, :$USERTID, :$CURRENT_TIME_MILLIS)   


    
    
--
-- TING TOPIC DELETE
--
-- SERVICE_ID = TingTopic.deleteSystem
-- TAGS = RQ
-- 

update SOC.T_TING_TOPIC
set INDX = INDX -1
where TING_TID = :tingTid
and INDX > :indx
;
delete from SOC.T_TING_TOPIC
where
TING_TOPIC_TID = :tingTopicTid





--
-- TING TOPIC SELECT USER ACCESS
--
-- SERVICE_ID = TingTopic.selectUserAccess
-- TAGS = RQ
--

select u.USER_TID, u.USER_ID, tta.TING_GROUP_ACCESS, tta.TING_ACCESS, tta.TING_TOPIC_ACCESS as RIGHT_TID, tta.COMP_ACCESS, 
(CASE
      WHEN u.USER_TID = :$USERTID THEN 'true'
      ELSE 'false'
END) as IS_ME,
(select tta2.COMP_ACCESS from 
	SOC.V_TING_TOPIC_ACCESS tta2 where tta2.USER_TID = :$USERTID and tta2.TING_TOPIC_TID = :tingTopicTid)
	as MY_COMP_ACCESS

from
SOC.T_TING_TOPIC tt
left join
SOC.V_TING_TOPIC_ACCESS tta on tta.TING_TOPIC_TID = tt.TING_TOPIC_TID
left join
JGROUND.T_USER u on u.USER_TID = tta.USER_TID
where
tt.TING_TOPIC_TID = :tingTopicTid
and
(tta.COMP_ACCESS > 0 or tta.TING_TOPIC_ACCESS > -1)
and
:$USERTID in (select tta2.USER_TID from SOC.V_TING_TOPIC_ACCESS tta2 where tta2.TING_TOPIC_TID = :tingTopicTid and tta2.COMP_ACCESS > 0)



--
--
-- TING TOPIC SAVE USER ACCESS
--
-- SERVICE_ID = TingTopic.saveUserAccess
-- TAGS       = RQ
--

[ {
	'switch' : 'select 1 from SOC.V_TING_TOPIC_ACCESS v where v.TING_TOPIC_TID = :tingTopicTid and v.COMP_ACCESS > 2 and v.USER_TID = :$USERTID',
	'case:1' : [
								{ 'add-role' : 'ting-topic-access-admin' } , 
								'serviceId:TingTopic.updateUserAccessSystem'
								
						 ],
		'null' : {'userMessage' : 'warn:Not enough rights!'}
	}
]



--
--
-- TING TOPIC UPDATE USER ACCESS SYSTEM
--
-- SERVICE_ID = TingTopic.updateUserAccessSystem
-- TAGS       = RQ
-- ROLES      = ting-topic-access-admin
--

delete from 
SOC.T_ACCESS
where
ITEM_TID = :tingTopicTid
and
USER_TID = :userTid
;
insert into SOC.T_ACCESS
(
USER_TID, 
ITEM_TID, 
RIGHT_TID,
FORBID_TID,
STATUS
)
VALUES 
(
:userTid, 
:tingTopicTid, 
:rightTid,
0,
1
)
;
delete from 
SOC.T_ACCESS
where
ITEM_TID = :tingTopicTid
and
USER_TID = :userTid
and
RIGHT_TID = -1





--
--
-- TING TOPIC UPDATE USER ACCESS
--
-- SERVICE_ID = TingTopic.updateUserAccess
-- TAGS = RQ
--

serviceId:TingTopic.saveUserAccess
;
serviceId:TingTopic.selectUserAccess



--
-- SELECT TING TOPIC SELECTABLE USER ACCESS
--
-- SERVICE_ID = TingTopic.selectableUserAccess
-- TAGS = RQ
--
--

set-if-empty:userIdFilter=%
;
select u.USER_TID, u.USER_ID, '1' as RIGHT_TID from 
JGROUND.T_USER u
left join
SOC.V_TING_TOPIC_ACCESS ta on ta.USER_TID = u.USER_TID
where
ta.TING_TOPIC_TID = :tingTopicTid
and
ta.COMP_ACCESS < 1
and
ta.TING_TOPIC_ACCESS = -1
and
u.USER_ID like :userIdFilter

--

select * from SOC.V_TING_TOPIC_ACCESS where TING_TOPIC_TID = 41097

select SERVICE_ID from JGROUND.T_SERVICES where SERVICE_ID like 'SOC.%'


select * from SOC.V_USER

select * from SOC.V_TING_TOPIC_ACCESS

select * from SOC.V_TING_ACCESS

select * from SOC.V_TING_GROUP_ACCESS

select * from SOC.T_ACCESS where USER_TID = 26297
 USER_TID ITEM_TID RIGHT_TID FORBID_TID STATUS
 -------- -------- --------- ---------- ------
    26297    27010         1          0      0

where 

select * from SOC.T_ACCESS tga where tga.ITEM_TID = 27010

select (select count(*) from SOC.T_TING_TOPIC) + (select count(*) from SOC.T_TING)+ (select count(*) from SOC.T_TING_GROUP) from JGROUND.T_DUAL

SOC.T_ACCESS


TING_TOPIC_TID TING_TID TING_GROUP_TID USER_TID USER_TID USER_TID
 -------------- -------- -------------- -------- -------- --------
           2202     2197           2191     1720     NULL     1720
           2205     2197           2191     NULL     NULL     NULL
           9795     3141           2191     NULL     NULL     NULL
           9799     4848           4843     NULL     NULL     NULL
          35414    34594          27010     NULL     NULL     NULL
          35979    34594          27010     NULL     NULL     NULL
          35981    34594          27010     NULL     NULL     NULL
          35983    34594          27010     NULL     NULL     NULL



--
--
-- TING SOC.TingAccess.select
--
-- SERVICE_ID = SOC.TingAccess.select
-- ROLES = SOC_USER,TING_USER
--
--

select 
u.ITEM_TID, u.ITEM_TYPE, u.name, a.USER_TID, a.RIGHT_TID, a.FORBID_TID
from
SOC.V_TING_UNION u 
left join
SOC.T_ACCESS a on a.ITEM_TID = u.ITEM_TID
where
a.ITEM_TID is not null



--
--
-- TING SOC.TingAccess.get
--
-- SERVICE_ID = SOC.TingAccess.get
-- ROLES = SOC_USER,TING_USER
--
--

select 
u.ITEM_TID, u.ITEM_TYPE, u.NAME, a.USER_TID, a.RIGHT_TID, a.FORBID_TID
from
SOC.V_TING_UNION u 
left join
SOC.T_ACCESS a on a.ITEM_TID = u.ITEM_TID
where
a.ITEM_TID is not null
and
u.ITEM_TID = :itemTid
and
a.USER_TID = :userTid



--
-- SOC.TingAccess.selectItem
--
-- SERVICE_ID = SOC.TingAccess.selectItem
-- TAGS = RQ
-- select * from SOC.T_TING_TOPIC
--

select
u.ITEM_TID, 
u.ITEM_TYPE || ' ' || u.NAME  as NAME
from 
SOC.V_TING_UNION u





--
--
-- TING SOC.TingAccess.delete
--
-- SERVICE_ID = SOC.TingAccess.delete
-- ROLES = SOC_ADMIN
-- TAGS = RQ
--

delete from  SOC.T_ACCESS
where
ITEM_TID = :itemTid
and
USER_TID = :userTid


--
--
-- TING GROUP ACCESS
--
--


--
-- TING GROUP SELECT USER ACCESS
--
-- SERVICE_ID = TingGroup.selectUserAccess
-- TAGS = RQ
--

select u.USER_ID, tga.COMP_ACCESS as RIGHT_TID, u.USER_TID,
(CASE
      WHEN u.USER_TID = :$USERTID THEN 'true'
      ELSE 'false'
END) as IS_ME,
(select tga2.COMP_ACCESS from 
	SOC.V_TING_GROUP_ACCESS tga2 where tga2.USER_TID = :$USERTID and tga2.TING_GROUP_TID = :tingGroupTid)
	as MY_RIGHT_TID
from
SOC.T_TING_GROUP tg
left join
SOC.V_TING_GROUP_ACCESS tga on tga.TING_GROUP_TID = tg.TING_GROUP_TID
left join
JGROUND.T_USER u on u.USER_TID = tga.USER_TID
where
tg.TING_GROUP_TID = :tingGroupTid
and
tga.COMP_ACCESS > 0
and
:$USERTID in (select tga2.USER_TID from SOC.V_TING_GROUP_ACCESS tga2 where tga2.TING_GROUP_TID = tg.TING_GROUP_TID and tga2.COMP_ACCESS > 0)

--

--
--
-- TING GROUP ADD USER ACCESS
--
-- SERVICE_ID = TingGroup.addUserAccess
-- TAGS = RQ
--

insert into SOC.T_ACCESS
(
USER_TID,
ITEM_TID,
RIGHT_TID,
FORBID_TID
)
select
:userTid,:tingGroupTid,:rightTid,0
from 
SOC.V_TING_GROUP_ACCESS tga 
left join
SOC.T_TING_GROUP tg on tg.TING_GROUP_TID = tga.TING_GROUP_TID
where 
tga.USER_TID = :$USERTID
and
tg.TING_GROUP_TID = :tingGroupTid
and
tga.COMP_ACCESS > 2
;
serviceId:TingGroup.selectableUserAccess


--
--
-- TING GROUP UPDATE USER ACCESS
--
-- SERVICE_ID = TingGroup.updateUserAccess
-- TAGS = RQ
--

update 
SOC.T_ACCESS
set 
RIGHT_TID = :rightTid
where
ITEM_TID = :tingGroupTid
and
USER_TID = :userTid
and
:$USERTID in (select tga.USER_TID from SOC.V_TING_GROUP_ACCESS tga left join SOC.T_TING_GROUP tg on tg.TING_GROUP_TID = tga.TING_GROUP_TID where 
tga.TING_GROUP_ACCESS > 2
and
tga.TING_GROUP_TID = :tingGroupTid
)
;
delete from SOC.T_ACCESS
where
ITEM_TID = :tingGroupTid
and
USER_TID = :userTid
and
RIGHT_TID <= 0
;
serviceId:TingGroup.selectUserAccess



--
select * from SOC.V_TING_GROUP_ACCESS where TING_GROUP_ACCESS in (0,-1)

delete  from SOC.T_ACCESS where RIGHT_TID <= 0


--
--
-- DELETE TING GROUP USER ACCESS ONLY
--
-- SERVICE_ID = TingGroup.deleteUserAccessOnly
-- TAGS = RQ
--

delete from SOC.T_ACCESS a
where
a.USER_TID = :userTid
and
a.ITEM_TID = :tingGroupTid
and
:$USERTID in (select a2.USER_TID from SOC.V_TING_GROUP_ACCESS a2 left join SOC.T_TING_GROUP tg on tg.TING_GROUP_TID = a2.TING_GROUP_TID where 
a2.COMP_ACCESS > 2
and
a2.TING_GROUP_TID = :tingGroupTid
)


--
--
-- DELETE USER ACCESS
--
-- SERVICE_ID = TingGroup.deleteUserAccess
-- TAGS = RQ
--

serviceId:TingGroup.deleteUserAccessOnly
;
serviceId:TingGroup.selectUserAccess



--

hans.mueller@ooit.com
26294

group item
27010

toni
1720


--
--
-- SAVE USER ACCESS
--
-- SERVICE_ID = TingGroup.saveUserAccess
-- TAGS = RQ
--

serviceId:TingGroup.deleteUserAccessOnly
;
serviceId:TingGroup.addUserAccess
;
serviceId:TingGroup.selectUserAccess




--
-- SELECT TING SELECTABLE USER ACCESS
--
-- SERVICE_ID = Ting.selectableUserAccess
-- TAGS = RQ
--
--

set-if-empty:userIdFilter=%
;
select u.USER_TID, u.USER_ID, '1' as RIGHT_TID from 
JGROUND.T_USER u
left join
SOC.V_TING_ACCESS ta on ta.USER_TID = u.USER_TID
where
ta.TING_TID = :tingTid
and
ta.TING_ACCESS = -1
and
ta.TING_GROUP_ACCESS = -1
and
u.USER_ID like :userIdFilter

--

select u.USER_TID, u.USER_ID, '1' as RIGHT_TID from 
JGROUND.T_USER u
left join
SOC.V_TING_ACCESS ta on ta.USER_TID = u.USER_TID
where
ta.TING_TID = 34574
and
ta.TING_ACCESS = -1
and
ta.TING_GROUP_ACCESS = -1







--
-- TING SELECT USER ACCESS
--
-- SERVICE_ID = Ting.selectUserAccess
-- TAGS = RQ
--

select u.USER_TID, u.USER_ID, ta.TING_GROUP_ACCESS, ta.TING_ACCESS as RIGHT_TID, ta.COMP_ACCESS	, 
(CASE
      WHEN u.USER_TID = :$USERTID THEN 'true'
      ELSE 'false'
END) as IS_ME,
(select ta2.COMP_ACCESS from 
	SOC.V_TING_ACCESS ta2 where ta2.USER_TID = :$USERTID and ta2.TING_TID = :tingTid)
	as MY_COMP_ACCESS

from
SOC.T_TING t
left join
SOC.V_TING_ACCESS ta on ta.TING_TID = t.TING_TID
left join
JGROUND.T_USER u on u.USER_TID = ta.USER_TID
where
t.TING_TID = :tingTid
and
ta.COMP_ACCESS > 0
and
:$USERTID in (select ta2.USER_TID from SOC.V_TING_ACCESS ta2 where ta2.TING_TID = :tingTid and ta2.COMP_ACCESS > 0)

--
34574

select  u.USER_TID, u.USER_ID, ta.TING_GROUP_ACCESS, ta.TING_ACCESS as RIGHT_TID, ta.COMP_ACCESS, 
(CASE
      WHEN u.USER_TID = 1720 THEN 'true'
      ELSE 'false'
END) as IS_ME,
(select ta2.COMP_ACCESS from 
	SOC.V_TING_ACCESS ta2 where ta2.USER_TID = 1720 and ta2.TING_TID = 34574)
	as MY_COMP_ACCESS
	
from
SOC.T_TING t
left join
SOC.V_TING_ACCESS ta on ta.TING_TID = t.TING_TID
left join
JGROUND.T_USER u on u.USER_TID = ta.USER_TID
where
t.TING_TID = 34574
and
(ta.TING_GROUP_ACCESS > -1 or ta.TING_ACCESS > -1)
and
1720 in (select ta2.USER_TID from SOC.V_TING_ACCESS ta2 where ta2.TING_TID = 34574 and ta2.COMP_ACCESS > 2)


select * from SOC.V_TING_ACCESS where USER_TID = 26294 and TING_TID = 34574
--

--
--
-- TING SAVE USER ACCESS
--
-- SERVICE_ID = Ting.saveUserAccess
-- TAGS       = RQ
--

[ {
	'switch' : 'select 1 from SOC.V_TING_ACCESS v where v.TING_TID = :tingTid and v.COMP_ACCESS > 2 and v.USER_TID = :$USERTID',
	'case:1' : [
								{ 'add-role' : 'ting-access-admin' } , 
								'serviceId:Ting.updateUserAccessSystem'
								
						 ],
		'null' : {'userMessage' : 'warn:Not enough rights!'}
	}
]

-- old

insert into SOC.T_ACCESS
(
USER_TID,
ITEM_TID,
RIGHT_TID,
FORBID_TID
)
select
:userTid,:tingTid,:rightTid,0
from 
SOC.V_TING_ACCESS a 
left join
SOC.T_TING t on t.TING_TID = a.TING_TID
where 
a.USER_TID = :$USERTID
and
tg.TING_TID = :tingTid
and
a.COMP_ACCESS > 2
and
:rightTid > -1



--
--
-- TING UPDATE USER ACCESS
--
-- SERVICE_ID = Ting.updateUserAccess
-- TAGS = RQ
--

serviceId:Ting.saveUserAccess
;
serviceId:Ting.selectUserAccess


--
--
-- TING UPDATE USER ACCESS SYSTEM
--
-- SERVICE_ID = Ting.updateUserAccessSystem
-- TAGS       = RQ
-- ROLES      = ting-access-admin
--

delete from 
SOC.T_ACCESS
where
ITEM_TID = :tingTid
and
USER_TID = :userTid
;
insert into SOC.T_ACCESS
(
USER_TID, 
ITEM_TID, 
RIGHT_TID,
FORBID_TID,
STATUS
)
VALUES 
(
:userTid, 
:tingTid, 
:rightTid,
0,
1
)
;
delete from 
SOC.T_ACCESS
where
ITEM_TID = :tingTid
and
USER_TID = :userTid
and
RIGHT_TID = -1




--
--
-- TING SOC.TingHierData
--
-- SERVICE_ID = SOC.TingHierData
-- ROLES = SYSTEM
-- TAGS = RQ
--

select TING_TOPIC_TID as "ID", TING_TID as "PARENT_ID" from SOC.T_TING_TOPIC 
union
select TING_TID as "ID", TING_GROUP_TID as "PARENT_ID" from SOC.T_TING



--
--
-- TING SOC.UserAccessData
--
-- SERVICE_ID = SOC.UserAccessData
-- TAGS = RQ
--

select RIGHT_TID, FORBID_TID, ITEM_TID 
from
SOC.T_ACCESS
where
USER_TID = :$USERTID



--
--
-- TING HierAccessService
--
-- SERVICE_ID = SOC.HierAccessService
--
--

set:userListServiceId=SOC.Users
;
set:hierDataServiceId=SOC.TingHierData
;
set:userAccessDataServiceId=SOC.UserAccessData
;
java:org.anakapa.app.jground.HierAccessService

--
-- xdelete from JGROUND.T_LABELS where NAME like 'vip%'
select * from JGROUND.T_LABELS where NAME like 'soc%'
