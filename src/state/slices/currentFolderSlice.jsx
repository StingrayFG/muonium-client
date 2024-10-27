import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import FolderService from 'services/FolderService.jsx'
import FileService from 'services/FileService.jsx'

import config from 'config.json';


// THUNKS
export const getFolder = createAsyncThunk(
  'folder/get',
  async ({ userData, driveData, folderData}, thunkAPI) => {
    return FolderService.handleGetByUuid(userData, driveData, folderData)
  },
);

export const uploadElement = createAsyncThunk(
  'elements/upload',
  async ({ userData, driveData, element, file}, thunkAPI) => {
    let newElement;   
    if (element.type === 'file') {
      await FileService.handleUpload(userData, driveData, element, file)
      .then(res => {
        newElement = res;   
      })
      .catch(() => {
        return thunkAPI.rejectWithValue(element);
      })
    }
    if (newElement) {
      return thunkAPI.fulfillWithValue(newElement);
    } else {
      return thunkAPI.rejectWithValueWithValue();
    } 
  },
);

export const createElement = createAsyncThunk(
  'elements/create',
  async ({ userData, driveData, element}, thunkAPI) => {
    let newElement;   
    if (element.type === 'folder') {
      await FolderService.handleCreate(userData, driveData, element)
      .then(res => {
        newElement = res;   
      })
    }
    if (newElement) {
      return thunkAPI.fulfillWithValue(newElement);
    } else {
      return thunkAPI.rejectWithValueWithValue();
    }
  },
);

export const renameElements = createAsyncThunk(
  'elements/rename',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') { 
        await FileService.handleRename(userData, driveData, element)
        .catch(() => failedElements.push(element))
      } else if (element.type === 'folder') { 
        await FolderService.handleRename(userData, driveData, element)
        .catch(() => failedElements.push(element))
      }
    } 

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
  },
);

export const copyElements = createAsyncThunk(
  'elements/copy',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') {
        await FileService.handleCopy(userData, driveData, element)
        .catch(() => failedElements.push(element))
      }
    }

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
  },
);

export const pasteElements = createAsyncThunk(
  'elements/paste',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') { 
        await FileService.handleMove(userData, driveData, element)
        .catch(() => failedElements.push(element))
      } else if (element.type === 'folder') { 
        await FolderService.handleMove(userData, driveData, element)
        .catch(() => failedElements.push(element))
      }
    } 

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
  },
);


export const moveElements = createAsyncThunk(
  'elements/move',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') { 
        await FileService.handleMove(userData, driveData, element)
        .catch(() => failedElements.push(element))
      } else if (element.type === 'folder') { 
        await FolderService.handleMove(userData, driveData, element)
        .catch(() => failedElements.push(element))
      }
    } 

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
  },
);

export const removeElements = createAsyncThunk(
  'elements/remove',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') {  
        await FileService.handleRemove(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      } else if (element.type === 'folder') { 
        await FolderService.handleRemove(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      }
    }  

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
  },
);

export const recoverElements = createAsyncThunk(
  'elements/recover',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') {  
        await FileService.handleRecover(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      } else if (element.type === 'folder') { 
        await FolderService.handleRecover(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      }
    }  

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
  },
);


export const deleteElements = createAsyncThunk(
  'elements/delete',
  async ({ userData, driveData, elements}, thunkAPI) => {
    let failedElements = [];

    for await (const element of elements) {
      if (element.type === 'file') {  
        await FileService.handleDelete(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      } else if (element.type === 'folder') { 
        await FolderService.handleDelete(userData, driveData, element)
        .catch(() => {failedElements.push(element)})
      }
    }  

    if (failedElements.length > 0) {
      return thunkAPI.rejectWithValue(failedElements);
    } else {
      return thunkAPI.fulfillWithValue();
    }
  },
);


// COMMON
const getSortedElements = (state, folders, files) => {
  state = parseToObject(state);
  if (state.showFoldersFirst) {
    if (state.sortBy === 'name') {
      return [
        ...folders.toSorted((a, b) => 
        state.sortByAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)),
        ...files.toSorted((a, b) => 
        state.sortByAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name))
      ]
    } else if ((state.sortBy === 'creationDate') || (state.sortBy === 'modificationDate')) {
      return ([
        ...folders.toSorted((a, b) => 
        state.sortByAscending ? !(new Date(b.date) - new Date(a.date)) : (new Date(b.date) - new Date(a.date))),
        ...files.toSorted((a, b) => 
        state.sortByAscending ? !(new Date(b.date) - new Date(a.date)) : (new Date(b.date) - new Date(a.date))),
      ])
    } else {
      return ([
        ...folders.toSorted((a, b) => 
        state.sortByAscending ? a.size - b.size : b.size - a.size),
        ...files.toSorted((a, b) => 
        state.sortByAscending ? a.size - b.size : b.size - a.size),
      ])
    }
  } 
}

