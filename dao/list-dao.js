const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const listFolderPath = path.join(__dirname, "storage", "listList");
const userFolderPath = path.join(__dirname, "storage", "userList");

// Method to read an list from a file
function get(listId) {
  try {
    const filePath = path.join(listFolderPath, `${listId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadList", message: error.message };
  }
}

// Method to write an list to a file
/* function create(list) {
  try {
    function get(userId) {
        const filePath = path.join(userFolderPath, `${userId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        const userName = fileData.name;
        return JSON.parse(userName);}
    
    /* const userPath = path.join(userFolderPath, `${userId}.json`)
    const userData = fs.readFileSync(userPath);
    const userName = userData.name; 
    function make(listFc) {
      listFc.id = crypto.randomBytes(16).toString("hex");
      const filePathFc = path.join(listFolderPath, `${listFc.id}.json`);
      const fileDataFc = JSON.stringify(listFc);
      return [filePathFc, fileDataFc]
    }

    const [filePath, fileData] = make(list)


    const filesData = fs.readFileSync(filePath, "utf8");
    const userId = filesData.userId
    fs.writeFileSync(filePath, fileData, get(userId), "utf8");
    return list;
  } catch (error) {
    throw { code: "failedToCreateList", message: error.message };
  }
} */

  function create(list) {
  try {
    function getUser(userId) {
      const filePath = path.join(userFolderPath, `${userId}.json`);
      const fileData = fs.readFileSync(filePath, "utf8");
      const user = JSON.parse(fileData);
      return user.name;
    }

    function make(list) {
      list.id = crypto.randomBytes(16).toString("hex");
      const filePath = path.join(listFolderPath, `${list.id}.json`);
      const fileData = JSON.stringify(list);
      return [filePath, fileData];
    }

    // Create list and get file path and data
    const [filePath, fileData] = make(list);

    // Write list data to file
    fs.writeFileSync(filePath, fileData, "utf8");

    // Read the newly written file to get the userId
    const savedListData = fs.readFileSync(filePath, "utf8");
    const parsedListData = JSON.parse(savedListData);
    const userId = parsedListData.userId;

    // Get user name
    const userName = getUser(userId);

    // Add user name to the list data
    parsedListData.userName = userName;

    // Write updated list data back to file
    fs.writeFileSync(filePath, JSON.stringify(parsedListData), "utf8");

    return parsedListData;
  } catch (error) {
    throw { code: "failedToCreateList", message: error.message };
  }
}

// Method to update list in a file
function update(list) {
  try {
    const currentList = get(list.id);
    if (!currentList) return null;
    const newList = { ...currentList, ...list };
    const filePath = path.join(listFolderPath, `${list.id}.json`);
    const fileData = JSON.stringify(newList);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newList;
  } catch (error) {
    throw { code: "failedToUpdateList", message: error.message };
  }
}

// Method to remove an list from a file
function remove(listId) {
  try {
    const filePath = path.join(listFolderPath, `${listId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveList", message: error.message };
  }
}

// Method to list lists in a folder
function list() {
  try {
    const files = fs.readdirSync(listFolderPath);
    const listList = files.map((file) => {
      const fileData = fs.readFileSync(
        path.join(listFolderPath, file),
        "utf8"
      );
      return JSON.parse(fileData);
    });
    listList.sort((a, b) => new Date(a.date) - new Date(b.date));
    return listList;
  } catch (error) {
    throw { code: "failedToListLists", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
