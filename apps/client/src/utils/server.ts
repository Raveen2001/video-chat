const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const createRoom = async (): Promise<string> => {
  // get request to /create-room using fetch
  const response = await fetch(`${SERVER_URL}/create-room`, {
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
