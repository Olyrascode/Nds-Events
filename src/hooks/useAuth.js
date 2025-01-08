import { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (user) => {
    if (!user) return null;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          isAdmin: false,
          createdAt: new Date()
        });
        return { ...user, isAdmin: false };
      }
      
      return {
        ...user,
        isAdmin: userDoc.data().isAdmin || false
      };
    } catch (error) {
      console.error('Error checking admin status:', error);
      return user;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const userWithAdmin = await checkAdminStatus(user);
      setCurrentUser(userWithAdmin);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      isAdmin: false,
      createdAt: new Date()
    });
    return userCredential;
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return {
    currentUser,
    loading,
    signup,
    login,
    logout
  };
}