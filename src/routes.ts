import { Router } from 'express';

import { UserControllers, ChatControllers, InstanceControllers, ContactControllers } from './modules';

const routes = Router();

const userControllers = new UserControllers();
const chatControllers = new ChatControllers();
const instanceControllers = new InstanceControllers();
const contactControllers = new ContactControllers();

routes.post('/login-user', userControllers.login);
routes.post('/create-user', userControllers.register);
routes.delete('/delete-user', userControllers.delete);

routes.post('/create-contact', contactControllers.register);
routes.delete('/delete-contact', contactControllers.delete);

routes.get('/find-instance', instanceControllers.find);
routes.post('/create-instance', instanceControllers.create);
routes.delete('/delete-instance', instanceControllers.delete);
// routes.post('/create-contact', instanceControllers.contact);

routes.get('/find-chat', chatControllers.find);
routes.post('/create-chat', chatControllers.create);
routes.post('/send-by-whatsapp', chatControllers.send);

export { routes };