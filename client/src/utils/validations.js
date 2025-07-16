export const validation = {
  validateTransaction(transaction) {
    const errors = [];

    if (!transaction.name || transaction.name.trim().length === 0) {
      errors.push("Transaction name is required");
    }

    if (transaction.name && transaction.name.length > 100) {
      errors.push("Transaction name cannot exceed 100 characters");
    }

    if (!transaction.amount || transaction.amount === 0) {
      errors.push("Amount is required and cannot be zero");
    }

    if (!transaction.datetime) {
      errors.push("Date and time are required");
    }

    if (transaction.datetime && new Date(transaction.datetime) > new Date()) {
      errors.push("Transaction date cannot be in the future");
    }

    if (transaction.description && transaction.description.length > 255) {
      errors.push("Description cannot exceed 255 characters");
    }

    return errors;
  },

  validateUser(userData) {
    const errors = [];

    if (!userData.username || userData.username.trim().length < 3) {
      errors.push("Username must be at least 3 characters long");
    }

    if (userData.username && userData.username.length > 30) {
      errors.push("Username cannot exceed 30 characters");
    }

    if (userData.username && !/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      errors.push(
        "Username can only contain letters, numbers, and underscores"
      );
    }

    if (
      !userData.email ||
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(userData.email)
    ) {
      errors.push("Please enter a valid email address");
    }

    if (!userData.password || userData.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }

    return errors;
  },
};
