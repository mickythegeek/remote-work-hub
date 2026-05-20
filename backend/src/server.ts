import dotenv from "dotenv";
dotenv.config();

import './instrument';
import app from './app';
import { unifiedConfig } from './config/unifiedConfig';

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
  });
});

const PORT = unifiedConfig.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
