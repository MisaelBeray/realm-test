import Realm from 'realm';
import AccurarySchema from '../accurary/models/Accurary';
import {IAccurary} from '../accurary/models/interfaces/IAccurary';

const changeSchemaAccurary = async () =>
  await Realm.open({
    path: 'myrealm',
    schema: [AccurarySchema],
    schemaVersion: 1,
    migration: (oldRealm, newRealm) => {
      if (oldRealm.schemaVersion < 1) {
        const oldObjects = oldRealm.objects<IAccurary>('Accurary');
        const newObjects = newRealm.objects<IAccurary>('Accurary');
        for (const objectIndex in oldObjects) {
          const oldObject = oldObjects[objectIndex];
          const newObject = newObjects[objectIndex];
          newObject.voltage =
            (oldObject.current || 0) - (oldObject?.lag || 0);
        }
      }
    },
  });

export default changeSchemaAccurary;
