import * as fsInfo from './credentials/fs-key.json';
import * as geeInfo from './credentials/gee-key.json';
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3333,
  firestore: {
    privateKey: fsInfo.private_key,
    clientEmail: fsInfo.client_email,
    projectId: fsInfo.project_id,
  },
  gee: geeInfo,
});
