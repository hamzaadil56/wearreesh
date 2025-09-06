export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
	stringToCheck.startsWith(startsWith)
		? stringToCheck
		: `${startsWith}${stringToCheck}`;

export const createUrl = (
	pathname: string,
	params: URLSearchParams | string
) => {
	const paramsString = params.toString();
	const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

	return `${pathname}${queryString}`;
};
