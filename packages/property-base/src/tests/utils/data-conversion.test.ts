import { trimStrings } from '@src/utils/data-conversion'

describe(trimStrings, () => {
  it('trims single string', () => {
    const input = '  foo  '
    const expected = 'foo'
    expect(trimStrings(input)).toEqual(expected)
  })

  it('trims array of strings', () => {
    const input = ['  foo  ', '  bar  ']
    const expected = ['foo', 'bar']
    expect(trimStrings(input)).toEqual(expected)
  })

  it('trims array of object of strings', () => {
    const input = [{ foo: ' foo ' }, '  bar  ']
    const expected = [{ foo: 'foo' }, 'bar']
    expect(trimStrings(input)).toEqual(expected)
  })

  it('trims nested array of object of strings', () => {
    const input = [{ foo: [{ baz: [{ qux: '  qux  ' }, 'ok '] }] }, '  bar  ']
    const expected = [{ foo: [{ baz: [{ qux: 'qux' }, 'ok'] }] }, 'bar']
    expect(trimStrings(input)).toEqual(expected)
  })
})
