import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Brain,
  Mail,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

import axios from 'axios';

import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function ForgotPassword() {

  const [email, setEmail] = useState('');

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError('');
    setSuccess('');

    if (!email) {

      setError('Digite seu email');

      return;
    }

    try {

      await axios.post(
        'http://localhost:3000/auth/forgot-password',
        { email }
      );

      setSuccess(
        'Email de recuperação enviado com sucesso!'
      );

    } catch (error) {

      setError('Erro ao enviar email');

    }

  }

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">

            <Brain className="w-8 h-8 text-white" />

          </div>

          <h1 className="text-3xl font-bold mb-2">
            Recuperar senha
          </h1>

          <p className="text-gray-500">
            Informe seu email para receber o link de recuperação
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

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div className="relative">

              <Mail className="absolute left-3 top-11 w-5 h-5 text-gray-400" />

              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                className="pl-11"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <Button type="submit">
              Enviar email
            </Button>

          </form>

          <div className="mt-6 text-center">

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >

              <ArrowLeft className="w-4 h-4" />

              Voltar para login

            </Link>

          </div>

        </div>

      </div>

    </div>

  );

}