import { ObjectParser } from './objectParser'

const unParsedObject = {
  'items[0][id]': '654c530a3ac391c45009a117',
  'items[0][name]': 'boonie',
}

describe('ObjectParser', () => {
  it('should able to parse unparsed object', () => {
    const parsedObject = ObjectParser.parseUnparsedObject(unParsedObject)
    expect(parsedObject).toEqual({
      items: [
        {
          id: '654c530a3ac391c45009a117',
          name: 'boonie',
        },
      ],
    })
  })
})
