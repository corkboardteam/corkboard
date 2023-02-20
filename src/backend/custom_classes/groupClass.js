import { doc, getDoc, setDoc, updateDoc, arrayUnion, 
        arrayRemove, increment, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

class GroupClass {
  constructor(groupID, groupName, groupDesc) {
    this.uid = groupID;
    this.name = groupName;
    this.desc = groupDesc;
    this.groupRef = doc(db, 'groups', groupID);
  }

  async createGroup(user) {
    try {
      // supposed to check if a user is in a group already by checking if their groupid is null or not but not working
      // if (user.groupID != null) {
      //   throw new Error('You are already in a group, Users are only allowed to be in one group at time');
      // }
        const groupDoc = await getDoc(this.groupRef);
        if (!groupDoc.exists()) { 
          const groupData = {
              ownerID: user.uid,
              uid: this.uid,
              name : this.name,
              desc : this.desc,
              members: arrayUnion(user.uid),
              totalMembers: 1
          }
          await setDoc(this.groupRef, groupData);
          console.log("Group Created:", groupData);

          const userRef = doc(db, 'users', user.uid);     
          await updateDoc(userRef, { groupID: this.uid }) // update user's group id
          return true;
        }
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  async joinGroup(user) {
    try {
      if (user.groupID != null) {
        throw new Error('You are already in a group, Users are only allowed to be in one group at time');
      }
      const groupDoc = await getDoc(this.groupRef);
      const groupData = groupDoc.data();
      if (groupDoc.exists()) {
        const members = groupDoc.data().members;
        if (members.includes(user.uid)) {
          throw new Error('User is already a member of this group');
        }
        await updateDoc(this.groupRef, { 
          members: arrayUnion(user.uid), 
          totalMembers: increment(1)
        });

        const userRef = doc(db, 'users', user.uid);      // update user's group id
        await updateDoc(userRef, { groupID: this.uid }) 

        console.log('Joined group:', groupData);
        return true;

      } else {
        throw new Error('Group does not exist');
      }
    } catch(error) {
      console.error('Error joining group:', error);
      throw error;
    }
  }

  async leaveGroup(user) {
    try {
      const groupDoc = await getDoc(this.groupRef);
      const groupData = groupDoc.data();
      if (!groupDoc.exists()) {
        throw new Error('Group does not exist');
      }
      const members = groupDoc.data().members;
      if (!members.includes(user.uid)) {
        throw new Error('User is not a member of this group');
      }
      await updateDoc(this.groupRef, { 
        members: arrayRemove(user.uid), 
        totalMembers: groupData.totalMembers - 1
      });
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { groupID: null })

      console.log('You have left the group: ', groupData);
      return true;

    } catch(error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }

  async updateGroup(user, newName, newDesc) {
    try {
      if (user.uid !== this.ownerID) {
        throw new Error('You do not have permissions to edit group info')
      }
      const groupDoc = await getDoc(this.groupRef);
      await updateDoc(this.groupRef, { 
        name: newName,
        desc: newDesc 
      });
      console.log('Group info updated');
      return true;
    } catch(error) {
      console.error('Error updating group:', error);
      throw error;
    } 
  }

  async deleteGroup(user) {
    try {
      const groupDoc = await getDoc(this.groupRef);
      if (!groupDoc.exists()) {
        throw new Error('Group does not exist');
      }
      const groupData = groupDoc.data();
      if (groupData.ownerID !== user.uid) {
        throw new Error('You are not the owner of this group');
      }
      await deleteDoc(this.groupRef);
      console.log('Group deleted');
      return true;

    } catch(error) {
      console.error('Error removing group:', error);
      throw error;
    }
  }
}

function generateUniqueID() {
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export { GroupClass, generateUniqueID };
