# EasyRice Backend API

This is a TypeScript backend project for rice inspection calculation, built to support the EasyRice Junior Exam requirements.

## Tech Stack

- TypeScript
- Express.js

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the server
```bash
npm run dev
```
The API server will start at: http://localhost:4000


---

## Test the API

I tested the API manually using **Postman** to ensure the calculation and response are correct.

### Example Request:
1. POST: http://localhost:4000/history
```bash
{
  "name": "ตรวจสอบข้าว1",
  "standardID": "1",
  "note": "System testing"
}
```

2. GET: http://localhost:4000/history
3. GET: http://localhost:4000/{id}
4. DELETE: http://localhost:4000/history
5. GET: http://localhost:4000/standard

<img width="196" height="182" alt="image" src="https://github.com/user-attachments/assets/9339b05c-69cb-4882-9c8b-c3f70bdd76b1" />

