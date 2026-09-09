import React from 'react';
import QuestionarioSupervisorRegional from './QuestionarioSupervisorRegional';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const rota = window.location.pathname;

  if (rota.startsWith('/admin')) {
    return <AdminPanel />;
  }

  return <QuestionarioSupervisorRegional />;
}
