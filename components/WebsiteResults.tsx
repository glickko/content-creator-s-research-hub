
import React, { useState } from 'react';
import type { WebsiteResult } from '../types';
import { LinkIcon } from './icons/LinkIcon';

interface WebsiteCardProps {
    result: WebsiteResult;
}

const WebsiteCard: React.FC<WebsiteCardProps> = ({ result }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 transition-all duration-300 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-900/30">
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-bold text-cyan-400 hover:underline"
                    >
                        {result.recipeName}
                    </a>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <LinkIcon />
                        {new URL(result.url).hostname}
                    </p>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                    {isExpanded ? 'Collapse' : 'Expand'}
                </button>
            </div>
            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-gray-300">{result.summary}</p>
                </div>
            )}
        </div>
    );
};

interface WebsiteResultsProps {
    results: WebsiteResult[];
}

export const WebsiteResults: React.FC<WebsiteResultsProps> = ({ results }) => {
    if (results.length === 0) {
        return <div className="text-center text-gray-500 py-10">No website results found.</div>;
    }

    return (
        <div className="space-y-4">
            {results.map((result, index) => (
                <WebsiteCard key={`${result.url}-${index}`} result={result} />
            ))}
        </div>
    );
};
