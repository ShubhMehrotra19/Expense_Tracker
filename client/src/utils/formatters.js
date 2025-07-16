export const formatters = {
  formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  },

  formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  formatDateTime(date) {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};
