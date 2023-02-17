import { db } from "../config";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

class Grocery {
    constructor(groceryName, price, storeName) {
        this.itemName = groceryName;
        this.price = price;
        this.storeName = storeName;
    }
}

const GroceryConverter = {
    toFirestore: (grocery) => {
        return {
            itemName: grocery.itemName,
            price: grocery.price,
            storeName: grocery.storeName,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Grocery(data.itemName, data.price, data.storeName)
    }
};

async function addGroceryItem(itemName, price, storeName) {
    const newGrocery = new Grocery(itemName, price, storeName);
    const ref = doc(collection(db, "groceries")).withConverter(GroceryConverter)
    await setDoc(ref, newGrocery);
}

async function getAllGroceries() {
    const querySnapshot = await getDocs(collection(db, "groceries").withConverter(GroceryConverter));
    querySnapshot.forEach((doc) => {
        return doc.data().itemName;
    })
}


export { Grocery, GroceryConverter, addGroceryItem, getAllGroceries }