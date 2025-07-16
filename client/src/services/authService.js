/* eslint-disable no-unused-vars */
import { supabase } from "../lib/supabase";

export const authService = {
  async signUp(email, password, username) {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Insert user profile (only if auth successful)
      if (authData.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .insert([
            {
              id: authData.user.id,
              username,
              email,
            },
          ])
          .select();

        if (userError) throw userError;
      }

      return {
        success: true,
        data: authData,
        needsConfirmation: !authData.session,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last login
      if (data.user) {
        await supabase.rpc("update_last_login", {
          user_uuid: data.user.id,
        });
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};
