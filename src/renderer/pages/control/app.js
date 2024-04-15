const handleStream = (stream) => {
  const video = document.getElementById('screen-video')
  // const { width, height } = stream.getVideoTracks()[0].getSettings()

  // window.electronAPI.setSize({ width, height })

  video.srcObject = stream
  video.onloadedmetadata = (_e) => video.play()
}

const getStream = async (screenId) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: screenId,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height
        }
      }
    })

    handleStream(stream)
  } catch (e) {
    console.log(e)
  }
}

window.electron.ipcRenderer.on('set-source-id', (event, screenId) => {
  getStream(screenId)
})
