-- Adminer 5.4.1 PostgreSQL 15.15 dump

DROP TABLE IF EXISTS "account";
CREATE TABLE "public"."account" (
    "id" text NOT NULL,
    "accountId" text NOT NULL,
    "providerId" text NOT NULL,
    "userId" text NOT NULL,
    "accessToken" text,
    "refreshToken" text,
    "idToken" text,
    "accessTokenExpiresAt" timestamptz,
    "refreshTokenExpiresAt" timestamptz,
    "scope" text,
    "password" text,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE INDEX "account_userId_idx" ON public.account USING btree ("userId");

INSERT INTO "account" ("id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "createdAt", "updatedAt") VALUES
('5kAOICFkxYlEg5b4I8VOkNueX1vSpgkK',	'LCSGsSrY2JOPo5O1T2RcAiXRzNQuzA18',	'credential',	'LCSGsSrY2JOPo5O1T2RcAiXRzNQuzA18',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'981445a974a70f005ff7a9f751f24bca:0f458fd1268d3c508acd5f7d475f267eaf324157927ad65001ff7d61f0c5fd65a7bbef2a44d7a94711dcd153447f8dac0b5d1502aff7376d7281ebf24c65bad1',	'2026-01-23 10:11:29.769+00',	'2026-01-23 10:11:29.769+00');

DROP TABLE IF EXISTS "session";
CREATE TABLE "public"."session" (
    "id" text NOT NULL,
    "expiresAt" timestamptz NOT NULL,
    "token" text NOT NULL,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamptz NOT NULL,
    "ipAddress" text,
    "userAgent" text,
    "userId" text NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX session_token_key ON public.session USING btree (token);

CREATE INDEX "session_userId_idx" ON public.session USING btree ("userId");

INSERT INTO "session" ("id", "expiresAt", "token", "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") VALUES
('bf0bNTcHsXXvA4fqOGS9eOI7vvrARqLq',	'2026-01-30 10:11:29.774+00',	'KUVe0gK3rWmSzYif4cgnQX0IjD2IKAMQ',	'2026-01-23 10:11:29.774+00',	'2026-01-23 10:11:29.774+00',	'',	'',	'LCSGsSrY2JOPo5O1T2RcAiXRzNQuzA18'),
('zSinOQf2Yca8mi00EaV2ezYd0ebzcjxd',	'2026-01-30 10:23:48.263+00',	'Y4bonMQZuROL2nD5EvXuyzGFZb7YgRMH',	'2026-01-23 10:23:48.264+00',	'2026-01-23 10:23:48.264+00',	'',	'',	'LCSGsSrY2JOPo5O1T2RcAiXRzNQuzA18');

DROP TABLE IF EXISTS "user";
CREATE TABLE "public"."user" (
    "id" text NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "emailVerified" boolean NOT NULL,
    "image" text,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);

INSERT INTO "user" ("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt") VALUES
('LCSGsSrY2JOPo5O1T2RcAiXRzNQuzA18',	'Demo Admin',	'demo@admin.local',	'0',	NULL,	'2026-01-23 10:11:29.762+00',	'2026-01-23 10:11:29.762+00');

DROP TABLE IF EXISTS "verification";
CREATE TABLE "public"."verification" (
    "id" text NOT NULL,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expiresAt" timestamptz NOT NULL,
    "createdAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
)
WITH (oids = false);

CREATE INDEX verification_identifier_idx ON public.verification USING btree (identifier);


ALTER TABLE ONLY "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;

ALTER TABLE ONLY "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"(id) ON DELETE CASCADE NOT DEFERRABLE;

-- 2026-01-23 10:51:27 UTC