
delete from JGROUND.T_SERVICES where SERVICE_ID = 'SOC_NU.write'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('SOC_NU.write', 
'java:org.anakapa.app.soc_nu.sq.Write;include:SOC_NU.read',
'NA', 'APP_LOCAL','') ;


-- select 

delete from JGROUND.T_SERVICES where SERVICE_ID = 'SOC_NU.read'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('SOC_NU.read', 
'java:org.anakapa.app.soc_nu.sq.Read',
'NA', 'APP_LOCAL','') ;



delete from JGROUND.T_SERVICES where SERVICE_ID = 'SOC_NU.insertNuMessage'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('SOC_NU.insertNuMessage', 
'
debug;init:geolocation=0,pictureSmallId=-1,pictureId=-1;insert into
SOC.T_NU_MESSAGE
(FROM_CODE, TO_CODE, MESSAGE, CREATOR, CREATED, GEOLOCATION, PICTURE_SMALL_ID, PICTURE_ID) 
values
(:fromCode, :toCode, :message, bigint(:creator), bigint(:$CURRENT_TIME_MILLIS), :geolocation, :pictureSmallId, :pictureId)',
'NA', 'APP_LOCAL','') ;
-- select * from SOC.T_NU_MESSAGE




delete from JGROUND.T_SERVICES where SERVICE_ID = 'SOC_NU.selectNuMessage'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('SOC_NU.selectNuMessage', 
'
debug;init:geolocation=0;select * from 
SOC.T_NU_MESSAGE
where
FROM_CODE = :fromCode
and
TO_CODE = :toCode
',
'NA', 'APP_LOCAL','') ;
-- select * from SOC.T_NU_MESSAGE







-- STATUS 0=new/open, 1=draft, 2=stored, 4=published, 5=activated/accepted, 9=deleted/invisible/denied, 
-- ACCESS 0=public, 1=access-control

-- 



--
--
--
-- SOC SERVICES
--
--
--




-- TYPE/MEETING




--MEETING_TID NAME DESCRIPTION ACCESS CREATED CREATOR_TID   UPDATED UPDATER_TID   STATUS
--select TYPE_TID, ORD, NAME, DESCRIPTION, ACCESS_RIGHT_TID from ESP.V_MP_TYPE order by ORD asc
delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.getTypeList'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.getTypeList', 
'
select 
m.MEETING_TID as "TYPE_TID", 1 as "ORD", m.NAME, m.DESCRIPTION, 6 as ACCESS_RIGHT_TID
from 
SOC.T_MEETING m where m.STATUS in (0,1,2,3,4,5)
and
0 < (select max(MEETING_RID) from SOC.V_USER_ACCESS_MEETING uam where uam.USER_TID = bigint(:$USERTID) and uam.MEETING_TID = m.MEETING_TID)',
'NA', 'APP_LOCAL','') ;



-- select * from SOC.T_MEETING_TYPE;
-- delete from SOC.T_MEETING_TYPE where MEETING_TYPE_TID > 10000


delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.insertType'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.insertType', 
'set:access=6;include:JGROUND.$NEWTID;insert into SOC.T_MEETING
(
MEETING_TID, 
NAME, 
DESCRIPTION, 
ACCESS,
CREATED,CREATOR_TID,UPDATED,UPDATER_TID,STATUS)
values
(
bigint(:$NEWTID), 
:typeName, 
:typeDescription, 
int(:access),
bigint(:$USERTID),
bigint(:$CURRENT_TIME_MILLIS),
bigint(:$USERTID),
bigint(:$CURRENT_TIME_MILLIS),
0 );insert 
into SOC.T_ACCESS (ITEM_TID, USER_TID, RIGHT_TID,CREATED,CREATOR_TID,UPDATED,UPDATER_TID,STATUS)
values (bigint(:$NEWTID), bigint(:$USERTID), 4,
bigint(:$USERTID),
bigint(:$CURRENT_TIME_MILLIS),
bigint(:$USERTID),
bigint(:$CURRENT_TIME_MILLIS),
0);include:MEETING.getTypeList',
'NA', 'APP_LOCAL','') ;
--{call ESP.SP_MP_INSERT_TYPE(:typeName,:typeDescription, null)};include:MEETING.getTypeList





delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.deleteType'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.deleteType', 
'update SOC.T_MEETING set STATUS = 9 where MEETING_TID = bigint(:typeTid);delete from SOC.T_MEETING where MEETING_TID = bigint(:typeTid);include:MEETING.getTypeList
',
'NA', 'APP_LOCAL','');

--{call ESP.SP_MP_DELETE_TYPE(to_number(:typeTid))};include:MEETING.getTypeList




-- MEETING/MEETING_INSTANCE --




delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.getMeetingList'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.getMeetingList', 
'select 
MEETING_INSTANCE_TID as "MEETING_TID",
PARENT_TID as "TYPE_TID",
NAME,
DESCRIPTION,
INDX as "ORD"
from 
SOC.T_MEETING_INSTANCE
where
PARENT_TID = bigint(:typeTid) 
order by NAME',
'NA', 'APP_LOCAL','') ;






delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.insertMeeting'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.insertMeeting', 
'insert into SOC.T_MEETING_INSTANCE 
(	MEETING_INSTANCE_TID,
	PARENT_TID,
	NAME, 
	LOCATION , 
	START_TIME,
	END_TIME,
	DESCRIPTION, 
	CREATED, CREATOR_TID, UPDATED, UPDATER_TID, STATUS)
values
(
NEXT VALUE for JGROUND.global_id, 
bigint(:typeTid), 
:meetingName, 
''-'',
SOC.currentMillis(),
SOC.currentMillis(),
:meetingDescription, 
bigint(:$USERTID),
SOC.currentMillis(),
bigint(:$USERTID),
SOC.currentMillis(),
0 );include:MEETING.getMeetingList',
'NA', 'APP_LOCAL','') ;

--{call ESP.SP_MP_INSERT_MEETING(:meetingName,:meetingDescription,to_number(:typeTid),null)};include:MEETING.getMeetingList




delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.deleteMeeting'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.deleteMeeting', 
'update SOC.T_MEETING_INSTANCE set STATUS = 9 where 
MEETING_INSTANCE_TID = bigint(:meetingTid);delete from SOC.T_MEETING_INSTANCE 
where MEETING_INSTANCE_TID = bigint(:meetingTid);include:MEETING.getMeetingList',
'NA', 'APP_LOCAL','') ;

--{call ESP.SP_MP_DELETE_MEETING(to_number(:meetingTid))};include:MEETING.getMeetingList




-- AGENDA




delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.getAgendaList';
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.getAgendaList', 
'
select 
AGENDA_TID, MEETING_INSTANCE_TID as "MEETING_TID", a.INDX as "ORD", a.NAME, a.DESCRIPTION, t.CONTENT_TEXT as "MINUTE"
from SOC.T_AGENDA a
left join
SOC.T_TEXT t on (a.AGENDA_TID = t.PARENT_TID and t.TYPE_TID = -1000006 and t.INDX = -1)
where 
a.MEETING_INSTANCE_TID = bigint(:meetingTid) 
order by a.INDX asc',
'NA', 'APP_LOCAL','') ;





delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.getAgendaList';
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.getAgendaList', 
'
select 
AGENDA_TID, MEETING_INSTANCE_TID as "MEETING_TID", a.INDX as "ORD", a.NAME, a.DESCRIPTION, 
t.CONTENT_TEXT as "MINUTE_TEXT", t.TITLE as "MINUTE_TITLE"
from SOC.T_AGENDA a
left join
SOC.T_TEXT t on (a.AGENDA_TID = t.PARENT_TID and t.TYPE_TID = -1000006 and t.INDX = -1)
where 
a.MEETING_INSTANCE_TID = bigint(:meetingTid) 
order by a.INDX asc',
'NA', 'APP_LOCAL','') ;



-- select * from ESP.T_MP_AGENDA where NAME = 'AA%'
delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.insertAgenda'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.insertAgenda', 
'
insert into SOC.T_AGENDA 
(
AGENDA_TID, 
MEETING_INSTANCE_TID, 
INDX,
NAME, 
DESCRIPTION, 
CREATED, CREATOR_TID, UPDATED, UPDATER_TID, STATUS)
values (
NEXT VALUE for JGROUND.global_id, 
bigint(:meetingTid),
-1,
:agendaName,
:agendaDescription,
bigint(:$USERTID),
SOC.currentMillis(),
bigint(:$USERTID),
SOC.currentMillis(),
0 );include:MEETING.getAgendaList',
'NA', 'APP_LOCAL','') ;


delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.deleteAgenda'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.deleteAgenda', 
'update SOC.T_AGENDA set STATUS = 9 where 
AGENDA_TID = bigint(:agendaTid);delete from SOC.T_AGENDA 
where AGENDA_TID = bigint(:agendaTid);include:MEETING.getAgendaList',
'NA', 'APP_LOCAL','') ;


delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.saveAgendaMinute'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.saveAgendaMinute', 
'delete from SOC.T_TEXT where 
PARENT_TID bigint(:agendaTid)
and
TYPE_TID = -1000006 
and 
INDX = -1
;insert into
SOC.T_TEXT 
(PARENT_TID,
TYPE_TID,
TITLE, 
CONTENT_TEXT, 
CREATED, CREATOR_TID, UPDATED, UPDATER_TID, STATUS)
values
(bigint(:agendaTid),
-1000006,
:minuteTitle,
:minuteText,
bigint(:$USERTID),
bigint(:$CURRENT_TIME_MILLIS),
bigint(:$USERTID),
bigint(:$CURRENT_TIME_MILLIS),
0)
;include:MEETING.getAgendaList',
'NA', 'APP_LOCAL','') ;




-- delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.getFileList'; 
-- insert into JGROUND.T_SERVICES 
-- (SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
--     values 
-- ('MEETING.getFileList', 
-- 'select * from ESP.V_MP_FILE where MEETING_ITEM_TID = to_number(:agendaTid)',
-- 'ESP_DEV,ESP_LOCAL,ESP_TRAIN,ESP_NYPROD'
-- ,'NA','',NULL);


delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.getAgendaFiles'; 
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.getAgendaFiles', 
'select 
FILE_ID as "FILE_TID", 
FILENAME, 
OWNER, 
TAGS,
char(CREATION_TS) as "CREATION_TIMESTAMP",
length(document) as "LENGTH"
from
JGROUND.T_FILE
where
DIRECTORY = cast(''/mp/'' || :agendaTid || ''/'' AS VARCHAR(1000))  
and
(TAGS is null or not TAGS like ''%DELETED%'')
order by FILENAME asc',
'NA', 'APP_LOCAL','') ;







delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.deleteAgendaFile';
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.deleteAgendaFile', 
'update ESP.T_FILE set TAGS = ''DELETED'' 
where 
FILE_ID = bigint(:fileTid)
and
DIRECTORY = ''/mp/'' || :agendaTid || ''/'';include:MEETING.getAgendaFiles',
'NA', 'APP_LOCAL','') ;




delete from JGROUND.T_SERVICES where SERVICE_ID = 'MEETING.uploadAgendaFiles';
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('MEETING.uploadAgendaFiles', 
'java:org.anakapa.app.jground.sq.UploadFiles;include:MEETING.getAgendaFiles',
'NA', 'APP_LOCAL','') ;



-- T_ACCESS


-- agenda


delete from JGROUND.T_SERVICES where SERVICE_ID = 'SOC.getAgendaAccess';
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('SOC.getAgendaAccess', 
'select 
max(ac.RIGHT_TID) as RIGHT_TID
from
SOC.T_AGENDA a 
left join
SOC.T_MEETING_INSTANCE mi on mi.MEETING_INSTANCE_TID = a.MEETING_INSTANCE_TID
left join
SOC.T_MEETING m on m.MEETING_TID = mi.PARENT_TID,
SOC.T_ACCESS ac
where
ac.USER_TID = bigint(:$USERTID)
and
(
ac.ITEM_TID = a.AGENDA_TID
or
ac.ITEM_TID = mi.MEETING_INSTANCE_TID
or
ac.ITEM_TID = m.MEETING_TID
)
and
a.AGENDA_TID = bigint(:agendaTid)',
'NA', 'APP_LOCAL','') ;


delete from JGROUND.T_SERVICES where SERVICE_ID = 'SOC.getMeetingInstanceAccess';
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('SOC.getMeetingInstanceAccess', 
'select 
max(ac.RIGHT_TID) as RIGHT_TID
from
SOC.T_MEETING_INSTANCE mi
left join 
SOC.T_MEETING m on m.MEETING_TID = mi.PARENT_TID,
SOC.T_ACCESS ac
where
ac.USER_TID = bigint(:$USERTID)
and
(
ac.ITEM_TID = mi.MEETING_INSTANCE_TID
or
ac.ITEM_TID = m.MEETING_TID
)
and
mi.MEETING_INSTANCE_TID = bigint(:meetingInstanceTid)',
'NA', 'APP_LOCAL','') ;


delete from JGROUND.T_SERVICES where SERVICE_ID = 'SOC.getMeetingAccess';
insert into JGROUND.T_SERVICES 
(SERVICE_ID,SERVICE_STMT,SECTION_ID,TAGS,ROLES)  
    values 
('SOC.getMeetingAccess', 
'select 
max(ac.RIGHT_TID) as RIGHT_TID
from
SOC.T_MEETING m,
SOC.T_ACCESS ac
where
ac.USER_TID = bigint(:$USERTID)
and
ac.ITEM_TID = m.MEETING_TID
and
m.MEETING_TID = bigint(:meetingTid)',
'NA', 'APP_LOCAL','') ;

--insert into SOC.T_ACCESS (ITEM_TID, USER_TID, RIGHT_TID, CREATED, CREATOR_TID, UPDATED, UPDATER_TID, STATUS)
--values (29897, 1845, 2, 0,0,0,0,0)







--
--
--
-- VALUES
--
--
--



--select * from SOC.T_RELATION_NAME


