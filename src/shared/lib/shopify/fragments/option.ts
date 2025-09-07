export const optionFragment = /* GraphQL */ `
	fragment option on ProductOption {
		id
		name
		values
		optionValues {
			id
			name
		}
	}
`;
