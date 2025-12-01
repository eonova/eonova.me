CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('posts', 'notes', 'talks');--> statement-breakpoint
CREATE TYPE "public"."unsubscribe_scope" AS ENUM('comment_replies_user', 'comment_replies_comment');--> statement-breakpoint
CREATE TABLE "album" (
	"id" text PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"description" text,
	"width" integer DEFAULT 300,
	"height" integer DEFAULT 200,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" text PRIMARY KEY NOT NULL,
	"body" text NOT NULL,
	"user_id" text DEFAULT 'ghost' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"content_id" text NOT NULL,
	"content_type" "content_type" NOT NULL,
	"parent_id" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"dislike_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"user_id" text NOT NULL,
	"comment_id" text NOT NULL,
	"is_like" boolean NOT NULL,
	CONSTRAINT "votes_user_id_comment_id_pk" PRIMARY KEY("user_id","comment_id")
);
--> statement-breakpoint
CREATE TABLE "content_likes" (
	"content_id" text NOT NULL,
	"anon_key" text NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "content_likes_content_id_anon_key_pk" PRIMARY KEY("content_id","anon_key"),
	CONSTRAINT "content_likes_like_count_check" CHECK ("content_likes"."like_count" BETWEEN 0 AND 3)
);
--> statement-breakpoint
CREATE TABLE "friends" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"avatar" text,
	"description" text,
	"order" integer DEFAULT 0,
	"active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"body" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "note" (
	"title" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"summary" text DEFAULT 's' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"slug" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"content" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"dia_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "settings_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "talk" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unsubscribes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"comment_id" text,
	"scope" "unsubscribe_scope" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "unsubscribes_user_id_scope_comment_id_uq" UNIQUE("user_id","scope","comment_id"),
	CONSTRAINT "unsubscribes_scope_comment_id_check" CHECK ((
        ("unsubscribes"."scope" = 'comment_replies_user' AND "unsubscribes"."comment_id" IS NULL)
        OR
        ("unsubscribes"."scope" = 'comment_replies_comment' AND "unsubscribes"."comment_id" IS NOT NULL)
      ))
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set default ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unsubscribes" ADD CONSTRAINT "unsubscribes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unsubscribes" ADD CONSTRAINT "unsubscribes_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_album_created" ON "album" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_comment_content_id" ON "comment" USING btree ("content_id");--> statement-breakpoint
CREATE INDEX "idx_comment_parent_id" ON "comment" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "idx_comment_user_id" ON "comment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_comment_content_created" ON "comment" USING btree ("content_id","created_at" DESC NULLS LAST) WHERE "comment"."parent_id" IS NULL;--> statement-breakpoint
CREATE INDEX "idx_comment_parent_created" ON "comment" USING btree ("parent_id","created_at" DESC NULLS LAST) WHERE "comment"."parent_id" IS NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_comment_body_search" ON "comment" USING gin (to_tsvector('english', "body"));--> statement-breakpoint
CREATE INDEX "votes_comment_id_like_idx" ON "votes" USING btree ("comment_id","is_like");--> statement-breakpoint
CREATE INDEX "idx_friend_order" ON "friends" USING btree ("order");--> statement-breakpoint
CREATE INDEX "messages_created_at_desc_idx" ON "messages" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "messages_user_id_idx" ON "messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_note_created" ON "note" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_post_created" ON "post" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "settings_user_id_idx" ON "settings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_talk_created" ON "talk" USING btree ("created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "unsubscribes_user_id_idx" ON "unsubscribes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "unsubscribes_comment_id_idx" ON "unsubscribes" USING btree ("comment_id");