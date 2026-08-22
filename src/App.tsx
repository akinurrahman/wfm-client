import { RouterProvider } from 'react-router';

import { Providers } from '@/components/providers';
import { router } from '@/router';
// import { useThemeInit } from '@/stores/theme.store';


function App() {
  // useThemeInit();
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
