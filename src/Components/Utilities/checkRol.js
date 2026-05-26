export default function (roles, userData) {
  return (Array.isArray(roles)
    ? roles.includes(userData?.rol_unique_roles)
    : roles === userData?.rol_unique_roles) || false;
}
