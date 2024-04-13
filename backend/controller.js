import { executeQuery } from "./dbconnection/db.js";

export const registerUser = async (req, res) => {
  const { password, name, email, address, phone, cnic, walletaddress } =
    req.body;
  // password	name	email	address	phone	cnic	walletaddress
  //sql logic

  const sql =
    "INSERT INTO users (password, name, email, address, phone, cnic, walletaddress) VALUES (?,?, ?, ?, ?, ?, ?)";
  const params = [password, name, email, address, phone, cnic, walletaddress];

  try {
    const result = await executeQuery(sql, params);
    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const loginUser = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  const params = [email, password];

  try {
    const result = await executeQuery(sql, params);
    if (result.length > 0) {
      // res.status(200).json({message : "login successful"})
      res.status(200).json({ email: email, password: password });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
};
