export const optionFragment = /* GraphQL */ `
	fragment option on ProductOption {
		id
		name
		values
		optionValues {
			id
			name
			swatch {
				color
				image {
					id
					alt
					mediaContentType
					previewImage {
						altText
						url
						height
						id
					}
				}
			}
		}
	}
`;
