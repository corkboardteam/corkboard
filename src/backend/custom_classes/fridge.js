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
    return ref.id
}

async function getFridge(groupName) {
    const fridgeRef = collection(db, "fridges");

    if (groupName == null) {
        alert("not in a group yet :(")
        return null

    }
    const q = query(fridgeRef, where("groupName", "==", groupName))

    const querySnapshot = await getDocs(q.withConverter(FridgeConverter));

    if (querySnapshot.length === 0) {
        alert("Hi! you're not in a group yet/ your group doesnt have a fridge")
        return null;
    }

    let fridge = []

    querySnapshot.forEach((doc) => {
        fridge.push({ data: doc.data(), id: doc.id })
    })

    return fridge[0];

}

async function addGroceryToFridge(itemName, maxQuantity, currentQuantity, groupName, storeName) {
    let grocery = await getSpecificGrocery(itemName); // data: Grocery object, id: autogenerated-id
    console.log(grocery)
    const fridge = await getFridge(groupName) //returns fridge object
    if (!fridge) {
        alert(`${groupName} is not a group`);
        return null;
    }

    if (grocery == null) {
        grocery = await addGroceryItem(itemName, 3, "target");
        //should change addGroceryItem eventually to only require itemName
        //currently it's fine since addGroceryItem ignores the other two arguments


    }
    //get the array
    let presentGroceries = fridge.data.groceries;

    const ind = presentGroceries.find(g => g.itemName === itemName)
    if (!ind) {
        //add to present Groceries list
        const newItem = {
            itemName: itemName,
            maxQuantity: maxQuantity,
            currentQuantity: currentQuantity,
            whereToBuy: storeName,
            price: grocery.data.price ? grocery.data.price : "undefined",
            priceUnit: grocery.data.priceUnit ? grocery.data.priceUnit : "undefined"
        };


        await updateDoc(doc(db, "fridges", fridge.id), {
            groceries: arrayUnion(newItem)
        })
        return { ...newItem, id: grocery.id };
    }
    else {
        alert("this item is already in your fridge!")
        return null;

        //would have to change this later, should decide as a group what to do in this case
    }
    return;
    //edit the fridge

}

async function removeGroceryFromFridge(itemName, groupID) {
    const fridge = await getFridge(groupID)
    let presentGroceries = fridge.data.groceries;
    console.log(presentGroceries)
    const ind = presentGroceries.findIndex(g => g.itemName === itemName)
    console.log(ind)
    if (ind === -1) {
        alert('this grocery is not in this fridge')
        return null;
    }

    //remove from fridge
    presentGroceries.splice(ind, ind + 1)
    await updateDoc(doc(db, "fridges", fridge.id), {
        groceries: presentGroceries
    })

}

export { Fridge, FridgeConverter, addNewFridge, getFridge, addGroceryToFridge, removeGroceryFromFridge }


