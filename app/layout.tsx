import './globals.css'
import type { Metadata } from 'next'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Nav from '../components/Nav'
import Footer from '@/components/Footer'
import SetContextProvider from '@/components/SetContext'
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'PokemonTCG Card Search',
  description: 'PokemonTCG Card Search',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <UserProvider>
        <body>
          <div className="main_bg">
            <div className='main_gradient'/>
          </div>
          <SetContextProvider>
            <main className='app_'>
              <Nav/>
              {children}
              <Footer/>
            </main>
          </SetContextProvider>          
        </body>
      </UserProvider>      
    </html>
  )
}
