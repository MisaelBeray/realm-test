import Realm from "realm";

export interface IAccurary {
  _id: Realm.BSON.UUID;
  voltage?: number;
  current?: number;
  lag?: number;
}

export type IAccuraryObject = IAccurary & Realm.Object;