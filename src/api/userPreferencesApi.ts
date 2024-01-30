import { query, where, addDoc, doc, getDocs, setDoc, deleteDoc } from '@firebase/firestore';
import { collectionUsersPreferencesFirebase } from '../firebaseConfig';
import { UserPreferenceInterface, UserPreferenceInterfaceWithId } from '../typesInterfaces/userPreference';
import { UserPreferencesContext } from '../hooks/userPreferences';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../hooks/authContext';

export function userPreferencesApiService() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { setUserPreferenceStore } = useContext(UserPreferencesContext);

  // Get user preference after login and remove it after logout
  useEffect(() => {
    getUsersPreferences();
  }, [user]);

  const getUsersPreferences = async () => {
    if (!user) {
      setUserPreferenceStore(undefined);
      return true;
    }

    setLoading(true);
    const docs = query(collectionUsersPreferencesFirebase, where('userEmail', '==', user?.email));
    return await getDocs(docs)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const userPreference: UserPreferenceInterface = doc.data() as UserPreferenceInterface;
          const userPreferenceWithId: UserPreferenceInterfaceWithId = { ...userPreference, id: doc.id };
          setUserPreferenceStore(userPreferenceWithId);
        });
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const addUserPreference = async (userPreference: UserPreferenceInterface) => {
    setLoading(true);

    return await addDoc(collectionUsersPreferencesFirebase, userPreference)
      .then((doc) => {
        const nextUserPreferenceWithId: UserPreferenceInterfaceWithId = { ...userPreference, id: doc.id };
        setUserPreferenceStore(nextUserPreferenceWithId);
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const removeUserPreference = async (id: string) => {
    return await deleteDoc(doc(collectionUsersPreferencesFirebase, id))
      .then(() => {
        setUserPreferenceStore(undefined);
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const updateUserPreference = async (userPreference: UserPreferenceInterfaceWithId) => {
    setLoading(true);
    return await setDoc(
      doc(collectionUsersPreferencesFirebase, userPreference.id),
      { ...userPreference },
      { merge: true },
    )
      .then(() => {
        setUserPreferenceStore(userPreference);
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  return { loading, getUsersPreferences, addUserPreference, removeUserPreference, updateUserPreference };
}
