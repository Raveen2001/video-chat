const SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;

export const createRoom = async (): Promise<string> => {
  // get request to /create-room using fetch
  const response = await fetch(`${SERVER_ENDPOINT}/create-room`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // get the roomId from the response
  const { roomId } = await response.json();

  // return the roomId
  return roomId;
};
