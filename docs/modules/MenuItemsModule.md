# Menu Items Module

Manages individual menu items, including creation, editing, and dietary tagging.

---

## **Table of Contents**

- **Features**
- **API Integration**
- **State Management**
- **Error Handling**
- **Styling**
- **Dependencies**

---

## **Features**

| **Feature**          | **Description**                         | **Component**          | **File**                |
| -------------------- | --------------------------------------- | ---------------------- | ----------------------- |
| **Item Creation**    | Add new menu items with allergens/diets | **`AddMenuItemForm`**  | **`AddMenuItem.jsx`**   |
| **Search & Filter**  | Filter items by name                    | **`MenuItemsPage`**    | **`MenuItemsPage.jsx`** |
| **Item Editing**     | Modify name/description/ingredients     | **`MenuItemPanel`**    | **`MenuItemPanel.jsx`** |
| **Item Deletion**    | Delete a menuItem from database         | **`MenuItemPanel`**    | **`MenuItemPanel.jsx`** |
| **Allergen Tagging** | Track allergens per item                | **`AllergenList`**     | **`AllergenList.jsx`**  |
| **Menu Assignment**  | Assign items to multiple menus          | **`MenuItemPicklist`** | **`MenuItemSwap.jsx`**  |
| **Search & Filter**  | Filter items by name                    | **`MenuItemPicklist`** | **`MenuItemSwap.jsx`**  |

---

## **API Integration**

### **Endpoints**

| **Endpoint**                                    | **Method**   | **Payload**                                     | **Called In**               | **File**                |
| ----------------------------------------------- | ------------ | ----------------------------------------------- | --------------------------- | ----------------------- |
| **`/api/menuitems/add-menu-item`**              | **`POST`**   | **`{ name, description, allergens, menuIDs }`** | **`handleSave()`**          | **`AddMenuItem.jsx`**   |
| **`/api/menuitems/menu/:menuname&:businessID`** | **`GET`**    | **`{ encodedMenuName, businessID }`**           | **`fetchMenu()`**           | **`MenuItemPanel.jsx`** |
| **`/api/menuitems/:id`**                        | **`GET`**    | **`{ menuID }`**                                | **`fetchMenuItems()`**      | **`MenuItemPanel.jsx`** |
| **`/api/menuitems/:id`**                        | **`PUT`**    | **`{ name, description, ingredients }`**        | **`handleSave()`**          | **`MenuItemPanel.jsx`** |
| **`/api/menuitems/:id`**                        | **`DELETE`** | None                                            | **`handleConfirmDelete()`** | **`MenuItemPanel.jsx`** |
| **`/api/menuitems//menuswap-menus`**            | **`GET`**    | **`businessID`**                                | **`fetchData()`**           | **`MenuItemSwap.jsx`**  |
| **`/api/menuitems/menuswap-items`**             | **`GET`**    | **`masterMenuID`**                              | **`fetchData()`**           | **`MenuItemSwap.jsx`**  |
| **`/api/menuitems/swap-menu/:id`**              | **`PUT`**    | **`menuID`**                                    | **`handleSave()`**          | **`MenuItemSwap.jsx`**  |

---

## **State Management**

| **State Variable**      | **Type**     | **Component**             | **Purpose**                                                                    |
| ----------------------- | ------------ | ------------------------- | ------------------------------------------------------------------------------ |
| **`isOpen`**            | **`Array`**  | **`AddMenuItemForm.jsx`** | Tracks state of the Add Item Panel                                             |
| **`selectedAllergens`** | **`Array`**  | **`AddMenuItemForm.jsx`** | Tracks allergens for new items                                                 |
| **`searchTerm`**        | **`string`** | **`MenuItemsPage.jsx`**   | Filters items by name                                                          |
| **`menuItems`**         | **`Array`**  | **`MenuItemsPage.jsx`**   | Stores items for current menu                                                  |
| **`fetchedMenu`**       | **`Array`**  | **`MenuItemsPage.jsx`**   | Keeps track of the current menu for accessing its variables                    |
| **`menus`**             | **`Set`**    | **`MenuItemSwap.jsx`**    | Holds menus pulled from database                                               |
| **`menuItems`**         | **`Set`**    | **`MenuItemSwap.jsx`**    | Holds menuItems pulled from database                                           |
| **`masterMenu`**        | **`Set`**    | **`MenuItemSwap.jsx`**    | Holds the MasterMenu for creating the tree                                     |
| **`otherMenus`**        | **`Set`**    | **`MenuItemSwap.jsx`**    | Holds every member that is not the MasterMenu for creating trees               |
| **`masterMenuID`**      | **`Set`**    | **`MenuItemSwap.jsx`**    | Used for comparison in handleDeleteItem                                        |
| **`selectedItemID`**    | **`Set`**    | **`MenuItemSwap.jsx`**    | Used for hopefully highlighting selected item and its duplicates in the future |
| **`selectedKeys`**      | **`Set`**    | **`MenuItemSwap.jsx`**    | Tracks items for menu swapping                                                 |
| **`searchTerms`**       | **`Set`**    | **`MenuItemSwap.jsx`**    | Used to filter the trees based on what is in the search bar                    |

---

## **Error Handling**

| **Scenario**                             | **Handling Method**           | **File**                 |
| ---------------------------------------- | ----------------------------- | ------------------------ |
| API Failures                             | **`alert()`** + console.error | **`AddMenuItem.jsx`**    |
| API Failures                             | **`alert()`** + console.error | **`MenuItemPanel.jsx`**  |
| Trying to Remove Item from nonMasterMenu | **`alert()`**                 | **`MenuItemPanel.jsx`**  |
| API Failures                             | **`alert()`** + console.error | **`MenuItemsPages.jsx`** |
| Empty Results                            | Displays "No items found"     | **`MenuItemSwap.jsx`**   |
| Missing Selected Target Menu             | **`alert()`**                 | **`MenuItemSwap.jsx`**   |
| Removing item from Master Menu           | **`alert()`**                 | **`MenuItemSwap.jsx`**   |
| API Failures                             | **`alert()`** + console.error | **`MenuItemSwap.jsx`**   |
| Expected Variable not in Local Storage   | **`alert()`**                 | **`MenuItemSwap.jsx`**   |
| Needed Item Does Not Exist               | **`alert()`**                 | **`MenuItemSwap.jsx`**   |

---

## **Styling**

| **File**                 | **Key Styles**             | **Components Affected**                                         |
| ------------------------ | -------------------------- | --------------------------------------------------------------- |
| **`picklist.scss`**      | Dual-panel layout          | **`MenuItemSwap.jsx`**                                          |
| **`styles.scss`**        | Base styles for item cards | **`MenuItemPanel.jsx`, `AddMenuItem.jsx`, `MenuItemsPage.jsx`** |
| **`MenuDashboard.scss`** | Grid layouts               | **`MenuDashboard.jsx`**                                         |

---

## **Dependencies**

| **Dependency**         | **Purpose**                   |
| ---------------------- | ----------------------------- |
| **`react`**            | Functionality                 |
| **`react-icons`**      | Create/Edit/Delete icons      |
| **`axios`**            | API calls for CRUD operations |
| **`react-router-dom`** | Navigation between pages      |
