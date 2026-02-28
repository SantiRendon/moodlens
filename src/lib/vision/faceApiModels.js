import * as faceapi from 'face-api.js'

let loaded = false

export async function ensureModelsLoaded() {
  if (loaded) return
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models')
  await faceapi.nets.faceExpressionNet.loadFromUri('/models')
  loaded = true
}