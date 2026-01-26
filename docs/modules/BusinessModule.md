# **Business Module**

Manages business profile information and settings.

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

| **Feature**              | **Description**                          | **Component**          | **File**                   |
| ------------------------ | ---------------------------------------- | ---------------------- | -------------------------- |
| **Profile Management**   | Edit business name, URL, and address     | **`EditBusinessInfo`** | **`EditBusinessInfo.jsx`** |
| **Allergen Disclosure**  | Specify unavoidable allergens            | **`EditBusinessInfo`** | **`EditBusinessInfo.jsx`** |
| **Dietary Preparations** | List special diets (Kosher, Halal, etc.) | **`EditBusinessInfo`** | **`EditBusinessInfo.jsx`** |

---

## **API Integration**

### **Endpoints**

| **Endpoint**              | **Method** | **Payload**                                    | **Called In**           | **File**                   |
| ------------------------- | ---------- | ---------------------------------------------- | ----------------------- | -------------------------- |
| **`/api/businesses/:id`** | **`GET`**  | None                                           | **`fetchBusinessInfo`** | **`EditBusinessInfo.jsx`** |
| **`/api/businesses/:id`** | **`PUT`**  | **`{ name, url, address, allergens, diets }`** | **`save`**              | **`EditBusinessInfo.jsx`** |

---

## **State Management**

| **State Variable**     | **Type**      | **Purpose**                                           |
| ---------------------- | ------------- | ----------------------------------------------------- |
| **`businessInfo`**     | **`Object`**  | Stores **`{ name, url, address, allergens, diets }`** |
| **`showConfirmation`** | **`boolean`** | Toggles success message                               |

---

## **Error Handling**

| **Scenario**       | **Handling Method**                      |
| ------------------ | ---------------------------------------- |
| API Fetch Failures | **`try/catch`** with **`console.error`** |
| Invalid Inputs     | Form prevents submission                 |
| Save Failures      | Displays error state                     |

---

## **Styling**

| **File**                    | **Key Styles**                | **Components Affected**    |
| --------------------------- | ----------------------------- | -------------------------- |
| **`EditBusinessInfo.scss`** | Form layout, responsive grids | **`EditBusinessInfo.jsx`** |

---

## **Dependencies**

| **Dependency**         | **Purpose**           |
| ---------------------- | --------------------- |
| **`react-router-dom`** | Navigation after save |
