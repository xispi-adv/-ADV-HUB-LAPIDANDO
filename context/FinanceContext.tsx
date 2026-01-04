
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Transaction, FinancialAccount, FinancialCategory, TransactionType } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// Mock Data Initializers
const INITIAL_ACCOUNTS: FinancialAccount[] = [
  { id: 'acc-1', name: 'Nubank PJ', balance: 15430.50, type: 'bank' },
  { id: 'acc-2', name: 'Caixa Econômica', balance: 3200.00, type: 'bank' },
  { id: 'acc-3', name: 'Cofre (Petty Cash)', balance: 450.00, type: 'cash' },
];

const INITIAL_CATEGORIES: FinancialCategory[] = [
  // CATEGORIAS DE DESPESA
  { id: 'cat-desp-1', name: 'Serviços de Marketing', type: 'despesa', budget: 1000 },
  { id: 'cat-desp-2', name: 'Software e SaaS', type: 'despesa', budget: 2000 },
  { id: 'cat-desp-3', name: 'Freelancer', type: 'despesa', budget: 5000 },
  { id: 'cat-desp-4', name: 'Infraestrutura', type: 'despesa', budget: 1000 },
  { id: 'cat-desp-5', name: 'Cloud', type: 'despesa', budget: 800 },
  { id: 'cat-desp-6', name: 'Impostos', type: 'despesa', budget: 1500 },
  { id: 'cat-desp-7', name: 'Outros', type: 'despesa', budget: 500 },

  // CATEGORIAS DE RECEITA
  { id: 'cat-rec-1', name: 'Mensalidade Plano', type: 'receita' },
  { id: 'cat-rec-2', name: 'Serviço Automação', type: 'receita' },
  { id: 'cat-rec-3', name: 'Serviço Site/ Landing Page', type: 'receita' },
  { id: 'cat-rec-4', name: 'Serviço Manuntenção', type: 'receita' },
  { id: 'cat-rec-5', name: 'Serviço de Marketing', type: 'receita' },
  { id: 'cat-rec-6', name: 'Outros', type: 'receita' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-05-01', description: 'Recebimento Cliente X', amount: 4500, type: 'receita', categoryId: 'cat-rec-1', accountId: 'acc-1', status: 'pago', clientId: 'cli-1' },
  { id: 't2', date: '2024-05-02', description: 'Assinatura Adobe CC', amount: 250, type: 'despesa', categoryId: 'cat-desp-2', accountId: 'acc-1', status: 'pago' },
  { id: 't3', date: '2024-05-05', description: 'Pagamento Freelancer Design', amount: 1200, type: 'despesa', categoryId: 'cat-desp-3', accountId: 'acc-2', status: 'pago' },
  { id: 't4', date: '2024-05-10', description: 'Servidor AWS', amount: 450, type: 'despesa', categoryId: 'cat-desp-5', accountId: 'acc-1', status: 'pendente' },
];

export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    text: string;
    timestamp: string;
}

interface FinanceContextType {
  accounts: FinancialAccount[];
  categories: FinancialCategory[];
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  classifyTransactionWithAI: (description: string, type: TransactionType) => Promise<string>;
  // Chat Bot Functions
  chatHistory: ChatMessage[];
  sendFinancialMessage: (message: string) => Promise<void>;
  isAiThinking: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<FinancialAccount[]>(INITIAL_ACCOUNTS);
  const [categories, setCategories] = useState<FinancialCategory[]>(INITIAL_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  
  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
      {
          id: 'init-1',
          role: 'ai',
          text: 'Olá! Sou seu Auditor Financeiro Virtual (CFO). Analiso seus dados em tempo real. Pergunte-me sobre fluxo de caixa, maiores gastos ou projeções.',
          timestamp: new Date().toISOString()
      }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...t, id: `t-${Date.now()}` };
    setTransactions(prev => [newTransaction, ...prev]);
    
    if (t.status === 'pago') {
        setAccounts(prev => prev.map(acc => {
            if (acc.id === t.accountId) {
                return {
                    ...acc,
                    balance: t.type === 'receita' ? acc.balance + t.amount : acc.balance - t.amount
                };
            }
            return acc;
        }));
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const classifyTransactionWithAI = useCallback(async (description: string, type: TransactionType): Promise<string> => {
    if (!description) return '';
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const filteredCategories = categories.filter(c => c.type === type);
      const categoryNames = filteredCategories.map(c => c.name).join(', ');
      
      const prompt = `
        Você é um Assistente Contábil (NEXUS-FIN).
        Categorize esta ${type}: "${description}".
        As categorias disponíveis para ${type} são: ${categoryNames}.
        Retorne APENAS o nome exato da categoria. Se não souber, retorne "Outros".
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const suggestedName = response.text?.trim();
      const foundCategory = filteredCategories.find(c => c.name.toLowerCase() === suggestedName?.toLowerCase());
      
      return foundCategory ? foundCategory.id : ''; 
    } catch (error) {
      return '';
    }
  }, [categories]);

  // Chatbot Logic
  const sendFinancialMessage = useCallback(async (userText: string) => {
      // 1. Add User Message
      const userMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          role: 'user',
          text: userText,
          timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, userMsg]);
      setIsAiThinking(true);

      try {
          // 2. Prepare Context
          const financialContext = {
              accounts: accounts.map(a => ({ name: a.name, balance: a.balance })),
              transactions: transactions.map(t => ({
                  date: t.date,
                  desc: t.description,
                  amount: t.amount,
                  type: t.type,
                  category: categories.find(c => c.id === t.categoryId)?.name || 'Unknown',
                  status: t.status
              })),
              categories: categories.map(c => ({ name: c.name, budget: c.budget }))
          };

          const systemInstruction = `
              Você é o CFO (Chief Financial Officer) Virtual do 'Ofc-MPV-HUB'.
              Sua persona é profissional, direta e analítica, mas acessível.
              
              DADOS FINANCEIROS ATUAIS (Contexto):
              ${JSON.stringify(financialContext)}

              INSTRUÇÕES:
              1. Responda com base APENAS nos dados fornecidos acima.
              2. Se o usuário perguntar "como estou?", faça uma análise geral de saldo vs despesas.
              3. Identifique padrões de gastos se solicitado.
              4. Seja conciso. Use formatação Markdown (negrito, listas) para facilitar a leitura.
              5. Se faltarem dados, avise.
          `;

          // 3. Call Gemini
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: [{ role: 'user', parts: [{ text: userText }] }],
              config: {
                  systemInstruction: systemInstruction
              }
          });

          // 4. Add AI Response
          const aiMsg: ChatMessage = {
              id: `msg-${Date.now() + 1}`,
              role: 'ai',
              text: response.text || "Desculpe, não consegui analisar os dados no momento.",
              timestamp: new Date().toISOString()
          };
          setChatHistory(prev => [...prev, aiMsg]);

      } catch (error) {
          console.error("Chat Error", error);
           const errorMsg: ChatMessage = {
              id: `msg-${Date.now() + 1}`,
              role: 'ai',
              text: "Ocorreu um erro ao processar sua solicitação financeira.",
              timestamp: new Date().toISOString()
          };
          setChatHistory(prev => [...prev, errorMsg]);
      } finally {
          setIsAiThinking(false);
      }

  }, [accounts, transactions, categories]);

  return (
    <FinanceContext.Provider value={{
      accounts,
      categories,
      transactions,
      addTransaction,
      deleteTransaction,
      classifyTransactionWithAI,
      chatHistory,
      sendFinancialMessage,
      isAiThinking
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
