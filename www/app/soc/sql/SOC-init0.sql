create schema SOC;



create table SOC.T_TEXT (
    PARENT_TID bigint not null default -1,
    -- -1000006 for minute
    TYPE_TID bigint not null default -1,
		INDX bigint DEFAULT -1,
    TITLE varchar(4000) not null, 
    CONTENT_TEXT varchar(4000), 
    CONTENT_BLOB CLOB, 
    --
    STATUS int default 0,
    CREATED bigint not null,
    CREATOR_TID bigint not null, 
    UPDATED bigint not null,
    UPDATER_TID bigint, 
    primary key (PARENT_TID,TYPE_TID,INDX)
);


create table SOC.T_TAG (
	PARENT_TID bigint,
	NAME varchar(512), 
	ORD bigint default 0,
    STATUS int default 0,
	primary key (PARENT_TID, NAME)
);
-- drop table SOC.T_ACCESS
-- drop view SOC.V_USER_ACCESS_MEETING_INSTANCE
-- drop view SOC.V_USER_ACCESS_MEETING
-- drop view SOC.V_USER_ACCESS_AGENDA
create table SOC.T_ACCESS (
    USER_TID bigint not null,
    ITEM_TID bigint not null,
    RIGHT_TID bigint not null,
    FORBID_TID bigint not null,
    STATUS int default 0,
    primary key (USER_TID, ITEM_TID),
    foreign key (USER_TID) references JGROUND.T_USER(USER_TID)
);






-- xdrop table VIP.T_FILE_LISTx
create table SOC.T_FILE_LIST (
FILE_LIST_TID bigint,
OWNER_TID bigint,
CREATED bigint,
STATUS int default 0,
primary key (FILE_LIST_TID)
);


create table SOC.T_FILE_LIST_REL (
  FILE_LIST_TID bigint,
  FILE_TID bigint,
  primary key (FILE_LIST_TID, FILE_TID)
)
;
alter table SOC.T_FILE_LIST_REL add column ORD bigint default 0;



--
-- SOC.V_USER
--

create view SOC.V_USER 
as
select u.USER_TID, u.USER_ID from
JGROUND.T_USER u
where
u.USER_ID in 
(select r.USER_ID from JGROUND.T_ROLES_PER_USER r 
	where 
	r.ROLE_NAME = 'SOC_USER'
	or
	r.ROLE_NAME = 'TING_USER'
)
;







