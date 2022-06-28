import Realm from 'realm';
import AccurarySchema from '../accurary/models/Accurary';
import { IAccurary } from '../accurary/models/interfaces/IAccurary';

const getRealm = async () =>
  await Realm.open({
    path: 'myrealm',
    schema: [AccurarySchema],
    schemaVersion: 1
  });

export default getRealm;
