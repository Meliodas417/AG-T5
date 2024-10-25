import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  sidebar: ReactNode
}

const Layout = ({ children, sidebar }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-snow via-snow/80 to-celtic-blue/10">
      <div className="w-64 bg-white shadow-lg text-night p-4 overflow-y-auto">
        {sidebar}
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export default Layout
