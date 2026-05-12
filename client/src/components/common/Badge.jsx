export function Badge({ label, variant = "default", size = "md" }) {
  const baseClasses = "font-semibold rounded-full";

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-100",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-100",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-100",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-100",
    pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-100",
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {label}
    </span>
  );
}

export default Badge;
