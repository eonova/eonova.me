ALTER TABLE "account" DROP CONSTRAINT "account_provider_provider_account_id_pk";--> statement-breakpoint
ALTER TABLE "rate" DROP CONSTRAINT "rate_user_id_comment_id_pk";--> statement-breakpoint
ALTER TABLE "verification_token" DROP CONSTRAINT "verification_token_identifier_token_pk";