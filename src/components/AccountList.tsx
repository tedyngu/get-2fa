import { DiscordAccount } from '../types';
import { AccountCard } from './AccountCard';
import { ShieldAlert } from 'lucide-react';

interface Props {
  accounts: DiscordAccount[];
  onDelete: (id: string) => void;
  timeOffset: number;
}

export function AccountList({ accounts, onDelete, timeOffset }: Props) {
  if (accounts.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 mb-4">
          <ShieldAlert className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">Chưa có tài khoản nào</h3>
        <p className="text-zinc-500 dark:text-zinc-400">Hãy thêm tài khoản Discord ở tab bên cạnh để quản lý mã 2FA.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl p-4 text-amber-800 dark:text-amber-300 text-sm flex items-center gap-3 shadow-sm">
        <ShieldAlert className="w-5 h-5 flex-shrink-0" />
        <p><strong>Lưu ý:</strong> Mật khẩu chung cho tất cả các tài khoản là <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono font-bold select-all">ugphone12</code></p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {accounts.map((account, index) => (
          <AccountCard 
            key={account.id} 
            account={account} 
            index={index} 
            onDelete={onDelete}
            timeOffset={timeOffset}
          />
        ))}
      </div>
    </div>
  );
}
