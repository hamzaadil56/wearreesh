export type Maybe<T> = T | null;

export type Connection<T> = {
	edges: Array<Edge<T>>;
};

export type Edge<T> = {
	node: T;
};

export type Cart = Omit<ShopifyCart, "lines"> & {
	lines: ShopifyCartItem[];
};

export type ShopifyCartItem = {
	id: string;
	quantity: number;
	cost: {
		totalAmount: Money;
	};
	merchandise: {
		id: string;
		title: string;
		selectedOptions: {
			name: string;
			value: string;
		}[];
		product: Product;
		price: Money;
	};
};

export type Collection = ShopifyCollection & {
	path: string;
	id?: string;
};

export type Image = {
	url: string;
	altText: string;
	width: number;
	height: number;
};

export type Menu = {
	title: string;
	path: string;
};

export type Money = {
	amount: string;
	currencyCode: string;
};

export type Page = {
	id: string;
	title: string;
	handle: string;
	body: string;
	bodySummary: string;
	seo?: SEO;
	createdAt: string;
	updatedAt: string;
};

export type Product = Omit<ShopifyProduct, "variants" | "images"> & {
	variants: ProductVariant[];
	images: Image[];
};

export type ProductOption = {
	id: string;
	name: string;
	values: string[];
};

export interface ProductVariant {
	id: string;
	title: string;
	quantityAvailable: number;
	price: Money;
	compareAtPrice?: {
		amount: string;
		currencyCode: string;
	};
	availableForSale: boolean;
	selectedOptions: {
		name: string;
		value: string;
	}[];
}

export type SEO = {
	title: string;
	description: string;
};

export type ShopifyCart = {
	id: string;
	checkoutUrl: string;
	cost: {
		subtotalAmount: Money;
		totalAmount: Money;
		totalTaxAmount: Money;
	};
	lines: Connection<ShopifyCartItem>;
	totalQuantity: number;
};

export type ShopifyCollection = {
	handle: string;
	title: string;
	description: string;
	seo: SEO;
	updatedAt: string;
	image?: Image;
};

export type ShopifyProduct = {
	id: string;
	handle: string;
	availableForSale: boolean;
	title: string;
	description: string;
	descriptionHtml: string;
	options: ProductOption[];
	totalInventory: number;
	priceRange: {
		maxVariantPrice: Money;
		minVariantPrice: Money;
	};
	variants: Connection<ProductVariant>;
	featuredImage: Image;
	images: Connection<Image>;
	seo: SEO;
	tags: string[];
	updatedAt: string;
};

export type ShopifyCartOperation = {
	data: {
		cart: ShopifyCart;
	};
	variables: {
		cartId: string;
	};
};

export type AttributeInput = {
	key: string;
	value: string;
};

export type CartLineInput = {
	merchandiseId: string;
	quantity?: number;
	attributes?: AttributeInput[];
	sellingPlanId?: string;
};

export type CartBuyerIdentityInput = {
	email?: string;
	phone?: string;
	companyLocationId?: string;
	countryCode?: string;
	customerAccessToken?: string;
	preferences?: Record<string, any>;
};

export type DeliveryAddress = {
	countryCode?: string;
	// Add other address fields as needed
	[key: string]: any;
};

export type AddressInput = {
	deliveryAddress?: DeliveryAddress;
	// Add other address fields as needed
	[key: string]: any;
};

export type CartSelectableAddressInput = {
	address?: AddressInput;
	// Add other fields as needed
	[key: string]: any;
};

export type CartDeliveryInput = {
	addresses?: CartSelectableAddressInput[];
};

export type CartInputMetafieldInput = {
	key: string;
	value: string;
	type: string;
};

export type CartInput = {
	attributes: AttributeInput[];
	lines: CartLineInput[];
	discountCodes: string[];
	giftCardCodes: string[];
	note?: string;
	buyerIdentity: CartBuyerIdentityInput;
	delivery: CartDeliveryInput;
	metafields?: CartInputMetafieldInput[];
};

export type ShopifyCreateCartOperation = {
	data: {
		cartCreate: {
			cart: ShopifyCart;
			userErrors: {
				field: string[];
				message: string;
			}[];
		};
	};
	variables: {
		input: CartInput;
	};
};

export type ShopifyAddToCartOperation = {
	data: {
		cartLinesAdd: {
			cart: ShopifyCart;
		};
	};
	variables: {
		cartId: string;
		lines: CartLineInput[];
	};
};

export type ShopifyRemoveFromCartOperation = {
	data: {
		cartLinesRemove: {
			cart: ShopifyCart;
		};
	};
	variables: {
		cartId: string;
		lineIds: string[];
	};
};

export type ShopifyUpdateCartOperation = {
	data: {
		cartLinesUpdate: {
			cart: ShopifyCart;
		};
	};
	variables: {
		cartId: string;
		lines: {
			id: string;
			merchandiseId?: string;
			quantity: number;
		}[];
	};
};

export type ShopifyCollectionOperation = {
	data: {
		collection: ShopifyCollection;
	};
	variables: {
		handle: string;
	};
};

export type ShopifyCollectionProductsOperation = {
	data: {
		collection: {
			products: Connection<ShopifyProduct>;
		};
	};
	variables: {
		handle: string;
		reverse?: boolean;
		sortKey?: string;
		first?: number;
	};
};

export type ShopifyCollectionsOperation = {
	data: {
		collections: Connection<ShopifyCollection>;
	};
};

export type ShopifyMenuOperation = {
	data: {
		menu?: {
			items: {
				title: string;
				url: string;
			}[];
		};
	};
	variables: {
		handle: string;
	};
};

export type ShopifyPageOperation = {
	data: { page: Page };
	variables: { handle: string };
};

export type ShopifyPagesOperation = {
	data: {
		pages: Connection<Page>;
	};
};

export type ShopifyProductOperation = {
	data: { product: ShopifyProduct };
	variables: {
		handle: string;
	};
};

export type ShopifyProductRecommendationsOperation = {
	data: {
		productRecommendations: ShopifyProduct[];
	};
	variables: {
		productId: string;
	};
};

export type ShopifyProductsOperation = {
	data: {
		products: Connection<ShopifyProduct>;
	};
	variables: {
		query?: string;
		reverse?: boolean;
		sortKey?: string;
	};
};

export type ShopifyProductsOptionsOperation = {
	data: {
		products: Connection<{
			id: string;
			handle: string;
			title: string;
			availableForSale: boolean;
			options: ProductOption[];
		}>;
	};
	variables: {
		query?: string;
		reverse?: boolean;
		sortKey?: string;
		first?: number;
	};
};
