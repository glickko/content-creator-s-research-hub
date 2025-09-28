import React, { useState, useCallback } from 'react';
import type { WebsiteResult, Tab } from './types';
import { fetchWebsiteResults, generateContentScript } from './services/geminiService';
import { SearchBar } from './components/SearchBar';
import { Tabs } from './components/Tabs';
import { WebsiteResults } from './components/WebsiteResults';
import { ContentResult } from './components/ContentResult';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [activeTab, setActiveTab] = useState<Tab>('websites');
    const [websiteResults, setWebsiteResults] = useState<WebsiteResult[]>([]);
    const [contentScript, setContentScript] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPaginating, setIsPaginating] = useState<boolean>(false);
    const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (newQuery: string) => {
        if (!newQuery.trim()) return;
        setQuery(newQuery);
        setIsLoading(true);
        setError(null);
        setWebsiteResults([]);
        setContentScript('');
        setActiveTab('websites');

        try {
            const results = await fetchWebsiteResults(newQuery);
            setWebsiteResults(results);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = async (newTab: Tab) => {
        setActiveTab(newTab);
        if (!query) return;

        if (newTab === 'content' && !contentScript && websiteResults.length > 0) {
            setIsGeneratingScript(true);
            setError(null);
            try {
                const script = await generateContentScript(query, websiteResults);
                setContentScript(script);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            } finally {
                setIsGeneratingScript(false);
            }
        }
    };

    const handleLoadMore = useCallback(async () => {
        if (!query || isPaginating) return;

        setIsPaginating(true);
        setError(null);
        try {
            if (activeTab === 'websites') {
                const newResults = await fetchWebsiteResults(query);
                setWebsiteResults(prev => [...prev, ...newResults]);
                setContentScript(''); // Invalidate old script since new data is available
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsPaginating(false);
        }
    }, [query, activeTab, isPaginating]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                        Content Creator's <span className="text-cyan-400">Research Hub</span>
                    </h1>
                    <p className="text-lg text-gray-400">
                        Find websites and generate scripts for your next masterpiece.
                    </p>
                </header>

                <main>
                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    <Tabs activeTab={activeTab} onTabChange={handleTabChange} />

                    <div className="mt-8">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Spinner />
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                                <p className="font-semibold">Oops! Something went wrong.</p>
                                <p>{error}</p>
                            </div>
                        ) : query ? (
                            <>
                                {activeTab === 'websites' && <WebsiteResults results={websiteResults} />}
                                {activeTab === 'content' && <ContentResult script={contentScript} isLoading={isGeneratingScript} hasSources={websiteResults.length > 0} />}
                                
                                { activeTab === 'websites' && websiteResults.length > 0 && (
                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={handleLoadMore}
                                            disabled={isPaginating}
                                            className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center mx-auto"
                                        >
                                            {isPaginating ? (
                                                <>
                                                    <Spinner small={true} />
                                                    <span className="ml-2">Loading...</span>
                                                </>
                                            ) : (
                                                'Next Page'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center text-gray-500 pt-16">
                                <p className="text-xl">Enter a topic above to start your research.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;
