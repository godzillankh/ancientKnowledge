import { query, where, addDoc, doc, getDocs, setDoc, deleteDoc } from '@firebase/firestore';
import { collectionScreensFirebase } from '../firebaseConfig';
import { useContext, useEffect, useState } from 'react';
import { ScreensContext } from '../hooks/screensContext';
import { AuthContext } from '../hooks/authContext';
import { ScreenInterface, ScreenInterfaceWithId } from '../typesInterfaces/screenAndSection';

export function screensService() {
  const { user } = useContext(AuthContext);
  const { screensStore, setScreensStore } = useContext(ScreensContext);
  const [loading, setLoading] = useState(false);

  // Get user preference after login and remove it after logout
  useEffect(() => {
    if (user) {
      getScreens();
    }
  }, [user]);

  const getScreens = async () => {
    if (!user) {
      setScreensStore(undefined);
      return true;
    }

    setLoading(true);
    const docs = query(collectionScreensFirebase, where('userEmail', '==', user?.email));
    return await getDocs(docs)
      .then((querySnapshot) => {
        const nextScreensStore: ScreenInterfaceWithId[] = [];
        querySnapshot.forEach((doc) => {
          const screen: ScreenInterface = doc.data() as ScreenInterface;
          const screenWithId: ScreenInterfaceWithId = { ...screen, id: doc.id };
          nextScreensStore.push(screenWithId);
        });
        setScreensStore(nextScreensStore);
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const addScreen = async (screen: ScreenInterface) => {
    if (!user) return false;

    const nextScreen = { ...screen, userEmail: user?.email };

    setLoading(true);

    return await addDoc(collectionScreensFirebase, nextScreen)
      .then((doc) => {
        const nextScreenWithId: ScreenInterfaceWithId = { ...screen, id: doc.id };
        setScreensStore((screensStore || []).concat(nextScreenWithId));
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const removeScreen = async (id: string) => {
    return await deleteDoc(doc(collectionScreensFirebase, id))
      .then(() => {
        const nextDataItemStore = (screensStore || []).filter((item: ScreenInterfaceWithId) => item.id !== id);
        setScreensStore(nextDataItemStore);
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const updateScreen = async (screen: ScreenInterfaceWithId) => {
    setLoading(true);
    return await setDoc(
      doc(collectionScreensFirebase, screen.id),
      { ...screen },
      { merge: true },
    )
      .then(() => {
        const nextScreensStore = (screensStore || []).map((dataItem) => dataItem.id === screen.id ? screen : dataItem);
        setScreensStore(nextScreensStore);
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  return { loading, getScreens, addScreen, removeScreen, updateScreen };
}
