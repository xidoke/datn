export const hasPermission = (
  permission: string[],
  requiredPermission: string,
) => {
  return permission.includes(requiredPermission);
};
