# 📁 Storage Management System

A secure and user-friendly file storage management system built using **Node.js**, **Express.js**, and **MongoDB** following the **MVC architecture**.

## 🚀 Features

* 🔐 User Registration & Authentication (JWT-based)
* 📁 Upload, Rename, Duplicate & Delete Files
* 🔒 File Locking with PIN Verification
* 📂 Folder Management (Create, View)
* 📊 Storage Summary by File Type
* 🗓️ Filter Files by Upload Date
* ⭐ Mark/Unmark Favorite Files
* 🔁 Forgot Password with Email OTP

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose ODM)
* **Cloud Storage**: Cloudinary
* **Auth**: JWT, Bcrypt, OTP (6-digit)
* **Design Pattern**: MVC

---

## 📦 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/storage-management-system.git
   cd storage-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**

   Create a `.env` file in the root and add the following:

   ```env
   PORT=5000
   DATABASE_URL=your_mongodb_url
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_password
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

---

## 📬 API Endpoints

### 🔐 Auth

| Method | Endpoint                        | Description                |
| ------ | ------------------------------- | -------------------------- |
| POST   | `/auth/register`                | Register new user          |
| POST   | `/auth/login`                   | User login                 |
| PATCH  | `/auth/change-password`         | Change current password    |
| PATCH  | `/auth/changeusername`          | Change username            |
| POST   | `/auth/forgetPassword`          | Send OTP to reset password |
| POST   | `/auth/verifyOtpSetNewPassword` | Verify OTP & set password  |
| DELETE | `/auth/profileDelete`           | Delete user account        |

### 📁 File

| Method | Endpoint                              | Description                        |
| ------ | ------------------------------------- | ---------------------------------- |
| POST   | `/file`                               | Upload new file                    |
| DELETE | `/file/:id`                           | Delete a file                      |
| PATCH  | `/file/rename/:id`                    | Rename a file                      |
| POST   | `/file/copy`                          | Duplicate a file                   |
| PATCH  | `/file/makefavortie/:id`              | Mark/unmark favorite               |
| PATCH  | `/file/lock/:id`                      | Lock a file                        |
| GET    | `/file/getfavorite`                   | Get favorite files                 |
| GET    | `/file?type=image`                    | Get files by type (image/pdf/note) |
| GET    | `/file/getFileByDate?date=YYYY-MM-DD` | Get files by date                  |
| GET    | `/file/:id`                           | Duplicate file by ID               |

### 📂 Folder

| Method | Endpoint      | Description           |
| ------ | ------------- | --------------------- |
| POST   | `/folder`     | Create folder         |
| GET    | `/folder`     | Get all folders       |
| GET    | `/folder/:id` | Get files in a folder |

### 📊 Storage

| Method | Endpoint   | Description           |
| ------ | ---------- | --------------------- |
| GET    | `/storage` | Storage usage summary |

---

## 🖚 Postman Collection

Import the `Jotter Storage Management.postman_collection.json` file to test all APIs easily.

---


---

## 🧑‍💻 Developed By

Md Sajedul Islam

