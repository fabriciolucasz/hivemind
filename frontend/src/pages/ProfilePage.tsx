import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AlertCircle,
  Calendar,
  Edit,
  Heart,
  Mail,
  Save,
  Trash2,
  User,
  X,
} from 'lucide-react';

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';

export function ProfilePage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleUnauthorized = useCallback(() => {
    signOut();
    navigate('/', { replace: true });
  }, [navigate, signOut]);

  const {
    profile,
    isLoading,
    error,
    setError,
    editProfile,
    removeAccount,
  } = useProfile({
    onUnauthorized: handleUnauthorized,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    interests: '',
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFormData({
      name: profile.name,
      age: profile.profile?.age?.toString() ?? '',
      interests: profile.profile?.interests.join(', ') ?? '',
    });
  }, [profile]);

  async function handleSave() {
    if (!formData.name.trim()) {
      setError('Informe seu nome');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccess('');

      await editProfile({
        name: formData.name.trim(),
        age: formData.age ? Number(formData.age) : null,
        interests: formData.interests,
      });

      setIsEditing(false);
      setSuccess('Perfil atualizado com sucesso');
    } catch (saveError) {
      console.error(saveError);
      setError('Erro ao atualizar perfil');
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelEdit() {
    if (profile) {
      setFormData({
        name: profile.name,
        age: profile.profile?.age?.toString() ?? '',
        interests: profile.profile?.interests.join(', ') ?? '',
      });
    }

    setIsEditing(false);
    setError('');
  }

  async function handleDeleteAccount() {
    try {
      setIsDeleting(true);
      setError('');

      await removeAccount();
      signOut();
      navigate('/', { replace: true });
    } catch (deleteError) {
      console.error(deleteError);
      setError('Erro ao excluir conta');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

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

          {success && (
            <div className="mb-5 p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-sm text-green-700">
                {success}
              </p>
            </div>
          )}

          {isLoading && (
            <p className="text-sm text-gray-500 text-center">
              Carregando perfil...
            </p>
          )}

          {!isLoading && profile && (
            <div className="space-y-5">
              <div className="relative">
                <User className="absolute left-3 top-11 w-5 h-5 text-gray-400" />

                {isEditing ? (
                  <Input
                    label="Nome"
                    className="pl-11"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        name: event.target.value,
                      })
                    }
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nome
                    </label>

                    <div className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 bg-gray-50">
                      {profile.name}
                    </div>
                  </div>
                )}
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

              <div className="relative">
                <Calendar className="absolute left-3 top-11 w-5 h-5 text-gray-400" />

                {isEditing ? (
                  <Input
                    label="Idade"
                    type="number"
                    min="0"
                    className="pl-11"
                    value={formData.age}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        age: event.target.value,
                      })
                    }
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Idade
                    </label>

                    <div className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 bg-gray-50">
                      {profile.profile?.age ?? 'Não informado'}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <Heart className="absolute left-3 top-11 w-5 h-5 text-gray-400" />

                {isEditing ? (
                  <Input
                    label="Interesses"
                    className="pl-11"
                    placeholder="Tecnologia, saúde, educação"
                    value={formData.interests}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        interests: event.target.value,
                      })
                    }
                  />
                ) : (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Interesses
                    </label>

                    <div className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 bg-gray-50">
                      {profile.profile?.interests.length
                        ? profile.profile.interests.join(', ')
                        : 'Não informado'}
                    </div>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setSuccess('');
                    setIsEditing(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar perfil
                </Button>
              )}

              <div className="border-t border-gray-200 pt-5">
                {!showDeleteConfirm ? (
                  <Button
                    type="button"
                    variant="destructive"
                    fullWidth
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir conta
                  </Button>
                ) : (
                  <div className="space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                      Esta ação exclui sua conta e seus dados cadastrados.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Excluindo...' : 'Confirmar'}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDeleteConfirm(false)}
                        disabled={isDeleting}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
