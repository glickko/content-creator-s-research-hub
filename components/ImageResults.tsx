
import React from 'react';
import type { ImageResult } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageCardProps {
    result: ImageResult;
    query: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ result, query }) => {
    const imageUrl = `data:image/png;base64,${result.base64}`;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${query.replace(/\s+/g, '_')}_${result.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="relative group aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-transparent hover:border-cyan-500 transition-all duration-300">
            <img src={imageUrl} alt={`Generated image for ${query}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
                <button
                    onClick={handleDownload}
                    className="bg-cyan-600/80 hover:bg-cyan-500 text-white p-3 rounded-full backdrop-blur-sm transition-transform duration-300 group-hover:scale-110"
                    aria-label="Download image"
                >
                    <DownloadIcon />
                </button>
            </div>
        </div>
    );
};


interface ImageResultsProps {
    results: ImageResult[];
    query: string;
}

export const ImageResults: React.FC<ImageResultsProps> = ({ results, query }) => {
     if (results.length === 0) {
        return <div className="text-center text-gray-500 py-10">No image results found.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((result) => (
                <ImageCard key={result.id} result={result} query={query} />
            ))}
        </div>
    );
};
