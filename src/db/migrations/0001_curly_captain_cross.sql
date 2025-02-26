CREATE TABLE "album" (
	"id" text PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"description" text,
	"width" integer DEFAULT 300,
	"height" integer DEFAULT 200,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talk" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text PRIMARY KEY NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"commentNums" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL
);
