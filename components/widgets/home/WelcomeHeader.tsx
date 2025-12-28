import React from 'react';
import { useTaskManager } from '../../../context/TaskManagerContext';
import { useEmail } from '../../../context/EmailContext';
import { useCalendar } from '../../../context/CalendarContext';

const TaskIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
);
const EmailIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const PulsePill: React.FC<{ icon: React.ReactNode, count: number, label: string }> = ({ icon, count, label }) => (
    <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full px-4 py-2 text-[var(--text-primary)] shadow-sm">
        {icon}
        <span className="font-semibold">{count}</span>
        <span className="text-[var(--text-secondary)]">{label}</span>
    </div>
);

const DynamicWelcomeHeader: React.FC = () => {
    const { tasks } = useTaskManager();
    const { emails } = useEmail();
    const { tasks: calendarTasks } = useCalendar();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Bom dia";
        if (hour < 18) return "Boa tarde";
        return "Boa noite";
    };

    const today = new Date().toISOString().split('T')[0];
    const tasksDueToday = tasks.filter(task => task.dueDate === today && task.status !== 'CONCLUIDO').length;
    const meetingsToday = calendarTasks.filter(t => t.dueDate === today && t.category === 'REUNIAO').length;
    // Fix: Using labelIds.includes('INBOX') instead of non-existent folderId property
    const unreadEmails = emails.filter(e => !e.isRead && e.labelIds.includes('INBOX')).length;

    return (
        <div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">{getGreeting()}, Teles.</h1>
            <div className="mt-4 flex flex-wrap items-center gap-4">
                <h2 className="text-lg text-[var(--text-secondary)] mr-2">Pulso do dia:</h2>
                {tasksDueToday > 0 && <PulsePill icon={<TaskIcon />} count={tasksDueToday} label={tasksDueToday > 1 ? "tarefas para hoje" : "tarefa para hoje"} />}
                {meetingsToday > 0 && <PulsePill icon={<CalendarIcon />} count={meetingsToday} label={meetingsToday > 1 ? "reuniões hoje" : "reunião hoje"} />}
                {unreadEmails > 0 && <PulsePill icon={<EmailIcon />} count={unreadEmails} label={unreadEmails > 1 ? "e-mails não lidos" : "e-mail não lido"} />}
            </div>
        </div>
    );
};

export default DynamicWelcomeHeader;