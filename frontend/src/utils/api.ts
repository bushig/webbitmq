import { BASE_URL } from "../config";
import axios from "axios";

export type QueueData = {
  rabbit_env: string;
  exchange_name: string;
  routing_key: string;
  ttl: number;
};

export type QueueMeta = {
  rabbit_host: string;
  exchange_name: string;
  routing_key: string;
  ttl: number;
  from: string;
  to: string;
};

export type MessageData = {
  payload: string;
};

export const createQueque = async (data: QueueData) => {
  const response = await axios.post(BASE_URL + "/api/execute_drain", data);

  if (response.status > 299 || response.status < 200) {
    return Promise.reject(response.data);
  }
  const result = await response.data;

  if (result.key) {
    return result.key;
  }

  return Promise.reject("Failed to get message from backend");
};

export const getQueueMeta = async (key: string) => {
  const response = await axios.get(`${BASE_URL}/api/get_meta/${key}`);

  if (response.status > 299 || response.status < 200) {
    return Promise.reject(response.data);
  }
  const result: QueueMeta = await response.data;

  if (result) {
    return result;
  }

  return Promise.reject("Failed to get message from backend");
};

export const getMessagesList = async (key: string) => {
  const response = await axios.get(`${BASE_URL}/api/${key}/messages`);

  if (response.status > 299 || response.status < 200) {
    return Promise.reject(response.data);
  }
  const result = await response.data;
  if (result) {
    return result;
  }

  return Promise.reject("Failed to get message from backend");
};
