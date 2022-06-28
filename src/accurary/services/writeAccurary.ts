import getRealm from "../../infrastructure/realm";
import { IAccurary, IAccuraryObject } from "../models/interfaces/IAccurary";

let createdAccurary: IAccuraryObject;
const writeAccurary = async (data: IAccurary) => {
  const realm = await getRealm();

  realm.write(() => {
    createdAccurary = realm.create("Accurary", data);
  });

  return createdAccurary;
};

export default writeAccurary;