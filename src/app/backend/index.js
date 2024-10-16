express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs").promises;
const app = express();
let usersData = {};
let userList = [];
app.use(cors());

app.use(bodyParser.json());

const jsonFilePath = "./database.json";
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userData = await getUserTasks(username, password);

  if (userData) {
    res.json(userData);
  } else {
    return res.json({ message: "unauthorized" });
  }
});
async function getUserTasks(username, password) {
  let userData;
  const data = await fs.readFile(jsonFilePath, "utf8");
  usersData = JSON.parse(data);
  userList = usersData.users;

  userData = userList.find(
    (user) =>
      user.username.toLowerCase().trim() === username.toLowerCase().trim() &&
      user.password.toLowerCase().trim() === password.toLowerCase().trim()
  );
  return userData;
}

app.post("/NewTask", async (req, res) => {
  const { username, password, task } = req.body;
  const userData = await getUserTasks(username, password);
  userData.tasks.push(task);

  await fs.writeFile(
    jsonFilePath,
    JSON.stringify(usersData, null, 2),
    (err) => {}
  );
  const userDataNew = await getUserTasks(username, password);
  res.json({ userDataNew });
});

app.post("/update", async (req, res) => {
  const { username, password, task } = req.body;

  let userTasks = await getUserTasks(username, password);
  const taskIndex = userTasks.tasks.findIndex(
    (existingTask) => existingTask.title === task.title
  );
  userTasks.tasks[taskIndex] = task;
  await fs.writeFile(
    jsonFilePath,
    JSON.stringify(usersData, null, 2),
    (err) => {}
  );
  const userDataNew = await getUserTasks(username, password);
  res.json({ userDataNew });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const data = await fs.readFile(jsonFilePath, "utf8");
  usersData = JSON.parse(data);
  usersData.users.push({
    username: username,
    password: password,
    tasks: [],
  });

  await fs.writeFile(
    jsonFilePath,
    JSON.stringify(usersData, null, 2),
    (err) => {}
  );
  res.json({ message: "New user registered" });
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
