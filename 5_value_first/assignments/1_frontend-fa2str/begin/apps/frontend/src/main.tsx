import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './App'
import './index.css'
import { createAPIClient } from '@dddforum/api';
import { PostsPresenter } from './modules/posts/application/presenters/postsPresenter';
import { configure } from "mobx"
import { Presenters } from './shared/presenters/presenters';
import { PostsStore } from './modules/posts/repos/postsStore';
import { appConfig } from '@/config';
import { OnboardingPresenter } from '@/modules/auth/application/presenters/onboardingPresenter'

import { LayoutPresenter } from './shared/layout/layoutPresenter';
import { AuthStore } from './modules/auth/authStore';
import { ToastAPI } from './shared/toast/toastAPI';
import { Stores } from './shared/store/stores';

import { FirebaseAPIClient } from './modules/auth/firebaseAPI';
import { NavigationStore } from './shared/navigation/navigationStore';
import { PostDetailsPresenter } from './modules/posts/application/presenters/postDetailsPresenter';
import { SubmissionPresenter } from './modules/posts/application/presenters/submissionPresenter';
import { CommentsPresenter } from './modules/comments/application/presenters/commentsPresenter';
import { CommentsStore } from '@/modules/comments/repos/commentsStore';
import { RegistrationPresenter } from './modules/auth/application/presenters/registrationPresenter';

configure({ enforceActions: "never" })

const apiClient = createAPIClient('http://localhost:3000');

const toastAPI = new ToastAPI();

const firebaseAPI = new FirebaseAPIClient(appConfig.firebase);

// Make stores
const authStore = new AuthStore(
  apiClient,
  firebaseAPI
);

const postsStore = new PostsStore(apiClient, authStore);
const navigationStore = new NavigationStore();
const commentsStore = new CommentsStore(apiClient);

const stores = new Stores(
  authStore,
  postsStore,
  navigationStore,
  commentsStore
);

// Make presenters
const onboardingPresenter = new OnboardingPresenter(
  navigationStore,
  authStore,
);
const postsPresenter = new PostsPresenter(
  postsStore, 
  authStore
);

const registrationPresenter = new RegistrationPresenter(
  navigationStore, 
  authStore
);
const submissionPresenter = new SubmissionPresenter(
  authStore,
  navigationStore,
  postsStore
);

const layoutPresenter = new LayoutPresenter(authStore, navigationStore);
const postDetailsPresenter = new PostDetailsPresenter(postsStore, authStore);
const commentsPresenter = new CommentsPresenter(commentsStore, authStore);

const presenters = new Presenters(
  onboardingPresenter, 
  registrationPresenter, 
  postsPresenter,
  submissionPresenter,
  layoutPresenter,
  postDetailsPresenter,
  commentsPresenter
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

