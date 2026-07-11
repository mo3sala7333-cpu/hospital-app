// Formats a whole-number EGP amount with thousands separators, e.g.
// 33000000 -> "33,000,000". Kept as Western digits (clearer at speed for a
// board audience) with the Arabic currency label applied by the caller.
export const formatEGP = (value: number): string => Math.round(value).toLocaleString("en-US");
