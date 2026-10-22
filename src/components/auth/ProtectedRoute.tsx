import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Verifica se o aluno está autenticado (você pode trocar pela validação real do Firebase futuramente)
  const isAlunoAutenticado = localStorage.getItem('alunoLogado') === 'true';

  if (!isAlunoAutenticado) {
    return <Navigate to="/aluno/login" replace />;
  }

  return <>{children}</>;
}