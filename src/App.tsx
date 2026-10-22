import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { CheckoutPage } from './pages/CheckoutPage';
import { AlunoPage } from './pages/AlunoPage';
import { AlunoLogin } from './pages/AlunoLogin';
import { ProtectedRoute } from './components/ProtectedRoute'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Home />} />
        
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Rota de Login do Aluno */}
  <Route path="/aluno/login" element={<AlunoLogin />} />

  {/* Rota Segura da Área do Aluno */}
  <Route 
    path="/aluno/estante" 
    element={
      <ProtectedRoute>
        <AlunoPage />
      </ProtectedRoute>
    } 
  />
        
        {/* Rota Privada (O Painel da Vitória) - Agora está blindada! */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota de fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;