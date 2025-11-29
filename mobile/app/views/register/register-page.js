import { Observable } from '@nativescript/core';
import { Frame } from '@nativescript/core';
import { apiService } from '../../services/api.service';

export function onNavigatingTo(args) {
  const page = args.object;
  const viewModel = new RegisterViewModel();
  page.bindingContext = viewModel;
  
  // Lier les champs de texte au viewModel
  const fullNameField = page.getViewById('fullNameField');
  const emailField = page.getViewById('emailField');
  const passwordField = page.getViewById('passwordField');
  const confirmPasswordField = page.getViewById('confirmPasswordField');
  
  if (fullNameField) {
    fullNameField.on('textChange', (args) => {
      viewModel.set('fullName', args.value);
    });
  }
  
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
  
  if (confirmPasswordField) {
    confirmPasswordField.on('textChange', (args) => {
      viewModel.set('confirmPassword', args.value);
    });
  }
}

class RegisterViewModel extends Observable {
  constructor() {
    super();
    this.fullName = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
  }

  async onRegister() {
    this.set('errorMessage', '');
    this.set('successMessage', '');

    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.set('errorMessage', 'Veuillez remplir tous les champs');
      return;
    }

    if (this.password.length < 8) {
      this.set('errorMessage', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.set('errorMessage', 'Les mots de passe ne correspondent pas');
      return;
    }

    this.set('isLoading', true);

    try {
      await apiService.register(this.email, this.password, this.fullName);
      this.set('successMessage', 'Inscription réussie ! Redirection...');
      
      setTimeout(() => {
        Frame.topmost().navigate({
          moduleName: 'views/profile/profile-page',
          clearHistory: true
        });
      }, 1000);
    } catch (error) {
      this.set('errorMessage', error.message || 'Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      this.set('isLoading', false);
    }
  }

  onNavigateToLogin() {
    Frame.topmost().goBack();
  }
}

