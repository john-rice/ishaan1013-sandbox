import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const user = sqliteTable("user", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey()
		.unique(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	image: text("image"),
});

export type User = typeof user.$inferSelect;

export const userRelations = relations(user, ({ many }) => ({
	sandbox: many(sandbox),
	usersToSandboxes: many(usersToSandboxes),
}));

export const sandbox = sqliteTable("sandbox", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey()
		.unique(),
	name: text("name").notNull(),
	type: text("type", { enum: ["react", "node"] }).notNull(),
	visibility: text("visibility", { enum: ["public", "private"] }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
});

export type Sandbox = typeof sandbox.$inferSelect;

export const sandboxRelations = relations(sandbox, ({ one, many }) => ({
	author: one(user, {
		fields: [sandbox.userId],
		references: [user.id],
	}),
	usersToSandboxes: many(usersToSandboxes),
}));

export const usersToSandboxes = sqliteTable("users_to_sandboxes", {
	userId: text("userId")
		.notNull()
		.references(() => user.id),
	sandboxId: text("sandboxId")
		.notNull()
		.references(() => sandbox.id),
});

export const usersToSandboxesRelations = relations(usersToSandboxes, ({ one }) => ({
	group: one(sandbox, {
		fields: [usersToSandboxes.sandboxId],
		references: [sandbox.id],
	}),
	user: one(user, {
		fields: [usersToSandboxes.userId],
		references: [user.id],
	}),
}));
