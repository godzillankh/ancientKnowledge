import { query, where, addDoc, doc, getDocs, deleteDoc } from '@firebase/firestore';
import { collectionImagesFirebase } from '../firebaseConfig';
import { useContext, useState } from 'react';
import { AuthContext } from '../hooks/authContext';
import { ImagesContext } from '../hooks/imagesContext';
import { ImagesInterface, ImagesItemInterface } from '../typesInterfaces/images';
import { useSearchParams } from 'react-router-dom';

export function imagesApiService() {
  const { user } = useContext(AuthContext);
  const { imagesStore, setImagesStore } = useContext(ImagesContext);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const validUsers = [user?.email, searchParams.get('userEmail')].filter(userValue => !!userValue);

  const getImages = async () => {

    if (!validUsers.length) {
      setImagesStore(undefined);
      return true;
    }

    setLoading(true);
    const docs = query(collectionImagesFirebase, where('userEmail', 'in', validUsers));
    const nextImagesStore: ImagesInterface = {};
    return await getDocs(docs)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data: ImagesItemInterface = doc.data() as ImagesItemInterface;
          nextImagesStore[doc.id] = data.dataImage;
          setImagesStore(nextImagesStore);
          return nextImagesStore;
        });
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const addImage = async (image: ImagesItemInterface) => {
    setLoading(true);
    return await addDoc(collectionImagesFirebase, image)
      .then((doc) => {
        setImagesStore({ ...imagesStore, [doc.id]: image.dataImage });
        return doc.id;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  const removeImage = async (id: string) => {
    return await deleteDoc(doc(collectionImagesFirebase, id))
      .then(() => {
        const nextImagesStore = JSON.parse(JSON.stringify(imagesStore));
        delete nextImagesStore[id];
        setImagesStore(nextImagesStore);
        return true;
      })
      .catch(() => {
        return false;
      }).finally(() => {
        setLoading(false);
      });
  }

  return { loading, getImages, addImage, removeImage };
}
