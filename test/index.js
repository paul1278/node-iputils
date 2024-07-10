const { describe, it } = require("node:test");
const assert = require("assert");
const { IPAddress } = require("../index");
const { InvalidIPError, InvalidConversionError } = require("../lib/Errors");
const IPSubnet = require("../lib/IPSubnet");

const IPV4_ADDRESS = "1.2.3.4";
const IPV4_ADDRESS_MASK = 24;
const IPV4_ADDRESS_MASK_NUMBER = 4294967040n;
const IPV4_ADDRESS_NUMBER = 16909060n;
const IPV4_ADDRESS_MASKED = "1.2.3.0";

const IPV6_ADDRESS_MAX = "fde8:894a:040c:ee20:0000:0000:0000:0001";
const IPV6_ADDRESS_MAX_MASKED = "fde8:894a:040c:ee20:0000:0000:0000:0000";
const IPV6_ADDRESS_MED = "fde8:894a:40c:ee20:0000::01";
const IPV6_ADDRESS_MIN = "fde8:894a:40c:ee20::1";
const IPV6_ADDRESS_MASK = 64;
const IPV6_ADDRESS_MASK_NUMBER = 340282366920938463444927863358058659840n;
const IPV6_ADDRESS_NUMBER = 337502080359017093851530813254246858753n;
const IPV6_ADDRESS_2_MAX = "fde8:0000:040c:ee20:0000:0000:0000:0002";
const IPV6_ADDRESS_2_MIN = "fde8:0:40c:ee20::2";

describe("Basic parsing", () => {
  it("should correctly parse an IPv4 address", () => {
    const ip = new IPAddress(IPV4_ADDRESS, IPV4_ADDRESS_MASK);
    assert.strictEqual(ip.type, 4);
    assert.strictEqual(ip.ip, "1.2.3.4");
  });
  it("should correctly parse an IPv6 address", () => {
    const ip = new IPAddress(IPV6_ADDRESS_MAX, IPV6_ADDRESS_MASK);
    assert.strictEqual(ip.type, 6);
    assert.strictEqual(ip.ip, IPV6_ADDRESS_MAX);
  });
  it("should drop invalid IP addresses", () => {
    assert.throws(() => new IPAddress("1.2.3.400", 24), InvalidIPError);
    assert.throws(() => new IPAddress("256.1.2.3", 24), InvalidIPError);
    assert.throws(() => new IPAddress("255.1.2.3.5", 24), InvalidIPError);
    assert.throws(() => new IPAddress("abcd", 24), InvalidIPError);
  });
  it("should drop invalid subnet masks", () => {
    assert.throws(() => new IPAddress("1.2.3.4", -1), InvalidIPError);
    assert.throws(() => new IPAddress("1.2.3.4", 33), InvalidIPError);
    assert.doesNotThrow(() => new IPAddress("1.2.3.4", 0), InvalidIPError);
    assert.doesNotThrow(() => new IPAddress("1.2.3.4", 32), InvalidIPError);
    assert.throws(() => new IPAddress(IPV6_ADDRESS_MAX, -1), InvalidIPError);
    assert.throws(() => new IPAddress(IPV6_ADDRESS_MAX, 129), InvalidIPError);
    assert.doesNotThrow(
      () => new IPAddress(IPV6_ADDRESS_MAX, 0),
      InvalidIPError,
    );
    assert.doesNotThrow(
      () => new IPAddress(IPV6_ADDRESS_MAX, 128),
      InvalidIPError,
    );
  });
  it("should correctly maximize an IPv6 address", () => {
    let ip = new IPAddress(IPV6_ADDRESS_MIN, 64);
    assert.strictEqual(ip.type, 6);
    assert.strictEqual(ip.ip, IPV6_ADDRESS_MAX);
    ip = new IPAddress(IPV6_ADDRESS_MED, 64);
    assert.strictEqual(ip.type, 6);
    assert.strictEqual(ip.ip, IPV6_ADDRESS_MAX);
  });
  it("should correctly minimize an IPv6 address", () => {
    let ip = new IPAddress(IPV6_ADDRESS_MAX, 64);
    assert.strictEqual(ip.type, 6);
    assert.strictEqual(ip.minimize(), IPV6_ADDRESS_MIN);
    ip = new IPAddress(IPV6_ADDRESS_MED, 64);
    assert.strictEqual(ip.type, 6);
    assert.strictEqual(ip.minimize(), IPV6_ADDRESS_MIN);
    ip = new IPAddress(IPV6_ADDRESS_2_MAX, 64);
    assert.strictEqual(ip.type, 6);
    assert.strictEqual(ip.minimize(), IPV6_ADDRESS_2_MIN);
  });
  it("should correctly do nothing while (max-)minimizing an IPv4 address", () => {
    const ip = new IPAddress(IPV4_ADDRESS, IPV4_ADDRESS_MASK);
    assert.strictEqual(ip.type, 4);
    assert.strictEqual(ip.minimize(), IPV4_ADDRESS);
    assert.strictEqual(ip.maximize(), IPV4_ADDRESS);
  });
});

