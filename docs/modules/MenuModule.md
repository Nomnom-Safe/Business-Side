# Menu Module

Manages restaurant menus, items, and dietary/allergen filtering.

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

| **Feature**           | **Description**            | **Component**          | **File**                |
| --------------------- | -------------------------- | ---------------------- | ----------------------- |
| **Menu Dashboard**    | Displays all menus         | **`MenuDashboard`**    | **`MenuDashboard.jsx`** |
| **Item Management**   | Add/edit/delete menu items | **`MenuItemPanel`**    | **`MenuItemPanel.jsx`** |
| **Menu Filtering**    | Filters by allergens/diets | **`FilterPanel`**      | **`FilterPanel.jsx`**   |
| **Menu Swapping**     | Moves items between menus  | **`MenuItemPicklist`** | **`MenuItemSwap.jsx`**  |
| **Real-Time Updates** | Syncs changes with backend | **`MenuItemsPage`**    | **`MenuItemsPage.jsx`** |

---

## **API Integration**

### **Endpoints**

| **Endpoint**                       | **Method**   | **Payload**                                     | **Called In**               | **File**                |
| ---------------------------------- | ------------ | ----------------------------------------------- | --------------------------- | ----------------------- |
| **`/api/menus`**                   | **`POST`**   | **`{ title, description, restaurant }`**        | **`handleAddMenu()`**       | **`MenuDashboard.jsx`** |
| **`/api/menus/:id`**               | **`DELETE`** | None                                            | **`handleConfirmDelete()`** | **`MenuDashboard.jsx`** |
| **`/api/menuitems/add-menu-item`** | **`POST`**   | **`{ name, description, allergens, menuIDs }`** | **`handleSave()`**          | **`AddMenuItem.jsx`**   |
| **`/api/menuitems/swap-menu`**     | **`POST`**   | **`{ menuIDs }`**                               | **`handleMoveToMenu()`**    | **`MenuItemSwap.jsx`**  |

---

## **State Management**

| **State Variable** | **Type**    | **Component**       | **Purpose**                  |
| ------------------ | ----------- | ------------------- | ---------------------------- |
| **`menus`**        | **`Array`** | **`MenuDashboard`** | Stores menu list             |
| **`menuItems`**    | **`Array`** | **`MenuItemsPage`** | Tracks items in current menu |

---

## **Error Handling**

| **Scenario**      | **Handling Method**                      | **File**                |
| ----------------- | ---------------------------------------- | ----------------------- |
| Invalid Menu Data | **`try/catch`** with **`console.error`** | **`MenuDashboard.jsx`** |
| API Failures      | **`alert()`** + state reset              | **`MenuItemPanel.jsx`** |
| Empty Fields      | Disables save buttons                    | **`AddMenuItem.jsx`**   |

---

## **Styling**

| **File**                 | **Key Styles**        | **Components Affected** |
| ------------------------ | --------------------- | ----------------------- |
| **`MenuDashboard.scss`** | Grid layout for menus | **`MenuDashboard`**     |
| **`MenuCard.scss`**      | Item cards            | **`MenuItemCard`**      |

---

## **Dependencies**

| **Dependency**         | **Purpose**                  |
| ---------------------- | ---------------------------- |
| **`axios`**            | API requests                 |
| **`react-icons`**      | Action buttons (delete/edit) |
| **`react-router-dom`** | Navigation between menus     |
