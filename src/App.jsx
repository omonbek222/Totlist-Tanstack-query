import React, { useState } from 'react';
import InfiniteScrollAlbums from './InfiniteScrollAlbums';
import ButtonLoadAlbums from './ButtonLoadAlbums';
import PaginatedAlbums from './PaginatedAlbums';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Button } from 'antd';

const queryClient = new QueryClient();

function App() {
  const [mode, setMode] = useState('scroll'); // 'scroll', 'button', 'pagination'

  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-5">TanStack Query - 3 xil yuklash usuli</h1>

        <div className="mb-6 flex gap-3">
          <Button type={mode === 'scroll' ? 'primary' : 'default'} onClick={() => setMode('scroll')}>
            Scroll bilan
          </Button>
          <Button type={mode === 'button' ? 'primary' : 'default'} onClick={() => setMode('button')}>
            Button bosib
          </Button>
          <Button type={mode === 'pagination' ? 'primary' : 'default'} onClick={() => setMode('pagination')}>
            Pagination (1, 2, 3)
          </Button>
        </div>

        {mode === 'scroll' && <InfiniteScrollAlbums />}
        {mode === 'button' && <ButtonLoadAlbums />}
        {mode === 'pagination' && <PaginatedAlbums />}
      </div>
    </QueryClientProvider>
  );
}

export default App;
