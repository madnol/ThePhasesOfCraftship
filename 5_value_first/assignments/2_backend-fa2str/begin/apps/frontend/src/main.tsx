import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App'
import './index.css'
import { createAPIClient } from '@dddforum/api';
import { configure } from "mobx"
import { Presenters } from './shared/presenters/presenters';
import { Stores } from './shared/store/stores';

import { RegistrationPresenter } from './modules/auth/application/presenters/registrationPresenter';
import { PostsPresenter } from './modules/posts/application/presenters/postsPresenter';

import { ToastAPI } from './shared/toast/toastAPI';

import { NavigationStore } from './shared/navigation/navigationStore';
import { AuthStore } from './modules/auth/stores/authStore';
import { PostsStore } from './modules/posts/stores/productionPostsStore';
import { LayoutPresenter } from './shared/layout/application/presenters/layoutPresenter';
import { ProductionFirebaseAPI } from './modules/auth/infra/firebase/productionFirebaseAPI';
import { appConfig } from './config'
import { OnboardingPresenter } from './pages/onboarding/application/presenters/onboardingPresenter';
import { MembersStore } from './modules/auth/stores/membersStore';

configure({ enforceActions: "never" })

const apiClient = createAPIClient('http://localhost:3000');

const toastAPI = new ToastAPI();
const firebaseAPI = new ProductionFirebaseAPI(appConfig.firebase);

// Make stores
const authStore = new AuthStore(
  apiClient,
  firebaseAPI
);

const postsStore = new PostsStore(apiClient, authStore);
const navigationStore = new NavigationStore();
const membersStore = new MembersStore(authStore, apiClient);

const stores = new Stores(
  authStore,
  postsStore,
  navigationStore,
  membersStore
);

// Make presenters
const postsPresenter = new PostsPresenter(postsStore, authStore);
const registrationPresenter = new RegistrationPresenter(
  navigationStore, 
  authStore,
  toastAPI,
  firebaseAPI
);

const onboardingPresenter = new OnboardingPresenter(
  navigationStore,
  membersStore
);

const layoutPresenter = new LayoutPresenter(authStore, navigationStore);

const presenters = new Presenters(
  registrationPresenter, 
  postsPresenter,
  layoutPresenter,
  onboardingPresenter
);

// Initialize app
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


export {
  apiClient,
  
  toastAPI,

  // Bundle it all up and export
  stores,
  presenters,
}

