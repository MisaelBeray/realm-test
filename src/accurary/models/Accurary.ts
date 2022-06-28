import {ObjectSchema} from 'realm';

const AccurarySchema: ObjectSchema = {
  name: 'Accurary',
  properties: {
    _id: 'uuid',
    voltage: 'float?',
    current: 'float?',
    lag: 'float?',
  },
  primaryKey: '_id',
};

export default AccurarySchema;
