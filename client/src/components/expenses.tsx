import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

type Transaction = {
  id: number;
  name: string;
  description: string;
  amount: number;
  datetime: string;
};

function Expenses() {
  const [balance, setBalance] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    datetime: "",
  });

  // Set current datetime when component loads
  useEffect(() => {
    const now = new Date();
    const localDateTime = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    setFormData((prev) => ({ ...prev, datetime: localDateTime }));
  }, []);

  // Animate balance changes (smooth counting effect)
  useEffect(() => {
    const difference = balance - displayBalance;
    if (difference !== 0) {
      const increment =
        difference > 0
          ? Math.ceil(difference / 20)
          : Math.floor(difference / 20);

      const timer = setTimeout(() => {
        setDisplayBalance((prev) => {
          const newValue = prev + increment;
          if (
            (difference > 0 && newValue >= balance) ||
            (difference < 0 && newValue <= balance)
          ) {
            return balance;
          }
          return newValue;
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [balance, displayBalance]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Check if name is empty
    if (!formData.name.trim()) {
      errors.push("Transaction name is required");
    }

    // Check if amount is empty
    if (!formData.amount.trim()) {
      errors.push("Amount is required");
    } else if (
      !formData.amount.startsWith("+") &&
      !formData.amount.startsWith("-")
    ) {
      errors.push("Amount must start with + or - sign");
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount === 0) {
        errors.push("Please enter a valid non-zero number");
      }
    }

    // Check if datetime is empty
    if (!formData.datetime.trim()) {
      errors.push("Date and time are required");
    } else {
      const selectedDate = new Date(formData.datetime);
      const now = new Date();
      if (selectedDate > now) {
        errors.push("Date cannot be in the future");
      }
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validate form before submitting
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(". "));
      return;
    }

    // Process the amount
    let amount = parseFloat(formData.amount);
    if (formData.amount.startsWith("+")) {
      amount = Math.abs(amount);
    } else if (formData.amount.startsWith("-")) {
      amount = -Math.abs(amount);
    }

    // Create new transaction
    const newTransaction = {
      id: Date.now(), // Simple ID generation
      name: formData.name.trim(),
      description: formData.description.trim(),
      amount: amount,
      datetime: new Date(formData.datetime).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Add transaction to list and update balance
    setTransactions((prev) => [newTransaction, ...prev]);
    setBalance((prev) => prev + amount);

    // Reset form
    setFormData({
      name: "",
      description: "",
      amount: "",
      datetime: new Date().toISOString().slice(0, 16),
    });
  };

  const handleDeleteTransaction = (id, amount) => {
    // Remove transaction from list
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    // Adjust balance (subtract the transaction amount)
    setBalance((prev) => prev - amount);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getAmountColor = (amount) => {
    return amount >= 0 ? "text-green-400" : "text-red-400";
  };

  const getAmountPrefix = (amount) => {
    return amount >= 0 ? "+" : "";
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const style = {
    h1: "text-center text-white m-0 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight transition-all duration-500",
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Balance Display */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-700 shadow-xl">
          <div className="text-slate-400 text-sm font-medium mb-2">
            Current Balance
          </div>
          <h1 className={style.h1}>{formatCurrency(displayBalance)}</h1>
        </div>

        {/* Add Transaction Form */}
        <div className="bg-slate-900 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-800 shadow-lg">
          <h2 className="text-slate-200 font-semibold mb-4 text-lg">
            Add New Transaction
          </h2>
          <div className="space-y-4">
            {/* Name and Date in one line */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-600 text-sm sm:text-base"
                type="text"
                placeholder="Transaction name *"
                maxLength={100}
              />
              <input
                name="datetime"
                value={formData.datetime}
                onChange={handleInputChange}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-600 text-sm sm:text-base"
                type="datetime-local"
                max={new Date().toISOString().slice(0, 16)}
              />
            </div>

            {/* Description */}
            <input
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-600 text-sm sm:text-base"
              type="text"
              placeholder="Description (optional)"
              maxLength={255}
            />

            {/* Amount */}
            <input
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-600 text-sm sm:text-base"
              type="text"
              placeholder="Amount (+100 for income, -50 for expense) *"
              pattern="[+-]?\d*\.?\d+"
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-sm sm:text-base">
              Add Transaction
            </button>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden">
          <div className="p-4 border-b border-slate-800">
            <button
              onClick={toggleHistory}
              className="flex items-center justify-between w-full text-left hover:bg-slate-800/30 rounded-lg p-2 -m-2 transition-colors duration-200">
              <h2 className="text-slate-200 font-semibold text-lg">
                Transaction History ({transactions.length})
              </h2>
              {isHistoryOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>

          {isHistoryOpen && (
            <div className="transactions divide-y divide-slate-800 max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  No transactions yet. Add your first transaction above!
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="transaction p-4 hover:bg-slate-800/50 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div className="left flex-1 min-w-0">
                        <div className="name text-slate-200 font-medium mb-1 text-sm sm:text-base truncate">
                          {transaction.name}
                        </div>
                        {transaction.description && (
                          <div className="description text-slate-400 text-xs sm:text-sm">
                            {transaction.description}
                          </div>
                        )}
                      </div>
                      <div className="right text-right ml-4 flex-shrink-0 flex items-center gap-2">
                        <div>
                          <div
                            className={`price font-semibold text-base sm:text-lg ${getAmountColor(
                              transaction.amount
                            )}`}>
                            {getAmountPrefix(transaction.amount)}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </div>
                          <div className="datetime text-slate-500 text-xs mt-1">
                            {transaction.datetime}
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            handleDeleteTransaction(
                              transaction.id,
                              transaction.amount
                            )
                          }
                          className="text-red-400 hover:text-red-300 p-1 rounded transition-colors duration-200"
                          title="Delete transaction">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Expenses;
