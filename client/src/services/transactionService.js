import { supabase } from "../lib/supabase";

export const transactionService = {
  async addTransaction(transactionData) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            ...transactionData,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;

      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getUserTransactions(limit = 50, offset = 0) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("transaction_details")
        .select("*")
        .eq("user_id", user.id)
        .order("datetime", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateTransaction(id, updateData) {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .update(updateData)
        .eq("id", id)
        .select();

      if (error) throw error;

      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteTransaction(id) {
    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getUserBalance() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase.rpc("get_user_balance", {
        user_uuid: user.id,
      });

      if (error) throw error;

      return { success: true, balance: data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getTransactionsSummary(startDate, endDate) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase.rpc("get_transactions_summary", {
        user_uuid: user.id,
        start_date: startDate,
        end_date: endDate,
      });

      if (error) throw error;

      return { success: true, data: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getCategoryWiseExpenses(startDate, endDate) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase.rpc("get_category_wise_expenses", {
        user_uuid: user.id,
        start_date: startDate,
        end_date: endDate,
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
