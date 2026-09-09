create table candidatos_supervisor_regional (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamp with time zone default now(),

  -- Dados Pessoais
  nome text not null,
  cpf text not null,
  email text not null,
  telefone text not null,
  cidade_atual text not null,
  estado_atual text not null,
  vaga_cidade text not null,

  -- Situação Profissional
  situacao_profissional text not null,
  empresa_atual text not null,
  cargo_atual text not null,
  disponibilidade_inicio text not null,

  -- Formação e Experiência
  formacao text not null,
  experiencia_comercial text not null,
  experiencia_supervisao text not null,
  possui_veiculo text not null,
  tipo_veiculo text,

  -- Perfil Comercial
  proatividade_autonomia text not null,
  energia_persistencia text not null,
  comunicacao_negociacao text not null,

  -- Gestão, Indicadores e Liderança
  organizacao_acompanhamento text not null,
  visao_analitica text not null,
  lideranca_articulacao text not null,
  responsabilidade_resultados text not null,
  equilibrio_emocional text not null,

  -- Perfil e Motivação
  motivacao_vaga text not null,
  contribuicao text not null,
  pretensao_salarial text not null,

  -- Localização e Disponibilidade
  reside_na_capital text not null,
  disponibilidade_mudanca text,
  disponibilidade_viagens text not null,

  -- LGPD
  lgpd_aceite boolean not null default false
);

alter table candidatos_supervisor_regional enable row level security;

create policy "Permitir insercao publica"
  on candidatos_supervisor_regional
  for insert
  to anon
  with check (true);
