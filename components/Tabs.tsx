import React from 'react';
import type { Tab } from '../types';

interface TabsProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const TabButton: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-lg font-semibold rounded-md transition-colors duration-300 ${
                isActive
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
        >
            {label}
        </button>
    );
};


export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex justify-center space-x-2 p-1 bg-gray-800/50 rounded-lg">
            <TabButton 
                label="Websites" 
                isActive={activeTab === 'websites'} 
                onClick={() => onTabChange('websites')} 
            />
            <TabButton 
                label="Content Ready Description" 
                isActive={activeTab === 'content'} 
                onClick={() => onTabChange('content')} 
            />
        </div>
    );
};
