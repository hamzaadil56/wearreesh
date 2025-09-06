import { BaseModel } from "../core/BaseModel";
import { Product } from "../product/Product.model";

export interface Money {
	amount: string;
	currencyCode: string;
}

export interface CartItemData {
	id: string;
	quantity: number;
	merchandise: {
		id: string;
		title: string;
		selectedOptions: {
			name: string;
			value: string;
		}[];
		product: Product;
	};
	cost: {
		totalAmount: Money;
	};
}

export interface CartData {
	id: string;
	checkoutUrl?: string;
	cost: {
		subtotalAmount: Money;
		totalAmount: Money;
		totalTaxAmount: Money;
	};
	lines: CartItemData[];
	totalQuantity: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export class CartItem {
	public readonly id: string;
	public readonly quantity: number;
	public readonly merchandise: CartItemData["merchandise"];
	public readonly cost: CartItemData["cost"];

	constructor(data: CartItemData) {
		this.id = data.id;
		this.quantity = data.quantity;
		this.merchandise = data.merchandise;
		this.cost = data.cost;
	}

	/**
	 * Get formatted total price
	 */
	get formattedTotal(): string {
		return this.formatPrice(
			this.cost.totalAmount.amount,
			this.cost.totalAmount.currencyCode
		);
	}

	/**
	 * Get unit price
	 */
	get unitPrice(): Money {
		const unitAmount = (
			parseFloat(this.cost.totalAmount.amount) / this.quantity
		).toFixed(2);
		return {
			amount: unitAmount,
			currencyCode: this.cost.totalAmount.currencyCode,
		};
	}

	/**
	 * Get formatted unit price
	 */
	get formattedUnitPrice(): string {
		const unit = this.unitPrice;
		return this.formatPrice(unit.amount, unit.currencyCode);
	}

	/**
	 * Get selected options as string
	 */
	get selectedOptionsText(): string {
		return this.merchandise.selectedOptions
			.map((option) => `${option.name}: ${option.value}`)
			.join(", ");
	}

	private formatPrice(amount: string, currencyCode: string): string {
		const numericAmount = parseFloat(amount);
		if (isNaN(numericAmount)) return "Price unavailable";

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currencyCode,
		}).format(numericAmount);
	}
}

export class Cart extends BaseModel {
	public readonly checkoutUrl?: string;
	public readonly cost: CartData["cost"];
	public readonly lines: CartItem[];
	public readonly totalQuantity: number;

	constructor(data: CartData) {
		super({
			id: data.id,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});

		this.checkoutUrl = data.checkoutUrl;
		this.cost = data.cost;
		this.lines = data.lines.map((line) => new CartItem(line));
		this.totalQuantity = data.totalQuantity;
	}

	/**
	 * Check if cart is empty
	 */
	get isEmpty(): boolean {
		return this.lines.length === 0;
	}

	/**
	 * Get number of items in cart
	 */
	get itemCount(): number {
		return this.lines.length;
	}

	/**
	 * Get formatted subtotal
	 */
	get formattedSubtotal(): string {
		return this.formatPrice(
			this.cost.subtotalAmount.amount,
			this.cost.subtotalAmount.currencyCode
		);
	}

	/**
	 * Get formatted total
	 */
	get formattedTotal(): string {
		return this.formatPrice(
			this.cost.totalAmount.amount,
			this.cost.totalAmount.currencyCode
		);
	}

	/**
	 * Get formatted tax
	 */
	get formattedTax(): string {
		return this.formatPrice(
			this.cost.totalTaxAmount.amount,
			this.cost.totalTaxAmount.currencyCode
		);
	}

	/**
	 * Find item by merchandise ID
	 */
	findItem(merchandiseId: string): CartItem | null {
		return (
			this.lines.find((line) => line.merchandise.id === merchandiseId) ||
			null
		);
	}

	/**
	 * Get item quantity by merchandise ID
	 */
	getItemQuantity(merchandiseId: string): number {
		const item = this.findItem(merchandiseId);
		return item ? item.quantity : 0;
	}

	/**
	 * Check if item exists in cart
	 */
	hasItem(merchandiseId: string): boolean {
		return this.findItem(merchandiseId) !== null;
	}

	/**
	 * Get unique products in cart
	 */
	get uniqueProducts(): Product[] {
		const productMap = new Map<string, Product>();

		this.lines.forEach((line) => {
			if (!productMap.has(line.merchandise.product.id)) {
				productMap.set(
					line.merchandise.product.id,
					line.merchandise.product
				);
			}
		});

		return Array.from(productMap.values());
	}

	private formatPrice(amount: string, currencyCode: string): string {
		const numericAmount = parseFloat(amount);
		if (isNaN(numericAmount)) return "Price unavailable";

		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currencyCode,
		}).format(numericAmount);
	}

	protected getSerializableData(): Record<string, any> {
		return {
			checkoutUrl: this.checkoutUrl,
			cost: this.cost,
			lines: this.lines.map((line) => ({
				id: line.id,
				quantity: line.quantity,
				merchandise: line.merchandise,
				cost: line.cost,
			})),
			totalQuantity: this.totalQuantity,
		};
	}

	clone(updates?: Partial<CartData>): this {
		return new Cart({
			...this.getSerializableData(),
			id: this.id,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			...updates,
		} as CartData) as this;
	}

	validate(): { isValid: boolean; errors: string[] } {
		const errors: string[] = [];

		// Cart can be empty, so no validation errors for empty cart
		// Validate individual items
		this.lines.forEach((line, index) => {
			if (line.quantity <= 0) {
				errors.push(
					`Item ${index + 1} must have quantity greater than 0`
				);
			}

			if (!line.merchandise.id) {
				errors.push(`Item ${index + 1} must have valid merchandise ID`);
			}
		});

		// Validate cost consistency
		if (parseFloat(this.cost.totalAmount.amount) < 0) {
			errors.push("Cart total cannot be negative");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}
}
