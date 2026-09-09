import React, { useState, useCallback } from 'react';
import { supabase } from './supabaseClient';

const AZUL = '#1B6FAB';
const VERDE = '#6BBF4E';
const FUNDO = '#F0F4F8';
const BORDA = '#D4E6F1';

const styles = {
  page: {
    minHeight: '100vh',
    background: FUNDO,
    fontFamily: "'Poppins', sans-serif",
    padding: '24px 16px',
  },
  header: {
    maxWidth: '640px',
    margin: '0 auto 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: AZUL,
    borderBottom: `4px solid ${VERDE}`,
    borderRadius: '10px',
    padding: '16px 22px',
  },
  logoText: { color: '#fff', fontWeight: 800, fontSize: '20px' },
  logoSub: { color: 'rgba(255,255,255,0.85)', fontSize: '12px' },
  card: {
    maxWidth: '640px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '12px',
    border: `1px solid ${BORDA}`,
    padding: '28px 26px',
    boxShadow: '0 2px 10px rgba(27,111,171,0.08)',
  },
  titulo: { fontSize: '19px', fontWeight: 800, color: AZUL, marginBottom: '4px' },
  subtitulo: { fontSize: '13px', color: '#5b6b7a', marginBottom: '18px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: '#33404a', margin: '16px 0 6px' },
  input: {
    width: '100%',
    padding: '11px 13px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1.5px solid ${BORDA}`,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '11px 13px',
    fontSize: '14px',
    borderRadius: '8px',
    border: `1.5px solid ${BORDA}`,
    outline: 'none',
    fontFamily: "'Poppins', sans-serif",
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  radioGroup: { display: 'flex', flexWrap: 'wrap', gap: '10px' },
  radioOpt: (sel) => ({
    padding: '9px 16px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? VERDE : BORDA}`,
    background: sel ? '#f0faf0' : '#fff',
    fontSize: '13px',
    color: sel ? '#256b1f' : '#33404a',
    cursor: 'pointer',
    fontWeight: sel ? 700 : 500,
  }),
  botao: {
    width: '100%',
    marginTop: '24px',
    padding: '13px',
    background: AZUL,
    color: '#fff',
    fontWeight: 700,
    fontSize: '14px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  botaoSec: {
    width: '100%',
    marginTop: '10px',
    padding: '13px',
    background: '#fff',
    color: AZUL,
    fontWeight: 700,
    fontSize: '14px',
    border: `1.5px solid ${AZUL}`,
    borderRadius: '8px',
    cursor: 'pointer',
  },
  nav: { display: 'flex', gap: '10px', marginTop: '22px' },
  erro: {
    background: '#fff3f3',
    border: '1px solid #f5c2c2',
    color: '#c0392b',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    marginTop: '14px',
  },
  lgpd: {
    background: FUNDO,
    border: `1px solid ${BORDA}`,
    borderRadius: '8px',
    padding: '16px 18px',
    fontSize: '12.5px',
    color: '#4a5a68',
    lineHeight: 1.7,
    marginTop: '14px',
  },
  checkLgpd: (sel) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '13px 15px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? VERDE : BORDA}`,
    background: sel ? '#f0faf0' : '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#374151',
    marginTop: '18px',
  }),
  progWrap: { display: 'flex', gap: '5px', maxWidth: '640px', margin: '0 auto 14px' },
  progBar: (state) => ({
    flex: 1,
    height: '5px',
    borderRadius: '4px',
    background: state === 'done' ? VERDE : state === 'atual' ? AZUL : BORDA,
  }),
  gridInfo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '10px',
    margin: '18px 0 22px',
  },
  infoCard: {
    background: FUNDO,
    border: `1px solid ${BORDA}`,
    borderRadius: '10px',
    padding: '14px 12px',
    textAlign: 'center',
  },
  infoIcon: { fontSize: '20px', marginBottom: '4px' },
  infoLabel: { fontSize: '11px', color: '#6b7a88', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' },
  infoValor: { fontSize: '13px', color: '#1a2733', fontWeight: 700, marginTop: '2px' },
  secaoTitulo: {
    fontSize: '12px',
    fontWeight: 800,
    color: AZUL,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginTop: '20px',
    marginBottom: '8px',
  },
  listaItem: { display: 'flex', gap: '8px', fontSize: '13.5px', color: '#3d4a56', padding: '4px 0', lineHeight: 1.5 },
  checkIcon: { color: VERDE, fontWeight: 800 },
  botaoCandidatar: {
    width: '100%',
    marginTop: '22px',
    padding: '14px',
    background: AZUL,
    color: '#fff',
    fontWeight: 700,
    fontSize: '14.5px',
    border: 'none',
    borderRadius: '9px',
    cursor: 'pointer',
  },
};

