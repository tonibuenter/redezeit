

--
--
--
--
-- SOC CHAT
--
--
--
-- select * from SOC.T_CHAT

--
-- SERVICE_ID = SOC.Chat.insert
-- ROLES      = SOC_USER
--

create-tid:chatTid
;
set-if-empty:chatType=private
;
set-if-empty:title=no_title
;
insert into SOC.T_CHAT
(CHAT_TID, CHAT_TYPE, TITLE, CREATOR_TID, CREATED )
values
(:chatTid, :chatType, :title, :$USERTID, :$CURRENT_TIME_MILLIS)
;
insert into SOC.T_CHAT_MEMBER (CHAT_TID, ROLE, USER_TID, CREATOR_TID, CREATED) 
values 
(:chatTid, 'creator', :$USERTID, :$USERTID, :$CURRENT_TIME_MILLIS)



--
-- SERVICE_ID = SOC.Chat.select
-- ROLES      = SOC_USER
--

select c.CHAT_TID, c.CHAT_TYPE, c.TITLE, c.CREATOR_TID, c.CREATED, u.USER_ID as CREATOR_ID
from SOC.T_CHAT c
left join 
SOC.T_CHAT_MEMBER m on m.CHAT_TID = c.CHAT_TID
left join
JGROUND.T_USER u on u.USER_TID = c.CREATOR_TID
where
m.USER_TID = :$USERTID
order by c.CREATED desc




--
--
-- SERVICE_ID = SOC.ChatMember.select
-- ROLES      = SOC_USER
--

select u.*, m.CHAT_TID, m.CREATOR_TID
from JGROUND.T_USER u 
left join SOC.T_CHAT_MEMBER m on m.USER_TID = u.USER_TID 
where 
u.USER_TID > 0
and
m.CHAT_TID in (select i.CHAT_TID from SOC.T_CHAT_MEMBER i where USER_TID = :$USERTID)



--
--
-- select * from SOC.T_CHAT_MEMBER

--
--
-- SERVICE_ID = SOC.ChatMessage.selectLast
-- ROLES      = SOC_USER
--

set-if-empty:lastChatMessageTid=0
;
select m.CHAT_TID, m.CHAT_MESSAGE_TID, m.MESSAGE, m.MEDIA_ID, 
m.MEDIA_SMALL_ID, m.GEOLOCATION, m.STATUS, m.CREATOR_TID, m.CREATED
from SOC.T_CHAT_MESSAGE m
where
m.CHAT_MESSAGE_TID > :lastChatMessageTid
and
m.CHAT_TID in (select i.CHAT_TID from SOC.T_CHAT_MEMBER i where i.USER_TID = :$USERTID)
order by CHAT_MESSAGE_TID asc

--
CHAT_TID = :chatTid
and


--
-- SERVICE_ID = SOC.ChatMessage.insert
-- ROLES      = SOC_USER
--

create-tid:chatMessageTid
;
insert into SOC.T_CHAT_MESSAGE (CHAT_TID, CHAT_MESSAGE_TID, MESSAGE, GEOLOCATION, CREATOR_TID, CREATED)
values
(:chatMessageTid, :chatMessageTid, :message, 'geo', :$USERTID, :$CURRENT_TIME_MILLIS)
;
update SOC.T_CHAT_MESSAGE
set CHAT_TID = :chatTid
where
CHAT_MESSAGE_TID = :chatMessageTid
and
:chatTid in (select i.CHAT_TID from SOC.T_CHAT_MEMBER i where i.USER_TID = :$USERTID)



--

update SOC.T_CHAT_MESSAGE m
set m.CHAT_TID = 1105
where
m.CHAT_MESSAGE_TID = 1105
and
:$USERID in (select i.CHAT_TID from SOC.T_CHAT_MEMBER i where i.USER_TID = 1000)




update SOC.T_CHAT_MESSAGE m
set m.CHAT_TID = :chatTid
where
CHAT_MESSAGE_TID = :chatMessageTid
and
:$USERID in (select m.CHAT_TID from SOC.T_CHAT_MEMBER where i.USER_TID = :$USERTID)
DEBUG [http-nio-8080-exec-5] 19:48:23,195  (RemoteQuery.java:1269) sql-param chatTid : 1004
DEBUG [http-nio-8080-exec-5] 19:48:23,195  (RemoteQuery.java:1269) sql-param chatMessageTid : 1105
DEBUG [http-nio-8080-exec-5] 19:48:23,195  (RemoteQuery.java:1269) sql-param $USERID : toni.buenter@ooit.com
DEBUG [http-nio-8080-exec-5] 19:48:23,195  (RemoteQuery.java:1269) sql-param $USERTID : 1000

--
--
-- SERVICE_ID = zzzSOC.ChatMember.select
-- ROLES      = SOC_USER
--

select m.USER_TID, m.CHAT_TID, u.USER_ID
from SOC.T_CHAT_MEMBER m  
left join JGROUND.T_USER u on u.USER_TID = m.USER_TID
where
m.CHAT_TID in
(select i.CHAT_TID from SOC.T_CHAT_MEMBER i where i.USER_TID = :$USERTID)

--
--
-- SERVICE_ID = SOC.Contact.insert
-- ROLES      = SOC_ADMIN
--

add-role:APP_ADMIN
;
serviceId:User.save
;
set:roleName=APP_USER
;
serviceId:Role.insert
;
set:roleName=SOC_USER
;
serviceId:Role.insert



--
--
-- SERVICE_ID = SOC.Contact.selectAll
-- ROLES      = SOC_USER
--

select * from JGROUND.T_USER where not USER_TID = :$USERTID and USER_TID > 0

--

select USER_TID, count(CHAT_TID) as CHAT_MEMBER_COUNT from SOC.T_CHAT_MEMBER group by USER_TID

--
insert into SOC.T_CHAT_MEMBER (CHAT_TID, ROLE, USER_TID, CREATOR_TID, CREATED) 
values 
(:chatTid, 'creator', :$USERTID, :$USERTID, :$CURRENT_TIME_MILLIS)



--
--
-- SERVICE_ID = SOC.ChatMember.insert
-- ROLES      = SOC_USER
--

create-tid:tmpTid
;
set-if-empty:role='creator'
;
insert into SOC.T_CHAT_MEMBER 
(CHAT_TID, ROLE, USER_TID, CREATOR_TID, CREATED) 
values 
(:chatTid, :role, :tmpTid, :$USERTID, :$CURRENT_TIME_MILLIS)
;
update SOC.T_CHAT_MEMBER
set USER_TID = :userTid
where
CHAT_TID = :chatTid
and
USER_TID = :tmpTid
and
CHAT_TID in (select i.CHAT_TID from SOC.T_CHAT i where i.CREATOR_TID = :$USERTID)
;
delete from SOC.T_CHAT_MEMBER where USER_TID = :tmpTid

--


select USER_TID, count(CHAT_TID) as CHAT_MEMBER_COUNT from SOC.T_CHAT_MEMBER group by USER_TID

select c.CHAT_TID from 
SOC.T_CHAT c where c.CREATOR_TID = :$USERTID 
where
:memberUserId


