"use client";

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
} from '@v6y/ui-kit-front';

interface Props {
  onPrevious: () => void;
  onLoadMore: () => void;
}

const VitalityAppListPagination: React.FC<Props> = ({ onPrevious, onLoadMore }) => {
  return (
    <div className="mt-6 flex items-center justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" className="text-black hover:text-black visited:text-black" onClick={(e) => { e.preventDefault(); onPrevious(); }} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive className="text-black hover:text-black visited:text-black">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); onLoadMore(); }} className="text-black hover:text-black visited:text-black">
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" className="text-black hover:text-black visited:text-black">...</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" onClick={(e) => { e.preventDefault(); onLoadMore(); }} className="text-black hover:text-black visited:text-black">
              Next
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default VitalityAppListPagination;