describe("Conversion", () => {
  it("should correctly convert an IPv4 address to a number", () => {
    const ip = new IPAddress(IPV4_ADDRESS, IPV4_ADDRESS_MASK);
    assert.strictEqual(ip.asNumber(), IPV4_ADDRESS_NUMBER);
  });
  it("should correctly convert an IPv6 address to a number", () => {
    const ip = new IPAddress(IPV6_ADDRESS_MAX, IPV6_ADDRESS_MASK);
    assert.strictEqual(ip.asNumber(), IPV6_ADDRESS_NUMBER);
  });

  it("should correctly convert an IPv4 number to an address", () => {
    const ip = IPAddress.fromNumber(IPV4_ADDRESS_NUMBER, 4);
    assert.strictEqual(ip.type, 4);
    assert.strictEqual(ip.ip, IPV4_ADDRESS);
  });
  it("should correctly convert an IPv6 number to an address", () => {
    const ip = IPAddress.fromNumber(IPV6_ADDRESS_NUMBER, 6);
    assert.strictEqual(ip.type, 6);
    assert.strictEqual(ip.ip, IPV6_ADDRESS_MAX);
  });
  it("should decline invalid types", () => {
    assert.throws(() => IPAddress.fromNumber("a", 5), InvalidConversionError);
    assert.throws(
      () => IPAddress.fromNumber(IPV4_ADDRESS_NUMBER, 2),
      InvalidConversionError,
    );
  });
});

describe("Masking", () => {
  it("should correctly mask an IPv4 address", () => {
    const ip = new IPAddress(IPV4_ADDRESS, IPV4_ADDRESS_MASK);
    assert.strictEqual(ip.applyMask().ip, IPV4_ADDRESS_MASKED);
  });
  it("should correctly mask an IPv6 address", () => {
    const ip = new IPAddress(IPV6_ADDRESS_MAX, IPV6_ADDRESS_MASK);
    assert.strictEqual(ip.applyMask().ip, IPV6_ADDRESS_MAX_MASKED);
  });
  it("should correctly convert a mask to a number", () => {
    let ip = new IPAddress(IPV4_ADDRESS, IPV4_ADDRESS_MASK);
    assert.strictEqual(ip.maskAsNumber(), IPV4_ADDRESS_MASK_NUMBER);
    ip = new IPAddress(IPV6_ADDRESS_MAX, IPV6_ADDRESS_MASK);
    assert.strictEqual(ip.maskAsNumber(), IPV6_ADDRESS_MASK_NUMBER);
  });
});

describe("Subnetting", () => {
  it("should return a subnet", () => {
    let ip = new IPAddress(IPV4_ADDRESS, IPV4_ADDRESS_MASK);
    let subnet = ip.getSubnet();
    assert.strictEqual(subnet instanceof IPSubnet, true);
  });
});
