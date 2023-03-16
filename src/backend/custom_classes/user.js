import { doc, query, where, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';

class User {
  constructor(user) {
    this.userRef = doc(db, 'users', user.uid);
    this.userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      phoneNumber: user.phoneNumber,
      fridge: null,
      groupID: null,
      trips: user.trips
    };
  }

  async exists() {
    const userDoc = await getDoc(this.userRef);
    return userDoc.exists();
  }

  async data() {
    const userDoc = await getDoc(this.userRef);
    const userData = userDoc.data();
    return userData;
  }

  async createUser() {
    try {
      await setDoc(this.userRef, this.userData);
      const newUserData = await this.data();
      console.log('User created: ', newUserData);
    } catch (error) {
      console.error('Error creating new user', error)
      throw error;
    }
  }

  async updateUser(newUserInfo) {
    try {
      await setDoc(this.userRef, newUserInfo)
    }
    catch (error) {
      console.error(error)
    }
  }


  async getAllUsers() {

    const querySnapshot = await getDocs(collection(db, "users"));

    let users = []
    querySnapshot.forEach((doc) => {
      users.push(doc.data())

    });

    return users
  }

  async getAllUsersWithGroupID(groupID) {
    try {
      const usersCollection = collection(db, 'users');
      const groupQuery = query(usersCollection, where('groupID', '==', groupID));
      const querySnapshot = await getDocs(groupQuery);
  
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
  
      return users;
    } catch (error) {
      console.error('Error fetching users with specific groupID:', error);
      throw error;
    }
  }
}

export default User;