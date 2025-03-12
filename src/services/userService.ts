
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

    // Get access token from user_info table
    const { data: userInfo } = await supabase
      .from('user_info')
      .select('access_token')
      .single();

    if (!userInfo?.access_token) {
      console.error('No access token found');
      return null;
    }

    // Fetch from API
    const response = await fetch('https://api.ciser.com.br/copiloto-vendas-api-qas/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${userInfo.access_token}`,
        'Content-Type': 'application/json',
      }
    });

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
