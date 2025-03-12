
import { CiserUserInfo } from "@/types/api";
import { supabase } from "@/lib/supabase";

const CACHE_KEY = 'ciser_user_info';

export async function fetchUserInfo(): Promise<CiserUserInfo | null> {
  try {
    // First try to get from cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }

    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No session found');
      return null;
    }

    // Call our Edge Function
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-user-info`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: CiserUserInfo = await response.json();
    
    // Cache the response
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    
    return data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
}
