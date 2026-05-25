import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  Brain,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  Sparkles,
} from 'lucide-react';

import { register } from '../services/authServices';

export function SignupPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    grade: '',
    interests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password =
        'A senha deve ter no mínimo 8 caracteres';
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
    ) {
      newErrors.password =
        'A senha deve conter letras maiúsculas, minúsculas e números';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        'As senhas não coincidem';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (validateStep1()) {
      setStep(2);
    }
  };

const handleStep2Submit = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  try {

    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      age: Number(formData.age),
      grade: formData.grade,
      interests: formData.interests,
    });

    navigate('/');

  } catch (error: any) {

    setErrors({
      api:
        error.message ||
        'Erro ao criar conta',
    });

  }

};



  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>

            <h1 className="text-3xl font-bold mb-2">
              Bem-vindo ao Hive Mind
            </h1>

            <p className="text-muted-foreground">
              Crie sua conta e descubra seu
              caminho profissional
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-primary rounded-full"></div>

                <div className="flex-1 h-2 bg-muted rounded-full"></div>
              </div>

              <p className="text-xs text-muted-foreground mt-2 text-center">
                Etapa 1 de 2
              </p>
            </div>

            <form
              onSubmit={handleStep1Submit}
              className="space-y-5"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-11 w-5 h-5 text-muted-foreground" />

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
                  error={errors.email}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-11 w-5 h-5 text-muted-foreground" />

                <Input
                  label="Senha"
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Mínimo 8 caracteres"
                  className="pl-11 pr-11"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  error={errors.password}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-11 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-11 w-5 h-5 text-muted-foreground" />

                <Input
                  label="Confirmar Senha"
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Digite a senha novamente"
                  className="pl-11 pr-11"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword:
                        e.target.value,
                    })
                  }
                  error={
                    errors.confirmPassword
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-11 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
              >
                Continuar
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link
                  to="/"
                  className="text-primary hover:underline"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Ao criar uma conta, você concorda
            com nossos Termos de Uso e Política
            de Privacidade
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Vamos começar sua jornada!
          </h1>

          <p className="text-muted-foreground">
            Conte-nos um pouco sobre você para
            personalizarmos sua experiência
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-primary rounded-full"></div>

              <div className="flex-1 h-2 bg-primary rounded-full"></div>
            </div>

            <p className="text-xs text-muted-foreground mt-2 text-center">
              Etapa 2 de 2
            </p>
          </div>

          {errors.api && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
              {errors.api}
            </div>
          )}

          <form
            onSubmit={handleStep2Submit}
            className="space-y-6"
          >
            <div className="relative">
              <User className="absolute left-3 top-11 w-5 h-5 text-muted-foreground" />

              <Input
                label="Nome completo"
                type="text"
                placeholder="Como você gostaria de ser chamado?"
                className="pl-11"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-11 w-5 h-5 text-muted-foreground" />

                <Input
                  label="Idade"
                  type="number"
                  placeholder="15"
                  className="pl-11"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      age: e.target.value,
                    })
                  }
                  required
                  min="13"
                  max="25"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-foreground">
                  Ano escolar
                </label>

                <select
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  value={formData.grade}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      grade: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">
                    Selecione
                  </option>

                  <option value="1em">
                    1º Ano - Ensino Médio
                  </option>

                  <option value="2em">
                    2º Ano - Ensino Médio
                  </option>

                  <option value="3em">
                    3º Ano - Ensino Médio
                  </option>

                  <option value="graduacao">
                    Graduação
                  </option>

                  <option value="outro">
                    Outro
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-foreground">
                Interesses atuais

                <span className="text-muted-foreground ml-1">
                  (opcional)
                </span>
              </label>

              <textarea
                className="w-full px-4 py-3 bg-input-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="Ex: Matemática, tecnologia, música, biologia, esportes..."
                value={formData.interests}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interests:
                      e.target.value,
                  })
                }
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Essas informações ajudarão
                nossa IA a fornecer
                recomendações mais precisas
              </p>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
              >
                Criar conta
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />

            <div className="text-sm">
              <p className="text-muted-foreground">
                Para entender como protegemos e
                por que coletamos seus dados,
                acesse nossa{' '}
                <a
                  href="#"
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  Política de Privacidade
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}