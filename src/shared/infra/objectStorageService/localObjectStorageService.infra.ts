import fs from 'fs'
import path from 'path'
import { UploadObject } from './domain/uploadObject'
import { LocalObjectStorageService } from './localObjectStorageService'

describe('LocalObjectStorageService', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(__dirname, 'tests/localTempDir'), { recursive: true })
  })

  afterAll(() => {
    fs.rmSync(path.join(__dirname, 'tests/localTempDir'), { recursive: true, force: true })
  })

  const service = new LocalObjectStorageService()
  it('should able to save file', async () => {
    const loadFileBuffer = fs.readFileSync(path.join(__dirname, 'tests/testFiles/profile_pic.png'))
    const uploadFile: UploadObject = {
      buffer: loadFileBuffer,
      extension: 'png',
      type: 'media',
    }
    await service.save('datingProfile/profilePic', uploadFile)
  })

  it('should able to save bulk file', async () => {
    const loadFileBuffer = fs.readFileSync(path.join(__dirname, 'tests/testFiles/profile_pic.png'))
    const uploadFile: UploadObject = {
      buffer: loadFileBuffer,
      extension: 'png',
      type: 'media',
    }
    await service.saveBulk('datingProfile/profilePic', [uploadFile, uploadFile])
  })
})
