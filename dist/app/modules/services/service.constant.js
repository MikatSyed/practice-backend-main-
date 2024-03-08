"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRelationalFieldsMapper = exports.ServiceRelationalFields = exports.ServiceSearchableFields = exports.queryFields = exports.ServiceFilterableFields = void 0;
exports.ServiceFilterableFields = [
    'searchTerm',
    'category',
    'minPrice',
    'maxPrice',
];
exports.queryFields = ['limit', 'page', 'sortBy', 'sortOrder'];
exports.ServiceSearchableFields = ['name', 'location'];
exports.ServiceRelationalFields = ['category', 'name'];
exports.ServiceRelationalFieldsMapper = {
    category: 'category',
};
