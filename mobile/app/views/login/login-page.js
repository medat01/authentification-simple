import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { apiService } from '../../services/api.service';

export function onNavigatingTo(args) {
  const page = args.object;
  const viewModel = new LoginViewModel();
  page.bindingContext = viewModel;
  
  // Lier les champs de texte au viewModel
  const emailField = page.getViewById('emailField');
  const passwordField = page.getViewById('passwordField');
  
  if (emailField) {
    emailField.on('textChange', (args) => {
      viewModel.set('email', args.value);
    });
  }
  
  if (passwordField) {
    passwordField.on('textChange', (args) => {
      viewModel.set('password', args.value);
    });
  }
}

class LoginViewModel extends Observable {
  constructor() {
    super();
    this.email = '';
    this.password = '';
    this.errorMessage = '';
    this.isLoading = false;
  }

  async onLogin() {
    if (!this.email || !this.password) {
      this.set('errorMessage', 'Veuillez remplir tous les champs');
      return;
    }

    this.set('isLoading', true);
    this.set('errorMessage', '');

    try {
      await apiService.login(this.email, this.password);
      Frame.topmost().navigate({
        moduleName: 'views/profile/profile-page',
        clearHistory: true
      });
    } catch (error) {
      this.set('errorMessage', error.message || 'Échec de la connexion. Vérifiez vos identifiants.');
    } finally {
      this.set('isLoading', false);
    }
  }

  onNavigateToRegister() {
    Frame.topmost().navigate({
      moduleName: 'views/register/register-page'
    });
  }
}

