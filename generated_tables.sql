CREATE TABLE "Account" (
	"id" UUID NOT NULL UNIQUE,
	-- equivalent for username
	"gist_id" VARCHAR(50) UNIQUE,
	"campus_id" UUID,
	"is_banned" BOOLEAN NOT NULL DEFAULT false,
	"is_deactivated" BOOLEAN NOT NULL DEFAULT false,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	"is_subscribed" BOOLEAN NOT NULL DEFAULT false,
	"name" VARCHAR(150),
	"dob" TIMESTAMP,
	"email" VARCHAR(255) UNIQUE,
	-- generate a random avatar on account creation
	"avatar" TEXT NOT NULL,
	"country" VARCHAR(50),
	"bio" VARCHAR(255),
	"quote" VARCHAR(255),
	"password" TEXT,
	"login_type" VARCHAR(50) NOT NULL,
	"two_factor_auth" BOOLEAN NOT NULL DEFAULT false,
	"send_notifications" BOOLEAN NOT NULL DEFAULT true,
	"popularity" UUID NOT NULL,
	PRIMARY KEY("id")
);
COMMENT ON COLUMN Account.gist_id IS 'equivalent for username';
COMMENT ON COLUMN Account.avatar IS 'generate a random avatar on account creation';

CREATE INDEX "Account_index_0"
ON "Account" ("campus_id", "gist_id", "name", "email");

CREATE TABLE "Popularity" (
	"id" UUID NOT NULL UNIQUE,
	"level" VARCHAR(50) UNIQUE DEFAULT 'meh',
	PRIMARY KEY("id")
);


CREATE TABLE "Campus" (
	"id" UUID NOT NULL UNIQUE,
	"name" VARCHAR(255) NOT NULL UNIQUE,
	"domain" TEXT NOT NULL,
	"cover_img" TEXT NOT NULL,
	"description" VARCHAR(255) NOT NULL,
	"is_deleted" BOOLEAN NOT NULL DEFAULT false,
	"locked" BOOLEAN NOT NULL DEFAULT false,
	"is_banned" BOOLEAN NOT NULL DEFAULT false,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	"popularity" UUID NOT NULL,
	PRIMARY KEY("id")
);

CREATE INDEX "campus_index_0"
ON "Campus" ("id", "name", "domain");

CREATE TABLE "Moderator" (
	"id" UUID NOT NULL UNIQUE,
	"account_id" UUID NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	PRIMARY KEY("id")
);

CREATE INDEX "moderator_index_0"
ON "Moderator" ("id", "account_id");

CREATE TABLE "Media" (
	"id" UUID NOT NULL UNIQUE,
	"gist_id" UUID NOT NULL,
	"media_type" VARCHAR(15) NOT NULL,
	"media_url" TEXT NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	PRIMARY KEY("id")
);

CREATE INDEX "media_index_0"
ON "Media" ("gist_id", "id");

CREATE TABLE "Gist" (
	"id" UUID NOT NULL UNIQUE,
	"account_id" UUID NOT NULL,
	"campus_id" UUID NOT NULL,
	"text" TEXT,
	"is_public" BOOLEAN ARRAY NOT NULL DEFAULT true,
	"is_deleted" BOOLEAN NOT NULL DEFAULT false,
	"type" VARCHAR(15) ARRAY NOT NULL DEFAULT 'gist',
	"tags" VARCHAR(150) ARRAY,
	"created_at" TIMESTAMP ARRAY NOT NULL,
	"upated_at" TIMESTAMP ARRAY NOT NULL,
	"popularity" UUID NOT NULL,
	"views" INTEGER NOT NULL DEFAULT 0,
	"likes_count" INTEGER NOT NULL DEFAULT 0,
	"has_parent" BOOLEAN NOT NULL DEFAULT false,
	"parent_id" UUID,
	PRIMARY KEY("id")
);

CREATE INDEX "gist_index_0"
ON "Gist" ("account_id", "campus_id", "text", "tags", "id");

CREATE TABLE "Subscription" (
	"id" UUID NOT NULL UNIQUE,
	"account_id" UUID NOT NULL,
	"service_id" UUID NOT NULL,
	"amount" INTEGER NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	PRIMARY KEY("id")
);

CREATE INDEX "subscription_index_0"
ON "Subscription" ("account_id", "service_id");

CREATE TABLE "Subscription_service" (
	"id" UUID NOT NULL UNIQUE,
	"type" VARCHAR(255) NOT NULL,
	"amount" INTEGER NOT NULL,
	"name" VARCHAR(100) NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	PRIMARY KEY("id")
);

CREATE INDEX "subscription_service_index_0"
ON "Subscription_service" ("id", "type");

CREATE TABLE "Report" (
	"id" UUID NOT NULL UNIQUE,
	"reporter" UUID NOT NULL,
	"reported" UUID NOT NULL,
	"reason" VARCHAR(255) NOT NULL,
	"report_type" VARCHAR(50) NOT NULL DEFAULT 'account',
	"created_at" TIMESTAMP NOT NULL,
	PRIMARY KEY("id")
);

CREATE INDEX "report_index_0"
ON "Report" ("report_type", "id");

CREATE TABLE "Likes" (
	"id" UUID NOT NULL UNIQUE,
	"account_id" UUID NOT NULL,
	"campus_id" UUID NOT NULL,
	"created_at" TIMESTAMP NOT NULL,
	PRIMARY KEY("id")
);

CREATE INDEX "likes_index_0"
ON "Likes" ("account_id", "campus_id", "id");

ALTER TABLE "Account"
ADD FOREIGN KEY("popularity") REFERENCES "Popularity"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Account"
ADD FOREIGN KEY("campus_id") REFERENCES "Campus"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Campus"
ADD FOREIGN KEY("popularity") REFERENCES "Popularity"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Moderator"
ADD FOREIGN KEY("account_id") REFERENCES "Account"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Gist"
ADD FOREIGN KEY("account_id") REFERENCES "Account"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Gist"
ADD FOREIGN KEY("campus_id") REFERENCES "Campus"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Gist"
ADD FOREIGN KEY("popularity") REFERENCES "Popularity"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Subscription"
ADD FOREIGN KEY("service_id") REFERENCES "Subscription_service"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Subscription"
ADD FOREIGN KEY("account_id") REFERENCES "Account"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Report"
ADD FOREIGN KEY("reported") REFERENCES "Account"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Report"
ADD FOREIGN KEY("reporter") REFERENCES "Account"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "Gist"
ADD FOREIGN KEY("id") REFERENCES "Media"("gist_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;