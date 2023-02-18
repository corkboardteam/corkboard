import { db } from "../firebase";
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
    let allGroceries = []
    querySnapshot.forEach((doc) => {
        allGroceries.push({ data: doc.data(), id: doc.id });
    })

    return allGroceries;
}


export { Grocery, GroceryConverter, addGroceryItem, getAllGroceries }