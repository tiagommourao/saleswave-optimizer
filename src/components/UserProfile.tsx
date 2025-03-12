
import { useEffect, useState } from 'react';
import { CiserUserInfo } from '@/types/api';
import { fetchUserInfo } from '@/services/userService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState<CiserUserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const data = await fetchUserInfo();
        setUserInfo(data);
      } catch (error) {
        console.error('Error loading user info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="p-4 text-red-500">
        Erro ao carregar informações do usuário
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Perfil do Usuário</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nome</label>
            <p className="text-lg">{userInfo.displayName}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Cargo</label>
            <p className="text-lg">{userInfo.jobTitle}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{userInfo.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Código BP</label>
            <p className="text-lg">{userInfo.codigo_bp}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Login ADFS</label>
            <p className="text-lg">{userInfo.login_adfs}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Representante</label>
            <p className="text-lg">{userInfo.is_representante === '1' ? 'Sim' : 'Não'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Data Sincronização</label>
            <p className="text-lg">{userInfo.data_sincronizacao}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Hora Sincronização</label>
            <p className="text-lg">{userInfo.hora_sincronizacao}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
