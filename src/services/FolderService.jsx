import axios from 'axios';

const FolderService = {
  handleCreate: async (userData, driveData, folderData) => {
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, folderData };
      
      await axios.post(process.env.REACT_APP_BACKEND_URL + '/folder/create', body, { headers })
      .then(res => {
        resolve(res.data.folderData);
      })
      .catch(err => {
        reject(err);
      });
    })
  },

  handleGetByUuid: async (userData, driveData, folderData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, folderData };
      
      await axios.post(process.env.REACT_APP_BACKEND_URL + '/folder/get/uuid', body, { headers })
      .then(res => {
        resolve(res.data.folderData);
      })
      .catch(err => {
        reject(err);
      });
    })
  },
  
  handleGetByPath: async (userData, driveData, folderData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, folderData };
      
      await axios.post(process.env.REACT_APP_BACKEND_URL + '/folder/get/path', body, { headers })
      .then(res => {
        resolve(res.data.folderData);
      })
      .catch(err => {
        reject(err);
      });
    })
  },

  handleRename: async (userData, driveData, folderData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, folderData };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/folder/rename', body, { headers })
      .then(res => {
        resolve(res.data.folderData);
      })
      .catch(err => {
        reject(err);
      });
    })
  },

  handleMove: async (userData, driveData, folderData) => {
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, folderData };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/folder/move', body, { headers })
      .then(res => {
        resolve(res.data.folderData);
      })
      .catch(err => {
        reject(err);
      });
    })
  },

  handleRemove: async (userData, driveData, folderData) => {
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, folderData };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/folder/remove', body, { headers })
      .then(res => {
        resolve(res.data.folderData);
      })
      .catch(err => {
        reject(err);
      });
    }) 
  },

  handleRecover: async (userData, driveData, folderData) => {
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };  
      const body = { userData, driveData, folderData };

      await axios.put(process.env.REACT_APP_BACKEND_URL + '/folder/recover', body, { headers })
      .then(res => {
        resolve(res.data.folderData);
      })
      .catch(err => {
        reject(err);
      });
    }) 
  },

  handleDelete: async (userData, driveData, folderData) => {
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, folderData };

      await axios.post(process.env.REACT_APP_BACKEND_URL + '/folder/delete', body, { headers })
      .then(res => {
        resolve(res.data.folderData);
      })
      .catch(err => {
        reject(err);
      });
    })  
  },
}

export default FolderService; 