import { useEffect, useState, useRef } from 'react';
import { Copy, Trash2, KeyRound, User, RefreshCw, Check } from 'lucide-react';
import type { DiscordAccount } from '../types';

interface Props {
  account: DiscordAccount;
  index: number;
  onDelete: (id: string) => void;
  timeOffset: number;
  key?: string | number;
}

export function AccountCard({ account, index, onDelete, timeOffset }: Props) {
  const [token, setToken] = useState('------');
  const [timeLeft, setTimeLeft] = useState(30);
  const [copied, setCopied] = useState(false);
  const [usernameCopied, setUsernameCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a ref to keep track of the secret so we can fetch properly
  const secretRef = useRef(account.twoFactorSecret.replace(/[^A-Z2-7a-z2-7]/gi, '').toUpperCase());

  useEffect(() => {
    secretRef.current = account.twoFactorSecret.replace(/[^A-Z2-7a-z2-7]/gi, '').toUpperCase();
  }, [account.twoFactorSecret]);

  const fetchToken = async () => {
    setIsLoading(true);
    try {
      // Use our proxy to fetch from 2fa.live
      const secret = secretRef.current;
      if (!secret) throw new Error("No secret");
      
      const res = await fetch(`/api/2fa/${secret}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      
      if (data && data.token) {
        setToken(data.token);
      } else {
        setToken('MÃ LỖI');
      }
    } catch (e) {
      console.error(e);
      setToken('MÃ LỖI');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchToken();
    
    // Timer to update timeLeft and refetch token
    const updateTimer = () => {
      const realTime = Date.now() + timeOffset;
      const epoch = Math.floor(realTime / 1000);
      const remaining = 30 - (epoch % 30);
      setTimeLeft(remaining);
      
      // If we hit exactly 30 (or close enough), refetch
      if (remaining === 30) {
        fetchToken();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timeOffset]);

  const handleCopy = () => {
    if (token && token !== 'MÃ LỖI' && token !== '------') {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyUsername = () => {
    if (account.username) {
      navigator.clipboard.writeText(account.username);
      setUsernameCopied(true);
      setTimeout(() => setUsernameCopied(false), 2000);
    }
  };

  // Calculate circle dasharray for SVG timer
  const circumference = 2 * Math.PI * 14; // r=14
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

  return (
    <div className="bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 py-1 px-2.5 rounded-lg text-sm">
            Acc {index + 1}
          </span>
        </h3>
        <button
          onClick={() => onDelete(account.id)}
          className="text-zinc-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
          title="Xóa tài khoản"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center group">
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
            <User className="w-5 h-5 text-zinc-400" />
            <span className="font-medium">{account.username}</span>
          </div>
          <button
            onClick={handleCopyUsername}
            className="text-zinc-400 hover:text-indigo-500 transition-colors p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 opacity-0 group-hover:opacity-100"
            title="Copy Username"
          >
            {usernameCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
          <KeyRound className="w-5 h-5 text-zinc-400" />
          <span className="font-mono text-sm break-all">{account.twoFactorSecret}</span>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-700/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="14"
                  className="stroke-zinc-200 dark:stroke-zinc-700"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="14"
                  className="stroke-indigo-500 transition-all duration-1000 ease-linear"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                {timeLeft}s
              </span>
            </div>
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-semibold tracking-wider mb-0.5">
                Mã 2FA
              </div>
              <div className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-widest min-w-[120px]">
                {isLoading ? (
                  <span className="flex items-center gap-2 text-zinc-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    ------
                  </span>
                ) : token === 'MÃ LỖI' ? (
                  <span className="text-red-500 text-lg">MÃ LỖI</span>
                ) : (
                  `${token.slice(0, 3)} ${token.slice(3, 6)}`
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              copied 
                ? 'bg-green-500 text-white shadow-md shadow-green-500/20' 
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200'
            }`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Đã chép!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
