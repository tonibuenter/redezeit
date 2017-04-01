create schema SOC;


-- xdrop table SOC.T_CHAT
create table SOC.T_CHAT (
  CHAT_TID bigint,
  CHAT_TYPE varchar(128),
  TITLE varchar(4000) not null,
  MEDIA_ID bigint,
  MEDIA_SMALL_ID bigint,
  GEOLOCATION varchar(128),
  STATUS bigint default 0,
  CREATOR_TID bigint,
  CREATED bigint,
  primary key (CHAT_TID)
);

-- xdrop table SOC.T_CHAT_MEMBER
create table SOC.T_CHAT_MEMBER (
  CHAT_TID bigint,
  USER_TID bigint,
  ROLE varchar(128),
  MEDIA_ID bigint,
  MEDIA_SMALL_ID bigint,
  GEOLOCATION varchar(128),
  STATUS bigint default 0,
  CREATED bigint,
  CREATOR_TID bigint,
  primary key (CHAT_TID, USER_TID)
);

-- xdrop table SOC.T_CHAT_MESSAGE
create table SOC.T_CHAT_MESSAGE (
  CHAT_TID bigint,
  CHAT_MESSAGE_TID bigint,
  MESSAGE varchar(4000) not null,
  MEDIA_ID bigint,
  MEDIA_SMALL_ID bigint,
  GEOLOCATION varchar(128),
  STATUS bigint default 0,
  CREATOR_TID bigint,
  CREATED bigint,
  primary key (CHAT_MESSAGE_TID)
);