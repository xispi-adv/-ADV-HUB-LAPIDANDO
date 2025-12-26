
import React from 'react';

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const BellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const Header: React.FC = () => {
    return (
        <header className="flex-shrink-0 h-16 relative group z-40">
            {/* Stealth Container */}
            <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out transform -translate-y-2 group-hover:translate-y-0 bg-[var(--bg-card)] rounded-b-2xl shadow-lg border-b border-[var(--border-color)]">
                
                <div className="w-1"></div>

                {/* Search and Actions */}
                <div className="flex items-center gap-4 md:gap-6">
                    <div className="relative hidden md:block">
                        <input
                            type="search"
                            placeholder="Busca universal..."
                            className="w-64 bg-[var(--bg-elevation-1)] border border-[var(--border-color)] rounded-full pl-10 pr-4 py-1.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all backdrop-blur-md"
                        />
                        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    </div>
                    <div className="h-6 w-px bg-[var(--border-color)]"></div>
                    <button className="relative text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--accent-color)] rounded-full border border-[var(--bg-card)]"></span>
                    </button>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-color)] to-[#0f172a] border border-[var(--border-color)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                            <UserIcon className="w-5 h-5 text-white" />
                        </div>
                    </button>
                </div>
            </div>
            
            {/* Minimal indicator to show where header is */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--border-color)] opacity-20 group-hover:opacity-0 transition-opacity"></div>
        </header>
    );
};

export default Header;
