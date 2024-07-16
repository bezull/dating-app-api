/* eslint-disable no-extra-semi */

/**
 * Reference: https://github.com/LinusU/node-append-field/tree/master
 */

type ParsePath = {
  type: 'array' | 'object'
  key: string | number
  append?: boolean
  nextType?: 'array' | 'object'
  last?: boolean
}

export class ObjectParser {
  parsePath(key: string): ParsePath[] {
    const reFirstKey = /^[^[]*/
    const reDigitPath = /^\[(\d+)\]/
    const reNormalPath = /^\[([^\]]+)\]/

    function failure(): ParsePath[] {
      return [{ type: 'object', key, last: true }]
    }

    const firstKeyMatch = reFirstKey.exec(key)
    if (!firstKeyMatch) return failure()

    const firstKey = firstKeyMatch[0]
    if (!firstKey) return failure()

    const len = key.length
    let pos = firstKey.length
    let tail: ParsePath = { type: 'object', key: firstKey }
    const steps = [tail]

    while (pos < len) {
      let m

      if (key[pos] === '[' && key[pos + 1] === ']') {
        pos += 2
        tail.append = true
        if (pos !== len) return failure()
        continue
      }

      m = reDigitPath.exec(key.substring(pos))
      if (m !== null) {
        pos += m[0].length
        tail.nextType = 'array'
        tail = { type: 'array', key: parseInt(m[1], 10) }
        steps.push(tail)
        continue
      }

      m = reNormalPath.exec(key.substring(pos))
      if (m !== null) {
        pos += m[0].length
        tail.nextType = 'object'
        tail = { type: 'object', key: m[1] }
        steps.push(tail)
        continue
      }

      return failure()
    }

    tail.last = true
    return steps
  }

  valueType(value: unknown): string {
    if (value === undefined) return 'undefined'
    if (Array.isArray(value)) return 'array'
    if (typeof value === 'object') return 'object'
    return 'scalar'
  }

  setLastValue(
    context: Record<string, unknown>,
    step: ParsePath,
    currentValue: unknown,
    entryValue: unknown,
  ): Record<string, unknown> {
    switch (this.valueType(currentValue)) {
      case 'undefined':
        if (step.append) {
          context[step.key] = [entryValue]
        } else {
          context[step.key] = entryValue
        }
        break
      case 'array':
        if (Array.isArray(context[step.key])) {
          ;(context[step.key] as unknown[]).push(entryValue)
        }
        break
      case 'object':
        return this.setLastValue(
          currentValue as Record<string, unknown>,
          { type: 'object', key: '', last: true },
          (currentValue as Record<string, unknown>)[''],
          entryValue,
        )
      case 'scalar':
        context[step.key] = [context[step.key], entryValue]
        break
    }

    return context
  }

  setValue(context: Record<string, unknown>, step: ParsePath, currentValue: unknown, entryValue: unknown) {
    if (step.last) return this.setLastValue(context, step, currentValue, entryValue)

    switch (this.valueType(currentValue)) {
      case 'undefined': {
        if (step.nextType === 'array') {
          context[step.key] = []
        } else {
          context[step.key] = Object.create(null)
        }

        return context[step.key]
      }

      case 'object': {
        return context[step.key]
      }

      case 'array': {
        if (step.nextType === 'array') {
          return currentValue
        }

        const obj = Object.create(null)
        context[step.key] = obj

        if (Array.isArray(currentValue)) {
          currentValue.forEach(function (item, i) {
            if (item !== undefined) obj['' + i] = item
          })
        }

        return obj
      }

      case 'scalar': {
        const obj = Object.create(null)
        obj[''] = currentValue
        context[step.key] = obj
        return obj
      }
    }
  }

  appendField(store: Record<string, unknown>, key: string, value: unknown): void {
    const steps = this.parsePath(key)

    steps.reduce((context, step) => {
      return this.setValue(context, step, context[step.key], value)
    }, store)
  }

  static parseUnparsedObject(unparsedObject: Record<string, unknown>): Record<string, unknown> {
    const keyValuePairs = Object.entries(unparsedObject)
    if (keyValuePairs.length === 0) return unparsedObject

    const parsedObject: Record<string, unknown> = {}
    const objectParser = new ObjectParser()

    for (const [key, value] of keyValuePairs) {
      if (Object.hasOwn(unparsedObject, key)) {
        objectParser.appendField(parsedObject, key, value)
      }
    }

    return parsedObject
  }
}
