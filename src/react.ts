import { useParams } from "react-router";
import { type ParamTypeMap, type SafeParamsResult, safeParams } from "./core";

export const useSafeParams = <T extends ParamTypeMap>(paramTypes: T): SafeParamsResult<T> => {
	const params = useParams();
	return safeParams(params, paramTypes);
};
