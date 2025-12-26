
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
  { id: 'cat-1', name: 'Serviços de Marketing', type: 'receita', budget: 0 },
  { id: 'cat-2', name: 'Software & SaaS', type: 'despesa', budget: 2000 },
  { id: 'cat-3', name: 'Pessoal / Freelancers', type: 'despesa', budget: 5000 },
  { id: 'cat-4', name: 'Infraestrutura', type: 'despesa', budget: 1000 },
  { id: 'cat-5', name: 'Impostos', type: 'despesa', budget: 1500 },
  { id: 'cat-6', name: 'Outros', type: 'despesa', budget: 500 },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't1', date: '2024-05-01', description: 'Recebimento Cliente X', amount: 4500, type: 'receita', categoryId: 'cat-1', accountId: 'acc-1', status: 'pago', clientId: 'cli-1' }, // Nubank
  { id: 't2', date: '2024-05-02', description: 'Assinatura Adobe CC', amount: 250, type: 'despesa', categoryId: 'cat-2', accountId: 'acc-1', status: 'pago' },
  { id: 't3', date: '2024-05-05', description: 'Pagamento Freelancer Design', amount: 1200, type: 'despesa', categoryId: 'cat-3', accountId: 'acc-2', status: 'pago' },
  { id: 't4', date: '2024-05-10', description: 'Servidor AWS', amount: 450, type: 'despesa', categoryId: 'cat-4', accountId: 'acc-1', status: 'pendente' },
  { id: 't5', date: '2024-05-15', description: 'Recebimento Cliente Y', amount: 3200, type: 'receita', categoryId: 'cat-1', accountId: 'acc-1', status: 'pendente' },
  { id: 't6', date: '2024-05-18', description: 'Google Ads Crédito', amount: 1500, type: 'despesa', categoryId: 'cat-4', accountId: 'acc-1', status: 'pago' },
  { id: 't7', date: '2024-05-20', description: 'Consultoria SEO', amount: 2800, type: 'receita', categoryId: 'cat-1', accountId: 'acc-1', status: 'pago' },
  { id: 't8', date: '2024-04-10', description: 'Setup Inicial McDonalds', amount: 8000, type: 'receita', categoryId: 'cat-1', accountId: 'acc-1', status: 'pago', clientId: 'cli-2' },
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
  classifyTransactionWithAI: (description: string) => Promise<string>;
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

  const classifyTransactionWithAI = useCallback(async (description: string): Promise<string> => {
    if (!description) return 'cat-6';
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const categoryNames = categories.map(c => c.name).join(', ');
      
      const prompt = `
        Você é um Assistente Contábil (NEXUS-FIN).
        Categorize a transação: "${description}".
        As categorias disponíveis são: ${categoryNames}.
        Retorne APENAS o nome exato da categoria. Se não souber, retorne "Outros".
      `;

      // Fixed: Updated to gemini-3-flash-preview as per guidelines
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const suggestedName = response.text?.trim();
      const foundCategory = categories.find(c => c.name.toLowerCase() === suggestedName?.toLowerCase());
      
      return foundCategory ? foundCategory.id : 'cat-6'; 
    } catch (error) {
      return 'cat-6';
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
          // Fixed: Updated to gemini-3-flash-preview as per guidelines
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
