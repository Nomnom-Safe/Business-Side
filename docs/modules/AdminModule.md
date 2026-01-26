# Admin Module

Allows an admin to manage user access control, including promoting users to admins, demoting admins to users, giving access to a user that already has an account, and removing users' access to the business.

---

## **Table of Contents**

- Features
- API Integration
- State Management
- Error Handling
- Styling
- Dependencies

---

## **Features**

| **Feature**                    | **Description**                                                | **Component**                                       |
| ------------------------------ | -------------------------------------------------------------- | --------------------------------------------------- |
| **User List Fetch**            | Fetches all users with access to the business from the backend | **`GetUsers()`**                                    |
| **Role Management**            | Promote/demote users between **`admin`** and **`user`** roles  | **`changeAdminStatus()`**                           |
| **User Removal**               | Revoke access to the business                                  | **`removeUserAccess()`**                            |
| **Confirmation-Based Refresh** | Refreshes the page to reflect changes after API calls          | **`useNavigate()`** in **`GetConfirmationMessage`** |
| **Confirmation Dialogs**       | Handles success/error feedback                                 | **`GetConfirmationMessage`**, **`ErrorMessage`**    |

---

## **API Integration**

### **Endpoints**

| **Endpoint**                         | **Method** | **Payload**                                   | **Called In**                        |
| ------------------------------------ | ---------- | --------------------------------------------- | ------------------------------------ |
| **`/api/admin/get-user-list`**       | **`POST`** | None                                          | **`getUsers()`** in **`AdminTable`** |
| **`/api/admin/change-admin-status`** | **`POST`** | **`{ action: string, targetEmail: string }`** | **`changeAdminStatus()`**            |
| **`/api/admin/remove-user-access`**  | **`POST`** | **`{ email: string }`**                       | **`removeUserAccess()`**             |

---

## **State Management**

| **State Variable**     | **Type**          | **Purpose**                                |
| ---------------------- | ----------------- | ------------------------------------------ |
| **`data`**             | **`Array<User>`** | Stores user list (**`{ email, status }`**) |
| **`message`**          | **`string`**      | Stores error/confirmation message          |
| **`showError`**        | **`boolean`**     | Toggles error messages                     |
| **`showConfirmation`** | **`boolean`**     | Toggles success messages                   |

---

## **Error Handling**

- **API Failures**:
  ```
  if (!response.ok) {
    setMessage("Error promoting user");
    setShowError(true);
  }
  ```
- **Validation**:
  - Ensures **`targetEmail`** exists before API calls.

---

## **8. Dependencies**

| **Dependency**             | **Purpose**                    |
| -------------------------- | ------------------------------ |
| **`material-react-table`** | Interactive user table         |
| **`react-router-dom`**     | Navigation after actions       |
| **`@mui/material`**        | UI components (Table, Buttons) |
