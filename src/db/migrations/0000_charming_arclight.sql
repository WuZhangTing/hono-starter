CREATE TABLE "user" (
	"id" uuid DEFAULT gen_random_uuid(),
	"username" varchar NOT NULL,
	"password" varchar NOT NULL,
	"name" varchar,
	"avatar" varchar,
	"phone" varchar,
	"email" varchar,
	"status" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
