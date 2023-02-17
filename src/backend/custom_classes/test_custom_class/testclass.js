import { Fridge, FridgeConverter } from '../fridge'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../config'
import { getAllGroceries } from '../grocery'
function TestClass() {

    async function addFridge() {


        const ref = doc(db, "fridges", "group1").withConverter(FridgeConverter);
        await setDoc(ref, new Fridge("group 1", ["bob"], ["lettuce"]));

    }

    addFridge();
    getAllGroceries()
    return (<div></div>)
}

export default TestClass