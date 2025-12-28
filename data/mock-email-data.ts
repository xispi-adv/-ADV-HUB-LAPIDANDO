
import type { EmailFolder, Email } from '../types';
import React from 'react';

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
const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.845a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" })
  )
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.036-2.134H8.716c-1.126 0-2.037.955-2.037 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" })
  )
);

export const MOCK_FOLDERS: EmailFolder[] = [
    { id: 'INBOX', name: 'Principal', unreadCount: 3, icon: InboxIcon },
    { id: 'IMPORTANT', name: 'Importantes', unreadCount: 1, icon: StarIcon },
    { id: 'SENT', name: 'Enviados', unreadCount: 0, icon: SentIcon },
    { id: 'TRASH', name: 'Lixeira', unreadCount: 0, icon: TrashIcon },
];

const generateDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
}

export const MOCK_EMAILS: Email[] = [
    {
        id: 'msg-1',
        threadId: 'thread-1',
        labelIds: ['INBOX', 'IMPORTANT'],
        from: { name: 'Felipe S.', email: 'felipe.s@example.com', avatar: 'https://i.pravatar.cc/40?u=felipe' },
        to: [{ name: 'Eu', email: 'me@adverge.ads' }],
        subject: 'Relatório Semanal de Performance da Campanha',
        snippet: 'Olá, segue anexo o relatório de performance desta semana. Tivemos um aumento de 15% no CTR!',
        body: `<p>Olá Equipe,</p><p>Segue anexo o relatório de performance consolidado para a campanha "Lançamento de Verão" referente à semana de 10/10 a 16/10.</p><ul><li>Aumento de 15% no CTR.</li><li>Redução de 8% no CPA.</li></ul><p>Abraços,<br>Felipe S.</p>`,
        date: generateDate(0),
        isRead: false,
        attachments: [],
        priority: 'high'
    },
    {
        id: 'msg-2',
        threadId: 'thread-2',
        labelIds: ['INBOX'],
        from: { name: 'Ana Carolina', email: 'ana.carolina@cliente-z.com' },
        to: [{ name: 'Eu', email: 'me@adverge.ads' }],
        subject: 'Dúvida Orçamento Q4',
        snippet: 'Oi Teles, podemos revisar a alocação de verba para o TikTok Ads?',
        body: '<p>Oi Teles,</p><p>Estive analisando o planejamento e gostaria de sugerir que movêssemos 20% da verba de Meta Ads para o TikTok Ads.</p><p>O que acha?</p>',
        date: generateDate(1),
        isRead: true,
        attachments: [],
    }
];
