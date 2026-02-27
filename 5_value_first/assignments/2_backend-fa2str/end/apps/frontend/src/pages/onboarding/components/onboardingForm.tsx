
import { useState } from 'react';
import { OnboardingVm } from '../application/viewModels/onboardingVm';

interface OnboardingFormProps {
  submitForm: (username: string, allowMarketing: boolean) => void;
  onboardingVm: OnboardingVm;
}

export const OnboardingForm = ({ submitForm, onboardingVm }: OnboardingFormProps) => {
  const [username, setUsername] = useState('');
  const [allowMarketing, setAllowMarketing] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-1xl mb-6">Complete Your Profile</h2>
      {onboardingVm.error && (
        <div className="error mb-4 text-red-500">
          {onboardingVm.error}
        </div>
      )}
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        submitForm(username, allowMarketing)
      }}>
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
          className="w-full bg-blue-500 text-white p-2 rounded"
          style={{ background: 'black' }}
          disabled={onboardingVm.isSubmitting}
        >
          {onboardingVm.isSubmitting ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  )
}