# BoredAPI

This API allows users to interact with a collection of "cures" through various endpoints. Users can create, update, delete, and retrieve cures based on filters such as type and participants.

## Table of Contents
- [Features](#features)
- [Setup](#setup)
- [Endpoints](#endpoints)
  - [GET /random](#1-get-random-cure)
  - [GET /cures/filter](#2-get-a-cure-by-filtering)
  - [GET /cures/:key](#3-get-a-specific-cure)
  - [POST /cures/create](#4-create-a-new-cure)
  - [PUT /cures/:key](#5-update-a-cure-entirely)
  - [PATCH /cures/:key](#6-update-an-attribute-of-the-cure)
  - [DELETE /cures/:key](#7-delete-a-specific-cure)
  - [DELETE /cures/deleteall](#8-delete-all-cures)
- [Technologies Used](#technologies-used)
- [License](#license)

## Features
- Retrieve a random cure.
- Filter cures by type or number of participants.
- Manage cures (create, update, delete).
- Delete all cures with a master key.

## Setup

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. The server will run on `http://localhost:3000`.

## Endpoints

### 1. GET /random
Retrieve a random cure.

#### Request
```http
GET /random
```

#### Response
```json
{
    "activity": "Practice playing a musical scale",
    "key": "71",
    "participants": "1",
    "type": "Creative",
    "link": "",
    "difficulty": "Medium",
    "duration": "30-60 minutes"
}
```

---

### 2. GET /cures/filter
Retrieve cures filtered by type and/or participants.

#### Request
```http
GET /cures/filter?type=Educational&participants=1
```

#### Response
```json
{
    "activity": "Learn basic gardening skills",
    "key": "98",
    "participants": "1",
    "type": "Educational",
    "link": "",
    "difficulty": "Medium",
    "duration": "2-4 hours"
}
```

#### Notes
- `type` is case-insensitive but will be converted to capitalize the first letter (e.g., `educational` -> `Educational`).
- `participants` filters cures based on the number of participants.

---

### 3. GET /cures/:key
Retrieve a specific cure by its key.

#### Request
```http
GET /cures/1
```

#### Response
```json
{
    "activity": "Create a DIY craft project",
    "key": "1",
    "participants": "1-2",
    "type": "Creative",
    "link": "",
    "difficulty": "Medium",
    "duration": "2-3 hours"
}
```

---

### 4. POST /cures/create
Create a new cure by providing all the details

#### Request
```json
{
    "activity": "Learn about astronomy",
    "participants": "1",
    "type": "Educational",
    "link": "",
    "difficulty": "Medium",
    "duration": "1-2 hours"
}
```

#### Response
```json
{
    "activity": "Learn about astronomy",
    "key": "101",
    "participants": "1",
    "type": "Educational",
    "link": "",
    "difficulty": "Medium",
    "duration": "1-2 hours"
}
```

---

### 5. PUT /cures/:key
Update a cure entirely.

#### Request
```http
PUT /cures/1
Content-Type: application/json

{
  "activity": "Updated Activity",
  "participants": "1-2",
  "type": "Wellness",
  "link": "http://updatedlink.com",
  "difficulty": "Medium",
  "duration": "20 minutes"
}
```

#### Response
```json
{
  "message": "Updated cure with key 1 successfully.",
  "updatedcure": {
    "activity": "Updated Activity",
    "participants": "1-2",
    "type": "Wellness",
    "link": "http://updatedlink.com",
    "difficulty": "Medium",
    "duration": "20 minutes"
  }
}
```

---

### 6. PATCH /cures/:key
Update specific attributes of a cure.

#### Request
```http
PATCH /cures/1
Content-Type: application/json

{
  "activity": "Partially Updated Activity",
  "difficulty": "Easy"
}
```

#### Response
```json
{
  "message": "Updated cure with key 1 successfully.",
  "updatedCure": {
    "activity": "Partially Updated Activity",
    "participants": "1-2",
    "type": "Wellness",
    "link": "http://updatedlink.com",
    "difficulty": "Easy",
    "duration": "20 minutes"
  }
}
```

---

### 7. DELETE /cures/:key
Delete a specific cure.

#### Request
```http
DELETE /cures/1
```

#### Response
```json
{
  "message": "Deleted cure with key 1 successfully!",
  "cure": {
    "activity": "Deleted Activity",
    "participants": "1-2",
    "type": "Wellness",
    "link": "http://deletedlink.com",
    "difficulty": "Medium",
    "duration": "20 minutes"
  }
}
```

---

### 8. DELETE /cures/deleteall
Delete all cures using a master key.

#### Request
```http
DELETE /cures/deleteall?key=4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT
```

#### Response
```
All cures have been deleted successfully
```

---

## Technologies Used
- Node.js
- Express.js

