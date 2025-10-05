export function isShopifyError(error: any): error is ShopifyError {
	return error?.message && error?.extensions?.code;
}

interface ShopifyError {
	message: string;
	extensions: {
		code: string;
	};
	cause?: any;
	status?: number;
}
