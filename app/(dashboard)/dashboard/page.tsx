import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: merchant } = await supabase
    .from('merchants')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!merchant) {
    return redirect('/onboarding')
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline text-[#111c2d]">Welcome, {merchant.store_name}!</h1>
        <p className="text-[#6d7a77]">You are currently on the <span className="text-[#00685f] font-bold uppercase">{merchant.plan}</span> plan.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#e7eeff] shadow-sm">
          <p className="text-sm font-medium text-[#6d7a77] mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-[#111c2d]">{merchant.currency} 0.00</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#e7eeff] shadow-sm">
          <p className="text-sm font-medium text-[#6d7a77] mb-1">Total Products</p>
          <p className="text-2xl font-bold text-[#111c2d]">0</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-[#e7eeff] shadow-sm">
          <p className="text-sm font-medium text-[#6d7a77] mb-1">Active Orders</p>
          <p className="text-2xl font-bold text-[#111c2d]">0</p>
        </div>
      </div>

      <div className="bg-[#f0f3ff] p-8 rounded-3xl border-2 border-dashed border-[#00685f]/20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
          🚀
        </div>
        <h2 className="text-xl font-bold text-[#111c2d]">Ready to start selling?</h2>
        <p className="text-[#6d7a77] max-w-sm">Create your first digital product and start sharing your link with your audience.</p>
        <button className="px-8 py-3 bg-[#00685f] text-white font-bold rounded-2xl shadow-lg shadow-[#00685f]/20 hover:bg-[#005049] transition-all">
          Create New Product
        </button>
      </div>
    </div>
  )
}
