import './globals.css'
import type { Metadata } from 'next'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import Nav from '../components/Nav'
import SetContextProvider from '@/components/SetContext'

export const metadata: Metadata = {
  title: 'PokemonTCG Deck Builder',
  description: 'PokemonTCG Deck Builder',
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
            </main>
          </SetContextProvider>          
        </body>
      </UserProvider>      
    </html>
  )
}
