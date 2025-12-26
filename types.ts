
import React from 'react';

export interface NavLink {
  id: string;
  label: string;
}

export interface AgentGroup {
  id: string;
  name: string;
  description: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface AgentCardData {
  id: string;
  groupId: string;
  title: string;
  description: string;
  systemInstruction: string;
  isHighlighted?: boolean;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  chatHistory?: Message[];
}

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp?: string;
}

export type ClientStatus = 'ACTIVE' | 'PROSPECT' | 'CHURNED';

export interface ClientPersona {
    name: string;
    description: string;
    pains?: string;
    desires?: string;
    objections?: string;
}

export interface ClientBrand {
    toneOfVoice: string;
    visualIdentity: string;
    coreValues: string;
    missionVision?: string;
    mainCompetitors?: string;
    differentiation?: string;
    idealCustomerProfile?: string;
}

export interface ClientKeyResult {
    id: string;
    title: string;
    isCompleted: boolean;
}

export interface ClientObjective {
    id: string;
    title: string;
    deadline: string;
    status: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'ATRASADO';
    keyResults: ClientKeyResult[];
}

export interface Client {
  id: string;
  name: string;
  companyName?: string;
  logo?: string; 
  status: ClientStatus;
  cnpj?: string;
  responsibleName?: string;
  email?: string;
  phone?: string;
  website?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  contractObjective?: string;
  description?: string;
  brand?: ClientBrand;
  personas?: ClientPersona[];
  objectives?: ClientObjective[];
  onboardingChecklist?: { id: string; label: string; completed: boolean }[];
  since: string;
}

export type TaskStatus = 'A_FAZER' | 'EM_ANDAMENTO' | 'CONCLUIDO';
export type TaskPriority = 'ALTA' | 'MEDIA' | 'BAIXA';

export interface ProjectGroup {
  id: string;
  name: string;
  description: string;
  clientId?: string;
  isPinned?: boolean; // NEW: Pin for groups
}

export interface Project {
  id: string;
  name: string;
  purpose: string;
  focus: string;
  client: string;
  summary: string;
  deadline: string;
  groupId: string;
  isPinned?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
}

export interface AdMetric {
    date: string;
    platform: 'google' | 'meta';
    cost: number;
    clicks: number;
    impressions: number;
}

export interface GeneratedMedia {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  url: string;
  options?: Record<string, string>;
}

export type CalendarTaskPriority = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type CalendarTaskCategory = 'CAMPANHA' | 'SOCIAL_MEDIA' | 'CONTEUDO' | 'EMAIL' | 'SEO' | 'ADS' | 'REUNIAO' | 'OUTRO';
export type CalendarTaskStatus = 'A_FAZER' | 'EM_PROGRESSO' | 'REVISAO' | 'CONCLUIDO';

export interface CalendarTask {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: CalendarTaskPriority;
  category: CalendarTaskCategory;
  assignedTo?: string;
  status: CalendarTaskStatus;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  estimatedTime?: number;
  relatedLink?: string;
  order: number;
  clientId?: string;
}

export type EmailFolderId = 'inbox' | 'sent' | 'drafts' | 'spam' | 'trash' | string;

export interface EmailFolder {
  id: EmailFolderId;
  name: string;
  unreadCount: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface EmailAttachment {
  id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
}

export interface Email {
  id: string;
  folderId: EmailFolderId;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  to: { name: string; email: string }[];
  cc?: { name: string; email: string }[];
  bcc?: { name: string; email: string }[];
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  attachments: EmailAttachment[];
}

export type TransactionType = 'receita' | 'despesa';
export type TransactionStatus = 'pago' | 'pendente';

export interface FinancialAccount {
  id: string;
  name: string;
  balance: number;
  type: 'bank' | 'cash' | 'credit';
}

export interface FinancialCategory {
  id: string;
  name: string;
  budget?: number;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  status: TransactionStatus;
  clientId?: string;
}
