'use client';

import React from 'react';

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@v6y/ui-kit-front/components/molecules/pagination';

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const VitalityAppListPagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const renderPages = () => {
        if (totalPages <= 7) {
            return pages.map((page) => (
                <PaginationItem key={page}>
                    <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                            e.preventDefault();
                            onPageChange(page);
                        }}
                        className="text-black hover:text-black visited:text-black"
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            ));
        }

        const startPages = pages.slice(0, 3);
        const endPages = pages.slice(-3);
        const middlePages = [currentPage - 1, currentPage, currentPage + 1].filter(
            (p) => p > 3 && p < totalPages - 2,
        );

        return (
            <>
                {startPages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(page);
                            }}
                            className="text-black hover:text-black visited:text-black"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                {middlePages.length > 0 && middlePages[0] > 4 && <PaginationEllipsis />}
                {middlePages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(page);
                            }}
                            className="text-black hover:text-black visited:text-black"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
                {middlePages.length > 0 && middlePages[middlePages.length - 1] < totalPages - 3 && (
                    <PaginationEllipsis />
                )}
                {endPages.map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                onPageChange(page);
                            }}
                            className="text-black hover:text-black visited:text-black"
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}
            </>
        );
    };

    return (
        <div className="mt-6 flex items-center justify-center">
            <Pagination>
                <PaginationContent>
                    {totalPages > 1 && (
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                className={`text-black hover:text-black visited:text-black ${
                                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) onPageChange(currentPage - 1);
                                }}
                            />
                        </PaginationItem>
                    )}
                    {renderPages()}
                    {totalPages > 1 && (
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                className={`text-black hover:text-black visited:text-black ${
                                    currentPage === totalPages
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < totalPages) onPageChange(currentPage + 1);
                                }}
                            />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default VitalityAppListPagination;
