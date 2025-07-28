import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ContextMenuContext } from 'contexts/ContextMenuContext.jsx';

import { deleteBookmark } from 'state/slices/bookmarkSlice';
import { setColumnIsEnabled } from 'state/slices/settingsSlice';

import CommonContextMenu from 'pages/drive/menus/CommonContextMenu/CommonContextMenu';
import CustomCheckbox from 'components/checkbox/CustomCheckbox';


export default function ColumnsContextMenu ({ bookmark }) {
  const dispatch = useDispatch();

  const userData = useSelector(state => state.user);
  const settingsData = useSelector(state => state.settings);

  const contextMenuContext = useContext(ContextMenuContext)

  const getIcon = (name) => {
    if (settingsData.listViewColumns.find(column => column.name === name).isEnabled) {
      return 'checkbox-on';
    } else {
      return 'checkbox-off';
    }
  }

  const handleOnClick = (name) => {
    dispatch(setColumnIsEnabled({
      name,
      isEnabled: !settingsData.listViewColumns.find(column => column.name === name).isEnabled
    }))
    contextMenuContext.setIsContextMenuOpen(false);
  }

  const options = [
    { text: 'Size', icon: getIcon('size'), 
    handleOnClick: () => handleOnClick('size') },
    { text: 'Created', icon: getIcon('creationDate'), 
    handleOnClick: () => handleOnClick('creationDate') },
    { text: 'Modified', icon: getIcon('modificationDate'), 
    handleOnClick: () => handleOnClick('modificationDate') },
    { text: 'Type', icon: getIcon('type'), 
    handleOnClick: () => handleOnClick('type') },
  ] 

  return (
    <CommonContextMenu options={options} />  
  );
};
