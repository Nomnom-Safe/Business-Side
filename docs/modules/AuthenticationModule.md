# Authentication Module

Handles user authentication, including login, signup, and credential management.

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

| **Feature**             | **Description**                  | **Component**              | **File**                |
| ----------------------- | -------------------------------- | -------------------------- | ----------------------- |
| **Login/Signup Toggle** | Switches between forms           | **`SignInUp`**             | **`SignInUp.jsx`**      |
| **Form Validation**     | Validates email/password formats | **`GetAuthForm`**          | **`GetAuthForm.jsx`**   |
| **Password Visibility** | Toggles password masking         | **`GetPasswordField`**     | **`Password.jsx`**      |
| **Credential Editing**  | Updates email/password           | **`EditLoginInfo`**        | **`EditLoginInfo.jsx`** |
| **Dietary Preferences** | Manages diets                    | **`GenerateDietList`**     | **`DietList.jsx`**      |
| **Allergen Tracking**   | Manages allergens                | **`GenerateAllergenList`** | **`AllergenList.jsx`**  |

---

## **API Integration**

### **Endpoints**

| **Endpoint**               | **Method** | **Payload**                                      | **Called In**  | **File**                |
| -------------------------- | ---------- | ------------------------------------------------ | -------------- | ----------------------- |
| **`/api/auth/signup`**     | **`POST`** | **`{ email, password, first_name, last_name }`** | **`signUp()`** | **`GetAuthForm.jsx`**   |
| **`/api/auth/signin`**     | **`POST`** | **`{ email, password }`**                        | **`logIn()`**  | **`GetAuthForm.jsx`**   |
| **`/api/auth/logout`**     | **`POST`** | None                                             | **`logout()`** | **`ProfileIcon.jsx`**   |
| **`/api/auth/edit-login`** | **`POST`** | **`{ credType, currentCred, newCred }`**         | **`save()`**   | **`EditLoginInfo.jsx`** |

---

## **State Management**

| **State Variable**      | **Type**      | **Component**          | **Purpose**                               |
| ----------------------- | ------------- | ---------------------- | ----------------------------------------- |
| **`formType`**          | **`string`**  | **`SignInUp`**         | Toggles **`signInForm`**/**`signUpForm`** |
| **`selectedAllergens`** | **`Array`**   | **`AllergenList`**     | Tracks selected allergens                 |
| **`selectedDiets`**     | **`Array`**   | **`DietList`**         | Tracks dietary preferences                |
| **`passwordVisible`**   | **`boolean`** | **`GetPasswordField`** | Toggles password visibility               |

---

## **Error Handling**

| **Scenario**   | **Handling Method**                     | **File**                 |
| -------------- | --------------------------------------- | ------------------------ |
| Invalid Email  | **`format.validateEmail()`**            | **`form-validation.js`** |
| Short Password | **`format.validatePassword()`**         | **`form-validation.js`** |
| API Failures   | **`try/catch`** with **`setMessage()`** | All files                |

---

## **Styling**

| **File**        | **Key Styles**             | **Components Affected** |
| --------------- | -------------------------- | ----------------------- |
| **`auth.scss`** | Form layouts, input fields | All auth forms          |

---

## **Dependencies**

| **Dependency**         | **Purpose**                |
| ---------------------- | -------------------------- |
| **`react-router-dom`** | Navigation                 |
| **`react-icons`**      | Password visibility toggle |
| **`axios`**            | API requests               |
