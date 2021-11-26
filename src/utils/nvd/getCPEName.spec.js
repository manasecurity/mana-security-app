import getCPEName from './getCPEName'

test('firefox transforms into a:mozilla:firefox', () => {
  const app = {
    cpe_part: "a",
    cpe_vendor: "mozilla",
    cpe_product: "firefox"
  }
  expect(getCPEName(app)).toEqual('a:mozilla:firefox')
})


test('OS transforms into o:apple:mac_os_x', () => {
  const app = {
    cpe_part: "o",
    cpe_vendor: "apple",
    cpe_product: "mac_os_x"
  }
  expect(getCPEName(app)).toEqual('o:apple:mac_os_x')
})