const ETAPAS = [
  { id: 'lgpd', titulo: '', sub: '' },
  { id: 'dados', titulo: 'Dados Pessoais', sub: 'Preencha seus dados de identificação e contato.' },
  { id: 'situacao', titulo: 'Situação Profissional Atual', sub: 'Conte sua situação atual e disponibilidade.' },
  { id: 'formacao', titulo: 'Formação e Experiência', sub: 'Sua trajetória em vendas, operações ou supervisão.' },
  { id: 'comercial', titulo: 'Perfil Comercial', sub: 'Como você atua na prospecção e negociação com clientes.' },
  { id: 'gestao', titulo: 'Gestão, Indicadores e Liderança', sub: 'Sua relação com metas, indicadores e articulação de equipe.' },
  { id: 'motivacao', titulo: 'Perfil e Motivação', sub: 'O que te move e o que espera desta oportunidade.' },
  { id: 'localizacao', titulo: 'Localização e Disponibilidade', sub: 'Informações essenciais para a logística da regional.' },
  { id: 'fim', titulo: '', sub: '' },
];

const inicial = {
  // Dados Pessoais
  nome: '', cpf: '', email: '', telefone: '', cidade_atual: '', estado_atual: '',
  com_quem_mora: '', vaga_cidade: '',
  // Situação Profissional
  situacao_profissional: '', empresa_atual: '', cargo_atual: '', disponibilidade_inicio: '',
  // Formação e Experiência
  formacao: '', experiencia_comercial: '', experiencia_supervisao: '',
  possui_veiculo: '', tipo_veiculo: '',
  // Perfil Comercial
  proatividade_autonomia: '', energia_persistencia: '', comunicacao_negociacao: '',
  // Gestão, Indicadores e Liderança
  organizacao_acompanhamento: '', visao_analitica: '', lideranca_articulacao: '',
  responsabilidade_resultados: '', equilibrio_emocional: '',
  // Perfil e Motivação
  motivacao_vaga: '', contribuicao: '', pretensao_salarial: '',
  // Localização e Disponibilidade
  reside_na_capital: '', disponibilidade_mudanca: '', disponibilidade_viagens: '',
  // LGPD
  lgpd_aceite: false,
};

// ---------- Campos definidos FORA do componente para evitar perda de foco ----------

const CampoTexto = React.memo(function CampoTexto({ label, valor, campo, onChange, placeholder, tipo = 'text' }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <input
        style={styles.input}
        type={tipo}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(campo, e.target.value)}
      />
    </>
  );
});

const CampoTextArea = React.memo(function CampoTextArea({ label, valor, campo, onChange, placeholder, linhas = 3 }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <textarea
        style={styles.textarea}
        rows={linhas}
        value={valor}
        placeholder={placeholder}
        onChange={(e) => onChange(campo, e.target.value)}
      />
    </>
  );
});

const CampoRadio = React.memo(function CampoRadio({ label, valor, campo, onChange, opcoes }) {
  return (
    <>
      <label style={styles.label}>{label} *</label>
      <div style={styles.radioGroup}>
        {opcoes.map((op) => (
          <div
            key={op}
            style={styles.radioOpt(valor === op)}
            onClick={() => onChange(campo, op)}
          >
            {op}
          </div>
        ))}
      </div>
    </>
  );
});

