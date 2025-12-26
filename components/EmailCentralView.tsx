import React, { useState, useEffect } from 'react';
import FolderPanel from './email/FolderPanel';
import EmailListPanel from './email/EmailListPanel';
import EmailViewPanel from './email/EmailViewPanel';
import ComposeModal from './email/ComposeModal';
import { useEmail } from '../context/EmailContext';

const EmailCentralView: React.FC = () => {
    const { getEmailById } = useEmail();
    const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
    const [isComposing, setIsComposing] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
    
    // mobileViewStack determines which panel to show on mobile: 'folders', 'list', or 'view'
    const [mobileViewStack, setMobileViewStack] = useState<'folders' | 'list' | 'view'>('folders');

    const selectedEmail = selectedEmailId ? getEmailById(selectedEmailId) : null;
    
    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const handleSelectEmail = (emailId: string) => {
        setSelectedEmailId(emailId);
        if(isMobileView) {
            setMobileViewStack('view');
        }
    }

    const handleSelectFolder = () => {
        setSelectedEmailId(null);
        if (isMobileView) {
            setMobileViewStack('list');
        }
    }

    const handleBack = () => {
        if (mobileViewStack === 'view') {
            setSelectedEmailId(null);
            setMobileViewStack('list');
        } else if (mobileViewStack === 'list') {
            setMobileViewStack('folders');
        }
    };

    const renderPanels = () => {
        if (isMobileView) {
            switch(mobileViewStack) {
                case 'folders':
                    return <FolderPanel onSelectFolder={handleSelectFolder} onCompose={() => setIsComposing(true)} />;
                case 'list':
                    return <EmailListPanel onSelectEmail={handleSelectEmail} onBack={handleBack} />;
                case 'view':
                    return <EmailViewPanel email={selectedEmail} onBack={handleBack} />;
                default:
                    return <FolderPanel onSelectFolder={handleSelectFolder} onCompose={() => setIsComposing(true)} />;
            }
        }
        
        // Desktop view
        return (
            <>
                <div className="w-64 flex-shrink-0">
                    <FolderPanel onSelectFolder={handleSelectFolder} onCompose={() => setIsComposing(true)} />
                </div>
                <div className="w-[450px] flex-shrink-0 border-l border-r border-white/10">
                    <EmailListPanel onSelectEmail={handleSelectEmail} selectedEmailId={selectedEmailId} />
                </div>
                <div className="flex-1 min-w-0">
                    <EmailViewPanel email={selectedEmail} />
                </div>
            </>
        )
    }

    return (
        <div className="h-full flex flex-col animate-fade-in-up">
            <div className="flex-grow flex bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden min-h-0">
                {renderPanels()}
            </div>
            {isComposing && <ComposeModal onClose={() => setIsComposing(false)} />}
        </div>
    );
};

export default EmailCentralView;
