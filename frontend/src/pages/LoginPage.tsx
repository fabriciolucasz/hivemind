import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Brain, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

import { Button } from '../components/Button';
import { Input } from '../components/Input';

import { login } from '../services/authServices';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {

  const navigate = useNavigate();

  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError('');

    if (!formData.email || !formData.password) {

      setError('Por favor, preencha todos os campos');

      return;
    }

    try {

      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      signIn(response.token, response.user);

      navigate('/dashboard');

    } catch (error) {

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Erro ao fazer login');
      }

    }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Hive Mind
          </h1>

          <p className="text-gray-500">
            Bem-vindo de volta! Faça login para continuar
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

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative">

              <Mail className="absolute left-3 top-11 w-5 h-5 text-gray-400" />

              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                className="pl-11"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
              />

            </div>

            <div className="relative">

              <Lock className="absolute left-3 top-11 w-5 h-5 text-gray-400" />

              <Input
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                className="pl-11 pr-11"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-500 hover:text-black"
              >

                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}

              </button>

            </div>

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />

                <span className="text-gray-500">
                  Lembrar de mim
                </span>

              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Esqueceu a senha?
              </Link>

            </div>

            <Button type="submit">
              Entrar
            </Button>

          </form>

          <div className="mt-6 text-center">

            <p className="text-sm text-gray-500">

              Não tem uma conta?{' '}

              <Link
                to="/signup"
                className="text-blue-600 hover:underline"
              >
                Criar conta
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}