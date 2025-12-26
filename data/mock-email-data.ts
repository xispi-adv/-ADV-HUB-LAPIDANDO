import type { EmailFolder, Email, EmailAttachment } from '../types';
import React from 'react';

// Icons for Folders
// FIX: Converted icon components from JSX to React.createElement to be valid in a .ts file.
const InboxIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.12-1.588H6.88a2.25 2.25 0 00-2.12 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" })
  )
);
const SentIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" })
  )
);
const DraftsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" })
  )
);
const SpamIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" })
    )
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" })
  )
);


export const MOCK_FOLDERS: EmailFolder[] = [
    { id: 'inbox', name: 'Caixa de Entrada', unreadCount: 3, icon: InboxIcon },
    { id: 'sent', name: 'Enviados', unreadCount: 0, icon: SentIcon },
    { id: 'drafts', name: 'Rascunhos', unreadCount: 1, icon: DraftsIcon },
    { id: 'spam', name: 'Spam', unreadCount: 12, icon: SpamIcon },
    { id: 'trash', name: 'Lixeira', unreadCount: 0, icon: TrashIcon },
];

const generateDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
}

export const MOCK_EMAILS: Email[] = [
    {
        id: 'email-1',
        folderId: 'inbox',
        from: { name: 'Felipe S.', email: 'felipe.s@example.com', avatar: 'https://i.pravatar.cc/40?u=felipe' },
        to: [{ name: 'Eu', email: 'me@adverge.ads' }],
        subject: 'Relatório Semanal de Performance da Campanha',
        snippet: 'Olá, segue anexo o relatório de performance desta semana. Tivemos um aumento de 15% no CTR!',
        body: `
            <p>Olá Equipe,</p>
            <p>Segue anexo o relatório de performance consolidado para a campanha "Lançamento de Verão" referente à semana de 10/10 a 16/10.</p>
            <p><strong>Destaques da semana:</strong></p>
            <ul>
                <li>Aumento de <strong>15% no CTR</strong> em anúncios de display.</li>
                <li>Redução de 8% no Custo por Aquisição (CPA).</li>
                <li>O criativo "Praia-03" foi o de melhor performance.</li>
            </ul>
            <p>Por favor, revisem o documento e me enviem seus feedbacks até amanhã, EOD.</p>
            <p>Abraços,<br>Felipe S.</p>
        `,
        date: generateDate(0),
        isRead: false,
        attachments: [
            { id: 'att-1', filename: 'Relatorio_Semanal_Q3_S2.pdf', size: 1200000, type: 'application/pdf', url: '#' },
            { id: 'att-2', filename: 'Performance_Criativos.xlsx', size: 450000, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', url: '#' }
        ],
    },
    {
        id: 'email-2',
        folderId: 'inbox',
        from: { name: 'Plataforma de Design', email: 'noreply@design-platform.com' },
        to: [{ name: 'Eu', email: 'me@adverge.ads' }],
        subject: 'Seus novos designs estão prontos!',
        snippet: 'Os criativos para a campanha de mídia social foram concluídos. Acesse a plataforma para revisar e aprovar.',
        body: '<p>Olá! Os 5 criativos solicitados para a campanha de Instagram da "Empresa Y" estão prontos para sua avaliação. Clique no botão abaixo para acessar o painel de aprovação.</p><p><a href="#">Revisar Designs</a></p>',
        date: generateDate(1),
        isRead: false,
        attachments: [],
    },
    {
        id: 'email-3',
        folderId: 'inbox',
        from: { name: 'Ana Carolina', email: 'ana.carolina@cliente-z.com', avatar: 'https://i.pravatar.cc/40?u=ana' },
        to: [{ name: 'Eu', email: 'me@adverge.ads' }],
        subject: 'Re: Alinhamento de Estratégia para o Q4',
        snippet: 'Obrigada pelo plano! Tenho algumas dúvidas sobre o orçamento de mídia paga. Podemos marcar uma call rápida?',
        body: '<p>Obrigada pelo envio do plano estratégico para o Q4. Gostei muito da abordagem de conteúdo!</p><p>Tenho apenas algumas dúvidas sobre a alocação de orçamento para Google Ads e Meta Ads. Seria possível marcarmos uma call de 30 minutos amanhã para conversarmos sobre isso?</p><p>Fico no aguardo.</p><p>Atenciosamente,<br>Ana Carolina</p>',
        date: generateDate(1),
        isRead: false,
        attachments: [],
    },
    {
        id: 'email-4',
        folderId: 'inbox',
        from: { name: 'Google Calendar', email: 'calendar-notification@google.com' },
        to: [{ name: 'Eu', email: 'me@adverge.ads' }],
        subject: 'Convite: Reunião de Kick-off "Projeto Alfa"',
        snippet: 'Qua, 25 de Outubro de 2025, 10:00 – 10:45',
        body: '<p>Você foi convidado para a reunião de kick-off do Projeto Alfa. Por favor, confirme sua presença.</p>',
        date: generateDate(2),
        isRead: true,
        attachments: [],
    },
    // Sent emails
    {
        id: 'email-5',
        folderId: 'sent',
        from: { name: 'Eu', email: 'me@adverge.ads' },
        to: [{ name: 'Ana Carolina', email: 'ana.carolina@cliente-z.com' }],
        subject: 'Alinhamento de Estratégia para o Q4',
        snippet: 'Olá Ana, tudo bem? Conforme conversamos, segue a proposta de estratégia para o último trimestre.',
        body: '<p>Olá Ana, tudo bem?</p><p>Conforme conversamos, segue em anexo a proposta de estratégia de marketing digital para o Q4.</p><p>Qualquer dúvida, estou à disposição!</p>',
        date: generateDate(1),
        isRead: true,
        attachments: [{ id: 'att-3', filename: 'Proposta_Estrategia_Q4.docx', size: 890000, type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', url: '#' }],
    },
    // Draft email
    {
        id: 'email-6',
        folderId: 'drafts',
        from: { name: 'Eu', email: 'me@adverge.ads' },
        to: [{ name: 'Equipe Interna', email: 'equipe@adverge.ads' }],
        subject: 'Brainstorm para Nova Campanha',
        snippet: 'Pessoal, vamos marcar um brainstorm para a nova campanha do Cliente X...',
        body: '<p>Pessoal,</p><p>Vamos marcar um brainstorm para a nova campanha do Cliente X. Minha sugestão é na sexta-feira, às 11h. O que acham?</p>',
        date: generateDate(0),
        isRead: true,
        attachments: [],
    },
    // Spam email
    {
        id: 'email-7',
        folderId: 'spam',
        from: { name: 'Ofertas Incríveis', email: 'promo@ofertastop.com' },
        to: [{ name: 'Eu', email: 'me@adverge.ads' }],
        subject: '🔥 Você ganhou um prêmio! 🔥',
        snippet: 'Clique aqui para resgatar seu prêmio exclusivo. Não perca esta oportunidade única!',
        body: '<p>Parabéns! Você foi selecionado para receber um prêmio incrível. Clique agora mesmo!</p>',
        date: generateDate(3),
        isRead: false,
        attachments: [],
    },
];
