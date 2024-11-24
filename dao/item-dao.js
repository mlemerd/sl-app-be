const fs = require("fs");
const path = require("path");

const itemFolderPath = path.join(__dirname, "storage", "itemList");

// Method to read an item from a file
function get(userId, listId) {
  try {
    const itemList = list();
    const item = itemList.find(
      (a) => a.userId === userId && a.listId === listId
    );
    return item;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadItem", message: error.message };
  }
}

// Method to update item in a file
function update(item) {
  try {
    const currentItem = get(item.userId, item.listId) || {};
    if (currentItem.file) {
      const filePath = path.join(itemFolderPath, currentItem.file);
      fs.unlinkSync(filePath);
    }
    const newItem = { ...currentItem, ...item };

    const filePath = path.join(
      itemFolderPath,
      `${newItem.userId}_${newItem.listId}_${newItem.item}.txt`
    );
    fs.writeFileSync(filePath, "", "utf8");
    return newItem;
  } catch (error) {
    throw { code: "failedToUpdateItem", message: error.message };
  }
}

// Method to remove an item from a file
function remove(userId, listId) {
  try {
    const item = get(userId, listId);
    if (item) {
      const filePath = path.join(itemFolderPath, item.file);
      fs.unlinkSync(filePath);
    }
    return {};
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw { code: "failedToRemoveItem", message: error.message };
  }
}

// Method to list items in a folder
function list() {
  try {
    const files = fs.readdirSync(itemFolderPath);
    const itemList = files.map((file) => {
      const itemData = file.replace(".txt", "").split("_");
      return {
        userId: itemData[0],
        listId: itemData[1],
        itemId: itemData[2],
        file,
      };
    });
    return itemList;
  } catch (error) {
    throw { code: "failedToListItems", message: error.message };
  }
}

function listMap() {
  const itemList = list();
  const itemMap = {};
  itemList.forEach((item) => {
    if (!itemMap[item.listId])
      itemMap[item.listId] = {};
    if (!itemMap[item.listId][item.userId])
      itemMap[item.listId][item.userId] = {};
    itemMap[item.listId][item.userId] = {
      item: item.item,
    };
  });
  return itemMap;
}

function userMap() {
  const itemList = list();
  const itemMap = {};
  itemList.forEach((item) => {
    if (!itemMap[item.userId])
      itemMap[item.userId] = {};
    if (!itemMap[item.userId][item.listId])
      itemMap[item.userId][item.listId] = {};
    itemMap[item.userId][item.listId] = {
      item: item.item,
    };
  });
  return itemMap;
}

module.exports = {
  get,
  update,
  remove,
  list,
  listMap,
  userMap,
};
