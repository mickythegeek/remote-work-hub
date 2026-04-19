import './instrument';
import app from './app';
import { unifiedConfig } from './config/unifiedConfig';

const PORT = unifiedConfig.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
