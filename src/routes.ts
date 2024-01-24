import { Router } from 'express';

import {
  UserControllers,
  MessagesControllers,
  FriendControllers,
  InstanceControllers,
} from './modules';

import storageTypes from './utils/multer';

import middleware from './middleware';

const routes = Router();

const userControllers = new UserControllers();
const friendControllers = new FriendControllers();
const messagesControllers = new MessagesControllers();
const instanceControllers = new InstanceControllers();

// const storage = storageTypes.fields([{ name: 'files', maxCount: 5 }]);
const storage = storageTypes.single('file');

routes.post('/login-user', userControllers.login);
routes.post('/create-user', userControllers.register);

routes.get('/instance-connect', instanceControllers.connect);
routes.post('/instance-webhook', instanceControllers.webhook);

routes.use(middleware);

routes.delete('/delete-user', userControllers.delete);

routes.get('/friends', friendControllers.friends);
routes.get('/friend', friendControllers.friend);
routes.post('/create', friendControllers.create);

routes.get('/messages-whatsapp', messagesControllers.index);
routes.get('/media-file', messagesControllers.media_file);
routes.post('/message-whatsapp', messagesControllers.messages);
routes.post('/message-media-whatsapp', storage, messagesControllers.messages_media);

routes.post('/platform-to-whatsapp', instanceControllers.platform_to_whatsapp);

export { routes };
