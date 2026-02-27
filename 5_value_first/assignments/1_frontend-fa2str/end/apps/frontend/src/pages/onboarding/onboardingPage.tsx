import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { usePresenters } from '../../shared/presenters/presentersContext';
import { Layout } from '@/shared/layout/layoutComponent';
import { OverlaySpinner } from '@/shared/spinner/overlaySpinner';
import { useStore } from '@/shared/store/storesContext';

export const OnboardingPage = observer(() => {
  const { navigation } = useStore();
  const { onboarding: presenter } = usePresenters();
  const [username, setUsername] = useState('');
  const [allowMarketing, setAllowMarketing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await presenter.registerMember({
      username,
      allowMarketing
    });
  };

  useEffect(() => {
    if (presenter.viewModel.hasCompletedOnboarding) {
      navigation.navigate('/')
    }
  }, [presenter.viewModel.hasCompletedOnboarding])

  const vm = presenter.viewModel;

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
        <h2 className="text-1xl mb-6">Complete Your Profile</h2>
        {vm.error && (
          <div className="error mb-4 text-red-500">
            {vm.error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={allowMarketing}
                onChange={(e) => setAllowMarketing(e.target.checked)}
                className="mr-2"
              />
              <span>I want to receive updates and marketing emails</span>
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={vm.isSubmitting}
          >
            {vm.isSubmitting ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
      </div>
      <OverlaySpinner isActive={vm.isSubmitting} />
    </Layout>
  );
}); 