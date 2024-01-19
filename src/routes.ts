import { Router } from 'express';

import {
  UserControllers,
  MessagesControllers,
  FriendControllers,
} from './modules';

import storageTypes from './utils/multer';

import middleware from './middleware';

const routes = Router();

const userControllers = new UserControllers();
const friendControllers = new FriendControllers();
const messagesControllers = new MessagesControllers();

// const storage = storageTypes.fields([{ name: 'files', maxCount: 5 }]);
const storage = storageTypes.single('file');

routes.post('/login-user', userControllers.login);
routes.post('/create-user', userControllers.register);

routes.use(middleware);

routes.delete('/delete-user', userControllers.delete);

routes.get('/friends', friendControllers.friends);
routes.get('/friend', friendControllers.friend);
routes.post('/create', friendControllers.create);

routes.get('/messages-whatsapp', messagesControllers.index);
routes.post('/message-whatsapp', messagesControllers.messages);
routes.post('/message-media-whatsapp', storage, messagesControllers.messages_media);
routes.post('/message-by-whatsapp', messagesControllers.message_by_whatsapp);

export { routes };
