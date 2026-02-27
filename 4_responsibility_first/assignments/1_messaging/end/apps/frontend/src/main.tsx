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

configure({ enforceActions: "never" })

const apiClient = createAPIClient('http://localhost:3000');

const toastAPI = new ToastAPI();

// Make stores
const authStore = new AuthStore(
  apiClient,
);

const postsStore = new PostsStore(apiClient, authStore);
const navigationStore = new NavigationStore();

const stores = new Stores(
  authStore,
  postsStore,
  navigationStore,
);

// Make presenters
const postsPresenter = new PostsPresenter(postsStore, authStore);
const registrationPresenter = new RegistrationPresenter(
  navigationStore, 
  authStore,
  toastAPI
);

const layoutPresenter = new LayoutPresenter(authStore, navigationStore);

const presenters = new Presenters(
  registrationPresenter, 
  postsPresenter,
  layoutPresenter,
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

