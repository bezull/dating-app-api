export type UploadObject = {
  type: 'media' | 'docs'
  buffer: Buffer
  extension: string
}

export type UploadedObject = {
  type: 'media' | 'docs'
  url: string
}
