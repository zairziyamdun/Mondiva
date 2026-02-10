import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { products as productsData, categories as categoriesData, users as usersData } from "./data.js";
import Product from "./models/Product.js";
import Category from "./models/Category.js";
import User from "./models/User.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Очистка коллекций
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // Создаем пользователей
    const createdUsers = await User.insertMany(
      usersData.map(u => ({ ...u, password: "123456" })) // временный пароль
    );

    // Создаем категории
    await Category.insertMany(categoriesData);

    // Создаем продукты
    await Product.insertMany(
      productsData.map(p => ({ ...p }))
    );

    console.log("Данные успешно загружены ✅");
    process.exit();
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
    process.exit(1);
  }
};

importData();
