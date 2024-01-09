import axios from 'axios';

const FolderService = {
  handleCreate: async (userData, folder) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, parentUuid: folder.parentUuid, folderName: folder.name };
    
    await axios.post(process.env.REACT_APP_BACKEND_URL + '/folder/create', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });   
  },

  handleGet: async (userData, parentUuid) => { 
    return new Promise( async function(resolve, reject) {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}`};
      const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, parentUuid };
      
      await axios.post(process.env.REACT_APP_BACKEND_URL + '/folder/get', body, {headers})
      .then(res => {
        resolve(res.data);
        return(res.data);
      })
      .catch(err => {
        reject();
        return(err);
      });
    })
  },

  handleRename: async (userData, folder) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, folderUuid: folder.uuid, folderName: folder.name };

    await axios.put(process.env.REACT_APP_BACKEND_URL + '/folder/rename', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleRemove: async (userData, folder) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, folderUuid: folder.uuid };

    await axios.put(process.env.REACT_APP_BACKEND_URL + '/folder/remove', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleRecover: async (userData, folder) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, folderUuid: folder.uuid };

    await axios.put(process.env.REACT_APP_BACKEND_URL + '/folder/recover', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },

  handleDelete: async (userData, folder) => {
    const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
    const body = { userUuid: userData.userUuid, driveUuid: userData.driveUuid, folderUuid: folder.uuid };

    await axios.post(process.env.REACT_APP_BACKEND_URL + '/folder/delete', body, {headers})
    .then(res => {
      return(res.data);
    })
    .catch(err => {
      return(err);
    });  
  },
}

export default FolderService; 