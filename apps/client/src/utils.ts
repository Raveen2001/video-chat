import { $ } from '@builder.io/qwik';

export const addStreamToGallery = $((stream: MediaStream) => {
  console.log('addStreamToGallery', stream);
  const video = document.createElement('video');
  video.srcObject = stream;
  video.autoplay = true;
  video.classList.add('video');
  video.muted = true;
  video.playsInline = true;
  document.querySelector('.gallery')?.appendChild(video);
});

export const createFakeStream = $(() => {
  const mediaStream = new MediaStream();

  // Create a fake video track
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const videoStream = canvas.captureStream(30);
  const videoTrack = videoStream.getVideoTracks()[0];
  mediaStream.addTrack(videoTrack);

  // Create a fake audio track
  const audioContext = new AudioContext();
  const audioNode = audioContext.createMediaStreamDestination();
  const audioTrack = audioNode.stream.getAudioTracks()[0];
  mediaStream.addTrack(audioTrack);

  return mediaStream;
});
