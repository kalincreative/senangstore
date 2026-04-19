import Link from 'next/link'
import { signOut } from '../auth-actions'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-[#f9f9ff]">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-[#e7eeff] flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#00685f] text-white font-bold text-lg shadow-lg shadow-[#00685f]/10">
            S
          </Link>
          <span className="ml-3 font-bold text-[#111c2d]">SenangStore</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center px-4 py-3 text-[#00685f] bg-[#f0f3ff] rounded-xl font-bold transition-all">
            Dashboard
          </Link>
          <Link href="/dashboard/products" className="flex items-center px-4 py-3 text-[#6d7a77] hover:bg-[#f0f3ff] hover:text-[#00685f] rounded-xl font-medium transition-all">
            Products
          </Link>
          <Link href="/dashboard/orders" className="flex items-center px-4 py-3 text-[#6d7a77] hover:bg-[#f0f3ff] hover:text-[#00685f] rounded-xl font-medium transition-all">
            Orders
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-4 py-3 text-[#6d7a77] hover:bg-[#f0f3ff] hover:text-[#00685f] rounded-xl font-medium transition-all">
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-[#e7eeff]">
          <form action={signOut}>
            <button className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
