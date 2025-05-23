import React from 'react';
import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button, Alert, Skeleton } from 'antd';

const LIMIT = 5;

const getData = async ({ pageParam = 1 }) => {
  const res = await axios(
    `https://jsonplaceholder.typicode.com/albums?_page=${pageParam}&_limit=${LIMIT}`
  );
  return {
    data: res.data,
    nextPage: res.data.length === LIMIT ? pageParam + 1 : undefined,
  };
};

const ButtonLoadAlbums = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['albums-button'],
    queryFn: getData,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const allPosts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="w-full max-w-[600px] m-auto p-4">
      {allPosts.map((value) => (
        <Alert key={value.id} message={value.title} className="mb-2" />
      ))}
      {isLoading || isFetchingNextPage ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : null}
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
          Load More
        </Button>
      )}
    </div>
  );
};

export default ButtonLoadAlbums;
