import { User, UserManager, WebStorageStateStore } from "oidc-client-ts";
import { GraphProfile, UserInfo } from "./types";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { fetchAdfsUserInfoViaEdgeFunction } from "./fallbackUtils";

export const fetchGraphProfile = async (accessToken: string): Promise<GraphProfile | null> => {
  try {
    console.log("Fetching user profile from Microsoft Graph API...");
    
    const response = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Graph API error:", response.status, errorText);
      toast({
        variant: "destructive",
        title: "Erro ao buscar perfil",
        description: `Erro ao buscar perfil do Microsoft Graph: ${response.status}`
      });
      return null;
    }
    
    const profileData = await response.json();
    console.log("Graph API response:", profileData);
    
    let photoUrl = null;
    try {
      const photoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });
      
      if (photoResponse.ok) {
        const blob = await photoResponse.blob();
        photoUrl = URL.createObjectURL(blob);
        console.log("Retrieved profile photo URL:", photoUrl);
      } else {
        console.log("No profile photo available:", photoResponse.status);
      }
    } catch (photoError) {
      console.error("Error fetching profile photo:", photoError);
    }
    
    return {
      ...profileData,
      photoUrl
    };
  } catch (err) {
    console.error("Error fetching Graph profile:", err);
    toast({
      variant: "destructive",
      title: "Erro ao buscar perfil",
      description: "Não foi possível buscar informações do Microsoft Graph"
    });
    return null;
  }
};

const fetchAdfsUserInfo = async (accessToken: string) => {
  try {
    console.log("Fetching ADFS user info via proxy...");
    
    const response = await fetch("/api/users/me", {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    
    if (!response.ok) {
      console.warn("Proxy API call failed, trying Edge Function fallback...");
      return await fetchAdfsUserInfoViaEdgeFunction(accessToken);
    }
    
    const adfsData = await response.json();
    console.log("ADFS API response via proxy:", adfsData);
    return adfsData;
    
  } catch (err) {
    console.error("Error fetching ADFS info via proxy:", err);
    console.log("Trying Edge Function fallback...");
    
    return await fetchAdfsUserInfoViaEdgeFunction(accessToken);
  }
};

export const saveUserInfo = async (userData: User): Promise<boolean> => {
  if (!userData || !userData.profile) {
    console.error("User data or profile missing");
    return false;
  }
  
  try {
    console.log("Attempting to save user info to Supabase...");
    
    console.log("User profile data from token:", userData.profile);
    console.log("Access token:", userData.access_token);
    
    const userId = userData.profile.sub;
    if (!userId) {
      console.error("User ID is missing from profile", userData.profile);
      return false;
    }

    let ipAddress = '';
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ipAddress = data.ip;
      console.log("Retrieved IP address:", ipAddress);
    } catch (ipError) {
      console.error("Error getting IP address:", ipError);
    }

    const userAgent = window.navigator.userAgent;
    
    const graphProfile = await fetchGraphProfile(userData.access_token);
    console.log("Graph profile retrieved:", graphProfile);
    
    const email = userData.profile.email || 
                 userData.profile.preferred_username || 
                 (graphProfile ? graphProfile.mail || graphProfile.userPrincipalName : null);
                 
    const displayName = userData.profile.name || 
                       (graphProfile ? graphProfile.displayName : null);
                       
    const firstName = graphProfile ? graphProfile.givenName : null;
    const lastName = graphProfile ? graphProfile.surname : null;
    const jobTitle = graphProfile ? graphProfile.jobTitle : null;
    
    const department = graphProfile ? graphProfile.officeLocation : null;
    
    const officeLocation = graphProfile ? graphProfile.officeLocation : null;
    
    const profileImageUrl = graphProfile ? graphProfile.photoUrl : null;
    
    console.log("Final mapped user fields:", {
      email,
      displayName,
      firstName,
      lastName,
      profileImageUrl,
      jobTitle,
      department,
      officeLocation
    });

    const userInfo: UserInfo = {
      user_id: userId,
      email: email,
      display_name: displayName,
      first_name: firstName,
      last_name: lastName,
      profile_image_url: profileImageUrl,
      job_title: jobTitle,
      department: department,
      office_location: officeLocation,
      user_agent: userAgent,
      ip_address: ipAddress,
      id_token: userData.id_token,
      raw_profile: userData.profile,
      login_timestamp: new Date().toISOString(),
      last_active: new Date().toISOString(),
      access_token: userData.access_token
    };

    console.log("Prepared user info to save:", userInfo);

    const { data: existingUser, error: fetchError } = await supabase
      .from('user_info')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking if user exists:", fetchError);
      toast({
        variant: "destructive",
        title: "Erro ao verificar usuário",
        description: "Não foi possível verificar se o usuário já existe: " + fetchError.message
      });
      return false;
    }

    let result;

    if (existingUser) {
      result = await supabase
        .from('user_info')
        .update(userInfo)
        .eq('user_id', userId);
    } else {
      result = await supabase
        .from('user_info')
        .insert([userInfo]);
    }
    
    if (result.error) {
      console.error("Error saving user info:", result.error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar informações",
        description: "Não foi possível salvar as informações do usuário: " + result.error.message
      });
      return false;
    }

    const adfsData = await fetchAdfsUserInfo(userData.access_token);
    
    if (adfsData) {
      const adfsInfo = {
        user_id: userId,
        display_name: adfsData.displayName,
        given_name: adfsData.givenName,
        job_title: adfsData.jobTitle,
        email: adfsData.email,
        user_principal_name: adfsData.userPrincipalName,
        codigo_bp: adfsData.codigo_bp,
        nome_bp: adfsData.nome_bp,
        login_adfs: adfsData.login_adfs,
        is_representante: adfsData.is_representante,
        erp_email: adfsData.erp_email,
        data_sincronizacao: adfsData.data_sincronizacao,
        hora_sincronizacao: adfsData.hora_sincronizacao,
        raw_data: adfsData
      };

      const { error: adfsError } = await supabase
        .from('user_info_adfs')
        .upsert([adfsInfo], {
          onConflict: 'user_id'
        });

      if (adfsError) {
        console.error("Error saving ADFS info:", adfsError);
        toast({
          variant: "destructive",
          title: "Erro ao salvar informações ADFS",
          description: "Não foi possível salvar as informações do ADFS"
        });
      } else {
        console.log("ADFS info saved successfully");
      }
    }

    console.log("User info saved successfully");
    toast({
      title: "Login efetuado",
      description: "Bem-vindo ao sistema!"
    });
    return true;
    
  } catch (err) {
    console.error("Error in saveUserInfo:", err);
    toast({
      variant: "destructive",
        title: "Erro ao salvar informações",
        description: "Ocorreu um erro ao salvar as informações do usuário."
    });
    return false;
  }
};

export const createUserManager = (clientId: string, tenant: string) => {
  if (!clientId || !tenant) {
    console.log("Dados de configuração incompletos:", { clientId, tenant });
    return null;
  }

  console.log("Iniciando configuração do UserManager com:", { clientId, tenant });
  
  const authority = `https://login.microsoftonline.com/${tenant}/v2.0`;

  const settings: any = {
    authority,
    client_id: clientId,
    redirect_uri: `${window.location.origin}/auth-callback`,
    post_logout_redirect_uri: window.location.origin,
    response_type: "code",
    scope: "openid profile email User.Read User.ReadBasic.All",
    automaticSilentRenew: true,
    monitorSession: true,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  };

  console.log("Configurações finais:", {
    ...settings,
  });

  return new UserManager(settings);
};
