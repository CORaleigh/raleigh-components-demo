import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'raleigh-js-map-components';
import '../node_modules/raleigh-js-map-components/dist/style.css';
import { setAssetPath } from "@esri/calcite-components/dist/components";

// Local assets
setAssetPath(window.location.href);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
