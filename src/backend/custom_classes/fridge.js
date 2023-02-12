import { doc, setDoc, getDoc } from 'firebase/firestore';
import db from '../config'

class Fridge {
    constructor(groupName, users, groceries) {
        this.groupName = groupName;
        this.users = users;
        this.groceries = groceries;
    }
}

const FridgeConverter = {
    toFirestore: (fridge) => {
        return {
            groupName: fridge.groupName,
            users: fridge.users,
            groceries: fridge.groceries
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Fridge(data.groupName, data.users, data.groceries)
    }
};

export { Fridge, FridgeConverter }


