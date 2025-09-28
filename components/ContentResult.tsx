import React from 'react';
import { Spinner } from './Spinner';

interface ContentResultProps {
    script: string;
    isLoading: boolean;
    hasSources: boolean;
}

export const ContentResult: React.FC<ContentResultProps> = ({ script, isLoading, hasSources }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 text-center">
                <Spinner />
                <p className="mt-4 text-lg text-gray-400">Generating your script... This may take a moment.</p>
            </div>
        );
    }

    if (!hasSources) {
        return (
            <div className="text-center text-gray-500 py-10">
                <p>Please perform a search on the 'Websites' tab first to gather sources for the script.</p>
            </div>
        );
    }

    if (!script) {
        return (
            <div className="text-center text-gray-500 py-10">
                 <p>Your generated content will appear here.</p>
                 <p className="mt-2 text-sm">If you've added new websites with "Next Page", the script will regenerate on this tab.</p>
            </div>
        );
    }
    
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-cyan-400">Generated Content Script</h2>
                 <span className="text-sm font-mono bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {script.length.toLocaleString()} characters
                </span>
            </div>
            <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {script}
            </div>
        </div>
    );
};
