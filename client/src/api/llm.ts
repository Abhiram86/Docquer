/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const BASE_URL = "http://localhost:8000/llm";

export const update_api_key = async (id: string, key: string) => {
  const response = await axios.post(`${BASE_URL}/update-groq`, {
    id,
    key,
  });
  return response;
};

export const chat_with_llama = async (
  username: string,
  // api_key: string,
  query: string,
  fileMime: string,
  linkUploaded: boolean,
  lastNMessages: string[] = [],
  conv_id: string
) => {
  if (fileMime.length > 0 || linkUploaded) {
    try {
      const response = await axios.post(`${BASE_URL}/file-chat`, {
        username,
        // api_key,
        query,
        conv_id,
        messageIds: lastNMessages,
        fileMime,
      });
      return response;
    } catch (error: any) {
      if (error.response) {
        return error.response;
      }
    }
  }
  const response = await axios.post(`${BASE_URL}/normal-chat`, {
    username,
    // api_key,
    query,
    conv_id,
    messageIds: lastNMessages,
  });
  return response;
};

export const uploadFile = async (conv_id: string, file: File) => {
  const formdata = new FormData();
  formdata.append("file", file);
  formdata.append("conv_id", conv_id);
  try {
    const response = await axios.post(
      `${BASE_URL}/upload-file`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const reuploadFile = async (conv_id: string, file: File) => {
  const formdata = new FormData();
  formdata.append("file", file);
  formdata.append("conv_id", conv_id);
  try {
    const response = await axios.post(
      `${BASE_URL}/replace-file`,
      formdata,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const new_chat = async (
  username: string,
  file: File | null = null,
  firstMessage: string
  // api_key: string
) => {
  try {
    const response = await axios.post(`${BASE_URL}/new-chat`, {
      username,
      fileName: file?.name || "",
      fileMime: file?.type || "",
      title: "New Chat",
      subTitle: "",
      firstMessage,
      messages: [],
      // api_key,
    });
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const get_convos = async (ids: string[]) => {
  try {
    const response = await axios.post(`${BASE_URL}/get-convos`, {
      ids,
    });
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const get_messages = async (id: string, userId: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/get-messages`,
      {
        id,
        userId,
      }
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const get_conv_details = async (ids: string[]) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/get-conv-details`,
      {
        ids,
      }
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const remove_conversation = async (id: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/remove-conv`, {
      conv_id: id,
    });
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
  }
};

export const uploadLinkData = async (url: string, conv_id: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/upload-link-data`, {
      url,
      conv_id
    });
    return response;
  } catch (error) {
    console.error('Error uploading link data:', error);
    throw error;
  }
};

export const uploadYoutubeVideo = async (conv_id: string, videoUrl: string) => {
  const formData = new FormData();
  formData.append("video_url", videoUrl);
  formData.append("conv_id", conv_id);
  
  try {
    const response = await axios.post(
      `${BASE_URL}/upload-youtube`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error: any) {
    if (error.response) {
      return error.response;
    }
    throw error;
  }
};
