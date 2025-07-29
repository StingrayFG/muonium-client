
const commonUtils = {
  parseFileSizeToString: (size) => { 
    if (size > Math.pow(1024, 3)) { 
      return Math.floor(size / Math.pow(1024, 3) * 10) / 10 + ' GiB';
    } else if (size > Math.pow(1024, 2)) { 
      return Math.floor(size / Math.pow(1024, 2) * 10) / 10  + ' MiB';
    } else if (size > Math.pow(1024, 1)) { 
      return Math.floor(size / Math.pow(1024, 1) * 10) / 10  + ' KiB';
    } else if (size <= Math.pow(1024, 1)) { 
      return size + ' B';
    } 
  },
}

export default commonUtils; 