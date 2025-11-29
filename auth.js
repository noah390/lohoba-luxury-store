// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjt8ZbkaUusAT7oxn1lh-d0aMzxI3ERpg",
  authDomain: "lohoba-luxury.firebaseapp.com",
  projectId: "lohoba-luxury",
  storageBucket: "lohoba-luxury.firebasestorage.app",
  messagingSenderId: "967128471724",
  appId: "1:967128471724:web:84df89cdeb33defcb7e709",
  measurementId: "G-7GQH4VTP6D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Check if user is authenticated
function checkAuth() {
  return new Promise((resolve) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(true);
      } else if (!window.location.pathname.includes('auth.html')) {
        window.location.href = 'auth.html';
        resolve(false);
      } else {
        resolve(false);
      }
    });
  });
}

// Sign Up
function signUp(event) {
  event.preventDefault();
  
  const name = document.getElementById('signUpName').value;
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;
  
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      return userCredential.user.updateProfile({
        displayName: name
      });
    })
    .then(() => {
      alert('Account created successfully!');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });
}

// Sign In
function signIn(event) {
  event.preventDefault();
  
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert('Welcome back!');
      window.location.href = 'index.html';
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });
}

// Show Sign Up Form
function showSignUp() {
  document.getElementById('signInForm').style.display = 'none';
  document.getElementById('forgotPasswordForm').style.display = 'none';
  document.getElementById('signUpForm').style.display = 'block';
}

// Show Sign In Form
function showSignIn() {
  document.getElementById('signUpForm').style.display = 'none';
  document.getElementById('forgotPasswordForm').style.display = 'none';
  document.getElementById('signInForm').style.display = 'block';
}

// Show Forgot Password Form
function showForgotPassword() {
  document.getElementById('signInForm').style.display = 'none';
  document.getElementById('signUpForm').style.display = 'none';
  document.getElementById('forgotPasswordForm').style.display = 'block';
}

// Reset Password
function resetPassword(event) {
  event.preventDefault();
  
  const email = document.getElementById('resetEmail').value;
  
  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert('Password reset email sent! Check your inbox.');
      showSignIn();
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });
}



// Sign Out
function signOut() {
  auth.signOut().then(() => {
    window.location.href = 'auth.html';
  });
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('auth.html')) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.href = 'index.html';
      }
    });
  } else {
    checkAuth();
  }
});