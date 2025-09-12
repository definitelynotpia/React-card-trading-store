import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// Router
import { BrowserRouter as Router } from "react-router-dom";
// state management
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  }
});

const persister = createAsyncStoragePersister({ storage: window.localStorage });

persistQueryClient({
  queryClient,
  persister,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient} >
        <App />
      </QueryClientProvider>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
