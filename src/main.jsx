import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Layout } from './components/Layout/Layout';
import { AuthProvider } from './context/AuthProvider';
import App from './App';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<BrowserRouter basename="/Bugle-Planet/">
				<Layout>
					<App />
				</Layout>
			</BrowserRouter>
		</AuthProvider>
	</StrictMode>
)
