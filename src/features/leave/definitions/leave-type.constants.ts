export const LEAVE_TYPE_KEYS = {
  all: ['leave-types'] as const,
  catalogue: () => [...LEAVE_TYPE_KEYS.all, 'catalogue'] as const,
};
