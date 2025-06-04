type ParamType = "int+" | "slug" | "ulid" | "uuid";

type ParamValidators = {
	[key in ParamType]: (value: string) => boolean;
};

const validators: ParamValidators = {
	"int+": (value: string) => {
		return /^\d+$/.test(value);
	},
	slug: (value: string) => {
		if (!value || value.length > 255) return false;
		if (!/^[a-z0-9]$/.test(value[0])) return false;
		if (!/[a-z0-9]$/.test(value[value.length - 1])) return false;
		return !/[^a-z0-9-]|--/.test(value);
	},
	ulid: (value: string) => {
		if (value.length !== 26) return false;
		return /^[0-9A-HJKMNP-TV-Z]+$/.test(value);
	},
	uuid: (value: string) => {
		if (value.length !== 36) return false;
		return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value);
	},
};

export type ParamTypeMap = Record<string, ParamType>;

export type SafeParamsResult<T extends ParamTypeMap> = {
	[K in keyof T]: T[K] extends "int" ? number : string;
};

export const safeParams = <T extends ParamTypeMap>(params: Record<string, string | undefined>, paramTypes: T): SafeParamsResult<T> => {
	const result: Record<string, string | number> = {};

	for (const [paramName, paramType] of Object.entries(paramTypes)) {
		const value = params[paramName];
		if (!value || !validators[paramType](value)) {
			throw new Response("Not Found", { status: 404 });
		}
		result[paramName] = paramType === "int+" ? Number.parseInt(value, 10) : value;
	}

	return result as SafeParamsResult<T>;
};
