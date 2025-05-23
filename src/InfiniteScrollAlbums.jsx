import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Alert, Skeleton } from 'antd';

const LIMIT = 5;

const fetchAlbums = async ({ pageParam = 1 }) => {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/albums?_page=${pageParam}&_limit=${LIMIT}`
  );
  return {
    data: res.data,
    nextPage: res.data.length === LIMIT ? pageParam + 1 : undefined,
  };
};

const InfiniteScrollAlbums = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['albums-scroll'],
    queryFn: fetchAlbums,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  const allAlbums = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="w-full max-w-[600px] m-auto p-4">
      <h2 className="text-xl font-bold mb-4">Scroll bilan yuklash</h2>

      {allAlbums.map((album) => (
        <Alert key={album.id} message={album.title} className="mb-2" />
      ))}

      {(isLoading || isFetchingNextPage) && (
        <Skeleton active paragraph={{ rows: 3 }} className="mb-4" />
      )}


      <div ref={loaderRef} className="h-[1px]"></div>
    </div>
  );
};

export default InfiniteScrollAlbums;
