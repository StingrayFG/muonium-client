import { instance } from 'services/AxiosInstance';


const FolderService = {
  handleCreate: async (userData, driveData, folderData) => {
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, driveData, folderData };
      
      await instance.post('/folder/create', body, { headers })
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
      
      await instance.post('/folder/get/uuid', body, { headers })
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
      
      await instance.post('/folder/get/path', body, { headers })
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

      await instance.put('/folder/rename', body, { headers })
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

      await instance.put('/folder/move', body, { headers })
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

      await instance.put('/folder/remove', body, { headers })
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

      await instance.put('/folder/recover', body, { headers })
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

      await instance.post('/folder/delete', body, { headers })
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