# **Backend Module**

Manages backend functionality and server for MongoDB.

---

## **Table of Contents**

- Features
- API Integration
- Data Models
- Authentication
- Error Handling
- Dependencies

---

## **Features**

| **Feature**              | **Description**                                                                | **Endpoint**                                                             | **Schema/Model**             | **Key Methods**                                            |
| ------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ---------------------------- | ---------------------------------------------------------- |
| **User Authentication**  | Secure signup/login with password hashing and cookie-based sessions            | **`POST /api/auth/signinPOST /api/auth/signup`**                         | **`User.js`**                | **`comparePassword()`**, **`pre('save')`** (hooking)       |
| **Business Management**  | CRUD operations for restaurant profiles with allergen/diet tracking            | **`GET/POST/PUT/DELETE /api/businesses`**                                | **`Business.js`**            | **`populate('menus')`** (for nested data)                  |
| **Menu Management**      | Create/delete menus, prioritize "Master Menu," and link to businesses          | **`POST /api/menusDELETE /api/menus/:id`**                               | **`Menu.js`**                | **`sort()`** (Master Menu prioritization)                  |
| **Menu Item Management** | Add/edit/delete items with ingredients, allergens, and multi-menu associations | **`POST /api/menuitems/add-menu-itemPUT /api/menuitems/:id`**            | **`MenuItem.js`**            | **`find({ menuIDs })`** (filtering by menu)                |
| **Admin Controls**       | Promote/demote admins, grant/revoke business access to users                   | **`POST /api/admin/change-admin-statusPOST /api/admin/add-user-access`** | **`User.js`**                | Aggregation pipelines (e.g., **`$match`**, **`$project`**) |
| **Dietary Filtering**    | Track allergens/diets at business and item levels                              | **`PUT /api/businesses/:id`** (update **`allergens`**/**`diets`**)       | **`Business.jsMenuItem.js`** | Array operations (e.g., **`$push`**, **`$pull`**)          |
| **Real-Time Sync**       | Instant UI updates via cookie-based session states (e.g., **`hasBusiness`**)   | N/A (Middleware)                                                         | **`cookies.js`**             | **`setCookies()`**, **`updateCookie()`**                   |

---

## **API Integration**

### **Endpoints**

| **Endpoint**                               | **Method**   | **Request Body**                                                              | **Success Response**                                        | **Error Cases**                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------ | ------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`/api/auth/signin`**                     | **`POST`**   | **`{ email: "user@example.com", password: "..." }`**                          | **`200`** + User data + cookies set                         | **`401`** (Invalid email/password), **`400`** (Missing fields)                                                                                                                                                                                                                                                    |
| **`/api/businesses`**                      | **`GET`**    | **` NONE`**                                                                   | **`200`** + Found businesses                                | **`400`** (Duplicate name), **`404`** ('No businesses found'), **`500`** ('Could not fetch businesses')                                                                                                                                                                                                           |
| **`/api/businesses/:id`**                  | **`GET`**    | Requires **` {id: req.params.id}`**                                           | **``**  Found business as json                              | **`404`** ('Business not found'),  **`500`** ('Could not fetch business')                                                                                                                                                                                                                                         |
| **`/api/businesses`**                      | **`POST`**   | Requires **`{ name, url, address, allergens = [], diets = [] }`** req.body    | **`201`** + Created business                                | **`400`** ('Business name already exists'), **`400`** ( 'Error creating business'), **`400`** ('Error associating new business with user'), **`400`** ('Error creating business: ' + err.message)                                                                                                                 |
| **`/api/businesses/:id`**                  | **`PUT`**    | Requires **` { name, url, address, allergens, diets, menus }`** req.body      | **``**  updatedBusiness as json                             | **`400`** ('Business name already exists.'),  **`400`** ('Error updating business: ' + err.message),  **`404`** ('Business not found')                                                                                                                                                                            |
| **`/api/business/:id`**                    | **`DELETE`** | Requires **`{ id }`** req.params.id                                           | **`201`** + Created business                                | **`404`** ('Business not found'), **`500`** ( 'Could not delete business')                                                                                                                                                                                                                                        |
| **`/api/admin/get-user-list`**             | **`POST`**   | Requires **`email`** cookie (auto-sent)                                       | **`200`** + **`users[]`**                                   | **`401`** (No business ID), **`401`** (No users with specified business ID), **`404`** (No users)                                                                                                                                                                                                                 |
| **`/api/admin/change-admin-status`**       | **`POST`**   | Requires **`{action, targetEmail}`** req.body                                 | **`200`** + **`{message: message}`**                        | **`400`** (Unknown action: ${action}), **`400`** ('At least one user must be an admin'), **`400`** ('Something went wrong'), **`400`** ('Error saving admin status'), **`400`** ('Error changing admin status: ' + err.message)                                                                                   |
| **`/api/admin/remove-user-access`**        | **`POST`**   | Requires **`{targetEmail}`** req.body **`{business_id }`** cookie (auto-sent) | **`200`** + ('Removed user access successfully.')           | **`400`** ('Business id not found.'), **`400`** ('At least one admin must be associated with the business'), **`400`** ('Error removing user access'), **`400`** ( 'Error changing business id: ' + err.message)                                                                                                  |
| **`/api/admin/add-user-access`**           | **`POST`**   | Requires **`{targetEmail}`** req.body **`{business_id }`** cookie (auto-sent) | **`200`** + \*\*`('User access added successfully.')        | **`400`** ('All fields are required.'), **`400`** (Business id not found. Business id: ${business_id}), **`400`** ('User does not exist'), **`400`** ( 'User has access to another business and cannot be added), **`400`** ('Error saving user access'), **`400`** ( 'Error adding user access: ' + err.message) |
| **`/api/menuitems/add-menu-item`**         | **`POST`**   | **`{ name: "Salad", allergens: ["Nuts"], menuIDs: ["menu_id"] }`**            | **`201`** + Saved item                                      | **`400`** (Empty fields), **`500`** (Save failed)                                                                                                                                                                                                                                                                 |
| **`/api/menuitems/swap-menu/:id`**         | **`PUT`**    | **`{ menuIDs: ["new_menu_id"] }`** (Update item's menu associations)          | **`200`** + Updated item                                    | **`404`** (Item not found), **`400`** (Invalid ID)                                                                                                                                                                                                                                                                |
| **`/api/menuitems/menuswap-menus/:id`**    | **`PUT`**    | **`{ menuIDs: ["new_menu_id"] }`** (Update item's menu associations)          | **`200`** + Updated item                                    | **`404`** (Item not found), **`400`** (Invalid ID), **`500`** ('Error editing menu item: ' + err.message)                                                                                                                                                                                                         |
| **`/api/menuitems/:menuName&:businessID`** | **`GET`**    | Requires **`{ businessID }`**  req.query                                      | **`200`** + Menus                                           | **`500`** ('Could not fetch menus')                                                                                                                                                                                                                                                                               |
| **`/api/menuitems/menuswap-menus/:id`**    | **`GET`**    | Requires **`{ businessID }`**  req.query                                      | **`200`** + Menus                                           | **`500`** ('Could not fetch menus')                                                                                                                                                                                                                                                                               |
| **`/api/menuitems/menuswap-items/id`**     | **`GET`**    | Requires **`{ menuID }`**  req.query                                          | **`200`** + menuItemss                                      | **`500`** ('Could not fetch menu items')                                                                                                                                                                                                                                                                          |
| **`/api/menuitems/`**                      | **`GET`**    | REquires **`{ menuID }`** req.query                                           | **`200`** + menuItems                                       | **`500`** ('Could not fetch menu items')                                                                                                                                                                                                                                                                          |
| **`/api/menuitems/:id`**                   | **`PUT`**    | **`{ name: "...", allergens: [...] }`** (Partial updates allowed)             | **`200`** + Updated item                                    | **`404`** (Item not found), **`400`** (Invalid data)                                                                                                                                                                                                                                                              |
| **`/api/menuitems/:id`**                   | **`DELETE`** | None                                                                          | **`200`** + **`{ message: "Deleted successfully" }`**       | **`404`** (Item not found)                                                                                                                                                                                                                                                                                        |
| **`/api/menus`**                           | **`GET`**    | **`NONE`**                                                                    | \*\*\*\* + Menus                                            | **`500`** ('Could not fetch menus')                                                                                                                                                                                                                                                                               |
| **`/api/menus`**                           | **`POST`**   | **`{ title: "Lunch", description: "...", restaurant: "business_id" }`**       | **`201`** + New menu                                        | **`404`** (Business not found), **`400`** (Validation)                                                                                                                                                                                                                                                            |
| **`/api/menus/update-title-description`**  | **`PUT`**    | Requires **`{ businessId, title, description }`** req.body                    | **`200`** + Updated menu                                    | **`404`** (Business not found), **`404`** ('No menus found for business')                                                                                                                                                                                                                                         |
| **`/api/menus/:id`**                       | **`DELETE`** | Requires **`{ businessId, title, description }`** req.body                    | **``** + ('Menu deleted and business updated successfully') | **`404`** (Menu not found), **`500`** ('Could not delete menu: ' + err.message)                                                                                                                                                                                                                                   |

---

## **Data Models**

| **Model**    | **Key Fields**                                                                 | **Relationships**            |
| ------------ | ------------------------------------------------------------------------------ | ---------------------------- |
| **User**     | **`email`**, **`password (hashed)`**, **`business_id`**, **`admin`** (boolean) | References **`Business`**    |
| **Business** | **`name`**, **`allergens[]`**, **`diets[]`**, **`menus[]`** (ObjectIDs)        | Has many **`Menu`**          |
| **Menu**     | **`title`**, **`description`**, **`restaurant`** (ObjectID)                    | Belongs to **`Business`**    |
| **MenuItem** | **`name`**, **`ingredients[]`**, **`allergens[]`**, **`menuIDs[]`**            | Many-to-many with **`Menu`** |

---

## **Authentication**

| **Method**         | **Implementation**                                  | **Security**                                |
| ------------------ | --------------------------------------------------- | ------------------------------------------- |
| **Cookie-Based**   | Secure/HttpOnly cookies with **`sameSite: 'None'`** | Encrypted via **`bcrypt`** password hashing |
| **Admin Controls** | **`admin`** boolean in User model                   | Role checks in admin routes                 |
| **Session Flow**   | Auto-logout on token expiration                     | CSRF protection via CORS policies           |

---

## **Error Handling**

| **Scenario**            | **Response**                                              | **Example Route**                                      |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------------ |
| Invalid Credentials     | **`401`** + **`{ error: "Password is incorrect" }`**      | **`user.routes.js`** (signin)                          |
| Duplicate Business      | **`400`** + **`{ error: "Business name exists" }`**       | **`business.routes.js`** (POST)                        |
| Missing Required Fields | **`400`** + **`{ error: "All fields required" }`**        | **`menu-items.routes.js`** (add-menu-item)             |
| Unauthorized Access     | **`401`** + **`{ error: "Business ID not found" }`**      | **`admin.routes.js`** (get-user-list)                  |
| Missing Information     | **`404`** + **`{ error: 'Menu Item not found' }`**        | **`menu-items.routes.js`** (DELETE /api/menuitems/:id) |
| Could Not Retrieve Data | **`500`** + **`{ error: 'Could not fetch menu items' }`** | **`menu-items.routes.js`** (GET /api/menuitems)        |

---

## **Dependencies**

| **Package**         | **Role**                                              |
| ------------------- | ----------------------------------------------------- |
| **`express`**       | REST API framework                                    |
| **`mongoose`**      | MongoDB ODM (Object-Document Mapping)                 |
| **`bcrypt`**        | Password hashing                                      |
| **`cookie-parser`** | Secure session management                             |
| **`cors`**          | Cross-origin resource sharing (frontend connectivity) |
