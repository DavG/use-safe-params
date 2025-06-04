import { describe, expect, test } from "vitest";
import { safeParams } from "../src/core";

describe("safeParams", () => {
	test("reject if missing param", () => {
		const params = { userId: "123" };
		const types = { userId: "int+", childId: "uuid" };
		expect(() => safeParams(params, types)).toThrow();
	});
	describe("int+", () => {
		test("accept valid integer and cast to number", () => {
			const params = { userId: "123" };
			const types = { userId: "int+" };
			const result = safeParams(params, types);
			expect(result.userId).toBe(123);
			expect(typeof result.userId).toBe("number");
		});
		test.each([
			"abc", // letters only
			"1a", // number followed by letter
			"a1", // letter followed by number
		])("refuse invalid input: %s", (value) => {
			const params = { userId: value };
			const types = { userId: "int+" };
			expect(() => safeParams(params, types)).toThrow();
		});
	});
	describe("ulid", () => {
		test("accept valid ulid", () => {
			const params = { ulid: "01ARZ3NDEKTSV4RRFFQ69G5FAV" };
			const types = { ulid: "ulid" };
			const result = safeParams(params, types);
			expect(result.ulid).toBe(params.ulid);
		});
		test.each([
			["01ARZ3NDEKTSV4RRFFQ69G5FA", "too short"],
			["01ARZ3NDEKTSV4RRFFQ69G5FAVV", "too long"],
			["01ARZ3NDEKTSV4RRFFQ69G5FAv", "lowercase"],
			["01ARZ3NDEKTSV4RRFFQ69G5FAO", "forbidden letters"],
		])("reject invalid ulid (%s)", (value, _reason) => {
			const params = { ulid: value };
			const types = { ulid: "ulid" };
			expect(() => safeParams(params, types)).toThrow();
		});
	});
	describe("uuid", () => {
		test("accept valid uuid", () => {
			const params = { uuid: "123e4567-e89b-12d3-a456-426614174000" };
			const types = { uuid: "uuid" };
			const result = safeParams(params, types);
			expect(result.uuid).toBe(params.uuid);
		});
		test.each([
			["123e4567-e89b-12d3-a456-4266141740000", "too long"],
			["123e4567-e89b-12d3-a456-42661417400", "too short"],
			["123e4567-e89b-12d3-a45-642661417400", "invalid format"],
		])("reject invalid uuid (%s)", (value, _reason) => {
			const params = { uuid: value };
			const types = { uuid: "uuid" };
			expect(() => safeParams(params, types)).toThrow();
		});
	});
	describe("slug", () => {
		test("accept valid slug", () => {
			const params = { slug: "valid-slug-123" };
			const types = { slug: "slug" };
			const result = safeParams(params, types);
			expect(result.slug).toBe(params.slug);
		});
		test("accept valid long slug (255 chars)", () => {
			const longSlug = `255-long-slug-${"x".repeat(241)}`;
			const params = { slug: longSlug };
			const types = { slug: "slug" };
			const result = safeParams(params, types);
			expect(result.slug).toBe(params.slug);
		});
		test.each([
			[`256-long-slug-${"x".repeat(242)}`, "too long (256 chars)"],
			["-invalid-slug-123", "starts with hyphen"],
			["invalid-slug-123-", "ends with hyphen"],
			["invalid--slug", "consecutive hyphens"],
			["invalid-Slug", "uppercase"],
			["invâlid-slug", "accents"],
			["invalid-slug\u200B", "unicode space"],
			["invalid-slug-\u00E9", "unicode accent"],
			[`invalid-slug${String.fromCharCode(255)}`, "unicode y"],
		])("reject invalid slug (%s)", (value, _reason) => {
			const params = { slug: value };
			const types = { slug: "slug" };
			expect(() => safeParams(params, types)).toThrow();
		});
	});
});
