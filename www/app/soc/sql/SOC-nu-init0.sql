-- **************
-- *** SOC NU ***
-- **************
-- drop table SOC.T_NU_MESSAGE;
create table SOC.T_NU_MESSAGE (
		FROM_CODE varchar(32),
		TO_CODE varchar(32),
    MESSAGE varchar(1000) not null,
    PICTURE_SMALL_ID bigint,
    PICTURE_ID bigint,
    CREATOR bigint,
    CREATED bigint,
    GEOLOCATION varchar(128),
    CREATOR_TID bigint,
    STATUS int default 0,
    primary key (FROM_CODE,TO_CODE,CREATED)
);