const addElementsOnClient = (state, elements) => {
  state = parseToObject(state);
  if (elements.length > 0) {
    let updatedFiles = state.files;
    let updatedFolders = state.folders;

    for (const element of elements) {
      if (element.type === 'file') {
        updatedFiles.push(element);
      } else if (element.type === 'folder') {
        updatedFolders.push(element);
      }
    }

    return { 
      ...state, 
      files: updatedFiles,
      folders: updatedFolders,
      sortedElements: getSortedElements(state, updatedFolders, updatedFiles) 
    };
  } else {
    return state;
  }
}

const updateElementsOnClient = (state, elements) => {
  state = parseToObject(state);
  if (elements.length > 0) {
    let updatedFiles = state.files;
    let updatedFolders = state.folders;

    for (const element of elements) {
      if (element.type === 'file') {
        updatedFiles.find((file, index) => {
          if (file.uuid === element.uuid) {
            delete updatedFiles[index].originalElement;
            updatedFiles[index] = { ...element, originalElement: updatedFiles[index] };
          }
        })
      } else if (element.type === 'folder') {
        updatedFolders.find((folder, index) => {
          if (folder.uuid === element.uuid) {
            delete updatedFolders[index].originalElement;
            updatedFolders[index] = { ...element, originalElement: updatedFolders[index] };
          }
        })
      }
    }

    return { 
      ...state, 
      files: updatedFiles,
      folders: updatedFolders,
      sortedElements: getSortedElements(state, updatedFolders, updatedFiles) 
    };
  } else {
    return state;
  }
}

const revertUpdateElementsOnClient = (state, elements) => {
  state = parseToObject(state);
  if (elements.length > 0) {
    let updatedFiles = state.files;
    let updatedFolders = state.folders;

    for (const element of elements) {
      if (element.type === 'file') {
        updatedFiles.find((file, index) => {
          if (file.uuid === element.uuid) {
            updatedFiles[index] = updatedFiles[index].originalElement;
          }
        })
      } else if (element.type === 'folder') {
        updatedFolders.find((folder, index) => {
          if (folder.uuid === element.uuid) {
            updatedFolders[index] = updatedFolders[index].originalElement;
          }
        })
      }
    }

    return { 
      ...state, 
      files: updatedFiles,
      folders: updatedFolders,
      sortedElements: getSortedElements(state, updatedFolders, updatedFiles) 
    };
  } else {
    return state;
  }
}

const updateUuidToPermanent = (state, clientElement, serverElement) => {
  state = parseToObject(state);
  if (clientElement && serverElement) {
    let updatedFiles = state.files;
    let updatedFolders = state.folders;

    if (clientElement.type === 'file') {
      updatedFiles.find((file, index) => {
        if (file.uuid === clientElement.uuid) {
          updatedFiles[index] = { ...updatedFiles[index], ...serverElement };
        }
      })
    } else if (clientElement.type === 'folder') {
      updatedFolders.find((folder, index) => {
        if (folder.uuid === clientElement.uuid) { 
          updatedFolders[index] = { ...updatedFolders[index], ...serverElement };
        }
      })
    }

    return { 
      ...state, 
      files: updatedFiles,
      folders: updatedFolders,
      sortedElements: getSortedElements(state, updatedFolders, updatedFiles) 
    };
  } else {
    return state;
  }
}

