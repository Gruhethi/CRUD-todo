import express from "express";
import cors from "cors";
import { firebaseConfig } from "./config.js";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore"; // Importing specific Firestore functions
const app = express();
app.use(express.json());
app.use(cors());

// Initialize Firebase app
initializeApp(firebaseConfig);
const db = getFirestore(); // Get a Firestore instance

// Add a new todo
app.post("/todos", async (req, res) => {
  try {
    const todoData = req.body;
    const newTodoRef = await addDoc(collection(db, "todos"), todoData);
    res.send({ id: newTodoRef.id, ...todoData, msg: "Todo added successfully" });
  } catch (error) {
    console.error("Error adding todo: ", error);
    res.status(500).send("Error adding todo");
  }
});

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todosSnapshot = await getDocs(collection(db, "todos"));
    const todos = [];
    todosSnapshot.forEach((doc) => {
      todos.push({ id: doc.id, ...doc.data() });
    });
    res.send(todos);
  } catch (error) {
    console.error("Error getting todos: ", error);
    res.status(500).send("Error getting todos");
  }
});

// Get a single todo by ID
app.get("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todoDoc = await getDoc(doc(db, "todos", todoId));
    if (todoDoc.exists()) {
      res.send({ id: todoId, ...todoDoc.data() });
    } else {
      res.status(404).send("Todo not found");
    }
  } catch (error) {
    console.error("Error getting todo: ", error);
    res.status(500).send("Error getting todo");
  }
});

// Update a todo by ID
app.put("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todoData = req.body;
    await updateDoc(doc(db, "todos", todoId), todoData);
    res.send({ msg: "Todo updated successfully" });
  } catch (error) {
    console.error("Error updating todo: ", error);
    res.status(500).send("Error updating todo");
  }
});

// Delete a todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    await deleteDoc(doc(db, "todos", todoId));
    res.send({ msg: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo: ", error);
    res.status(500).send("Error deleting todo");
  }
});

app.listen(4000, () => console.log("Up & Running on port 4000"));
