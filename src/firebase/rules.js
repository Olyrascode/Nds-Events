// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Packs collection
    match /packs/{packId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        isAdmin()
      );
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        isAdmin()
      );
    }
    
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

// Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    match /products/{fileName} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}