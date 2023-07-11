import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ref } from "vue";

export const getRequest = async <ResponseType>(
  url: string,
  config?: AxiosRequestConfig<any> | undefined
) => {
  const responseData = ref<ResponseType>();
  const error = ref<Error | AxiosError>();

  await axios
    .get(url, config)
    .then((res) => {
      if (res && res.data) responseData.value = res.data;
    })
    .catch((err: Error | AxiosError) => (error.value = err));

  return { data: responseData.value, error: error.value };
};

export const postRequest = async <RequestData, ResponseType>(
  url: string,
  requestData: RequestData,
  config?: AxiosRequestConfig<RequestData> | undefined
) => {
  const responseData = ref<ResponseType>();
  const response = ref<AxiosResponse<any, any>>();
  const error = ref<Error | AxiosError>();

  await axios
    .post(url, requestData, config)
    .then((res) => (response.value = res))
    .then((res) => {
      if (res && res.data) responseData.value = res.data;
    })
    .catch((err: Error | AxiosError) => (error.value = err));

  return {
    response: response.value,
    data: responseData.value,
    error: error.value,
  };
};

export const patchRequest = async <RequestData, ResponseType>(
  url: string,
  patchData: RequestData,
  config?: AxiosRequestConfig<RequestData> | undefined
) => {
  const responseData = ref<ResponseType>();
  const error = ref<Error | AxiosError>();

  await axios
    .patch(url, patchData, config)
    .then((res) => {
      if (res && res.data) responseData.value = res.data;
    })
    .catch((err: Error | AxiosError) => (error.value = err));

  return { data: responseData.value, error: error.value };
};

export const deleteRequest = async <ResponseType>(
  url: string,
  config?: AxiosRequestConfig<any> | undefined
) => {
  const responseData = ref<ResponseType>();
  const error = ref<Error | AxiosError>();

  await axios
    .delete(url, config)
    .then((res) => {
      if (res && res.data) responseData.value = res.data;
    })
    .catch((err: Error | AxiosError) => (error.value = err));

  return { data: responseData.value, error: error.value };
};
