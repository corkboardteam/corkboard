import { Fridge, FridgeConverter } from '../fridge'
import { getDoc, setDoc, doc } from 'firebase/firestore'
import db from '../../firebase'
import { getAllGroceries, Grocery } from '../grocery'
import GroceryList from '../../../frontend/components/GroceryList'
function TestClass() {

    async function addFridge() {


        const ref = doc(db, "fridges", "group1").withConverter(FridgeConverter);
        await setDoc(ref, new Fridge("group 1", ["bob"], ["lettuce"]));

    }

    addFridge();
    getAllGroceries()
    return (
        <div>
            <GroceryList />
        </div>
    )
}

export default TestClass