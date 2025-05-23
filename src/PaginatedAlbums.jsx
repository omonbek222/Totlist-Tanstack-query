import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Alert, Skeleton, Pagination } from 'antd';

const LIMIT = 5;

const fetchAlbums = async (page) => {
  const res = await axios(
    `https://jsonplaceholder.typicode.com/albums?_page=${page}&_limit=${LIMIT}`
  );
  return res.data;
};

const PaginatedAlbums = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['albums-pagination', page],
    queryFn: () => fetchAlbums(page),
    keepPreviousData: true,
  });

  return (
    <div className="w-full max-w-[600px] m-auto p-4">
      {isError && <Alert message="Error" description={error.message} type="error" />}
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 5 }} />
      ) : (
        <>
          {data.map((item) => (
            <Alert key={item.id} message={item.title} className="mb-2" />
          ))}
          <Pagination
            current={page}
            total={100} 
            pageSize={LIMIT}
            onChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
};

export default PaginatedAlbums;
