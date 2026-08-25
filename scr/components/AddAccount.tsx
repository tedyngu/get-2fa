import { useState, FormEvent } from 'react';
import { Plus, User, KeyRound } from 'lucide-react';

interface Props {
  onAdd: (username: string, twoFactorSecret: string) => void;
}

export function AddAccount({ onAdd }: Props) {
  const [username, setUsername] = useState('');
  const [secret, setSecret] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim() && secret.trim()) {
      onAdd(username.trim(), secret.trim());
      setUsername('');
      setSecret('');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <Plus className="w-6 h-6 text-indigo-500" />
        Thêm tài khoản mới
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Tài khoản (Username)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
              placeholder="Nhập tên tài khoản..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Mã bảo mật 2FA (Secret)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-5 w-5 text-zinc-400" />
            </div>
            <input
              type="text"
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-600 rounded-xl bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow font-mono text-sm"
              placeholder="VD: JBSWY3DPEHPK3PXP"
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Dán mã secret bạn nhận được khi thiết lập 2FA trên Discord.
          </p>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors mt-2"
        >
          <Plus className="w-5 h-5" />
          Thêm vào danh sách
        </button>
      </form>
    </div>
  );
}
