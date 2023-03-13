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
    this.groupRef = doc(db, 'groups', groupID);
    this.fridge = fridgeID;
  }

  async exists() {
    const groupDoc = await getDoc(this.groupRef);
    return groupDoc.exists();
  }

  async data() {
    const groupDoc = await getDoc(this.groupRef);
    const groupData = groupDoc.data();
    return groupData;
  }


  async createGroup(user, groupName) {
    try {
      const exists = await this.exists();
      if (!exists) {
        const fridgeID = await addNewFridge(this.uid, user.uid);
        const member = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        }; 
        const groupData = {
          owner: member,
          uid: this.uid,
          name: groupName,
          desc: null,
          fridge: fridgeID,
          members: arrayUnion(member),
          totalMembers: 1
        }
        await setDoc(this.groupRef, groupData);
        console.log("Group Created:", groupData);
        console.log(user);

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

      const exists = await this.exists();
      if (exists) {
        const data = await this.data();
        const members = data.members;
        const userIsMember = members.some(member => member.uid === user.uid);
        if (userIsMember) {
          throw new Error('User is already a member of this group');
        }
        const member = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
        }; 
        await updateDoc(this.groupRef, {
          members: arrayUnion(member),
          totalMembers: increment(1)
        });

        console.log('Joined group: ' + data.name, data);
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
      const exists = await this.exists();
      if (!exists) {
        throw new Error('Group does not exist');
      }
      const data = await this.data();
      const members = data.members;
      const userIsMember = members.some(member => member.uid === user.uid);
      const member = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      };

      // check if user is a member of the group
      if (!userIsMember) {
        throw new Error('User is not a member of this group');
      }
      
      if (data.ownerID === user.uid) {
        // select a random member to be the new owner if owner leaves
        const newOwnerIndex = Math.floor(Math.random() * members.length);
        const newOwner = members[newOwnerIndex];
        
        await updateDoc(this.groupRef, {
          members: arrayRemove(member),
          totalMembers: data.totalMembers - 1,
          owner: newOwner
        });
        console.log('Left group: ' + data.name, data);
        return true;

        // check if user is the last member in group, if they are leave and delete group
      } else if (data.totalMembers === 1 && userIsMember) {
        await updateDoc(this.groupRef, {
          members: arrayRemove(member),
          totalMembers: data.totalMembers - 1
        });

        await deleteDoc(this.groupRef);
        console.log('Left and deleted group: ' + data.name);
        return true;

        // leave group normally
      } else {
        await updateDoc(this.groupRef, {
          members: arrayRemove(member),
          totalMembers: data.totalMembers - 1
        });
        console.log('Left group: ' + data.name, data);
        return true;
      }

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
      const newGroupData = {
        name: newName,
        desc: newDesc
      }
      const data = await this.data();
      const updatedGroupData = { ...data, ...newGroupData };
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
      const exists = await this.exists();
      if (!exists) {
        throw new Error('Group does not exist');
      }
      const data = await this.data();
      const member = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
      };
      
      // const groupData = groupDoc.data();
      if (data.owner !== member) {
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



async function generateGroupUID() {
  const length = 8;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export { GroupClass, generateGroupUID };
