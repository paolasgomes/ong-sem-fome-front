import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

export function LoginPage() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate();

const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate('/dashboard');
};

//Logo styles
const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    backgroundColor: '#f97316',
    borderRadius: '0.5rem', 
    margin: '0 auto 1.5rem', 
};

const logoIconStyle = {
    width: '24px',
    height: '24px',
    color: 'white',
};

const buttonStyle = {
    width: '100%',
    backgroundColor: '#f97316',
    color: 'white',
    fontWeight: 'bold',
    padding: '0.75rem 1rem', 
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
};

return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
    <div style={{ maxWidth: '28rem', width: '100%', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}>
        
        <div style={logoContainerStyle}>
        <Heart style={logoIconStyle} />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>Acesse sua conta</h2>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Bem-vindo(a) de volta!</p>
        </div>

        <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Email
            </label>
            <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            required
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
            />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
            Senha
            </label>
            <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
            />
        </div>

        <div>
            <button
            type="submit"
            style={buttonStyle}
            >
            Entrar
            </button>
        </div>
        </form>
    </div>
    </div>
);
}