import React from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar'; // ou o caminho que vc usou
import Header from '@/components/layout/Header/Header';    // ou o caminho que vc usou

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-body)' }}>
      
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <Header />

        <main style={{ flex: 1 }}>
          {children}
        </main>

        <footer style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', borderTop: '1px solid #e2e8f0' }}>
          © 2026 Paróquia São Miguel Arcanjo. Todos os direitos reservados.
        </footer>

      </div>
    </div>
  );
}