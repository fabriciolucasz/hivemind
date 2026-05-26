import { useEffect, useState } from 'react';

import {
  User,
  Mail,
  AlertCircle,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

interface UserProfile {
  name: string;
  email: string;
}

export function ProfilePage() {

  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [error, setError] = useState('');

  useEffect(() => {

    async function loadProfile() {

      try {

        setProfile({
          name: user?.name || '',
          email: user?.email || '',
        });

      } catch (error) {

        setError('Erro ao carregar perfil');

      }

    }

    loadProfile();

  }, [user]);

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">

            <User className="w-8 h-8 text-white" />

          </div>

          <h1 className="text-3xl font-bold mb-2">
            Meu Perfil
          </h1>

          <p className="text-gray-500">
            Informações da sua conta
          </p>

        </div>

        <div className="bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">

          {error && (

            <div className="mb-5 p-4 bg-red-100 border border-red-300 rounded-lg flex items-start gap-3">

              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />

              <p className="text-sm text-red-600">
                {error}
              </p>

            </div>

          )}

          {profile && (

            <div className="space-y-5">

              <div className="relative">

                <User className="absolute left-3 top-11 w-5 h-5 text-gray-400" />

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Nome
                  </label>

                  <div className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 bg-gray-50">
                    {profile.name}
                  </div>

                </div>

              </div>

              <div className="relative">

                <Mail className="absolute left-3 top-11 w-5 h-5 text-gray-400" />

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>

                  <div className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 bg-gray-50">
                    {profile.email}
                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}