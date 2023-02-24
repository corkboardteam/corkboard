import { doc, setDoc, getDocs, collection, query, where, arrayUnion, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'
import { getSpecificGrocery, addGroceryItem } from './grocery';

class Fridge {
    constructor(groupName, users, groceries) {
        this.groupName = groupName; //should be a string containing username
        this.users = users; //should be an array of userIDs
        this.groceries = groceries; //should be an array of grocery IDs mapping to current quantity and max limit
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

async function addNewFridge(groupName, user) {
    //when initializing Fridge, we should add the creater of the fridge group to the user array
    //there shouldn't be any groceries yet
    const newFridge = new Fridge(groupName, [user], []);

    //tbd: do we want to have firebase autogenerate userIDs or let users define their own
    //or do we want to use the groupName as a fridge's id value
    const ref = doc(collection(db, "fridges")).withConverter(FridgeConverter);
    await setDoc(ref, newFridge);
}

async function getFridge(groupName) {
    const fridgeRef = collection(db, "fridges");
    const q = query(fridgeRef, where("groupName", "==", groupName))

    const querySnapshot = await getDocs(q.withConverter(FridgeConverter));

    if (querySnapshot.length === 0)
        return null;

    let fridge = []

    querySnapshot.forEach((doc) => {
        fridge.push({ data: doc.data(), id: doc.id })
    })

    return fridge[0];

}

async function addGroceryToFridge(itemName, maxQuantity, currentQuantity, groupName) {
    let grocery = await getSpecificGrocery(itemName); // data: Grocery object, id: autogenerated-id

    const fridge = await getFridge(groupName) //returns fridge object
    if (!fridge) {
        alert(`${groupName} is not a group`);
        return null;
    }

    if (grocery == null) {
        grocery = await addGroceryItem(itemName, 3, "target");

        //hardcoded price and store for now, need to figure out what to do in this scenario later
        //a valid solution would probably be to display a popup so that users can enter what they want as the price and store
    }
    //get the array
    let presentGroceries = fridge.data.groceries;

    const ind = presentGroceries.find(g => g.itemName === itemName)
    if (!ind) {
        //add to present Groceries list
        const newItem = { itemName: itemName, maxQuantity: maxQuantity, currentQuantity: currentQuantity };


        await updateDoc(doc(db, "fridges", fridge.id), {
            groceries: arrayUnion(newItem)
        })
        return { ...newItem, whereToBuy: grocery.data.storeName, id: grocery.id };
    }
    else {
        alert("this item is already in your fridge!")
        return null;

        //would have to change this later, should decide as a group what to do in this case
    }
    return;
    //edit the fridge

}


export { Fridge, FridgeConverter, addNewFridge, getFridge, addGroceryToFridge }


