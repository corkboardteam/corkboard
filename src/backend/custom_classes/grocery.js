import { db } from "../firebase";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import axios from "axios";

class Grocery {
    constructor(groceryName, price, priceUnit) {
        this.itemName = groceryName;
        this.price = price;
        // this.storeName = storeName;
        this.priceUnit = priceUnit
    }
}

const GroceryConverter = {
    toFirestore: (grocery) => {
        return {
            itemName: grocery.itemName,
            price: grocery.price,
            priceUnit: grocery.priceUnit,
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Grocery(data.itemName, data.price, data.priceUnit)
    }
};

async function addGroceryItem(itemName, price, storeName) {
    async function getGroceryIDFromApi(itemName) {
        try {
            const res = await axios.get(`https://api.spoonacular.com/food/ingredients/autocomplete?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&query=${itemName}&number=1&metaInformation=true`)
            if (res.data.length === 0)
                return null
            else
                return res.data[0].id
        }
        catch (error) {
            console.error("An error happened while getting data from the database")
            return null
        }


    }

    async function getPriceFromApi(itemName) {
        const id = await getGroceryIDFromApi(itemName)
        if (id === null)
            return null

        try {
            const price = await axios.get(`https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}&amount=1`)
            console.log(price)
            const estimatedCost = price.data.estimatedCost; //{value: some value, unit: US cents, some other currency}
            console.log(estimatedCost)
            return estimatedCost
        }
        catch (error) {
            console.error("There was some trouble connecting to the grocery database")
            return null
        }
    }

    const productPrice = await getPriceFromApi(itemName)
    let newGrocery;
    if (productPrice === null)
        newGrocery = new Grocery(itemName, -1, "");
    else
        newGrocery = new Grocery(itemName, productPrice.value, productPrice.unit);

    const ref = doc(collection(db, "groceries")).withConverter(GroceryConverter)
    await setDoc(ref, newGrocery);

    const obj = { data: newGrocery, id: ref.id }
    return obj
}

async function getAllGroceries() {
    const querySnapshot = await getDocs(collection(db, "groceries").withConverter(GroceryConverter));
    let allGroceries = []
    querySnapshot.forEach((doc) => {
        allGroceries.push({ data: doc.data(), id: doc.id });
    })

    return allGroceries;
}

async function getSpecificGrocery(itemName) {
    const groceriesRef = collection(db, "groceries");
    const q = query(groceriesRef, where("itemName", "==", itemName))

    const querySnapshot = await getDocs(q.withConverter(GroceryConverter));
    if (querySnapshot.size == 0)
        return null;

    let docs = []
    querySnapshot.forEach((doc) => {
        docs.push({ data: doc.data(), id: doc.id })
    })

    return docs[0];

}

export { Grocery, GroceryConverter, addGroceryItem, getAllGroceries, getSpecificGrocery }