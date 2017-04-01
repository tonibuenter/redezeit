--
-- SERVICE_ID = SOC.Users
-- ROLES = SOC_USER,TING_USER
--

select 
u.USER_TID, 
u.USER_ID 
from
JGROUND.T_USER u
where
u.USER_ID in (select r.USER_ID from JGROUND.T_ROLES_PER_USER r where r.ROLE_NAME in ('SOC_USER','TING_USER') )

--
-- SERVICE_ID = SOC.User.me
--

select 
u.*
from
JGROUND.T_USER u
where
u.USER_TID = :$USERTID

