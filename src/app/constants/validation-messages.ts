export const VALIDATION_MESSAGES = {
  oneRequired: 'Please provide either client name OR document ID.',
  onlyOneAllowed: 'Please fill only one field (name OR document ID), not both.',
  pattern: 'Document ID must contain digits only.',
  noResults: 'No results found.',
  multipleResults: 'Multiple results found',
  invalidResult: 'Search returned an invalid result.',
  genericError: 'An error occurred while searching. Please try again.',
} as const;
