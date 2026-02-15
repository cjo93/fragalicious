import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SettingsPage() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError('');
    setSuccess(false);
    try {
      // Call Supabase RPC for account deletion
      const { error } = await supabase.rpc('delete_user_account');
      if (error) throw error;
      setSuccess(true);
      // Optionally, sign out the user
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (e: any) {
      setError(e.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8">
      <h2 className="font-mono text-xl mb-4 text-destructive">Danger Zone</h2>
      <button
        className="bg-destructive text-white font-mono py-2 px-4 rounded hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-destructive/50"
        onClick={handleDeleteAccount}
        disabled={deleting}
        aria-label="Delete My Account"
      >
        {deleting ? 'Deleting...' : 'Delete My Account'}
      </button>
      {success && <div className="mt-4 text-green-500 font-mono">Account deleted. Redirecting...</div>}
      {error && <div className="mt-4 text-destructive font-mono">{error}</div>}
    </div>
  );
}
