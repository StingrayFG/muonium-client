import axios from 'axios';

const BookmarkService = {
  handleCreate: async (userData, bookmarkData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, bookmarkData };
  
      await axios.post(process.env.REACT_APP_SERVER_URL + '/bookmark/create', body, { headers })
      .then(res => {
        resolve(res.data.bookmarkData);
      })
      .catch(err => {
        reject(err);
      });  
    })
  },

  handleGet: async (userData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData };
  
      await axios.post(process.env.REACT_APP_SERVER_URL + '/bookmark/get', body, { headers })
      .then(res => {
        resolve(res.data.bookmarksData);
      })
      .catch(err => {
        reject(err);
      });  
    })
  },

  handleDelete: async (userData, bookmarkData) => { 
    return new Promise(async (resolve, reject) => {
      const headers = { 'Authorization': `Bearer ${userData.accessToken}` };
      const body = { userData, bookmarkData };
  
      await axios.post(process.env.REACT_APP_SERVER_URL + '/bookmark/delete', body, { headers })
      .then(res => {
        resolve(res.data.bookmarkData);
      })
      .catch(err => {
        reject(err);
      });  
    })
  },
}

export default BookmarkService; 