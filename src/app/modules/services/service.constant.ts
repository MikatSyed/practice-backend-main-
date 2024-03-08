export const ServiceFilterableFields = [
  'searchTerm',
  'category',
  'minPrice',
  'maxPrice',
];
export const queryFields = ['limit', 'page', 'sortBy', 'sortOrder'];

export const ServiceSearchableFields = ['name', 'location'];

export const ServiceRelationalFields = ['category', 'name'];
export const ServiceRelationalFieldsMapper: { [key: string]: string } = {
  category: 'category',
};