export default function QuestionarioSupervisorRegional() {
  const [tela, setTela] = useState('vaga');
  const [lgpdAceite, setLgpdAceite] = useState(false);
  const [lgpdErro, setLgpdErro] = useState(false);
  const [etapa, setEtapa] = useState(1);
  const [form, setForm] = useState(inicial);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const set = useCallback((campo, valor) => {
    setForm((f) => ({ ...f, [campo]: valor }));
  }, []);

  const validar = useCallback(() => {
    if (etapa === 1) {
      if (!form.nome.trim()) return 'Informe o nome completo.';
      if (!form.cpf.trim()) return 'Informe o CPF.';
      if (!form.email.trim()) return 'Informe o e-mail.';
      if (!form.telefone.trim()) return 'Informe o telefone.';
      if (!form.cidade_atual.trim()) return 'Informe a cidade onde reside atualmente.';
      if (!form.estado_atual.trim()) return 'Informe o estado onde reside atualmente.';
      if (!form.com_quem_mora) return 'Informe com quem mora atualmente.';
      if (!form.vaga_cidade) return 'Selecione para qual cidade deseja concorrer à vaga.';
    }
    if (etapa === 2) {
      if (!form.situacao_profissional) return 'Informe a situação profissional atual.';
      if (!form.empresa_atual.trim()) return 'Informe a empresa atual ou a mais recente.';
      if (!form.cargo_atual.trim()) return 'Informe o cargo atual ou o mais recente.';
      if (!form.disponibilidade_inicio) return 'Informe a disponibilidade para início.';
    }
    if (etapa === 3) {
      if (!form.formacao.trim()) return 'Informe sua formação.';
      if (!form.experiencia_comercial.trim()) return 'Descreva sua experiência comercial.';
      if (!form.experiencia_supervisao.trim()) return 'Descreva sua experiência com supervisão ou gestão de equipe.';
      if (!form.possui_veiculo) return 'Informe se possui veículo próprio.';
      if (form.possui_veiculo === 'Sim' && !form.tipo_veiculo) return 'Informe o tipo de veículo.';
    }
    if (etapa === 4) {
      if (!form.proatividade_autonomia.trim()) return 'Descreva um exemplo de proatividade e autonomia.';
      if (!form.energia_persistencia.trim()) return 'Descreva como lida com rejeições em negociações.';
      if (!form.comunicacao_negociacao.trim()) return 'Descreva sua experiência em negociação com clientes.';
    }
    if (etapa === 5) {
      if (!form.organizacao_acompanhamento.trim()) return 'Descreva como organiza sua agenda e acompanhamento de pendências.';
      if (!form.visao_analitica.trim()) return 'Descreva como usa indicadores para antecipar problemas.';
      if (!form.lideranca_articulacao.trim()) return 'Descreva sua experiência articulando prioridades com uma equipe de suporte.';
      if (!form.responsabilidade_resultados.trim()) return 'Descreva como age diante de um desvio de meta.';
      if (!form.equilibrio_emocional.trim()) return 'Descreva como mantém a postura profissional sob pressão.';
    }
    if (etapa === 6) {
      if (!form.motivacao_vaga.trim()) return 'Informe o que te motivou a se candidatar.';
      if (!form.contribuicao.trim()) return 'Descreva como pode contribuir para o crescimento da regional.';
      if (!form.pretensao_salarial.trim()) return 'Informe a pretensão salarial.';
    }
    if (etapa === 7) {
      if (!form.reside_na_capital) return 'Informe se reside na capital da vaga selecionada.';
      if (form.reside_na_capital === 'Não' && !form.disponibilidade_mudanca) return 'Informe a disponibilidade de mudança.';
      if (!form.disponibilidade_viagens) return 'Informe a disponibilidade para viagens.';
    }
    return '';
  }, [etapa, form]);

  const avancarLgpd = useCallback(() => {
    if (!lgpdAceite) { setLgpdErro(true); return; }
    setForm((f) => ({ ...f, lgpd_aceite: true }));
    setTela('form');
    window.scrollTo(0, 0);
  }, [lgpdAceite]);

  const avancar = useCallback(() => {
    const msg = validar();
    if (msg) { setErro(msg); return; }
    setErro('');
    if (etapa < ETAPAS.length - 2) {
      setEtapa((e) => e + 1);
      window.scrollTo(0, 0);
    } else {
      enviar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapa, validar]);

  const voltar = useCallback(() => {
    if (etapa > 1) { setEtapa((e) => e - 1); window.scrollTo(0, 0); }
  }, [etapa]);

  const enviar = useCallback(async () => {
    setEnviando(true);
    setErro('');
    try {
      const { error } = await supabase.from('candidatos_supervisor_regional').insert([{ ...form }]);
      if (error) throw error;
      setTela('fim');
      window.scrollTo(0, 0);
    } catch (e) {
      setErro('Ocorreu um erro ao enviar. Tente novamente em instantes.');
    } finally {
      setEnviando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const progresso = () => {
    const total = ETAPAS.length - 2;
    const atualIdx = etapa - 1;
    return (
      <div style={styles.progWrap}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={styles.progBar(i < atualIdx ? 'done' : i === atualIdx ? 'atual' : 'pendente')} />
        ))}
      </div>
    );
  };

  const Cabecalho = () => (
    <div style={styles.header}>
      <div>
        <div style={styles.logoText}>genthe</div>
        <div style={styles.logoSub}>que entende de gente</div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', textAlign: 'right' }}>
        Processo Seletivo<br />
        <strong style={{ color: '#fff' }}>Supervisor Regional | Help Entregas</strong>
      </div>
    </div>
  );

  const Rodape = () => (
    <div style={{ textAlign: 'center', marginTop: '26px', fontSize: '12px', color: '#8a97a3' }}>
      contato@genthe.com.br &nbsp;|&nbsp; www.genthe.com.br &nbsp;|&nbsp; @gentheconsultoria
    </div>
  );

  // ---------- Tela da Vaga ----------
  if (tela === 'vaga') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, maxWidth: '640px' }}>
          <div style={styles.titulo}>Supervisor Regional de Operações e Expansão Comercial</div>
          <div style={styles.subtitulo}>Logística / Delivery · Cuiabá/MT e Belo Horizonte/MG</div>

          <div style={styles.gridInfo}>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>💰</div>
              <div style={styles.infoLabel}>Remuneração</div>
              <div style={styles.infoValor}>Fixo R$ 6.000,00 + variável</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>🕗</div>
              <div style={styles.infoLabel}>Horário</div>
              <div style={styles.infoValor}>Seg a Sáb · Comercial</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📍</div>
              <div style={styles.infoLabel}>Modalidade</div>
              <div style={styles.infoValor}>Home office + campo</div>
            </div>
            <div style={styles.infoCard}>
              <div style={styles.infoIcon}>📄</div>
              <div style={styles.infoLabel}>Contratação</div>
              <div style={styles.infoValor}>PJ</div>
            </div>
          </div>

          <div style={styles.secaoTitulo}>🎁 Estrutura Oferecida</div>
          <div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Notebook, tablet e número corporativo</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Ajuda de custo de combustível mensal</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Cartão corporativo para despesas de deslocamento</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Despesas fora da capital custeadas pela empresa</div>
          </div>

          <div style={styles.secaoTitulo}>📚 Requisitos</div>
          <div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Vivência em vendas, gestão comercial ou supervisão de operações</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Conhecimento em gestão de indicadores e acompanhamento de metas</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Disponibilidade total para atuação no estado</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Veículo próprio, carro ou moto</div>
            <div style={styles.listaItem}><span style={styles.checkIcon}>✓</span> Disponibilidade para viagens</div>
          </div>

          <button style={styles.botaoCandidatar} onClick={() => { setTela('lgpd'); window.scrollTo(0, 0); }}>
            Candidate-se agora →
          </button>
        </div>
        <Rodape />
      </div>
    );
  }

  // ---------- Tela LGPD ----------
  if (tela === 'lgpd') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, maxWidth: '640px' }}>
          <div style={{ fontSize: '30px', marginBottom: '10px' }}>🔒</div>
          <div style={styles.titulo}>Proteção de Dados — LGPD</div>
          <div style={styles.lgpd}>
            As informações fornecidas neste questionário serão utilizadas exclusivamente para fins de recrutamento e seleção pela <strong>Genthe Consultoria em Gestão de Pessoas</strong>, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>.<br /><br />
            Seus dados serão tratados com segurança, sigilo e responsabilidade, podendo ser compartilhados com a empresa contratante vinculada a este processo seletivo. Ao prosseguir, você também autoriza a realização de verificação de antecedentes junto a órgãos públicos, utilizando CPF e nome completo, como parte da etapa de triagem.<br /><br />
            Você poderá solicitar a correção, a atualização ou a exclusão dos seus dados a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>. Ao continuar, você declara ter lido e concordado com o tratamento dos seus dados pessoais para participação neste processo seletivo, nos termos da LGPD.
          </div>
          <div style={styles.checkLgpd(lgpdAceite)} onClick={() => { setLgpdAceite((v) => !v); setLgpdErro(false); }}>
            <span style={{ fontSize: '16px' }}>{lgpdAceite ? '✅' : '⬜'}</span>
            Li e concordo com o tratamento dos meus dados pessoais, incluindo a verificação de antecedentes, para participação neste processo seletivo, conforme a LGPD.
          </div>
          {lgpdErro && <div style={styles.erro}>É necessário concordar com os termos para continuar.</div>}
          <button style={styles.botao} onClick={avancarLgpd}>Iniciar questionário →</button>
        </div>
        <Rodape />
      </div>
    );
  }

  // ---------- Tela final ----------
  if (tela === 'fim') {
    return (
      <div style={styles.page}>
        <Cabecalho />
        <div style={{ ...styles.card, textAlign: 'center' }}>
          <div style={{ fontSize: '38px', marginBottom: '10px' }}>✅</div>
          <div style={styles.titulo}>Questionário enviado com sucesso!</div>
          <div style={{ fontSize: '13px', color: '#5b6b7a', marginTop: '8px' }}>
            Obrigada pela sua participação no processo seletivo. Nossa equipe analisará suas respostas e entrará em contato em breve.
          </div>
        </div>
        <Rodape />
      </div>
    );
  }

  const e = ETAPAS[etapa];

  return (
    <div style={styles.page}>
      <Cabecalho />
      {progresso()}
      <div style={styles.card}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: VERDE, letterSpacing: '0.5px' }}>
          ETAPA {etapa} DE {ETAPAS.length - 2}
        </div>
        <div style={styles.titulo}>{e.titulo}</div>
        <div style={styles.subtitulo}>{e.sub}</div>

        {e.id === 'dados' && (
          <>
            <CampoTexto label="Nome completo" campo="nome" valor={form.nome} onChange={set} placeholder="Seu nome completo" />
            <CampoTexto label="CPF" campo="cpf" valor={form.cpf} onChange={set} placeholder="000.000.000-00" />
            <CampoTexto label="E-mail" campo="email" valor={form.email} onChange={set} placeholder="seuemail@exemplo.com" tipo="email" />
            <CampoTexto label="Telefone" campo="telefone" valor={form.telefone} onChange={set} placeholder="(00) 00000-0000" />
            <CampoTexto label="Cidade onde reside atualmente" campo="cidade_atual" valor={form.cidade_atual} onChange={set} placeholder="Sua cidade" />
            <CampoTexto label="Estado onde reside atualmente" campo="estado_atual" valor={form.estado_atual} onChange={set} placeholder="Sua UF" />
            <CampoRadio
              label="Com quem mora atualmente"
              campo="com_quem_mora"
              valor={form.com_quem_mora}
              onChange={set}
              opcoes={['Sozinho(a)', 'Cônjuge/Companheiro(a)', 'Pais ou responsáveis', 'Outros familiares', 'Outros']}
            />
            <CampoRadio
              label="Para qual cidade deseja concorrer à vaga"
              campo="vaga_cidade"
              valor={form.vaga_cidade}
              onChange={set}
              opcoes={['Cuiabá/MT', 'Belo Horizonte/MG']}
            />
          </>
        )}

        {e.id === 'situacao' && (
          <>
            <CampoRadio
              label="Situação profissional atual"
              campo="situacao_profissional"
              valor={form.situacao_profissional}
              onChange={set}
              opcoes={['Empregado(a)', 'Prestando serviços como PJ', 'Disponível no mercado']}
            />
            <CampoTexto label="Empresa atual ou mais recente" campo="empresa_atual" valor={form.empresa_atual} onChange={set} placeholder="Nome da empresa" />
            <CampoTexto label="Cargo atual ou mais recente" campo="cargo_atual" valor={form.cargo_atual} onChange={set} placeholder="Seu cargo" />
            <CampoRadio
              label="Disponibilidade para início"
              campo="disponibilidade_inicio"
              valor={form.disponibilidade_inicio}
              onChange={set}
              opcoes={['Imediata', 'Até 15 dias', 'Até 30 dias', 'Acima de 30 dias']}
            />
          </>
        )}

        {e.id === 'formacao' && (
          <>
            <CampoTexto label="Formação" campo="formacao" valor={form.formacao} onChange={set} placeholder="Curso e nível de escolaridade" />
            <CampoTextArea
              label="Experiência em vendas, prospecção ou expansão comercial"
              campo="experiencia_comercial"
              valor={form.experiencia_comercial}
              onChange={set}
              placeholder="Descreva sua trajetória comercial, segmentos e principais resultados"
            />
            <CampoTextArea
              label="Experiência em supervisão, coordenação ou gestão de equipe"
              campo="experiencia_supervisao"
              valor={form.experiencia_supervisao}
              onChange={set}
              placeholder="Descreva sua experiência liderando ou articulando equipes"
            />
            <CampoRadio
              label="Possui veículo próprio"
              campo="possui_veiculo"
              valor={form.possui_veiculo}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
            {form.possui_veiculo === 'Sim' && (
              <CampoRadio
                label="Tipo de veículo"
                campo="tipo_veiculo"
                valor={form.tipo_veiculo}
                onChange={set}
                opcoes={['Carro', 'Moto', 'Carro e moto']}
              />
            )}
          </>
        )}

        {e.id === 'comercial' && (
          <>
            <CampoTextArea
              label="Descreva uma situação em que você identificou uma oportunidade e agiu por conta própria, sem esperar cobrança"
              campo="proatividade_autonomia"
              valor={form.proatividade_autonomia}
              onChange={set}
              placeholder="Conte o contexto, a ação e o resultado"
            />
            <CampoTextArea
              label="Como você lida com rejeições durante a prospecção ou negociação, sem desistir da oportunidade nem insistir de forma inadequada"
              campo="energia_persistencia"
              valor={form.energia_persistencia}
              onChange={set}
              placeholder="Descreva sua abordagem"
            />
            <CampoTextArea
              label="Descreva uma negociação em que precisou alinhar expectativas com o cliente sem prometer o que não poderia entregar"
              campo="comunicacao_negociacao"
              valor={form.comunicacao_negociacao}
              onChange={set}
              placeholder="Conte a situação e como conduziu a conversa"
            />
          </>
        )}

        {e.id === 'gestao' && (
          <>
            <CampoTextArea
              label="Como você organiza sua agenda, funil comercial e acompanhamento de pendências"
              campo="organizacao_acompanhamento"
              valor={form.organizacao_acompanhamento}
              onChange={set}
              placeholder="Descreva seu método de organização"
            />
            <CampoTextArea
              label="Como você usa indicadores para antecipar problemas, em vez de agir apenas depois das reclamações"
              campo="visao_analitica"
              valor={form.visao_analitica}
              onChange={set}
              placeholder="Dê um exemplo prático"
            />
            <CampoTextArea
              label="Descreva uma situação em que precisou alinhar prioridades e prazos com uma equipe de suporte, sem assumir as rotinas operacionais dela"
              campo="lideranca_articulacao"
              valor={form.lideranca_articulacao}
              onChange={set}
              placeholder="Conte o contexto e como conduziu"
            />
            <CampoTextArea
              label="Diante de um resultado abaixo da meta, como você identifica a causa e conduz a correção"
              campo="responsabilidade_resultados"
              valor={form.responsabilidade_resultados}
              onChange={set}
              placeholder="Descreva um exemplo real"
            />
            <CampoTextArea
              label="A rotina exige acompanhar indicadores, manter contato constante com os entregadores terceirizados e ainda fazer a ponte com o cliente. Como você lida com a pressão de conduzir essas frentes ao mesmo tempo, sem perder o foco"
              campo="equilibrio_emocional"
              valor={form.equilibrio_emocional}
              onChange={set}
              placeholder="Descreva como organiza prioridades e mantém a postura profissional diante dessa pressão"
            />
          </>
        )}

        {e.id === 'motivacao' && (
          <>
            <CampoTextArea
              label="O que te motivou a se candidatar a esta vaga"
              campo="motivacao_vaga"
              valor={form.motivacao_vaga}
              onChange={set}
              placeholder="Seja objetivo"
            />
            <CampoTextArea
              label="De que forma você pode contribuir para o crescimento da regional"
              campo="contribuicao"
              valor={form.contribuicao}
              onChange={set}
              placeholder="Descreva sua contribuição esperada"
            />
            <CampoTexto label="Pretensão salarial" campo="pretensao_salarial" valor={form.pretensao_salarial} onChange={set} placeholder="R$ 0,00" />
          </>
        )}

        {e.id === 'localizacao' && (
          <>
            <div style={styles.lgpd}>
              Esta vaga exige acompanhamento presencial das unidades atendidas no estado. Residir na capital selecionada facilita a logística de deslocamento e a proximidade com o suporte operacional.
            </div>
            <CampoRadio
              label={`Você reside atualmente em ${form.vaga_cidade || 'Cuiabá/MT ou Belo Horizonte/MG'}`}
              campo="reside_na_capital"
              valor={form.reside_na_capital}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
            {form.reside_na_capital === 'Não' && (
              <CampoRadio
                label="Você tem disponibilidade de mudança para Cuiabá/MT ou Belo Horizonte/MG"
                campo="disponibilidade_mudanca"
                valor={form.disponibilidade_mudanca}
                onChange={set}
                opcoes={['Sim', 'Não']}
              />
            )}
            <CampoRadio
              label="Você tem disponibilidade para viagens dentro do estado"
              campo="disponibilidade_viagens"
              valor={form.disponibilidade_viagens}
              onChange={set}
              opcoes={['Sim', 'Não']}
            />
          </>
        )}

        {erro && <div style={styles.erro}>{erro}</div>}

        <div style={styles.nav}>
          {etapa > 1 && <button style={styles.botaoSec} onClick={voltar}>← Voltar</button>}
          <button style={styles.botao} onClick={avancar} disabled={enviando}>
            {etapa === ETAPAS.length - 2 ? (enviando ? 'Enviando...' : '✅ Enviar questionário') : 'Continuar →'}
          </button>
        </div>
      </div>
      <Rodape />
    </div>
  );
}
