interface MessageTypeConversationProps {
  event: string; // "messages.upsert",
  instance: string; // "instance_3_553175564133",
  data: {
    key: {
      remoteJid: string; // "553191819932@s.whatsapp.net",
      fromMe: boolean; // false,
      id: string; // "3A6687C4331054C34F0F"
    },
    pushName: string; // "Leila Fernanda",
    message: {
      conversation: string; // "Eu te amo",
      messageContextInfo: {
        deviceListMetadata: {
          senderTimestamp: string; // "1705675528",
          recipientKeyHash: string; // "mlFwLjPVjSGbYQ==",
          recipientTimestamp: string; // "1705684155",
          recipientKeyIndexes: number[]; // [107]
        },
        deviceListMetadataVersion: number; // 2
      }
    },
    messageType: string; // "conversation",
    messageTimestamp: number; // 1705684429,
    owner: string; // "instance_3_553175564133",
    source: string; // "ios"
  },
  destination: string; // "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
  date_time: string; // "2024-01-19T14:13:49.253Z",
  sender: string; // "553175564133@s.whatsapp.net",
  server_url: string; // "api.whatsapp.laks.net.br",
  apikey: string; // "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
}

interface MessageTypeExtendedProps {
  event: string; // "send.message",
  instance: string; // "instance_3_553175564133",
  data: {
    key: {
      remoteJid: string; // "553191819932@s.whatsapp.net",
      fromMe: true,
      id: string; // "BAE520405E56E538"
    },
    pushName: string; // "",
    message: {
      extendedTextMessage: {
        text: string; // "tes"
      }
    },
    messageType: string; // "extendedTextMessage",
    messageTimestamp: {
      low: 1705846799,
      high: 0,
      unsigned: true
    },
    owner: string; // "instance_3_553175564133",
    source: string; // "web"
  },
  destination: string; // "https://c56c-177-55-225-167.ngrok-free.app/api/instance-webhook",
  date_time: string; // "2024-01-21T11:19:59.540Z",
  sender: string; // "553175564133@s.whatsapp.net",
  server_url: string; // "api.whatsapp.laks.net.br",
  apikey: string; // "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
}

interface ExtendedProps {
  event: "messages.upsert",
  instance: "instance_3_553175564133",
  data: {
    key: {
      remoteJid: "553184106645@s.whatsapp.net",
      fromMe: false,
      id: "3EB04EF72CB55E8D65551A"
    },
    pushName: "Marco Túlio Rocha",
    message: {
      extendedTextMessage: {
        text: "blz",
        contextInfo: {
          ephemeralSettingTimestamp: "1703855923",
          disappearingMode: {
          initiator: "CHANGED_IN_CHAT",
            trigger: "CHAT_SETTING"
          }
        },
        inviteLinkGroupTypeV2: "DEFAULT"
      },
    messageContextInfo: {
      deviceListMetadata: {
        senderKeyHash: "QGi3BKqB61apfg==",
        senderTimestamp: "1705581226",
        recipientKeyHash: "E23S4XdBpqm7OA==",
        recipientTimestamp: "1705846963"
      },
      deviceListMetadataVersion: 2
    }
    },
    messageType: "extendedTextMessage",
    messageTimestamp: 1705927423,
    owner: "instance_3_553175564133",
    source: "android"
  },
  destination: "https://2bbb-177-55-225-167.ngrok-free.app/api/instance-webhook",
  date_time: "2024-01-22T09:43:43.775Z",
  sender: "553175564133@s.whatsapp.net",
  server_url: "api.whatsapp.laks.net.br",
  apikey: "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
}

interface WebhookConnecting {
  event: string; // "connection.update",
  instance: string; // "instance_3_553175564133",
  data: {
    instance: string; // "instance_3_553175564133",
    state: string; // "refused",
    statusReason: number; // 428
  };
  destination: string; // "https://2376-177-55-225-167.ngrok-free.app/api/instance-webhook",
  date_time: string; // "2024-01-21T00:29:01.929Z",
  sender: string; // "553175564133@s.whatsapp.net",
  server_url: string; // "api.whatsapp.laks.net.br",
  apikey: string; // "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
}

export {
  MessageTypeConversationProps,
  MessageTypeExtendedProps,
  WebhookConnecting,
  ExtendedProps
}