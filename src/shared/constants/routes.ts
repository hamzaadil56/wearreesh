import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

export const ROUTES = {
	HOME: "/",
	PRODUCTS: "/products",
	ABOUT: "/about",
	CONTACT: "/contact",
	ACCOUNT: "/account",
	LOGIN: "/login",
	REGISTER: "/register",
};
export const navigationLinks = [
	{ name: "Shop", href: ROUTES.PRODUCTS },
	{ name: "About Us", href: ROUTES.ABOUT },
	{ name: "Contact Us", href: ROUTES.CONTACT },
];
export const socialMediaLinks = [
	{ name: "Facebook", href: "#", icon: FaFacebookF },
	{ name: "Instagram", href: "#", icon: FaInstagram },
	{ name: "YouTube", href: "#", icon: FaYoutube },
];