const removeElementsOnClient = (state, elements) => {
  state = parseToObject(state);
  if (elements.length > 0) {
    let updatedFiles = state.files;
    let updatedFolders = state.folders;

    const elementsUuids = elements.map(element => element.uuid);

    updatedFiles = updatedFiles.filter(file => (!elementsUuids.includes(file.uuid)))
    updatedFolders = updatedFolders.filter(folder => (!elementsUuids.includes(folder.uuid)))

    return { 
      ...state, 
      files: updatedFiles,
      folders: updatedFolders,
      sortedElements: getSortedElements(state, updatedFolders, updatedFiles) 
    };
  } else {
    return state;
  }
}

const parseToObject = (state) => {
  return JSON.parse(JSON.stringify(state))
}


// SLICE
export const currentFolderSlice = createSlice({
  name: 'currentFolder',
  initialState: {
    uuid: '',
    files: [],
    folders: [],
    sortedElements: [],
    sortBy: JSON.parse(localStorage.getItem('settings')) ? 
    JSON.parse(localStorage.getItem('settings')).sortBy: config.defaultSettings.sortBy,
    sortByAscending: JSON.parse(localStorage.getItem('settings')) ? 
    JSON.parse(localStorage.getItem('settings')).sortByAscending : config.defaultSettings.sortByAscending,
    showFoldersFirst: JSON.parse(localStorage.getItem('settings')) ? 
    JSON.parse(localStorage.getItem('settings')).showFoldersFirst : config.defaultSettings.showFoldersFirst,
  },
  reducers: {
    syncSortingData: (state, action) => {
      let newState = { 
        ...parseToObject(state), 
        ...action.payload,
      };

      newState.sortedElements = getSortedElements(newState, newState.folders, newState.files)
      return newState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getFolder.fulfilled, (state, action) => {
      let newState = { 
        ...parseToObject(state), 
        ...action.payload,
      };

      newState.sortedElements = getSortedElements(newState, newState.folders, newState.files)
      return newState;
    });

    builder.addCase(uploadElement.pending, (state, action) => {
      return addElementsOnClient(state, [action.meta.arg.element]);
    });
    builder.addCase(uploadElement.rejected, (state, action) => {
      return removeElementsOnClient(state, [action.meta.arg.element]);
    });


    builder.addCase(createElement.pending, (state, action) => {
      return addElementsOnClient(state, [action.meta.arg.element]);
    });
    builder.addCase(createElement.fulfilled, (state, action) => {
      return updateUuidToPermanent(state, action.meta.arg.element, action.payload);
    });
    builder.addCase(createElement.rejected, (state, action) => {
      return removeElementsOnClient(state, [action.meta.arg.element]);
    });


    builder.addCase(renameElements.pending, (state, action) => {
      return updateElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(renameElements.rejected, (state, action) => {
      return revertUpdateElementsOnClient(state, action.payload);
    });


    builder.addCase(copyElements.pending, (state, action) => {
      return addElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(copyElements.rejected, (state, action) => {
      return removeElementsOnClient(state, action.payload);
    });


    builder.addCase(pasteElements.pending, (state, action) => {
      return addElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(pasteElements.rejected, (state, action) => {
      return removeElementsOnClient(state, action.payload);
    });


    builder.addCase(moveElements.pending, (state, action) => {
      return removeElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(moveElements.rejected, (state, action) => {
      return addElementsOnClient(state, action.payload);
    });


    builder.addCase(removeElements.pending, (state, action) => {
      return removeElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(removeElements.rejected, (state, action) => {
      return addElementsOnClient(state, action.payload);
    });


    builder.addCase(recoverElements.pending, (state, action) => {
      return removeElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(recoverElements.rejected, (state, action) => {
      return addElementsOnClient(state, action.payload);
    });


    builder.addCase(deleteElements.pending, (state, action) => {
      return removeElementsOnClient(state, action.meta.arg.elements);
    });
    builder.addCase(deleteElements.rejected, (state, action) => {
      return addElementsOnClient(state, action.payload);
    });
  },
});

export const { syncSortingData } = currentFolderSlice.actions;
