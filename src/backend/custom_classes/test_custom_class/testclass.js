import { Fridge, FridgeConverter } from '../fridge'
import { getDoc, setDoc, doc } from 'firebase/firestore'
import db from '../../config'

function TestClass() {

    async function addFridge() {
        console.log('add fridge')
        const ref = doc(db, "fridges", "group1").withConverter(FridgeConverter);
        await setDoc(ref, new Fridge("group 1", ["bob"], ["lettuce"]));

    }

    addFridge();
    return (<div></div>)
}

export default TestClass