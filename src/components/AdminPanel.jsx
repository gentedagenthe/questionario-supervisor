import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AZUL = '#1B6FAB';
const VERDE = '#6BBF4E';
const FUNDO = '#F0F4F8';
const BORDA = '#D4E6F1';

const styles = {
  page: { minHeight: '100vh', background: FUNDO, fontFamily: "'Poppins', sans-serif", padding: '24px 16px' },
  loginWrap: {
    maxWidth: '380px', margin: '90px auto', background: '#fff', borderRadius: '14px',
    padding: '38px 30px', boxShadow: '0 2px 20px rgba(27,111,171,0.1)', textAlign: 'center',
  },
  logo: { fontWeight: 800, fontSize: '22px', color: AZUL },
  sub: { fontSize: '12px', color: '#8a97a3', letterSpacing: '1px', marginBottom: '22px', textTransform: 'uppercase' },
  input: { width: '100%', padding: '12px 14px', border: `1.5px solid ${BORDA}`, borderRadius: '8px', fontSize: '14px', marginBottom: '10px', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box' },
  botao: { width: '100%', padding: '12px', background: AZUL, color: '#fff', fontWeight: 700, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  erro: { color: '#c0392b', fontSize: '12.5px', marginBottom: '10px' },
  header: { maxWidth: '1100px', margin: '0 auto 20px', background: AZUL, borderRadius: '10px', padding: '18px 24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  filtros: { maxWidth: '1100px', margin: '0 auto 16px', display: 'flex', gap: '10px', flexWrap: 'wrap' },
  filtroInput: { flex: '1 1 220px', padding: '10px 13px', border: `1.5px solid ${BORDA}`, borderRadius: '8px', fontSize: '13px', fontFamily: "'Poppins', sans-serif" },
  lista: { maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' },
  linha: { background: '#fff', border: `1px solid ${BORDA}`, borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', cursor: 'pointer' },
  nome: { fontWeight: 700, color: '#1a2733', fontSize: '14px' },
  detalhe: { fontSize: '12.5px', color: '#6b7a88' },
  badge: { background: FUNDO, border: `1px solid ${BORDA}`, borderRadius: '6px', padding: '4px 10px', fontSize: '11.5px', color: AZUL, fontWeight: 600 },
  botaoWpp: { background: VERDE, color: '#fff', border: 'none', borderRadius: '7px', padding: '8px 14px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' },
  modalFundo: { position: 'fixed', inset: 0, background: 'rgba(20,30,40,0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 16px', overflowY: 'auto', zIndex: 50 },
  modal: { background: '#fff', borderRadius: '12px', maxWidth: '680px', width: '100%', padding: '26px 28px' },
  campoLabel: { fontSize: '11.5px', fontWeight: 700, color: '#8a97a3', textTransform: 'uppercase', marginTop: '14px' },
  campoValor: { fontSize: '13.5px', color: '#1a2733', marginTop: '3px', lineHeight: 1.5 },
  fechar: { float: 'right', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#8a97a3' },
};

const Campo = ({ label, valor }) => (
  <>
    <div style={styles.campoLabel}>{label}</div>
    <div style={styles.campoValor}>{valor || '—'}</div>
  </>
);

const fmtData = (d) => (d ? new Date(d).toLocaleString('pt-BR') : '—');

export default function AdminPanel() {
  const [autenticado, setAutenticado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState('');
  const [filtroCidade, setFiltroCidade] = useState('');
  const [selecionado, setSelecionado] = useState(null);

  const login = () => {
    if (senha === process.env.REACT_APP_ADMIN_PASSWORD) {
      setAutenticado(true);
      setErroLogin('');
    } else {
      setErroLogin('Senha incorreta.');
    }
  };

  useEffect(() => {
    if (!autenticado) return;
    const carregar = async () => {
      setCarregando(true);
      const { data } = await supabase
        .from('candidatos_supervisor_regional')
        .select('*')
        .order('criado_em', { ascending: false });
      if (data) setCandidatos(data);
      setCarregando(false);
    };
    carregar();
  }, [autenticado]);

  const filtrados = candidatos.filter((c) => {
    const texto = busca.toLowerCase();
    const nomeOk = !busca || (c.nome || '').toLowerCase().includes(texto) || (c.email || '').toLowerCase().includes(texto);
    const cidadeOk = !filtroCidade || c.vaga_cidade === filtroCidade;
    return nomeOk && cidadeOk;
  });

  const copiarWpp = (c) => {
    const txt = `*Genthe — Supervisor Regional (${c.vaga_cidade})*\n\n*Candidato(a):* ${c.nome}\n*CPF:* ${c.cpf}\n*E-mail:* ${c.email}\n*Telefone:* ${c.telefone}\n*Cidade atual:* ${c.cidade_atual}/${c.estado_atual}\n*Reside na capital da vaga:* ${c.reside_na_capital}\n*Disponibilidade de mudança:* ${c.disponibilidade_mudanca || '—'}\n*Possui veículo:* ${c.possui_veiculo} ${c.tipo_veiculo ? '(' + c.tipo_veiculo + ')' : ''}\n*Pretensão salarial:* ${c.pretensao_salarial}\n*Enviado em:* ${fmtData(c.criado_em)}`;
    navigator.clipboard.writeText(txt);
    alert('Copiado para a área de transferência!');
  };

  if (!autenticado) {
    return (
      <div style={styles.page}>
        <div style={styles.loginWrap}>
          <div style={styles.logo}>genthe</div>
          <div style={styles.sub}>painel administrativo</div>
          {erroLogin && <div style={styles.erro}>{erroLogin}</div>}
          <input
            style={styles.input}
            type="password"
            placeholder="Senha de acesso"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
          <button style={styles.botao} onClick={login}>Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '18px' }}>Supervisor Regional — Candidatos</div>
          <div style={{ fontSize: '12.5px', opacity: 0.85 }}>{candidatos.length} respostas recebidas</div>
        </div>
      </div>

      <div style={styles.filtros}>
        <input
          style={styles.filtroInput}
          placeholder="Buscar por nome ou e-mail"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <select style={styles.filtroInput} value={filtroCidade} onChange={(e) => setFiltroCidade(e.target.value)}>
          <option value="">Todas as cidades</option>
          <option value="Cuiabá/MT">Cuiabá/MT</option>
          <option value="Belo Horizonte/MG">Belo Horizonte/MG</option>
        </select>
      </div>

      <div style={styles.lista}>
        {carregando && <div style={styles.detalhe}>Carregando...</div>}
        {!carregando && filtrados.length === 0 && <div style={styles.detalhe}>Nenhum candidato encontrado.</div>}
        {filtrados.map((c) => (
          <div key={c.id} style={styles.linha} onClick={() => setSelecionado(c)}>
            <div>
              <div style={styles.nome}>{c.nome}</div>
              <div style={styles.detalhe}>{c.email} · {c.telefone}</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={styles.badge}>{c.vaga_cidade}</span>
              <span style={styles.detalhe}>{fmtData(c.criado_em)}</span>
              <button style={styles.botaoWpp} onClick={(e) => { e.stopPropagation(); copiarWpp(c); }}>Copiar WhatsApp</button>
            </div>
          </div>
        ))}
      </div>

      {selecionado && (
        <div style={styles.modalFundo} onClick={() => setSelecionado(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button style={styles.fechar} onClick={() => setSelecionado(null)}>×</button>
            <div style={{ fontWeight: 800, fontSize: '17px', color: AZUL }}>{selecionado.nome}</div>
            <div style={styles.detalhe}>Enviado em {fmtData(selecionado.criado_em)}</div>

            <Campo label="Vaga selecionada" valor={selecionado.vaga_cidade} />
            <Campo label="CPF" valor={selecionado.cpf} />
            <Campo label="E-mail" valor={selecionado.email} />
            <Campo label="Telefone" valor={selecionado.telefone} />
            <Campo label="Cidade / Estado atual" valor={`${selecionado.cidade_atual}/${selecionado.estado_atual}`} />
            <Campo label="Com quem mora atualmente" valor={selecionado.com_quem_mora} />

            <Campo label="Situação profissional" valor={selecionado.situacao_profissional} />
            <Campo label="Empresa atual" valor={selecionado.empresa_atual} />
            <Campo label="Cargo atual" valor={selecionado.cargo_atual} />
            <Campo label="Disponibilidade para início" valor={selecionado.disponibilidade_inicio} />

            <Campo label="Formação" valor={selecionado.formacao} />
            <Campo label="Experiência comercial" valor={selecionado.experiencia_comercial} />
            <Campo label="Experiência em supervisão" valor={selecionado.experiencia_supervisao} />
            <Campo label="Veículo" valor={`${selecionado.possui_veiculo}${selecionado.tipo_veiculo ? ' — ' + selecionado.tipo_veiculo : ''}`} />

            <Campo label="Proatividade e autonomia" valor={selecionado.proatividade_autonomia} />
            <Campo label="Energia comercial e persistência" valor={selecionado.energia_persistencia} />
            <Campo label="Comunicação e negociação" valor={selecionado.comunicacao_negociacao} />

            <Campo label="Organização e acompanhamento" valor={selecionado.organizacao_acompanhamento} />
            <Campo label="Visão analítica" valor={selecionado.visao_analitica} />
            <Campo label="Liderança e articulação com o suporte" valor={selecionado.lideranca_articulacao} />
            <Campo label="Responsabilidade pelos resultados" valor={selecionado.responsabilidade_resultados} />
            <Campo label="Lida com pressão (indicadores, terceiros e cliente)" valor={selecionado.equilibrio_emocional} />

            <Campo label="Motivação para a vaga" valor={selecionado.motivacao_vaga} />
            <Campo label="Contribuição esperada" valor={selecionado.contribuicao} />
            <Campo label="Pretensão salarial" valor={selecionado.pretensao_salarial} />

            <Campo label="Reside na capital da vaga" valor={selecionado.reside_na_capital} />
            <Campo label="Disponibilidade de mudança" valor={selecionado.disponibilidade_mudanca} />
            <Campo label="Disponibilidade para viagens" valor={selecionado.disponibilidade_viagens} />
          </div>
        </div>
      )}
    </div>
  );
}
