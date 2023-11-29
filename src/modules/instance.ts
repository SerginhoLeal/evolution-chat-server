import { Request, Response } from 'express';

import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { evolution_api } from '../services';

const prisma = new PrismaClient();

class InstanceControllers {
  async find(request: Request, reply: Response) {
    const { use_logged_id } = request.query;

    const instance = await prisma.instance.findFirst({
      where: {
        user_id: `${use_logged_id}`
      },
      include: {
        chat: {
          include: {
            contact: true
          }
        }
      }
    });

    return reply.status(201).json({ instance });

    // if (!instance) return reply.status(404).end();

    // const { data } = await axios.get(`${process.env.EVOLUTION_API}/instance/fetchInstances?instanceName=${instance.instance_name}`, {
    //   headers: {
    //   'Content-Type': 'application/json',
    //     apikey: `${process.env.VITE_API_KEY}`
    //   }
    // });

    // if (!data) return reply.status(404).json({ data: null, message: 'Instance not Found' });

    // return reply.status(201).json({ instance });

    // return prisma.instance.findFirst({
    //   where: {
    //     user_id: `${use_logged_id}`
    //   },
    //   include: {
    //     chat: {
    //       include: {
    //         contact: true
    //       }
    //     }
    //   }
    // })
    //   .then(data => reply.status(201).json({ data }))
    //   .catch(error => reply.status(409).end({ error }))
  };

  async create(request: Request, reply: Response) {
    const { use_logged_id } = request.query;
    const { instance_name } = request.body;

    const find_user = await prisma.user.findFirst({
      where: {
        id: `${use_logged_id}`
      }
    });

    const creating_instance = await evolution_api.post('/instance/create', {
      instanceName: `${instance_name}`,
      qrcode: true,
      number: `${find_user?.number}`
    });

    if (creating_instance.status !== 201) return reply.status(404).end({ message: 'Fail to Create Instance' });

    evolution_api.post(`/webhook/set/${creating_instance.data.instance.instanceName}`, {
      url: `${process.env.PRODUCTION_BASE_URL}/api/send-by-whatsapp`,
      webhook_by_events: false,
      webhook_base64: false,
      events: [
        // "QRCODE_UPDATED",
        "MESSAGES_UPSERT",
        // "MESSAGES_UPDATE",
        "MESSAGES_DELETE",
        "SEND_MESSAGE",
        // "CONNECTION_UPDATE",
        // "CALL"
      ]
    });

    return prisma.instance.create({
      data: {
        instance_name: creating_instance.data.instance.instanceName,
        user_id: `${use_logged_id}`
      }
    })
      .then(data => reply.status(201).json(creating_instance.data))
      .catch(error => reply.status(404).end({ error }))
  };

  async delete(request: Request, reply: Response) {
    const { use_logged_id, instance_id } = request.query;

    return await prisma.instance.delete({
      where: {
        id: `${instance_id}`,
        user_id: `${use_logged_id}`
      },
    })
      .then(success => reply.status(201).json({ message: `instance ${success.instance_name} deleted` }))
      .catch(error => reply.status(404).end({ error }))
  }
};

export { InstanceControllers };
