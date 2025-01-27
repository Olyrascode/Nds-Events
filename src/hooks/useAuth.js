// import { useState, useEffect } from 'react';
// import { auth, db } from '../firebase/config';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   signOut, 
//   onAuthStateChanged 
// } from 'firebase/auth';

// export function useAuth() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const checkAdminStatus = async (user) => {
//     if (!user) return null;
//     try {
//       const userDocRef = doc(db, 'users', user.uid);
//       const userDoc = await getDoc(userDocRef);
      
//       if (!userDoc.exists()) {
//         await setDoc(userDocRef, {
//           email: user.email,
//           isAdmin: false,
//           createdAt: new Date()
//         });
//         return { ...user, isAdmin: false };
//       }
      
//       return {
//         ...user,
//         isAdmin: userDoc.data().isAdmin || false
//       };
//     } catch (error) {
//       console.error('Error checking admin status:', error);
//       return user;
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       const userWithAdmin = await checkAdminStatus(user);
//       setCurrentUser(userWithAdmin);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const signup = async (email, password) => {
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     await setDoc(doc(db, 'users', userCredential.user.uid), {
//       email,
//       isAdmin: false,
//       createdAt: new Date()
//     });
//     return userCredential;
//   };

//   const login = async (email, password) => {
//     return signInWithEmailAndPassword(auth, email, password);
//   };

//   const logout = () => {
//     return signOut(auth);
//   };

//   return {
//     currentUser,
//     loading,
//     signup,
//     login,
//     logout
//   };
// }
import { useState, useEffect } from 'react';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Vérifier le token et récupérer les informations utilisateur
  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserDetails(token)
        .then((userData) => {
          if (userData) {
            setCurrentUser(userData); // Met à jour l'utilisateur avec `isAdmin`
          }
        })
        .catch(() => setCurrentUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data = await response.json();
      setCurrentUser({ email, isAdmin: false });
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token); // Enregistrer le token JWT
      setCurrentUser(data.user); // Backend retourne l'utilisateur, y compris `isAdmin`
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Supprimer le token JWT
    setCurrentUser(null);
  };

  return {
    currentUser,
    loading,
    signup,
    login,
    logout,
  };
}
