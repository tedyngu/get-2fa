import { useState, useEffect } from 'react';
import { ShieldCheck, List, PlusCircle, RefreshCw } from 'lucide-react';
import { AccountList } from './components/AccountList';
import { AddAccount } from './components/AddAccount';
import type { DiscordAccount } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [accounts, setAccounts] = useState<DiscordAccount[]>([]);
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('discord_2fa_accounts');
    if (stored) {
      try {
        setAccounts(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored accounts');
      }
    }
    syncTime();
  }, []);

  const syncTime = async () => {
    setIsSyncing(true);
    setSyncStatus('idle');
    try {
      const start = Date.now();
      const res = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=UTC');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      const end = Date.now();
      const rtt = end - start;
      
      // timeapi.io returns dateTime without 'Z' at the end, so we append it for UTC parsing
      const serverTime = new Date(data.dateTime + 'Z').getTime() + (rtt / 2);
      const localTime = Date.now();
      
      setTimeOffset(serverTime - localTime);
      setSyncStatus('success');
    } catch (e) {
      console.error("Failed to sync time:", e);
      setSyncStatus('error');
    } finally {
      setIsSyncing(false);
    }
  };

  // Save to localStorage when accounts change
  const saveAccounts = (newAccounts: DiscordAccount[]) => {
    setAccounts(newAccounts);
    localStorage.setItem('discord_2fa_accounts', JSON.stringify(newAccounts));
  };

  const handleAddAccount = (username: string, twoFactorSecret: string) => {
    // Basic cleanup just for storage
    const newAccount: DiscordAccount = {
      id: crypto.randomUUID(),
      username,
      twoFactorSecret: twoFactorSecret.replace(/\s+/g, ''),
      createdAt: Date.now(),
    };
    saveAccounts([...accounts, newAccount]);
    setActiveTab('list');
  };

  const handleDeleteAccount = (id: string) => {
    saveAccounts(accounts.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30 pb-12">
      <div className="max-w-xl mx-auto px-4 py-8">
        
        {/* Header */}
        <header className="mb-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-4 text-white">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Discord 2FA</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-4">Trình quản lý và lấy mã xác thực 2 bước</p>
          
          <button 
            onClick={syncTime}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-colors border ${
              syncStatus === 'success' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 border-green-200 dark:border-green-500/30' :
              syncStatus === 'error' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 border-red-200 dark:border-red-500/30' :
              'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Đang đồng bộ thời gian...' : 
             syncStatus === 'success' ? `Đã đồng bộ (lệch ${Math.round(timeOffset / 1000)}s)` : 
             syncStatus === 'error' ? 'Đồng bộ lỗi, thử lại' : 'Đồng bộ thời gian chuẩn'}
          </button>
        </header>

        {/* Navigation Tabs */}
        <div className="flex bg-zinc-200/50 dark:bg-zinc-800/50 p-1 rounded-xl mb-6 shadow-inner">
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
            }`}
          >
            <List className="w-4 h-4" />
            Acc Discord
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'add'
                ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Thêm TK Discord
          </button>
        </div>

        {/* Content Area */}
        <main>
          {activeTab === 'list' ? (
            <AccountList accounts={accounts} onDelete={handleDeleteAccount} timeOffset={timeOffset} />
          ) : (
            <AddAccount onAdd={handleAddAccount} />
          )}
        </main>

      </div>
    </div>
  );
}
