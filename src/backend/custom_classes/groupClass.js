import {
  doc, getDoc, setDoc, updateDoc, arrayUnion,
  arrayRemove, increment, deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { addNewFridge, Fridge } from './fridge';
import { UserAuth } from '../authContext';

class GroupClass {
  constructor(groupID, fridgeID) {
    this.uid = groupID;
    this.ownerID = null;
    this.name = null;
    this.desc = null;
    this.members = null;
    this.totalMembers = null;
    this.groupRef = doc(db, 'groups', groupID);
    this.fridge = fridgeID;
  }

  async createGroup(user, groupName = null, groupDesc = null) {
    try {
      // supposed to check if a user is in a group already by checking if their groupid is null or not but not working
      // if (user.groupID != null) {
      //   throw new Error('You are already in a group, Users are only allowed to be in one group at time');
      // }
      console.log(user)
      console.log(this.uid)
      const fridgeID = await addNewFridge(this.uid, user.uid)
      const groupDoc = await getDoc(this.groupRef);

      if (!groupDoc.exists()) {
        const groupData = {
          ownerID: user.uid,
          uid: this.uid,
          name: groupName,
          desc: groupDesc,
          members: arrayUnion(user.uid),
          totalMembers: 1,
          fridge: fridgeID
        }
        await setDoc(this.groupRef, groupData);
        console.log("Group Created:", groupData);


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
      if (groupDoc.exists()) {
        const groupData = groupDoc.data();
        const members = groupData.members;
        if (members.includes(user.uid)) {
          throw new Error('User is already a member of this group');
        }
        await updateDoc(this.groupRef, {
          members: arrayUnion(user.uid),
          totalMembers: increment(1)
        });


        console.log('Joined group: ' + groupData.name, groupData);
        return true;

      } else {
        throw new Error('Group does not exist');
      }
    } catch (error) {
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
        totalMembers: (groupData.totalMembers) - 1
      });

      console.log('Left group: ' + groupData.name, groupData);
      return true;

    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }

  async updateGroupInfo(user, newName, newDesc) {
    try {
      if (user.uid !== this.ownerID) {
        throw new Error('You do not have permissions to edit group info')
      }
      const groupDoc = await getDoc(this.groupRef);
      const groupData = groupDoc.data();
      const newGroupData = {
        name: newName,
        desc: newDesc
      }
      const updatedGroupData = { ...groupData, ...newGroupData };
      await updateDoc(this.groupRef, updatedGroupData);

      console.log('Group info updated');
      return true;
    } catch (error) {
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

    } catch (error) {
      console.error('Error removing group:', error);
      throw error;
    }
  }
}


function generateGroupUID() {
  const length = 8;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export { GroupClass, generateGroupUID };
