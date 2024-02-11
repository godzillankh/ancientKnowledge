import { query, where, addDoc, doc, getDocs, setDoc, deleteDoc } from '@firebase/firestore';
import { collectionDataFirebase } from '../firebaseConfig';
import { DataItemInterface, DataItemInterfaceWithId } from '../typesInterfaces/dataItem';
import { useContext, useState } from 'react';
import { DataContext } from '../hooks/dataContext';
import { AuthContext } from '../hooks/authContext';
import { imagesApiService } from './imagesApi';
import { useSearchParams } from 'react-router-dom';

export function dataItemApiService() {
  const { user } = useContext(AuthContext);
  const { dataStore, setDataStore } = useContext(DataContext);
  const { addImage } = imagesApiService();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const validUsers = [user?.email, searchParams.get('userEmail')].filter(userValue => !!userValue);

  const getDataItems = async () => {

    if (!validUsers.length) {
      setDataStore(undefined);
      return true;
    }

    setLoading(true);
    const docs = query(collectionDataFirebase, where('userEmail', 'in', validUsers));
    return await getDocs(docs)
      .then((querySnapshot) => {
        const nextDataStore: DataItemInterfaceWithId[] = [];
        querySnapshot.forEach((doc) => {

          const data: DataItemInterface = doc.data() as DataItemInterface;
          const dataWithId: DataItemInterfaceWithId = { ...data, id: doc.id };
          nextDataStore.push(dataWithId);
        });
        setDataStore(nextDataStore);
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const addDataItem = async (data: DataItemInterface) => {
    if (!user?.email) return false;

    if (data.image) {
      const imageId = await addImage({ dataImage: data.image, userEmail: user.email });
      if (imageId && typeof imageId === 'string') {
        data.image = imageId;
      } else {
        data.image = undefined;
      }
    }
    setLoading(true);
    return await addDoc(collectionDataFirebase, data)
      .then((doc) => {
        const nextDataItemWithId: DataItemInterfaceWithId = { ...data, id: doc.id };
        setDataStore((dataStore || []).concat([nextDataItemWithId]));
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const removeDataItem = async (id: string) => {
    return await deleteDoc(doc(collectionDataFirebase, id))
      .then(() => {
        const nextDataItemStore = (dataStore || []).filter((item: DataItemInterfaceWithId) => item.id !== id);
        setDataStore(nextDataItemStore);
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const updateDataItem = async (data: DataItemInterfaceWithId) => {
    setLoading(true);
    return await setDoc(
      doc(collectionDataFirebase, data.id),
      { ...data },
      { merge: true },
    )
      .then(() => {
        const nextDataStore = (dataStore || []).map((dataItem) => dataItem.id === data.id ? data : dataItem);
        setDataStore(nextDataStore);
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  return { loading, getDataItems, addDataItem, removeDataItem, updateDataItem };
}
