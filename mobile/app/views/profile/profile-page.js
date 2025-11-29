import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { apiService } from '../../services/api.service';
import { isAuthenticated } from '../../services/storage.service';

export function onNavigatingTo(args) {
  const page = args.object;
  page.bindingContext = new ProfileViewModel();
  
  const viewModel = page.bindingContext;
  viewModel.loadProfile();
}

class ProfileViewModel extends Observable {
  constructor() {
    super();
    this.fullName = '';
    this.email = '';
    this.errorMessage = '';
    this.isLoading = false;
  }

  async loadProfile() {
    if (!isAuthenticated()) {
      Frame.topmost().navigate({
        moduleName: 'views/login/login-page',
        clearHistory: true
      });
      return;
    }

    this.set('isLoading', true);
    this.set('errorMessage', '');

    try {
      const response = await apiService.getProfile();
      if (response.success && response.user) {
        this.set('fullName', response.user.full_name);
        this.set('email', response.user.email);
      }
    } catch (error) {
      this.set('errorMessage', error.message || 'Échec du chargement du profil');
      // Si le token est invalide, rediriger vers la connexion
      if (error.message && (error.message.includes('token') || error.message.includes('Unauthorized'))) {
        setTimeout(() => {
          Frame.topmost().navigate({
            moduleName: 'views/login/login-page',
            clearHistory: true
          });
        }, 2000);
      }
    } finally {
      this.set('isLoading', false);
    }
  }

  async onLogout() {
    this.set('isLoading', true);
    
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    } finally {
      Frame.topmost().navigate({
        moduleName: 'views/login/login-page',
        clearHistory: true
      });
    }
  }
}

